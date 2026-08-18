import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const NAV = [
  { to: "/", label: "Dashboard", roles: ["officer", "researcher", "analyst", "admin"] },
  { to: "/analytics", label: "Analytics", roles: ["officer", "researcher", "analyst", "admin"] },
  { to: "/alerts", label: "Alerts", roles: ["officer", "researcher", "analyst", "admin"] },
  { to: "/review", label: "Review Queue", roles: ["analyst", "admin"] },
  { to: "/admin", label: "Admin", roles: ["admin"] },
];

export default function Layout({ children }) {
  const { session, logout } = useAuth();
  const navigate = useNavigate();
  const role = session?.user?.role;

  return (
    <div className="min-h-screen flex bg-abyss bg-contour">
      <aside className="w-60 shrink-0 border-r border-line bg-ink/60 flex flex-col">
        <div className="px-5 py-6 border-b border-line">
          <div className="font-display text-lg tracking-tight text-parchment">CoastalAI</div>
          <div className="font-mono text-[11px] text-chart tracking-widest">— SENTINEL —</div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.filter((item) => item.roles.includes(role)).map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-panel text-chart border border-line"
                    : "text-mute hover:text-parchment hover:bg-panel/60"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="px-5 py-4 border-t border-line">
          <div className="text-xs text-mute">Signed in as</div>
          <div className="text-sm text-parchment">{session?.user?.name}</div>
          <div className="text-[11px] font-mono text-chart2 uppercase tracking-wide">{role}</div>
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="mt-3 text-xs text-coral hover:underline"
          >
            Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
