import Panel from "./Panel";

export default function DataTable({
  columns,
  rows,
  emptyMessage = "No data found.",
  isLoading = false,
  loadingMessage = "Synchronizing data stream...",
  onRowClick,
}) {
  return (
    <Panel className="overflow-hidden border-white/5 bg-slate-900/40">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.02]">
              {columns.map((column) => (
                <th 
                  key={column.key} 
                  className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-500"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-white/[0.03]">
            {isLoading ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center"
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-500/20 border-t-blue-500" />
                    <span className="text-xs font-bold tracking-widest text-slate-500 uppercase">{loadingMessage}</span>
                  </div>
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center"
                >
                  <span className="text-xs font-bold tracking-widest text-slate-600 uppercase">{emptyMessage}</span>
                </td>
              </tr>
            ) : (
              rows.map((row, index) => (
                <tr 
                  key={row.id || index} 
                  onClick={() => onRowClick?.(row)} 
                  className={`group transition-all duration-200 ${
                    onRowClick ? "cursor-pointer hover:bg-white/[0.02]" : ""
                  }`}
                >
                  {columns.map((column) => (
                    <td key={column.key} className="px-6 py-4 align-middle">
                      <div className="transition-transform duration-200 group-hover:translate-x-1">
                        {column.render ? column.render(row) : row[column.key]}
                      </div>
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}
