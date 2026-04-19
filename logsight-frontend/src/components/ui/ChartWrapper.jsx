import Panel from "./Panel";

export default function ChartWrapper({
  title,
  titleClassName = "",
  children,
  metric,
  metricLabel,
  isLoading = false,
  isEmpty = false,
  emptyMessage = "No data available.",
}) {
  return (
    <Panel className="h-full p-5 sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className={`text-lg font-semibold tracking-tight sm:text-xl ${titleClassName}`.trim()}>
            {title}
          </h2>
        </div>
        {metric !== undefined && (
          <div className="min-w-fit rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-right">
            {metricLabel && (
              <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">
                {metricLabel}
              </p>
            )}
            <p className="mt-1 text-sm font-semibold text-slate-100">{metric}</p>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex h-[250px] items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] text-sm text-slate-400">
          Loading chart data...
        </div>
      ) : isEmpty ? (
        <div className="flex h-[250px] items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-6 text-center text-sm text-slate-400">
          {emptyMessage}
        </div>
      ) : (
        <div className="rounded-2xl bg-slate-950/40 p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.03),0_10px_30px_rgba(15,23,42,0.18)]">
          {children}
        </div>
      )}
    </Panel>
  );
}
