import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import ChartWrapper from "../ui/ChartWrapper";

const tooltipStyle = {
  background: "#020617",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "14px",
  padding: "10px 12px",
  boxShadow: "0 18px 40px rgba(2, 6, 23, 0.45)",
};

export default function LineChartBox({ data, loading = false, metric, metricLabel }) {
  return (
    <ChartWrapper
      title="Logs Over Time"
      titleClassName="text-emerald-400 font-bold"
      metric={metric}
      metricLabel={metricLabel}
      isLoading={loading}
      isEmpty={data.length === 0}
      emptyMessage="No log activity yet, so there is nothing to plot over time."
    >
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
          <defs>
            <linearGradient id="lineColorGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#34d399" stopOpacity={1} />
              <stop offset="100%" stopColor="#10b981" stopOpacity={1} />
            </linearGradient>
            <filter id="lineGlowModern" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#10b981" floodOpacity="0.35" />
            </filter>
          </defs>
          <XAxis
            dataKey="time"
            stroke="#64748b"
            tick={{ fill: "#64748b", fontSize: 11, fontWeight: 500 }}
            tickLine={false}
            axisLine={{ stroke: "rgba(255,255,255,0.06)" }}
            tickMargin={8}
          />
          <YAxis
            stroke="#64748b"
            tick={{ fill: "#64748b", fontSize: 11, fontWeight: 500 }}
            tickLine={false}
            axisLine={{ stroke: "rgba(255,255,255,0.06)" }}
            tickMargin={8}
            width={40}
          />
          <Tooltip
            contentStyle={{
              background: "rgba(15, 23, 42, 0.85)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "12px",
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.3)"
            }}
            labelStyle={{ color: "#94a3b8", marginBottom: "6px", fontWeight: 500 }}
            itemStyle={{ color: "#a7f3d0", fontWeight: 600 }}
            cursor={{ stroke: "rgba(255,255,255,0.1)", strokeWidth: 2, strokeDasharray: "4 4" }}
          />
          <Line
            type="monotone"
            dataKey="count"
            stroke="url(#lineColorGradient)"
            strokeWidth={4}
            dot={{ r: 0, fill: "#10b981", strokeWidth: 0 }}
            activeDot={{ r: 6, fill: "#34d399", stroke: "#064e3b", strokeWidth: 2 }}
            filter="url(#lineGlowModern)"
            animationDuration={1500}
            animationEasing="ease-out"
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}
