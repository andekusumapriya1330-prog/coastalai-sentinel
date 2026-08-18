import React, { useEffect, useState } from "react";
import Topbar from "../components/Topbar.jsx";
import AlertCard from "../components/AlertCard.jsx";
import { api } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Alerts() {
  const { session } = useAuth();
  const token = session?.token;
  const [alerts, setAlerts] = useState([]);
  const [severity, setSeverity] = useState("");

  useEffect(() => {
    api.getAlerts(token, severity ? { severity } : {}).then((a) => setAlerts(a.alerts));
  }, [severity]);

  return (
    <div>
      <Topbar
        eyebrow="FR4 — Alerting & Notification"
        title="Alert Log"
        action={
          <select
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
            className="bg-ink border border-line rounded-md px-3 py-2 text-sm text-parchment"
          >
            <option value="">All severities</option>
            <option value="high">High</option>
            <option value="moderate">Moderate</option>
            <option value="low">Low</option>
          </select>
        }
      />
      <div className="p-8 space-y-3 max-w-3xl">
        {alerts.map((a) => (
          <AlertCard key={a.id} alert={a} />
        ))}
        {alerts.length === 0 && <div className="text-mute text-sm">No alerts match this filter.</div>}
      </div>
    </div>
  );
}
