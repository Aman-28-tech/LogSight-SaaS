import { useState } from "react";
import Panel from "./ui/Panel";
import { createLog } from "../services/api";

export default function Sidebar({ onPricingClick }) {
  const [active, setActive] = useState("dashboard");
  const [isSimulating, setIsSimulating] = useState(false);

  const handleScroll = (key, elementId) => {
    setActive(key);
    if (elementId) {
      document.getElementById(elementId)?.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSimulate = () => {
    if (isSimulating) return;
    setIsSimulating(true);

    const services = ["auth-service", "database", "payment-api", "user-service"];
    let delay = 0;

    for (let i = 0; i < 8; i++) {
      const srv = services[Math.floor(Math.random() * services.length)];
      setTimeout(() => {
        createLog({ service: srv, level: "info", message: `Processed secure request for ${srv}` }).catch(() => {});
      }, delay);
      delay += 300 + Math.random() * 200;
    }

    const failingService = services[Math.floor(Math.random() * services.length)];
    for (let i = 0; i < 7; i++) {
      setTimeout(() => {
        createLog({ 
          service: failingService, 
          level: "error", 
          message: `CRITICAL FAULT: Connection pool exhausted in ${failingService}` 
        }).catch(() => {});
      }, delay);
      delay += 100;
    }

    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        createLog({ service: "cache-layer", level: "warning", message: `Cache miss duration exceeded limits.` }).catch(() => {});
      }, delay);
      delay += 300 + Math.random() * 200;
    }

    setTimeout(() => setIsSimulating(false), delay + 500);
  };

  const itemClass = (key) =>
    `flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-all ${
      active === key
        ? "bg-blue-500/10 text-blue-300"
        : "text-slate-400 hover:bg-white/5 hover:text-slate-100"
    }`;

  return (
    <aside className="hidden h-screen w-64 p-4 lg:fixed lg:block">
      <Panel className="flex h-full flex-col p-5">
        <div className="mb-8 border-b border-white/10 pb-5">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-slate-500">
            Monitoring
          </p>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-100">
            LogSight
          </h1>
        </div>

        <div className="flex flex-col gap-2">
          <div
            onClick={() => handleScroll("dashboard")}
            className={itemClass("dashboard") + " cursor-pointer"}
          >
            <span>Dashboard</span>
          </div>

          <div
            onClick={() => handleScroll("ai", "ai-insights")}
            className={itemClass("ai") + " cursor-pointer"}
          >
            <span>AI Insights</span>
          </div>

          <div
            onClick={() => handleScroll("recent", "recent-activities")}
            className={itemClass("recent") + " cursor-pointer"}
          >
            <span>Recent Activities</span>
          </div>
        </div>

        <div className="mt-8 mb-4 flex flex-col gap-3">
          <button
            onClick={onPricingClick}
            className="w-full rounded-xl py-3 px-4 text-xs font-bold uppercase tracking-widest text-white shadow-xl transition-all border border-blue-500/50 bg-blue-600/20 hover:bg-blue-600/40 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]"
          >
            🚀 Upgrade to Pro
          </button>
          <button
            onClick={handleSimulate}
            disabled={isSimulating}
            className={`w-full rounded-xl py-3 px-4 text-xs font-bold uppercase tracking-widest text-white shadow-xl transition-all
              ${isSimulating 
                ? "bg-fuchsia-600/50 cursor-not-allowed animate-pulse" 
                : "bg-fuchsia-600 hover:bg-fuchsia-500 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(192,38,211,0.4)]"
              }
            `}
          >
            {isSimulating ? "Simulating..." : "✨ Simulate Traffic"}
          </button>
        </div>

        <div className="mt-auto border-t border-white/10 pt-5 text-xs text-slate-500">
          © 2026 LogSight
        </div>
      </Panel>
    </aside>
  );
}
