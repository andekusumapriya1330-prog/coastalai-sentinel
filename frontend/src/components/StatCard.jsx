import React from "react";

export default function StatCard({ label, value, sub, tone = "chart" }) {
  const toneClass = { chart: "text-chart", coral: "text-coral", amber: "text-amber", chart2: "text-chart2" }[tone];
  return (
    <div className="border border-line bg-panel/60 rounded-lg px-5 py-4">
      <div className="text-xs text-mute uppercase tracking-wide">{label}</div>
      <div className={`font-mono text-3xl mt-1 ${toneClass}`}>{value}</div>
      {sub && <div className="text-xs text-mute mt-1">{sub}</div>}
    </div>
  );
}
