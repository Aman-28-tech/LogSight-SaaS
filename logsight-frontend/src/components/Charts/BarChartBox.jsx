import {
  BarChart,
  Bar,
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

export default function BarChartBox({ data, loading = false, metric, metricLabel }) {
  return (
    <ChartWrapper
      title="Service Activity"
      titleClassName="text-violet-400 font-bold"
      metric={metric}
      metricLabel={metricLabel}
      isLoading={loading}
      isEmpty={data.length === 0}
      emptyMessage="Service activity will appear once logs are grouped by service."
    >
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
          <XAxis
            dataKey="service"
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
            itemStyle={{ color: "#ddd6fe", fontWeight: 600 }}
            cursor={{ fill: "rgba(255,255,255,0.03)" }}
          />
          <defs>
            <linearGradient id="barGradientModern" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity={1} />
              <stop offset="100%" stopColor="#4c1d95" stopOpacity={0.8} />
            </linearGradient>
            <filter id="barGlowModern" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#8b5cf6" floodOpacity="0.3" />
            </filter>
          </defs>
          <Bar
            dataKey="count"
            fill="url(#barGradientModern)"
            radius={[6, 6, 0, 0]}
            filter="url(#barGlowModern)"
            animationDuration={1500}
            animationEasing="ease-out"
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}
