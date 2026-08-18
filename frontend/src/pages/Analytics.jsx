import React, { useEffect, useState } from "react";
import Topbar from "../components/Topbar.jsx";
import { api } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

export default function Analytics() {
  const { session } = useAuth();
  const token = session?.token;
  const [regions, setRegions] = useState([]);
  const [regionId, setRegionId] = useState("");
  const [series, setSeries] = useState(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    api.getRegions(token).then((r) => {
      setRegions(r.regions);
      if (r.regions.length) setRegionId(r.regions[0].id);
    });
  }, []);

  useEffect(() => {
    if (!regionId) return;
    api.getTimeSeries(token, regionId).then(setSeries);
  }, [regionId]);

  function handleExport() {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      // FR3.4 — export processed layers as GeoTIFF/Shapefile. Wire this to a
      // real export job (backend generates the file / signed URL) in production.
      alert(`Export queued: ${series?.region} shoreline layer (GeoTIFF). A download link would be emailed/served here.`);
    }, 600);
  }

  return (
    <div>
      <Topbar
        eyebrow="Shoreline time-series"
        title="Erosion & Accretion Analytics"
        action={
          <div className="flex items-center gap-3">
            <select
              value={regionId}
              onChange={(e) => setRegionId(e.target.value)}
              className="bg-ink border border-line rounded-md px-3 py-2 text-sm text-parchment"
            >
              {regions.map((r) => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
            <button
              onClick={handleExport}
              disabled={exporting}
              className="border border-line text-sm text-chart2 px-4 py-2 rounded-md hover:bg-panel"
            >
              {exporting ? "Preparing…" : "Export GeoTIFF"}
            </button>
          </div>
        }
      />

      <div className="p-8">
        <div className="border border-line bg-panel/40 rounded-lg p-6" style={{ height: 420 }}>
          {series ? (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={series.points}>
                <CartesianGrid stroke="#1E2A40" strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fill: "#7C8AA3", fontSize: 11 }} minTickGap={40} />
                <YAxis tick={{ fill: "#7C8AA3", fontSize: 11 }} label={{ value: "Shoreline position (m)", angle: -90, position: "insideLeft", fill: "#7C8AA3", fontSize: 11 }} />
                <Tooltip contentStyle={{ background: "#101A2C", border: "1px solid #1E2A40", color: "#E8E2D0" }} />
                <Legend wrapperStyle={{ fontSize: 12, color: "#7C8AA3" }} />
                <Area
                  type="monotone"
                  dataKey="confidenceHigh"
                  stroke="none"
                  fill="#22D3EE"
                  fillOpacity={0.08}
                  name="Confidence band"
                />
                <Area
                  type="monotone"
                  dataKey="confidenceLow"
                  stroke="none"
                  fill="#070B14"
                  fillOpacity={1}
                  name=""
                  legendType="none"
                />
                <Line
                  type="monotone"
                  dataKey="shorelinePositionM"
                  stroke="#5EEAD4"
                  strokeWidth={2}
                  dot={false}
                  name="Shoreline position (m)"
                />
              </ComposedChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-mute text-sm">Loading time series…</div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6 text-sm">
          <div className="border border-line rounded-lg p-4 bg-panel/30">
            <div className="text-xs text-mute uppercase">Model accuracy target</div>
            <div className="font-mono text-chart mt-1">≥ 90% vs. ground truth</div>
          </div>
          <div className="border border-line rounded-lg p-4 bg-panel/30">
            <div className="text-xs text-mute uppercase">Classification kappa</div>
            <div className="font-mono text-chart mt-1">≥ 0.85</div>
          </div>
          <div className="border border-line rounded-lg p-4 bg-panel/30">
            <div className="text-xs text-mute uppercase">Ingestion → layer latency</div>
            <div className="font-mono text-chart mt-1">≤ 6–24 hrs</div>
          </div>
        </div>
      </div>
    </div>
  );
}
