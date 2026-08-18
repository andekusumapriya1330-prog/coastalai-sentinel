const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

async function request(path, { method = "GET", body, token } = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

export const api = {
  login: (email, password) => request("/auth/login", { method: "POST", body: { email, password } }),
  getRegions: (token) => request("/regions", { token }),
  getAlerts: (token, params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/alerts${qs ? `?${qs}` : ""}`, { token });
  },
  triggerIngestion: (token, regionId) =>
    request("/ingestion/trigger", { method: "POST", body: { regionId }, token }),
  getTimeSeries: (token, regionId, start, end) => {
    const qs = new URLSearchParams({ ...(start ? { start } : {}), ...(end ? { end } : {}) }).toString();
    return request(`/timeseries/${regionId}${qs ? `?${qs}` : ""}`, { token });
  },
  getPredictions: (token, status) =>
    request(`/predictions${status ? `?status=${status}` : ""}`, { token }),
  submitCorrection: (token, id, body) =>
    request(`/predictions/${id}/correction`, { method: "POST", body, token }),
  getAudit: (token) => request("/audit", { token }),
};
