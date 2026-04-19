import { randomUUID } from "crypto";
const SOCKET_ROOM_PREFIX = "user:";
const REPLAY_EVENT_PREFIX = "realtime:events:";
const RATE_LIMIT_PREFIX = "realtime:ratelimit:";
const DEFAULT_REPLAY_LIMIT = 50;
const MAX_REPLAY_LIMIT = 100;
const REPLAY_BUFFER_SIZE = 200;
const RATE_LIMIT_WINDOW_MS = 10 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 20;

let ioInstance = null;
let redisClients = null;
const localReplayStore = new Map();
const localRateLimitStore = new Map();

const getReplayKey = (userId) => `${REPLAY_EVENT_PREFIX}${userId}`;
const getRateLimitKey = (userId, action) => `${RATE_LIMIT_PREFIX}${userId}:${action}`;

const parsePositiveInt = (value, fallback, max) => {
  const parsed = Number.parseInt(value, 10);

  if (!Number.isFinite(parsed) || parsed < 1) {
    return fallback;
  }

  return Math.min(parsed, max);
};

const getLocalReplayEvents = (userId) => localReplayStore.get(String(userId)) || [];

const setLocalReplayEvents = (userId, events) => {
  localReplayStore.set(String(userId), events.slice(-REPLAY_BUFFER_SIZE));
};

const createEventPayload = (eventName, data) => ({
  type: eventName,
  ...data,
});

const createReplayEvent = (event) => ({
  id: randomUUID(),
  ...event,
});

export const getUserRoom = (userId) => `${SOCKET_ROOM_PREFIX}${userId}`;

const addReplayEvent = async (userId, event) => {
  const serialized = JSON.stringify(event);

  if (redisClients?.kv) {
    const replayKey = getReplayKey(userId);
    await redisClients.kv.rPush(replayKey, serialized);
    await redisClients.kv.lTrim(replayKey, -REPLAY_BUFFER_SIZE, -1);
    return;
  }

  const events = getLocalReplayEvents(userId);
  events.push(event);
  setLocalReplayEvents(userId, events);
};

const readReplayEvents = async (userId) => {
  if (redisClients?.kv) {
    const replayKey = getReplayKey(userId);
    const items = await redisClients.kv.lRange(replayKey, 0, -1);
    return items
      .map((item) => {
        try {
          return JSON.parse(item);
        } catch {
          return null;
        }
      })
      .filter(Boolean);
  }

  return getLocalReplayEvents(userId);
};

export const emitUserEvent = async (userId, eventName, data) => {
  if (!ioInstance) {
    return null;
  }

  const event = createEventPayload(eventName, data);
  const replayEvent = createReplayEvent(event);
  const room = getUserRoom(userId);

  try {
    await addReplayEvent(userId, replayEvent);
    console.log(`Realtime emit ${eventName} -> ${room}`);
    ioInstance.to(room).emit(eventName, event);
  } catch (error) {
    console.error(`Socket emit failed for ${eventName}:`, error.message);
  }

  return event;
};

const getReplaySlice = (events, lastEventId, limit) => {
  if (!lastEventId) {
    return events.slice(-limit);
  }

  const lastSeenIndex = events.findIndex((event) => event.id === lastEventId);

  if (lastSeenIndex === -1) {
    return events.slice(-limit);
  }

  return events.slice(lastSeenIndex + 1, lastSeenIndex + 1 + limit);
};

export const getReplayEvents = async (
  userId,
  { lastEventId, limit = DEFAULT_REPLAY_LIMIT } = {}
) => {
  const replayLimit = parsePositiveInt(limit, DEFAULT_REPLAY_LIMIT, MAX_REPLAY_LIMIT);
  const events = await readReplayEvents(userId);
  return getReplaySlice(events, lastEventId, replayLimit);
};

export const checkRealtimeRateLimit = async (userId, action) => {
  const now = Date.now();
  const key = getRateLimitKey(userId, action);

  if (redisClients?.kv) {
    const total = await redisClients.kv.incr(key);

    if (total === 1) {
      await redisClients.kv.pExpire(key, RATE_LIMIT_WINDOW_MS);
    }

    return total <= RATE_LIMIT_MAX_REQUESTS;
  }

  const current = localRateLimitStore.get(key);

  if (!current || current.resetAt <= now) {
    localRateLimitStore.set(key, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return true;
  }

  current.count += 1;
  localRateLimitStore.set(key, current);
  return current.count <= RATE_LIMIT_MAX_REQUESTS;
};

export const setupRealtime = async (io) => {
  ioInstance = io;

  if (!process.env.REDIS_URL) {
    return { redisEnabled: false };
  }

  try {
    const [{ createClient }, { createAdapter }] = await Promise.all([
      import("redis"),
      import("@socket.io/redis-adapter"),
    ]);

    const pubClient = createClient({ url: process.env.REDIS_URL });
    const subClient = pubClient.duplicate();
    const kvClient = pubClient.duplicate();

    await Promise.all([pubClient.connect(), subClient.connect(), kvClient.connect()]);

    io.adapter(createAdapter(pubClient, subClient));
    redisClients = {
      pub: pubClient,
      sub: subClient,
      kv: kvClient,
    };

    return { redisEnabled: true };
  } catch (error) {
    console.error("Redis realtime disabled:", error.message);
    redisClients = null;
    return { redisEnabled: false, error };
  }
};
