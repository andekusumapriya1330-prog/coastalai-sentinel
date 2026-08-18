import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const DEMO_ACCOUNTS = [
  { email: "officer@coastalai.gov", role: "Disaster Mgmt Officer" },
  { email: "researcher@coastalai.gov", role: "Coastal Researcher" },
  { email: "analyst@coastalai.gov", role: "GIS Analyst" },
  { email: "admin@coastalai.gov", role: "Admin" },
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("officer@coastalai.gov");
  const [password, setPassword] = useState("demo1234");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-abyss bg-contour px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="font-display text-2xl text-parchment">CoastalAI</div>
          <div className="font-mono text-xs text-chart tracking-[0.3em] uppercase mt-1">Sentinel Console</div>
        </div>

        <form onSubmit={handleSubmit} className="border border-line bg-panel/60 rounded-xl p-6 space-y-4">
          <div>
            <label className="text-xs text-mute uppercase tracking-wide">Email</label>
            <input
              className="mt-1 w-full bg-ink border border-line rounded-md px-3 py-2 text-sm text-parchment focus:outline-none focus:ring-2 focus:ring-chart"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
            />
          </div>
          <div>
            <label className="text-xs text-mute uppercase tracking-wide">Password</label>
            <input
              className="mt-1 w-full bg-ink border border-line rounded-md px-3 py-2 text-sm text-parchment focus:outline-none focus:ring-2 focus:ring-chart"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
            />
          </div>
          {error && <div className="text-coral text-sm">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-chart text-ink font-semibold rounded-md py-2 text-sm hover:bg-chart2 transition-colors disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <div className="mt-6 border border-line rounded-lg p-4 bg-panel/30">
          <div className="text-xs text-mute uppercase tracking-wide mb-2">Demo accounts (password: demo1234)</div>
          <div className="grid grid-cols-1 gap-1">
            {DEMO_ACCOUNTS.map((a) => (
              <button
                key={a.email}
                type="button"
                onClick={() => setEmail(a.email)}
                className="text-left text-xs font-mono text-mute hover:text-chart2 flex justify-between"
              >
                <span>{a.email}</span>
                <span className="text-parchment/60">{a.role}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
