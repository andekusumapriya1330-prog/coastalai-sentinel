import React from "react";

const SEVERITY_STYLE = {
  high: "border-coral/50 bg-coral/10 text-coral",
  moderate: "border-amber/50 bg-amber/10 text-amber",
  low: "border-chart2/50 bg-chart2/10 text-chart2",
};

export default function AlertCard({ alert }) {
  return (
    <div className={`border rounded-lg px-4 py-3 ${SEVERITY_STYLE[alert.severity] || SEVERITY_STYLE.low}`}>
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] uppercase tracking-wide">{alert.severity} · {alert.type}</span>
        <span className="text-[11px] text-mute font-mono">{new Date(alert.timestamp).toLocaleString()}</span>
      </div>
      <div className="text-sm text-parchment mt-1">{alert.message}</div>
      <div className="text-xs text-mute mt-1">
        {alert.region} · rate {alert.erosionRateM} m/yr · confidence {(alert.confidence * 100).toFixed(0)}%
      </div>
    </div>
  );
}
