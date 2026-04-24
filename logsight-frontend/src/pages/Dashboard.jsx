import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";
import Stats from "../components/Stats";
import LogCard from "../components/LogCard";
import LogsTable from "../components/Logs/LogsTable";
import AIInsights from "../components/AIInsights";
import Header from "../components/layout/Header";
import Panel from "../components/ui/Panel";
import LogModal from "../components/ui/LogModal";
import { useState, useMemo } from "react";

import LineChartBox from "../components/Charts/LineChartBox";
import PieChartBox from "../components/Charts/PieChartBox";
import BarChartBox from "../components/Charts/BarChartBox";
import ErrorTrendChartBox from "../components/Charts/ErrorTrendChartBox";
import {
  getDashboardStats,
  getErrorTrendData,
  getLevelData,
  getLogsPerTime,
  getServiceData,
} from "../utils/dashboard";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function Dashboard({
  logs,
  filteredLogs,
  filter,
  setFilter,
  aiInsight,
  aiError,
  loadingLogs,
  fetchAI,
  loadingAI,
  logout,
  searchQuery,
  setSearchQuery,
  dateRange,
  setDateRange,
  anomalyPulse,
  onPricingClick,
}) {
  const [selectedLog, setSelectedLog] = useState(null);

  const handleExport = () => {
    if (!filteredLogs || filteredLogs.length === 0) return;
    const headers = ["Service", "Level", "Message", "Time"];
    const rows = filteredLogs.map((log) => [
      log.service,
      log.level,
      `"${(log.message || "").replace(/"/g, '""')}"`,
      new Date(log.createdAt).toLocaleString(),
    ]);
    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `logs-export-${new Date().toISOString()}.csv`;
    link.click();
  };

  const safeLogs = Array.isArray(logs) ? logs : [];
  const safeFilteredLogs = Array.isArray(filteredLogs) ? filteredLogs : [];
  
  const { totalLogs, errorLogs, services } = useMemo(() => getDashboardStats(safeLogs), [safeLogs]);
  const logsPerTime = useMemo(() => getLogsPerTime(safeFilteredLogs), [safeFilteredLogs]);
  const errorTrendData = useMemo(() => getErrorTrendData(safeLogs), [safeLogs]);
  const levelData = useMemo(() => getLevelData(safeLogs), [safeLogs]);
  const serviceData = useMemo(() => getServiceData(safeFilteredLogs), [safeFilteredLogs]);
  
  const peakLogCount = useMemo(() => logsPerTime.reduce(
    (max, item) => Math.max(max, item.count),
    0
  ), [logsPerTime]);
  
  const peakErrorCount = useMemo(() => errorTrendData.reduce(
    (max, item) => Math.max(max, item.count),
    0
  ), [errorTrendData]);
  const getLogCardKey = (log) =>
    log._id || log.id || `${log.createdAt || ""}:${log.service || ""}:${log.level || ""}:${log.message || ""}`;

  return (
    <>
      <LogModal
        isOpen={!!selectedLog}
        log={selectedLog}
        onClose={() => setSelectedLog(null)}
      />
      <div className={`relative min-h-screen text-white transition-colors duration-700 ${anomalyPulse ? "bg-red-950/80 shadow-[inset_0_0_100px_rgba(239,68,68,0.3)]" : "bg-gradient-to-br from-slate-950 via-[#0f172a] to-black"}`}>
        {/* Subtle Background Dynamic Glow */}
        {!anomalyPulse && (
          <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            <motion.div 
              animate={{ opacity: [0.1, 0.2, 0.1], scale: [1, 1.05, 1] }} 
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }} 
              className="absolute -top-[20%] -right-[10%] w-[50vw] h-[50vw] bg-indigo-500/10 rounded-full blur-[130px]" 
            />
            <motion.div 
              animate={{ opacity: [0.1, 0.15, 0.1], scale: [1, 1.1, 1] }} 
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 3 }} 
              className="absolute top-[40%] -left-[10%] w-[40vw] h-[40vw] bg-blue-600/10 rounded-full blur-[130px]" 
            />
          </div>
        )}

        <div className="relative z-10">
          <Sidebar onPricingClick={onPricingClick} />
          <div className="w-full lg:pl-64">
        <Header
          showActions
          eyebrow="Operations Overview"
          filter={filter}
          onFilterChange={setFilter}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          onExport={handleExport}
          onLogout={logout}
        />
        <motion.div 
          className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 pb-12 pt-8 sm:px-6 lg:px-8"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={itemVariants} className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="relative overflow-hidden rounded-2xl xl:col-span-1">
              <Panel className="glass-premium relative z-10 h-full p-6">
                <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-blue-500/10 blur-2xl" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                  Active Scope
                </p>
                <div className="mt-4 flex items-baseline gap-2">
                  <h2 className="text-3xl font-black tracking-tight text-white capitalize">
                    {filter}
                  </h2>
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                </div>
                <p className="mt-3 text-xs font-medium text-slate-400">
                  {loadingLogs
                    ? "Syncing data..."
                    : `Analyzing ${safeFilteredLogs.length.toLocaleString()} matches`}
                </p>
              </Panel>
            </div>

            <div className="md:col-span-2 xl:col-span-3">
              {loadingLogs ? (
                <div className="p-6 text-slate-400">Loading dashboard...</div>
              ) : (
                <Stats total={totalLogs} errors={errorLogs} services={services} />
              )}
            </div>
          </motion.div>

          {loadingLogs ? (
            <div className="p-6 text-slate-400">Loading dashboard...</div>
          ) : (
            <motion.div variants={itemVariants} className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <LineChartBox
                data={logsPerTime}
                loading={loadingLogs}
                metric={safeLogs.length}
                metricLabel="Total Logs"
              />
              <PieChartBox
                data={levelData}
                loading={loadingLogs}
                metric={errorLogs}
                metricLabel="Errors"
              />
              <BarChartBox
                data={serviceData}
                loading={loadingLogs}
                metric={services}
                metricLabel="Services"
              />
              <ErrorTrendChartBox
                data={errorTrendData}
                loading={loadingLogs}
                metric={peakErrorCount || peakLogCount}
                metricLabel="Peak Count"
              />
            </motion.div>
          )}

          <motion.div variants={itemVariants} id="ai-insights" className="scroll-mt-28">
            <AIInsights
              aiInsight={aiInsight}
            error={aiError}
            fetchAI={fetchAI}
            loading={loadingAI}
          />
          </motion.div>

          <motion.section variants={itemVariants} id="recent-activities" className="space-y-4 scroll-mt-28">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                  Activity
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-100">
                  Recent Logs
                </h2>
              </div>
              <span className="text-sm text-slate-400">
                {loadingLogs ? "Loading..." : `${safeFilteredLogs.length} visible`}
              </span>
            </div>

            <div className="hidden lg:block">
              <LogsTable logs={safeFilteredLogs} loading={loadingLogs} onRowClick={setSelectedLog} />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:hidden">
              {loadingLogs ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <Panel key={index} className="p-4 sm:p-5">
                    <div className="mb-3 h-3 w-20 rounded-full bg-white/5" />
                    <div className="mb-4 h-5 w-32 rounded-full bg-white/5" />
                    <div className="mb-3 h-6 w-24 rounded-full bg-white/5" />
                    <div className="h-3 w-full rounded-full bg-white/5" />
                    <div className="mt-2 h-3 w-3/4 rounded-full bg-white/5" />
                  </Panel>
                ))
              ) : safeFilteredLogs.length > 0 ? (
                safeFilteredLogs.map((log) => <div key={getLogCardKey(log)} onClick={() => setSelectedLog(log)} className="cursor-pointer transition hover:scale-[1.01]"><LogCard log={log} /></div>)
              ) : (
                <Panel className="p-8 text-center text-sm text-slate-400 md:col-span-2">
                  No logs match this filter.
                </Panel>
              )}
            </div>
          </motion.section>
        </motion.div>
      </div>
      </div>
    </div>
    </>
  );
}
