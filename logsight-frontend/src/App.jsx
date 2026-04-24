import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import ToastViewport from "./components/ui/ToastViewport";
import PricingPage from "./pages/PricingPage";
import useAuthToken from "./hooks/useAuthToken";
import useDashboardData from "./hooks/useDashboardData";
import { useState } from "react";

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

  const [currentView, setCurrentView] = useState('dashboard');

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
      {currentView === 'pricing' ? (
        <PricingPage onBack={() => setCurrentView('dashboard')} />
      ) : (
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
          onPricingClick={() => setCurrentView('pricing')}
        />
      )}
    </>
  );
}

export default App;
