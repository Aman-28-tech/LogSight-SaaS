import DataTable from "../ui/DataTable";

function LevelBadge({ level }) {
  const styles = {
    error: "bg-rose-500/10 border-rose-500/30 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.15)]",
    warning: "bg-amber-500/10 border-amber-500/30 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.15)]",
    info: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.15)]",
  };

  const icons = {
    error: (
      <svg className="mr-2 h-2.5 w-2.5 fill-current" viewBox="0 0 8 8">
        <circle cx="4" cy="4" r="3" />
      </svg>
    ),
    warning: (
      <svg className="mr-2 h-2.5 w-2.5 fill-current" viewBox="0 0 8 8">
        <circle cx="4" cy="4" r="3" />
      </svg>
    ),
    info: (
      <svg className="mr-2 h-2.5 w-2.5 fill-current" viewBox="0 0 8 8">
        <circle cx="4" cy="4" r="3" />
      </svg>
    ),
  };

  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.1em] ${styles[level] || "bg-white/10 text-white"}`}>
      {icons[level]}
      {level}
    </span>
  );
}

export default function LogsTable({ logs, loading, onRowClick }) {
  const safeLogs = Array.isArray(logs) ? logs : [];

  const columns = [
    {
      key: "service",
      header: "Service",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-slate-500/50" />
          <span className="font-bold text-white tracking-tight">{row.service}</span>
        </div>
      ),
    },
    {
      key: "level",
      header: "Severity",
      render: (row) => <LevelBadge level={row.level} />,
    },
    {
      key: "message",
      header: "Message",
      render: (row) => (
        <span className="text-sm font-medium text-slate-300 line-clamp-1 group-hover:text-white transition-colors">
          {row.message}
        </span>
      ),
    },
    {
      key: "time",
      header: "Timestamp",
      render: (row) => (
        <div className="flex flex-col">
          <span className="whitespace-nowrap text-xs font-bold text-slate-400">
            {new Date(row.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
          <span className="whitespace-nowrap text-[10px] text-slate-600">
            {new Date(row.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
          </span>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={safeLogs}
      isLoading={loading}
      emptyMessage="No matching logs discovered."
      onRowClick={onRowClick}
    />
  );
}
