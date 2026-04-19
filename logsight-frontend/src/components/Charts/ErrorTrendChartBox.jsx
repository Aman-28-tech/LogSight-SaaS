import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import ChartWrapper from "../ui/ChartWrapper";

const tooltipStyle = {
  background: "#020617",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "14px",
  padding: "10px 12px",
  boxShadow: "0 18px 40px rgba(2, 6, 23, 0.45)",
};

export default function ErrorTrendChartBox({ data, loading = false, metric, metricLabel }) {
  return (
    <ChartWrapper
      title="Error Trend"
      titleClassName="text-rose-400 font-bold"
      metric={metric}
      metricLabel={metricLabel}
      isLoading={loading}
      isEmpty={data.length === 0}
      emptyMessage="Error activity will appear here when error logs are present."
    >
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
          <defs>
            <linearGradient id="errorTrendGradientModern" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.7} />
              <stop offset="100%" stopColor="#9f1239" stopOpacity={0.0} />
            </linearGradient>
            <filter id="errorTrendGlowModern" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#f43f5e" floodOpacity="0.4" />
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
            itemStyle={{ color: "#fecdd3", fontWeight: 600 }}
            cursor={{ stroke: "rgba(255,255,255,0.1)", strokeWidth: 2, strokeDasharray: "4 4" }}
          />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#f43f5e"
            fill="url(#errorTrendGradientModern)"
            strokeWidth={4}
            activeDot={{ r: 6, fill: "#fda4af", stroke: "#881337", strokeWidth: 2 }}
            filter="url(#errorTrendGlowModern)"
            animationDuration={1500}
            animationEasing="ease-out"
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}
