import { useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";

import { API_BASE_URL } from "../config/env";
import { getAIInsights, getLogs } from "../services/api";




function normalizeLogs(items) {
  return Array.isArray(items) ? items : [];
}

function normalizeLogItem(log) {
  if (!log || typeof log !== "object") {
    return null;
  }

  const level = typeof log.level === "string" ? log.level : "";
  const service = typeof log.service === "string" ? log.service : "";
  const message = typeof log.message === "string" ? log.message : "";
  const createdAt = log.createdAt || new Date().toISOString();

  if (!level || !service || !message) {
    return null;
  }

  return {
    ...log,
    level,
    service,
    message,
    createdAt,
  };
}

function getLogKey(log) {
  if (log?._id) {
    return log._id;
  }

  if (log?.id) {
    return log.id;
  }

  return `${log?.createdAt || ""}:${log?.service || ""}:${log?.level || ""}:${log?.message || ""}`;
}

function sortLogsByNewest(items) {
  return [...items].sort((left, right) => {
    const leftTime = new Date(left.createdAt || 0).getTime();
    const rightTime = new Date(right.createdAt || 0).getTime();

    return rightTime - leftTime;
  });
}

function prependLog(existingLogs, nextLog) {
  const key = getLogKey(nextLog);

  if (!key) return existingLogs;

  if (existingLogs.some((log) => getLogKey(log) === key)) {
    return existingLogs;
  }

  return sortLogsByNewest([nextLog, ...existingLogs]);
}

const TOAST_DURATION_MS = 8000;
const TOAST_EXIT_MS = 300;
const SPAM_THRESHOLD = 3;

function buildToastFromLog(log) {
  if (log.level === "error") {
    return {
      variant: "error",
      title: `Error in ${log.service}`,
      message: log.message,
    };
  }

  if (log.level === "warning") {
    return {
      variant: "warning",
      title: `Warning in ${log.service}`,
      message: log.message,
    };
  }

  if (log.level === "info") {
    return {
      variant: "info",
      title: `New info from ${log.service}`,
      message: log.message,
    };
  }

  return null;
}

export default function useDashboardData(token) {
  const [logs, setLogs] = useState([]);
  const [initialized, setInitialized] = useState(false);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState("all");
  const [anomalyPulse, setAnomalyPulse] = useState(false);
  const [aiInsight, setAiInsight] = useState("");
  const [aiError, setAiError] = useState("");
  const [loadingLogs, setLoadingLogs] = useState(true);
  const [loadingAI, setLoadingAI] = useState(false);
  const [toasts, setToasts] = useState([]);
  const messageCountsRef = useRef(new Map());
  const toastTimersRef = useRef(new Map());
  const initializedRef = useRef(false);

  const clearToastTimers = (toastId) => {
    const timers = toastTimersRef.current.get(toastId);

    if (!timers) {
      return;
    }

    timers.forEach((timerId) => clearTimeout(timerId));
    toastTimersRef.current.delete(toastId);
  };

  const finalizeToastRemoval = (toastId) => {
    clearToastTimers(toastId);
    setToasts((prev) => prev.filter((toast) => toast.id !== toastId));
  };

  const removeToast = (toastId) => {
    setToasts((prev) =>
      prev.map((toast) =>
        toast.id === toastId ? { ...toast, exiting: true } : toast
      )
    );

    const removeTimer = window.setTimeout(() => {
      finalizeToastRemoval(toastId);
    }, TOAST_EXIT_MS);

    const activeTimers = toastTimersRef.current.get(toastId) || [];
    toastTimersRef.current.set(toastId, [...activeTimers, removeTimer]);
  };

  const pushToast = ({ variant, title, message }) => {
    const id =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random()}`;

    setToasts((prev) => [...prev, { id, variant, title, message, exiting: false }]);

    const exitTimer = window.setTimeout(() => {
      removeToast(id);
    }, TOAST_DURATION_MS - TOAST_EXIT_MS);

    toastTimersRef.current.set(id, [exitTimer]);
  };

  const handleRealtimeLog = (log) => {
    if (!initializedRef.current) {
      return;
    }

    const nextLog = normalizeLogItem(log?.log || log);

    if (!nextLog) {
      console.error("Invalid socket log payload:", log);
      return;
    }

    if (nextLog.service === "auth") {
      return;
    }

    console.log("SOCKET log:", nextLog?._id);
    setLogs((prev) => prependLog(prev, nextLog));

    const messageCount =
      (messageCountsRef.current.get(nextLog.message) || 0) + 1;
    messageCountsRef.current.set(nextLog.message, messageCount);

    if (messageCount === SPAM_THRESHOLD) {
      pushToast({
        variant: "warning",
        title: "Repeated error detected",
        message: nextLog.message,
      });
    }

    if (messageCount >= SPAM_THRESHOLD) {
      return;
    }

    const toast = buildToastFromLog(nextLog);

    if (toast) {
      pushToast(toast);
    }
  };

  useEffect(() => {
    if (!token) {
      setLogs([]);
      setInitialized(false);
      initializedRef.current = false;
      setFilter("all");
      setAiInsight("");
      setAiError("");
      setLoadingLogs(true);
      setLoadingAI(false);
      messageCountsRef.current.clear();
      toastTimersRef.current.forEach((timers) =>
        timers.forEach((timerId) => clearTimeout(timerId))
      );
      toastTimersRef.current.clear();
      setToasts([]);
      setSearchQuery("");
      setDateRange("all");
      setAnomalyPulse(false);
    }
  }, [token]);

  useEffect(() => {
    if (!token || !initialized) return undefined;

    const socket = io(API_BASE_URL, {
      auth: {
        token,
      },
      transports: ["websocket"],
    });

    const handleConnect = () => {
      console.log("✅ CONNECTED:", socket.id);
    };

    const handleConnectError = (err) => {
      console.error("❌ SOCKET ERROR:", err.message);
    };

    const handleDebugEvent = (data) => {
      console.log("🔥 RECEIVED EVENT:", data);
    };

    const handleRealtimeAlert = (data) => {
      console.log("ALERT:", data);
      if (data?.category === "anomaly") {
        setAnomalyPulse(true);
        pushToast({
          variant: "error",
          title: "Critical Anomaly Detected",
          message: data.message || "High error rate spotted.",
        });
        setTimeout(() => setAnomalyPulse(false), 8000);
      }
    };

    socket.on("connect", handleConnect);
    socket.on("connect_error", handleConnectError);
    socket.on("logs:new", handleDebugEvent);
    socket.on("logs:new", handleRealtimeLog);
    socket.on("alerts:new", handleRealtimeAlert);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("connect_error", handleConnectError);
      socket.off("logs:new", handleDebugEvent);
      socket.off("logs:new", handleRealtimeLog);
      socket.off("alerts:new", handleRealtimeAlert);
      socket.disconnect();
    };
  }, [initialized, token]);

  useEffect(() => {
    return () => {
      toastTimersRef.current.forEach((timers) =>
        timers.forEach((timerId) => clearTimeout(timerId))
      );
      toastTimersRef.current.clear();
    };
  }, []);

  useEffect(() => {
    if (!token) return undefined;

    const fetchLogs = async () => {
      try {
        setInitialized(false);
        initializedRef.current = false;
        setLoadingLogs(true);
        const response = await getLogs();
        const fetchedLogs = normalizeLogs(
          response.data?.success
            ? response.data?.data?.items || []
            : []
        )
          .map(normalizeLogItem)
          .filter(Boolean)
          .filter((log) => log.service !== "auth");

        console.log("FETCH logs:", fetchedLogs.length);
        setLogs(fetchedLogs);
        setInitialized(true);
        initializedRef.current = true;
      } catch (error) {
        console.error("Error fetching logs:", error);
        setLogs([]);
        setInitialized(true);
        initializedRef.current = true;
      } finally {
        setLoadingLogs(false);
      }
    };

    fetchLogs();
  }, [token]);

  useEffect(() => {
    console.log("TOTAL logs:", logs.length);
  }, [logs]);

  const fetchAI = async () => {
    if (loadingAI) return;

    try {
      setLoadingAI(true);
      setAiError("");
      const response = await getAIInsights(logs);
      if (!response.data?.success) {
        throw new Error("Failed to generate AI insights.");
      }

      setAiInsight(response.data?.data?.insight || "");
    } catch (error) {
      console.error("Error fetching AI insights:", error);
      setAiInsight("");
      setAiError(
        error.response?.data?.message || "Failed to generate AI insights."
      );
    } finally {
      setLoadingAI(false);
    }
  };

  const filteredLogs = useMemo(() => {
    let result = logs;

    if (filter !== "all") {
      result = result.filter((log) => log.level === filter);
    }

    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (log) =>
          log.message?.toLowerCase().includes(q) ||
          log.service?.toLowerCase().includes(q)
      );
    }

    if (dateRange !== "all") {
      const now = Date.now();
      const limits = {
        "24h": now - 24 * 60 * 60 * 1000,
        "7d": now - 7 * 24 * 60 * 60 * 1000,
      };

      const threshold = limits[dateRange];
      if (threshold) {
        result = result.filter((log) => new Date(log.createdAt).getTime() >= threshold);
      }
    }

    return result;
  }, [filter, searchQuery, dateRange, logs]);

  return {
    logs,
    filteredLogs,
    filter,
    setFilter,
    aiInsight,
    aiError,
    loadingLogs,
    fetchAI,
    loadingAI,
    toasts,
    removeToast,
    searchQuery,
    setSearchQuery,
    dateRange,
    setDateRange,
    anomalyPulse,
  };
}
