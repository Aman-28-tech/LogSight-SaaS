import axios from "axios";

const PRIMARY_AI_MODEL = process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini";
const FALLBACK_AI_MODEL = "openai/gpt-3.5-turbo";
const MAX_LOGS = 20;
const REQUEST_TIMEOUT_MS = 8000;
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_REFERER =
  process.env.OPENROUTER_REFERER || "http://localhost:5173";
const OPENROUTER_TITLE = process.env.OPENROUTER_TITLE || "LogSight";
const AI_TEST_MODE = process.env.AI_TEST_MODE === "true";

const createAnalysis = ({
  severity = "LOW",
  riskScore = 0,
  summary = "No significant issues detected.",
  issues = [],
  services = [],
  topService = null,
  causes = [],
  actions = [],
}) => ({
  severity,
  riskScore,
  summary,
  issues,
  services,
  topService,
  causes,
  actions,
});

const createError = (message, code = "AI_ANALYSIS_FAILED", details) => ({
  message,
  code,
  ...(details ? { details } : {}),
});

const createMockInsight = () =>
  createAnalysis({
    severity: "MEDIUM",
    riskScore: 42,
    summary: "Mock AI response returned because OpenRouter is unavailable.",
    issues: ["AI test mode fallback is active"],
    services: ["backend"],
    topService: "backend",
    causes: ["OpenRouter request failed during backend testing"],
    actions: ["Verify frontend rendering with this mock insight response"],
  });

const sanitizeLogs = (logs) =>
  logs.slice(0, MAX_LOGS).map((log) => ({
    service: log?.service || "unknown",
    level: log?.level || "info",
    message: log?.message || "",
    createdAt: log?.createdAt || null,
  }));

const clampRiskScore = (value) => {
  const numeric = Number(value);

  if (!Number.isFinite(numeric)) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round(numeric)));
};

const normalizeStringArray = (value) => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => String(item).trim())
    .filter(Boolean)
    .slice(0, 10);
};

const normalizeAnalysis = (value) => {
  const services = normalizeStringArray(value?.services);

  return createAnalysis({
    severity: String(value?.severity || "LOW").toUpperCase(),
    riskScore: clampRiskScore(value?.riskScore),
    summary: String(value?.summary || "Analysis completed."),
    issues: normalizeStringArray(value?.issues),
    services,
    topService: value?.topService ? String(value.topService) : services[0] || null,
    causes: normalizeStringArray(value?.causes),
    actions: normalizeStringArray(value?.actions),
  });
};

const extractJsonObject = (content) => {
  if (!content || typeof content !== "string") {
    return null;
  }

  try {
    return JSON.parse(content);
  } catch {
    const start = content.indexOf("{");
    const end = content.lastIndexOf("}");

    if (start === -1 || end === -1 || start >= end) {
      return null;
    }

    try {
      return JSON.parse(content.slice(start, end + 1));
    } catch {
      return null;
    }
  }
};

const formatSection = (title, emoji, items) => {
  if (!items || items.length === 0) {
    return `${emoji} ${title}:\n- None`;
  }

  return `${emoji} ${title}:\n${items.map((item) => `- ${item}`).join("\n")}`;
};

export const formatInsight = (analysis) => {
  if (!analysis || typeof analysis !== "object") {
    return "AI insight unavailable.";
  }

  const severity = analysis.severity || "LOW";
  const riskScore = Number.isFinite(Number(analysis.riskScore))
    ? Number(analysis.riskScore)
    : 0;
  const summary = analysis.summary || "No summary available.";
  const services = Array.isArray(analysis.services) ? analysis.services : [];
  const topService = analysis.topService || "Unknown";
  const issues = Array.isArray(analysis.issues) ? analysis.issues : [];
  const causes = Array.isArray(analysis.causes) ? analysis.causes : [];
  const actions = Array.isArray(analysis.actions) ? analysis.actions : [];

  return [
    `🔥 Severity: ${severity}`,
    `📊 Risk Score: ${riskScore}`,
    "",
    `🔍 Summary:\n${summary}`,
    "",
    formatSection("Issues Detected", "🚨", issues),
    "",
    formatSection("Affected Services", "⚙️", services),
    "",
    `📈 Top Failing Service:\n- ${topService}`,
    "",
    formatSection("Possible Causes", "💡", causes),
    "",
    formatSection("Recommended Actions", "🛠️", actions),
  ].join("\n");
};

export const analyzeLogs = async (logs) => {
  if (!Array.isArray(logs)) {
    return {
      ok: false,
      statusCode: 400,
      error: createError("Logs must be an array", "INVALID_LOGS_INPUT"),
    };
  }

  if (logs.length === 0) {
    return {
      ok: false,
      statusCode: 400,
      error: createError("Logs must be a non-empty array", "EMPTY_LOGS_INPUT"),
    };
  }

  if (!process.env.OPENROUTER_API_KEY) {
    if (AI_TEST_MODE) {
      console.warn(
        "Returning mock AI insight because AI_TEST_MODE is enabled and no API key is configured"
      );
      return {
        ok: true,
        data: createMockInsight(),
      };
    }

    console.error("OPENROUTER_API_KEY is not configured");
    return {
      ok: false,
      statusCode: 500,
      error: createError("AI service is not configured", "MISSING_OPENROUTER_API_KEY"),
    };
  }

  const limitedLogs = sanitizeLogs(logs);
  const requestHeaders = {
    Authorization: `Bearer ${String(process.env.OPENROUTER_API_KEY).trim()}`,
    "Content-Type": "application/json",
    "HTTP-Referer": OPENROUTER_REFERER,
    "X-Title": OPENROUTER_TITLE,
  };
  const requestMessages = [
    {
      role: "system",
      content: [
        "You analyze backend logs.",
        "Return only valid JSON with this exact shape:",
        "{",
        '  "severity": "LOW | MEDIUM | HIGH | CRITICAL",',
        '  "riskScore": 0,',
        '  "summary": "short summary",',
        '  "issues": ["issue"],',
        '  "services": ["service"],',
        '  "topService": "service",',
        '  "causes": ["cause"],',
        '  "actions": ["action"]',
        "}",
        "Keep it concise and practical.",
      ].join("\n"),
    },
    {
      role: "user",
      content: JSON.stringify({ logs: limitedLogs }),
    },
  ];
  const modelsToTry = [PRIMARY_AI_MODEL, FALLBACK_AI_MODEL].filter(
    (model, index, models) => model && models.indexOf(model) === index
  );
  let lastErrorResult = null;

  for (const model of modelsToTry) {
    console.log("OpenRouter request debug", {
      apiKeyLoaded: Boolean(process.env.OPENROUTER_API_KEY),
      model,
      requestHeaders: {
        Authorization: "Bearer <redacted>",
        "Content-Type": requestHeaders["Content-Type"],
        "HTTP-Referer": requestHeaders["HTTP-Referer"],
        "X-Title": requestHeaders["X-Title"],
      },
    });

    try {
      const response = await axios.post(
        OPENROUTER_URL,
        {
          model,
          temperature: 0.2,
          messages: requestMessages,
        },
        {
          timeout: REQUEST_TIMEOUT_MS,
          headers: requestHeaders,
        }
      );

      const content = response?.data?.choices?.[0]?.message?.content;
      const parsed = extractJsonObject(content);

      if (!parsed) {
        console.error("OpenRouter returned an unparsable response", {
          model,
          status: response?.status,
          content,
        });

        lastErrorResult = {
          ok: false,
          statusCode: 502,
          error: createError("AI response could not be parsed", "INVALID_AI_RESPONSE"),
        };
        continue;
      }

      return {
        ok: true,
        data: normalizeAnalysis(parsed),
      };
    } catch (error) {
      const status = error.response?.status;
      const responseData = error.response?.data;
      const errorMessage =
        status === 401
          ? "OpenRouter authentication failed: invalid API key"
          : status === 429
            ? "OpenRouter rate limit exceeded"
            : error.code === "ECONNABORTED"
              ? "AI request timed out"
              : !error.response
                ? "Request to OpenRouter failed"
                : responseData?.error?.message ||
                  error.message ||
                  "AI request failed";

      console.error("OpenRouter AI request failed", {
        model,
        status,
        message: errorMessage,
        response: responseData,
        code: error.code,
        responseMessage: error.message,
        requestHeaders: {
          Authorization: "Bearer <redacted>",
          "Content-Type": requestHeaders["Content-Type"],
          "HTTP-Referer": requestHeaders["HTTP-Referer"],
          "X-Title": requestHeaders["X-Title"],
        },
      });

      lastErrorResult = {
        ok: false,
        statusCode: status || 502,
        error: createError(
          errorMessage,
          "AI_REQUEST_FAILED",
          status ? { status, model } : { model }
        ),
      };
    }
  }

  if (AI_TEST_MODE) {
    console.warn("Returning mock AI insight because AI_TEST_MODE is enabled");
    return {
      ok: true,
      data: createMockInsight(),
    };
  }

  return (
    lastErrorResult || {
      ok: false,
      statusCode: 502,
      error: createError("AI request failed", "AI_REQUEST_FAILED"),
    }
  );
};
