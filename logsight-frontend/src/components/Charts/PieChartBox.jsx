import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import ChartWrapper from "../ui/ChartWrapper";

const COLORS = [
  "url(#colorError)",
  "url(#colorInfo)",
  "url(#colorWarning)",
];

export default function PieChartBox({ data, loading = false, metric, metricLabel }) {
  const safeData = Array.isArray(data) ? data : [];

  return (
    <ChartWrapper
      title="Log Levels"
      titleClassName="text-amber-400 font-bold"
      metric={metric}
      metricLabel={metricLabel}
      isLoading={loading}
      isEmpty={safeData.every((item) => item.value === 0)}
      emptyMessage="Log levels will appear here after the first logs arrive."
    >
      <ResponsiveContainer width="100%" height={250}>
        <PieChart margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
          <defs>
            <linearGradient id="colorError" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity={1} />
              <stop offset="100%" stopColor="#991b1b" stopOpacity={1} />
            </linearGradient>
            <linearGradient id="colorInfo" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
              <stop offset="100%" stopColor="#065f46" stopOpacity={1} />
            </linearGradient>
            <linearGradient id="colorWarning" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity={1} />
              <stop offset="100%" stopColor="#b45309" stopOpacity={1} />
            </linearGradient>
            <filter id="pieGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#000000" floodOpacity="0.5" />
            </filter>
          </defs>
          <Pie
            data={safeData}
            dataKey="value"
            outerRadius={85}
            innerRadius={55}
            paddingAngle={6}
            cornerRadius={6}
            stroke="none"
            filter="url(#pieGlow)"
            animationDuration={1500}
            animationEasing="ease-out"
          >
            {safeData.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "rgba(15, 23, 42, 0.85)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "12px",
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.3)"
            }}
            labelStyle={{ color: "#94a3b8", marginBottom: "6px", fontWeight: 500 }}
            itemStyle={{ color: "#f8fafc", fontWeight: 600 }}
          />
          <Legend
            verticalAlign="bottom"
            iconType="circle"
            wrapperStyle={{ color: "#cbd5e1", fontSize: "12px", paddingTop: "12px", fontWeight: 500 }}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}
