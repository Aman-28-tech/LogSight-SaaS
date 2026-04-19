import Log from "../models/log.model.js";
import { emitUserEvent } from "../services/realtime.service.js";

let errorBuffer = {};
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 100;
const LOG_PROJECTION = "service level message user createdAt updatedAt";
const DEFAULT_TOP_LIMIT = 10;
const MAX_TOP_LIMIT = 50;
const DEFAULT_TIME_BUCKET = "hour";
const TIME_BUCKET_FORMATS = {
  hour: "%Y-%m-%dT%H:00:00Z",
  day: "%Y-%m-%dT00:00:00Z",
};

const parsePositiveInt = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);

  if (!Number.isFinite(parsed) || parsed < 1) {
    return fallback;
  }

  return parsed;
};

const parseDate = (value) => {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const buildLogMatchFilter = (userId, query = {}) => {
  const { service, level, from, to } = query;
  const filter = { user: userId };
  const createdAt = {};
  const fromDate = parseDate(from);
  const toDate = parseDate(to);

  if (service) filter.service = service;
  if (level) filter.level = level;
  if (fromDate) createdAt.$gte = fromDate;
  if (toDate) createdAt.$lte = toDate;
  if (Object.keys(createdAt).length > 0) {
    filter.createdAt = createdAt;
  }

  return filter;
};

const getTimeBucketFormat = (bucket) =>
  TIME_BUCKET_FORMATS[bucket] || TIME_BUCKET_FORMATS[DEFAULT_TIME_BUCKET];

const emitUserEventSafely = async (userId, eventName, payload) => {
  try {
    await emitUserEvent(userId, eventName, payload);
  } catch (error) {
    console.error(`Realtime emit failed for ${eventName}:`, error.message);
  }
};

export const createLog = async (req, res, next) => {
  try {
    // 🔐 safety
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const log = await Log.create({
      ...req.body,
      user: req.user.id,
    });

    console.log("EMITTING LOG ID:", log._id);

    await emitUserEventSafely(req.user.id, "logs:new", {
      log: log.toObject(),
    });

    // 🚨 ERROR HANDLING
    if (log.level === "error") {
      await emitUserEventSafely(req.user.id, "alerts:new", {
        category: "error_log",
        severity: "high",
        service: log.service,
        message: `ERROR in ${log.service}: ${log.message}`,
        logId: log._id,
        createdAt: log.createdAt,
      });

      // 🧠 Initialize buffer
      if (!errorBuffer[req.user.id]) {
        errorBuffer[req.user.id] = [];
      }

      // ⏱️ push timestamp
      errorBuffer[req.user.id].push(Date.now());

      // 🧹 keep only last 1 min
      errorBuffer[req.user.id] = errorBuffer[req.user.id].filter(
        (t) => Date.now() - t < 60000
      );

      // 💣 anomaly detection
      if (errorBuffer[req.user.id].length > 5) {
        await emitUserEventSafely(req.user.id, "alerts:new", {
          category: "anomaly",
          severity: "critical",
          service: log.service,
          message: "Anomaly detected: Too many errors in the last minute",
          errorCountLastMinute: errorBuffer[req.user.id].length,
          createdAt: new Date().toISOString(),
        });

        // 🔔 Webhook Integration for Slack/Discord
        if (process.env.SLACK_WEBHOOK_URL) {
          fetch(process.env.SLACK_WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              text: `🚨 *CRITICAL ANOMALY DETECTED* 🚨\nService *${log.service}* generated over 5 errors within one minute!\n*Latest Message*: ${log.message}`
            })
          }).catch((err) => console.error("Webhook trigger failed:", err.message));
        }
      }
    }

    res.status(201).json({
      success: true,
      data: log,
    });
  } catch (err) {
    next(err);
  }
};

// 🔍 GET LOGS
export const getLogs = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { page, limit } = req.query;
    const currentPage = parsePositiveInt(page, DEFAULT_PAGE);
    const pageSize = Math.min(parsePositiveInt(limit, DEFAULT_LIMIT), MAX_LIMIT);
    const skip = (currentPage - 1) * pageSize;
    const filter = buildLogMatchFilter(req.user.id, req.query);

    const [logs, total] = await Promise.all([
      Log.find(filter, LOG_PROJECTION)
        .sort({ createdAt: -1, _id: -1 })
        .skip(skip)
        .limit(pageSize)
        .lean(),
      Log.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: {
        items: logs,
        pagination: {
          page: currentPage,
          limit: pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
          hasNextPage: skip + logs.length < total,
          hasPrevPage: currentPage > 1,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getLogsPerService = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const match = buildLogMatchFilter(req.user.id, req.query);
    const data = await Log.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$service",
          count: { $sum: 1 },
        },
      },
      { $project: { _id: 0, service: "$_id", count: 1 } },
      { $sort: { count: -1, service: 1 } },
    ]);

    res.json({
      success: true,
      data,
    });
  } catch (err) {
    next(err);
  }
};

export const getLogLevelDistribution = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const match = buildLogMatchFilter(req.user.id, req.query);
    const grouped = await Log.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$level",
          count: { $sum: 1 },
        },
      },
    ]);

    const counts = {
      error: 0,
      warning: 0,
      info: 0,
    };

    for (const item of grouped) {
      if (item._id in counts) {
        counts[item._id] = item.count;
      }
    }

    res.json({
      success: true,
      data: {
        total: counts.error + counts.warning + counts.info,
        ...counts,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getLogsOverTime = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { bucket = DEFAULT_TIME_BUCKET } = req.query;
    const match = buildLogMatchFilter(req.user.id, req.query);
    const format = getTimeBucketFormat(bucket);

    const data = await Log.aggregate([
      { $match: match },
      {
        $group: {
          _id: {
            $dateToString: {
              format,
              date: "$createdAt",
            },
          },
          count: { $sum: 1 },
        },
      },
      { $project: { _id: 0, timestamp: "$_id", count: 1 } },
      { $sort: { timestamp: 1 } },
    ]);

    res.json({
      success: true,
      data: {
        items: data,
        bucket: bucket in TIME_BUCKET_FORMATS ? bucket : DEFAULT_TIME_BUCKET,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getTopErrorMessages = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const limit = Math.min(
      parsePositiveInt(req.query.limit, DEFAULT_TOP_LIMIT),
      MAX_TOP_LIMIT
    );
    const match = buildLogMatchFilter(req.user.id, {
      ...req.query,
      level: "error",
    });
    const data = await Log.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$message",
          count: { $sum: 1 },
          services: { $addToSet: "$service" },
          latestAt: { $max: "$createdAt" },
        },
      },
      {
        $project: {
          _id: 0,
          message: "$_id",
          count: 1,
          services: 1,
          latestAt: 1,
        },
      },
      { $sort: { count: -1, latestAt: -1 } },
      { $limit: limit },
    ]);

    res.json({
      success: true,
      data,
    });
  } catch (err) {
    next(err);
  }
};
