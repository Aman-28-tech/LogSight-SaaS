import { useState } from "react";
import Panel from "./ui/Panel";
import { motion, AnimatePresence } from "framer-motion";

const Icons = {
  Issues: (className) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>
    </svg>
  ),
  Causes: (className) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
    </svg>
  ),
  Actions: (className) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21 2-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3y-3.5L15.5 7.5z"/>
    </svg>
  ),
  Insight: (className) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v8"/><path d="m4.93 4.93 1.41 1.41"/><path d="M2 12h8"/><path d="m4.93 19.07 1.41-1.41"/><path d="M12 22v-8"/><path d="m19.07 19.07-1.41-1.41"/><path d="M22 12h-8"/><path d="m19.07 4.93-1.41 1.41"/>
    </svg>
  )
};

function getSectionStyle(line) {
  if (line.includes("🚨") || line.toLowerCase().includes("issue")) {
    return {
      label: "Issues",
      icon: Icons.Issues,
      badge: "Critical",
      theme: "red",
      gradient: "from-red-500/20 to-transparent",
      border: "border-red-500/20",
      text: "text-red-200",
      accent: "bg-red-500"
    };
  }

  if (line.includes("🔍") || line.includes("📊") || line.toLowerCase().includes("cause")) {
    return {
      label: "Causes",
      icon: Icons.Causes,
      badge: "Identified",
      theme: "amber",
      gradient: "from-amber-500/20 to-transparent",
      border: "border-amber-500/20",
      text: "text-amber-200",
      accent: "bg-amber-500"
    };
  }

  if (line.includes("🛠️") || line.toLowerCase().includes("action")) {
    return {
      label: "Actions",
      icon: Icons.Actions,
      badge: "Required",
      theme: "emerald",
      gradient: "from-emerald-500/20 to-transparent",
      border: "border-emerald-500/20",
      text: "text-emerald-200",
      accent: "bg-emerald-500"
    };
  }

  return null;
}

export default function AIInsights({ aiInsight, error, fetchAI, loading }) {
  const [open, setOpen] = useState(false);
  const hasInsight = aiInsight.trim().length > 0;
  const hasError = error.trim().length > 0;
  
  const lines = aiInsight
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const sections = [];
  let currentSection = { style: null, content: [] };

  lines.forEach((line) => {
    const style = getSectionStyle(line);
    if (style) {
      if (currentSection.style !== null || currentSection.content.length > 0) {
        sections.push(currentSection);
      }
      currentSection = { style, content: [line] };
    } else {
      currentSection.content.push(line);
    }
  });

  if (currentSection.style !== null || currentSection.content.length > 0) {
    sections.push(currentSection);
  }

  const handleToggle = () => {
    if (!open) {
      setOpen(true);
      fetchAI();
    } else {
      setOpen(false);
    }
  };

  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/40 p-1">
      {/* Background Decorative Blur */}
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500/10 blur-[100px]" />
      <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-indigo-500/10 blur-[100px]" />

      <div className="relative z-10 flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
            {Icons.Insight("h-6 w-6")}
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
              AI Log Intelligence
            </h2>
            <p className="text-sm font-medium text-slate-400">
              Automated anomaly detection and root cause analysis.
            </p>
          </div>
        </div>

        <button
          onClick={handleToggle}
          disabled={loading}
          className={`group relative overflow-hidden rounded-2xl px-6 py-3 text-sm font-bold transition-all duration-300 ${
            open ? "bg-white/10 text-white hover:bg-white/20" : "bg-blue-600 text-white hover:bg-blue-500 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)]"
          }`}
        >
          <span className="relative z-10 flex items-center gap-2">
            {loading ? (
              <>
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing...
              </>
            ) : open ? (
              "Collapse analysis"
            ) : (
              "Generate Insight"
            )}
            {!loading && <span className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}>▼</span>}
          </span>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          >
            <div className="border-t border-white/5 p-4 sm:p-6">
              {loading && (
                <div className="grid gap-4 sm:grid-cols-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse rounded-2xl border border-white/5 bg-white/[0.02] p-6">
                      <div className="mb-4 h-10 w-10 rounded-xl bg-white/5" />
                      <div className="mb-2 h-4 w-3/4 rounded bg-white/5" />
                      <div className="h-3 w-1/2 rounded bg-white/5" />
                    </div>
                  ))}
                </div>
              )}

              {!loading && hasError && (
                <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center text-red-200">
                  <Icons.Issues className="mx-auto mb-4 h-12 w-12 text-red-400 opacity-50" />
                  <p className="font-semibold">{error}</p>
                </div>
              )}

              {!loading && !hasError && !hasInsight && (
                <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-12 text-center text-slate-500">
                  <Icons.Insight className="mx-auto mb-4 h-12 w-12 opacity-20" />
                  <p className="text-lg font-medium">Ready for log analysis</p>
                  <p className="mt-2 text-sm">Click generate to start the AI evaluation process.</p>
                </div>
              )}

              {!loading && !hasError && hasInsight && (
                <div className="grid gap-6 lg:grid-cols-3">
                  {sections.map((section, idx) => {
                    if (section.style) {
                      return (
                        <div
                          key={idx}
                          className={`group relative overflow-hidden rounded-2xl border ${section.style.border} bg-slate-900/60 p-6 transition-all duration-300 hover:translate-y--1 hover:shadow-2xl`}
                        >
                          <div className={`absolute inset-0 bg-gradient-to-br ${section.style.gradient} opacity-20`} />
                          
                          <div className="relative z-10 flex items-start justify-between mb-6">
                            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${section.style.accent}/10 ${section.style.text}`}>
                              {section.style.icon("h-7 w-7")}
                            </div>
                            <span className={`inline-flex items-center rounded-lg border ${section.style.border} bg-white/5 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest ${section.style.text}`}>
                              {section.style.badge}
                            </span>
                          </div>

                          <div className="relative z-10 space-y-4">
                            <h3 className={`text-xl font-bold tracking-tight ${section.style.text}`}>
                              {section.style.label}
                            </h3>
                            <div className="space-y-4">
                              {section.content.map((line, lineIndex) => {
                                const isList = line.trim().startsWith("-");
                                const cleanedLine = line.replace(/^-/, "").trim();
                                
                                if (isList || section.style.label === "Actions") {
                                  return (
                                    <div key={lineIndex} className="flex gap-3">
                                      <div className={`mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full ${section.style.accent}`} />
                                      <p className="text-sm leading-relaxed text-slate-300">
                                        {cleanedLine}
                                      </p>
                                    </div>
                                  );
                                }
                                
                                return (
                                  <p key={lineIndex} className={`text-sm leading-relaxed ${lineIndex === 0 ? "font-bold text-white/90" : "text-slate-400"}`}>
                                    {line}
                                  </p>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    }

                    // Render fallthrough content (intro or general notes)
                    return (
                      <div key={idx} className="lg:col-span-3 rounded-2xl border border-white/5 bg-white/[0.02] p-5">
                         <div className="space-y-2">
                           {section.content.map((line, lineIndex) => (
                             <p key={lineIndex} className="text-sm text-slate-400 italic leading-relaxed">
                               {line}
                             </p>
                           ))}
                         </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
