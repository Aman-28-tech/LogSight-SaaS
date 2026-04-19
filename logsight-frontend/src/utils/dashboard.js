function isValidLog(log) {
  return (
    log &&
    typeof log === "object" &&
    typeof log.level === "string" &&
    typeof log.service === "string"
  );
}

function groupLogsByTime(logs) {
  let latestTime = 0;
  const counts = logs.reduce((acc, log) => {
    const createdAt = new Date(log.createdAt);
    if (!Number.isNaN(createdAt.getTime())) {
      const timestamp = createdAt.getTime();
      if (timestamp > latestTime) {
        latestTime = timestamp;
      }
      const time = createdAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      acc[time] = (acc[time] || 0) + 1;
    }
    return acc;
  }, {});

  const result = [];
  const now = latestTime > 0 ? new Date(latestTime) : new Date();
  
  // Pad the last 15 minutes to guarantee a beautiful line chart
  // This makes the "Simulate Traffic" spike look exactly like a real APM spike
  for (let i = 14; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 60000);
    const time = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    result.push({
      time,
      count: counts[time] || 0
    });
  }

  return result;
}

export function getDashboardStats(logs) {
  const safeLogs = Array.isArray(logs) ? logs.filter(isValidLog) : [];

  return {
    totalLogs: safeLogs.length,
    errorLogs: safeLogs.filter((log) => log.level === "error").length,
    services: new Set(safeLogs.map((log) => log.service)).size,
  };
}

export function getLogsPerTime(logs) {
  const safeLogs = Array.isArray(logs) ? logs.filter(isValidLog) : [];
  return groupLogsByTime(safeLogs);
}

export function getErrorTrendData(logs) {
  const safeLogs = Array.isArray(logs)
    ? logs.filter((log) => isValidLog(log) && log.level === "error")
    : [];
  return groupLogsByTime(safeLogs);
}

export function getLevelData(logs) {
  const safeLogs = Array.isArray(logs) ? logs.filter(isValidLog) : [];

  return [
    {
      name: "Error",
      value: safeLogs.filter((log) => log.level === "error").length,
    },
    {
      name: "Info",
      value: safeLogs.filter((log) => log.level === "info").length,
    },
    {
      name: "Warning",
      value: safeLogs.filter((log) => log.level === "warning").length,
    },
  ];
}

export function getServiceData(logs) {
  const safeLogs = Array.isArray(logs) ? logs.filter(isValidLog) : [];

  return Object.values(
    safeLogs.reduce((accumulator, log) => {
      if (!accumulator[log.service]) {
        accumulator[log.service] = { service: log.service, count: 0 };
      }

      accumulator[log.service].count += 1;
      return accumulator;
    }, {})
  );
}
