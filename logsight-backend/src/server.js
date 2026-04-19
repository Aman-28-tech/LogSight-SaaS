import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectDB from "./config/db.js";
import { createServer } from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import {
  checkRealtimeRateLimit,
  getReplayEvents,
  getUserRoom,
  setupRealtime,
} from "./services/realtime.service.js";

const PORT = process.env.PORT || 5000;
const extractSocketToken = (socket) => {
  const authToken = socket.handshake.auth?.token;

  if (authToken) {
    return authToken.startsWith("Bearer ")
      ? authToken.split(" ")[1]
      : authToken;
  }

  const authorizationHeader = socket.handshake.headers?.authorization;

  if (authorizationHeader?.startsWith("Bearer ")) {
    return authorizationHeader.split(" ")[1];
  }

  return null;
};

// create HTTP server
const server = createServer(app);

// attach socket.io
const io = new Server(server, {
  cors: {
    origin: "*",
  },
  serveClient: false,
  perMessageDeflate: false,
  transports: ["websocket"],
  connectTimeout: 10000,
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000,
  },
});

// ✅ FIXED: attach to express app
app.set("io", io);

io.use((socket, next) => {
  try {
    if (!process.env.JWT_SECRET) {
      return next(new Error("Realtime authentication is not configured"));
    }

    const token = extractSocketToken(socket);

    if (!token) {
      return next(new Error("Authentication required"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    socket.data.user = {
      id: String(decoded.id),
      room: getUserRoom(decoded.id),
    };

    next();
  } catch (error) {
    next(new Error("Invalid or expired token"));
  }
});

// socket connection
io.on("connection", (socket) => {
  const { id } = socket.data.user;
  const room = getUserRoom(id);
  console.log("🔥 SOCKET CONNECTED USER:", id);
  console.log("🏠 JOINING ROOM:", room);
  socket.join(room);
  console.log("✅ rooms:", socket.rooms);

  socket.emit("socket:ready", {
    type: "socket:ready",
    userId: id,
    room,
    connectedAt: new Date().toISOString(),
  });

  const initialReplayCursor = socket.handshake.auth?.lastEventId;

  if (initialReplayCursor) {
    void getReplayEvents(id, { lastEventId: initialReplayCursor })
      .then((events) => {
        if (events.length > 0) {
          socket.emit("replay:batch", {
            type: "replay:batch",
            requestedAfter: initialReplayCursor,
            events,
          });
        }
      })
      .catch((error) => {
        console.error("Replay bootstrap failed:", error.message);
      });
  }

  socket.on("replay:request", async (payload = {}, ack) => {
    try {
      const allowed = await checkRealtimeRateLimit(id, "replay:request");

      if (!allowed) {
        const response = {
          ok: false,
          error: "Replay rate limit exceeded",
        };

        if (typeof ack === "function") {
          ack(response);
        } else {
          socket.emit("replay:error", response);
        }
        return;
      }

      const events = await getReplayEvents(id, {
        lastEventId: payload.lastEventId,
        limit: payload.limit,
      });

      const response = {
        ok: true,
        events,
      };

      if (typeof ack === "function") {
        ack(response);
        return;
      }

      socket.emit("replay:batch", {
        type: "replay:batch",
        requestedAfter: payload.lastEventId || null,
        events,
      });
    } catch (error) {
      const response = {
        ok: false,
        error: "Replay failed",
      };

      if (typeof ack === "function") {
        ack(response);
      } else {
        socket.emit("replay:error", response);
      }
    }
  });
});

connectDB()
  .then(async () => {
    await setupRealtime(io);
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
  });
