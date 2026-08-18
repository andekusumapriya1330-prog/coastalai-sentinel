import React, { useEffect, useState } from "react";
import Topbar from "../components/Topbar.jsx";
import { api } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Review() {
  const { session } = useAuth();
  const token = session?.token;
  const [predictions, setPredictions] = useState([]);
  const [notesById, setNotesById] = useState({});
  const [busyId, setBusyId] = useState(null);

  async function load() {
    const { predictions } = await api.getPredictions(token, "flagged");
    setPredictions(predictions);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCorrect(id, correctedLabel) {
    setBusyId(id);
    try {
      await api.submitCorrection(token, id, { correctedLabel, notes: notesById[id] || "" });
      await load();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <Topbar eyebrow="FR2.5 / SSD-3 — Human-in-the-loop" title="Review Queue" />
      <div className="p-8 space-y-4 max-w-3xl">
        {predictions.map((p) => (
          <div key={p.id} className="border border-line bg-panel/40 rounded-lg p-5">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-mono text-xs text-amber uppercase">{p.type}</div>
                <div className="text-parchment font-medium mt-1">{p.region}</div>
                <div className="text-sm text-mute mt-1">{p.note}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-mute">Confidence</div>
                <div className="font-mono text-coral text-lg">{(p.confidence * 100).toFixed(0)}%</div>
              </div>
            </div>
            <textarea
              placeholder="Correction notes…"
              value={notesById[p.id] || ""}
              onChange={(e) => setNotesById({ ...notesById, [p.id]: e.target.value })}
              className="mt-3 w-full bg-ink border border-line rounded-md px-3 py-2 text-sm text-parchment"
              rows={2}
            />
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => handleCorrect(p.id, "confirmed")}
                disabled={busyId === p.id}
                className="text-sm bg-chart text-ink px-3 py-1.5 rounded-md font-semibold hover:bg-chart2 disabled:opacity-60"
              >
                Confirm boundary
              </button>
              <button
                onClick={() => handleCorrect(p.id, "corrected")}
                disabled={busyId === p.id}
                className="text-sm border border-line text-parchment px-3 py-1.5 rounded-md hover:bg-panel"
              >
                Submit correction
              </button>
            </div>
          </div>
        ))}
        {predictions.length === 0 && (
          <div className="text-mute text-sm">No predictions currently flagged for review.</div>
        )}
      </div>
    </div>
  );
}
