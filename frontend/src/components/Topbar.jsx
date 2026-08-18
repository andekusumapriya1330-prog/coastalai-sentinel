import React from "react";

export default function Topbar({ title, eyebrow, action }) {
  return (
    <div className="flex items-end justify-between px-8 py-6 border-b border-line">
      <div>
        {eyebrow && (
          <div className="font-mono text-[11px] text-chart tracking-widest uppercase mb-1">{eyebrow}</div>
        )}
        <h1 className="font-display text-2xl text-parchment">{title}</h1>
      </div>
      {action}
    </div>
  );
}
