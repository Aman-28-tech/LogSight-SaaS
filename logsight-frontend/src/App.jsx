import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import ToastViewport from "./components/ui/ToastViewport";
import useAuthToken from "./hooks/useAuthToken";
import useDashboardData from "./hooks/useDashboardData";

function App() {
  const { token, setToken } = useAuthToken();
  const {
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
  } = useDashboardData(token);

  const logout = () => setToken("");

  if (!token) {
    return (
      <>
        <ToastViewport toasts={toasts} onDismiss={removeToast} />
        <AuthPage setToken={setToken} />
      </>
    );
  }

  return (
    <>
      <ToastViewport toasts={toasts} onDismiss={removeToast} />
      <Dashboard
        logs={logs}
        filteredLogs={filteredLogs}
        filter={filter}
        setFilter={setFilter}
        aiInsight={aiInsight}
        aiError={aiError}
        loadingLogs={loadingLogs}
        fetchAI={fetchAI}
        loadingAI={loadingAI}
        logout={logout}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        dateRange={dateRange}
        setDateRange={setDateRange}
        anomalyPulse={anomalyPulse}
      />
    </>
  );
}

export default App;
