import express from "express";
import cors from "cors";

import logRoutes from "./routes/log.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import authRoutes from "./routes/auth.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import { stripeWebhook } from "./controllers/payment.controller.js";

import { apiLimiter } from "./middleware/rateLimit.middleware.js";
import { errorHandler } from "./middleware/error.middleware.js";

const app = express();

// 🔥 GLOBAL MIDDLEWARES
app.use(cors());

// ✨ STRIPE WEBHOOK (Must be before express.json to get raw body)
app.post("/payments/webhook", express.raw({ type: "application/json" }), stripeWebhook);

app.use(express.json({ limit: "1mb" }));

// 🔥 RATE LIMIT (BEFORE ROUTES)
app.use(apiLimiter);

// ✅ TEST ROUTE
app.get("/", (req, res) => {
  res.send("LogSight Backend Running 🚀");
});

// 🔥 ROUTES
app.use("/auth", authRoutes);
app.use("/logs", logRoutes);
app.use("/ai", aiRoutes);
app.use("/payments", paymentRoutes);

// 🔥 ERROR HANDLER (ALWAYS LAST)
app.use(errorHandler);

export default app;
