import React, { useEffect, useState } from "react";
import Topbar from "../components/Topbar.jsx";
import MapView from "../components/MapView.jsx";
import StatCard from "../components/StatCard.jsx";
import AlertCard from "../components/AlertCard.jsx";
import { api } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Dashboard() {
  const { session } = useAuth();
  const token = session?.token;
  const role = session?.user?.role;
  const [regions, setRegions] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [selectedId, setSelectedId] = useState(""); // "" = All Regions
  const [triggering, setTriggering] = useState(false);
  const [lastRun, setLastRun] = useState(null);

  async function loadRegions() {
    const r = await api.getRegions(token);
    setRegions(r.regions);
  }

  async function loadAlerts(regionId) {
    const a = await api.getAlerts(token, regionId ? { regionId } : {});
    setAlerts(a.alerts.slice(0, 6));
  }

  useEffect(() => {
    loadRegions();
  }, []);

  // Re-fetch the alert feed whenever the selected region changes.
  useEffect(() => {
    loadAlerts(selectedId);
  }, [selectedId]);

  async function handleTrigger() {
    setTriggering(true);
    try {
      const result = await api.triggerIngestion(token, selectedId || undefined);
      setLastRun(result);
      await loadRegions();
      await loadAlerts(selectedId);
    } finally {
      setTriggering(false);
    }
  }

  const selectedRegion = regions.find((r) => r.id === selectedId) || null;
  const visibleRegions = selectedRegion ? [selectedRegion] : regions;
  const highRisk = visibleRegions.filter((r) => r.riskLevel === "high").length;

  return (
    <div>
      <Topbar
        eyebrow="Live overview"
        title="Regional Monitoring"
        action={
          <div className="flex items-center gap-3">
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="bg-ink border border-line rounded-md px-3 py-2 text-sm text-parchment focus:outline-none focus:ring-2 focus:ring-chart"
            >
              <option value="">All regions</option>
              {regions.map((r) => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
            {(role === "officer" || role === "admin") && (
              <button
                onClick={handleTrigger}
                disabled={triggering}
                className="bg-chart text-ink text-sm font-semibold px-4 py-2 rounded-md hover:bg-chart2 disabled:opacity-60"
              >
                {triggering ? "Running ingestion…" : "Run ingestion cycle"}
              </button>
            )}
          </div>
        }
      />

      <div className="p-8 space-y-6">
        {lastRun && (
          <div className="border border-line bg-panel/50 rounded-lg px-4 py-3 text-sm">
            <span className="font-mono text-chart2">SSD-1 simulated:</span>{" "}
            requested imagery for <span className="text-parchment">{lastRun.region}</span>, computed rate{" "}
            <span className="text-parchment">{lastRun.erosionRateM} m/yr</span> (confidence{" "}
            {(lastRun.confidence * 100).toFixed(0)}%) —{" "}
            {lastRun.alertGenerated ? (
              <span className="text-coral">threshold exceeded, alert generated</span>
            ) : (
              <span className="text-chart2">within threshold, no alert</span>
            )}
          </div>
        )}

        <div className="grid grid-cols-4 gap-4">
          <StatCard
            label={selectedRegion ? "Selected region" : "Monitored regions"}
            value={selectedRegion ? selectedRegion.riskLevel.toUpperCase() : regions.length}
            sub={selectedRegion ? selectedRegion.name : undefined}
            tone="chart"
          />
          <StatCard label="High risk zones" value={highRisk} tone="coral" />
          <StatCard label="Active alerts" value={alerts.length} tone="amber" />
          <StatCard label="Platform uptime target" value="99.5%" sub="NFR — availability" tone="chart2" />
        </div>

        <div className="grid grid-cols-3 gap-6" style={{ height: "440px" }}>
          <div className="col-span-2 h-full">
            <MapView regions={visibleRegions} onSelect={setSelectedId} selectedId={selectedId} />
          </div>
          <div className="space-y-3 overflow-y-auto pr-1">
            <div className="text-xs text-mute uppercase tracking-wide">
              {selectedRegion ? `Alerts — ${selectedRegion.name}` : "Recent alerts — all regions"}
            </div>
            {alerts.map((a) => (
              <AlertCard key={a.id} alert={a} />
            ))}
            {alerts.length === 0 && <div className="text-sm text-mute">No alerts logged yet.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
