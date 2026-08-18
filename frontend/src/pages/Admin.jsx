import React, { useEffect, useState } from "react";
import Topbar from "../components/Topbar.jsx";
import { api } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Admin() {
  const { session } = useAuth();
  const token = session?.token;
  const [log, setLog] = useState([]);

  useEffect(() => {
    api.getAudit(token).then((r) => setLog(r.auditLog));
  }, []);

  return (
    <div>
      <Topbar eyebrow="FR6.2 — Auditability" title="Audit Log" />
      <div className="p-8">
        <div className="border border-line rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-panel text-mute text-xs uppercase">
              <tr>
                <th className="text-left px-4 py-2">Time</th>
                <th className="text-left px-4 py-2">User</th>
                <th className="text-left px-4 py-2">Action</th>
                <th className="text-left px-4 py-2">Detail</th>
              </tr>
            </thead>
            <tbody>
              {log.map((entry) => (
                <tr key={entry.id} className="border-t border-line">
                  <td className="px-4 py-2 font-mono text-xs text-mute">{new Date(entry.timestamp).toLocaleString()}</td>
                  <td className="px-4 py-2">{entry.userId}</td>
                  <td className="px-4 py-2 text-chart2">{entry.action}</td>
                  <td className="px-4 py-2 font-mono text-xs text-mute">{JSON.stringify(entry.detail)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {log.length === 0 && <div className="p-4 text-mute text-sm">No audit events yet.</div>}
        </div>
      </div>
    </div>
  );
}
