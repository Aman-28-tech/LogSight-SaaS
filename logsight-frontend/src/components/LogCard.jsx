import Panel from "./ui/Panel";

export default function LogCard({ log }) {
  const time = new Date(log.createdAt).toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  // 🎨 LEVEL COLORS
  const levelStyles = {
    error: "text-red-400 border-red-500/30",
    warning: "text-yellow-400 border-yellow-500/30",
    info: "text-green-400 border-green-500/30",
  };

  return (
    <div>
      <Panel
        className={`p-4 sm:p-5 ${levelStyles[log.level] || "border-white/10"}`}
      >
        <div className="mb-3 flex items-start justify-between gap-3 text-sm text-slate-400">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
              Service
            </p>
            <span className="mt-1 block font-semibold text-slate-100">{log.service}</span>
          </div>
          <span>{time}</span>
        </div>

        <div className="mb-3">
          <span
            className={`rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium ${
              log.level === "error"
                ? "text-red-400"
                : log.level === "warning"
                  ? "text-yellow-400"
                  : "text-green-400"
            }`}
          >
            {log.level.toUpperCase()}
          </span>
        </div>

        <p className="text-sm leading-6 text-slate-200">{log.message}</p>
      </Panel>
    </div>
  );
}
