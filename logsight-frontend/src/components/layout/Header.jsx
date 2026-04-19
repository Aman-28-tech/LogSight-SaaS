export default function Header({
  showActions = false,
  eyebrow = "Operations Overview",
  filter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  dateRange,
  onDateRangeChange,
  onExport,
  onLogout,
  title = "LogSight Dashboard",
  subtitle = "Monitor incoming events, review service health, and scan recent activity from one place.",
}) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/85 backdrop-blur-xl">
      <div className={`mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-6 sm:px-6 lg:flex-row lg:items-center lg:px-8 ${!showActions ? "justify-center" : "lg:justify-between"}`}>
        <div className={`min-w-0 flex-shrink-0 ${!showActions ? "text-center w-full mx-auto flex flex-col items-center" : ""}`}>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-400">
            {eyebrow}
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-50 sm:text-4xl">
            {title}
          </h1>
          <p className={`mt-2 max-w-2xl text-sm leading-6 text-slate-400 ${!showActions ? "mx-auto text-center" : ""}`}>
            {subtitle}
          </p>
        </div>

        {showActions ? (
          <div className="flex flex-wrap lg:flex-nowrap w-full lg:w-auto items-center gap-3">
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery || ""}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="w-full lg:w-48 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 outline-none transition focus:border-blue-500 focus:bg-white/10 placeholder:text-slate-500 shadow-inner"
            />
            <select
              className="flex-1 lg:flex-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 outline-none transition focus:border-blue-500 focus:bg-white/10 shadow-inner"
              value={dateRange || "all"}
              onChange={(event) => onDateRangeChange?.(event.target.value)}
            >
              <option value="all">All time</option>
              <option value="24h">Last 24h</option>
              <option value="7d">Last 7d</option>
            </select>
            <select
              className="flex-1 lg:flex-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 outline-none transition focus:border-blue-500 focus:bg-white/10 shadow-inner"
              value={filter}
              onChange={(event) => onFilterChange?.(event.target.value)}
            >
              <option value="all">All levels</option>
              <option value="error">Errors</option>
              <option value="info">Info</option>
              <option value="warning">Warnings</option>
            </select>

            <button
              type="button"
              onClick={onExport}
              className="flex-1 lg:flex-none whitespace-nowrap rounded-xl bg-emerald-500/20 border border-emerald-500/30 px-4 py-3 text-sm font-semibold tracking-wide text-emerald-400 transition-colors hover:bg-emerald-500/30"
            >
              Export ↓
            </button>

            <button
              type="button"
              onClick={onLogout}
              className="flex-1 lg:flex-none rounded-xl bg-red-500/20 border border-red-500/30 px-4 py-3 text-sm font-semibold tracking-wide text-red-400 transition-colors hover:bg-red-500/30"
            >
              Logout
            </button>
          </div>
        ) : null}
      </div>
    </header>
  );
}
