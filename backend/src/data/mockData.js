// Simulated data layer standing in for: STAC catalog (FR1.3), AI/ML analytics
// engine (FR2), and alert log (FR4). Replace with real ingestion/model calls
// when moving to production — route handlers only depend on these shapes.

export const users = [
  { id: "u1", email: "officer@coastalai.gov", password: "demo1234", role: "officer", name: "R. Alvarez" },
  { id: "u2", email: "researcher@coastalai.gov", password: "demo1234", role: "researcher", name: "Dr. N. Rao" },
  { id: "u3", email: "analyst@coastalai.gov", password: "demo1234", role: "analyst", name: "S. Chen" },
  { id: "u4", email: "admin@coastalai.gov", password: "demo1234", role: "admin", name: "Platform Admin" },
];

export const regions = [
  { id: "reg-1", name: "Vizag Coastal Corridor", lat: 17.6868, lng: 83.2185, riskLevel: "moderate", lastErosionRateM: 1.8 },
  { id: "reg-2", name: "Chilika Lagoon Barrier", lat: 19.7167, lng: 85.3167, riskLevel: "high", lastErosionRateM: 3.4 },
  { id: "reg-3", name: "Kakinada Mangrove Belt", lat: 16.9891, lng: 82.2475, riskLevel: "low", lastErosionRateM: 0.6 },
  { id: "reg-4", name: "Digha Shoreline", lat: 21.6274, lng: 87.5088, riskLevel: "high", lastErosionRateM: 4.1 },
  { id: "reg-5", name: "Puri-Konark Beach Belt", lat: 19.8135, lng: 85.8312, riskLevel: "high", lastErosionRateM: 3.9 },
  { id: "reg-6", name: "Paradip Port Foreshore", lat: 20.3167, lng: 86.6167, riskLevel: "moderate", lastErosionRateM: 2.1 },
  { id: "reg-7", name: "Godavari Delta Front", lat: 16.5062, lng: 81.8040, riskLevel: "moderate", lastErosionRateM: 1.6 },
  { id: "reg-8", name: "Krishna Delta Front", lat: 15.9129, lng: 80.8365, riskLevel: "low", lastErosionRateM: 0.9 },
  { id: "reg-9", name: "Chennai Marina Coast", lat: 13.0500, lng: 80.2824, riskLevel: "moderate", lastErosionRateM: 1.4 },
  { id: "reg-10", name: "Rameswaram Sandbar", lat: 9.2876, lng: 79.3129, riskLevel: "low", lastErosionRateM: 0.5 },
  { id: "reg-11", name: "Kochi Backwater Barrier", lat: 9.9312, lng: 76.2673, riskLevel: "high", lastErosionRateM: 3.1 },
  { id: "reg-12", name: "Sundarbans Delta Fringe", lat: 21.9497, lng: 88.9468, riskLevel: "high", lastErosionRateM: 4.6 },
];

export let alerts = [
  {
    id: "al-1001",
    regionId: "reg-2",
    region: "Chilika Lagoon Barrier",
    severity: "high",
    type: "erosion",
    erosionRateM: 3.4,
    confidence: 0.91,
    message: "Shoreline retreat exceeded configured threshold (2.5 m/yr).",
    timestamp: "2026-08-15T06:12:00Z",
    channels: ["email", "sms", "dashboard"],
  },
  {
    id: "al-1000",
    regionId: "reg-4",
    region: "Digha Shoreline",
    severity: "high",
    type: "erosion",
    erosionRateM: 4.1,
    confidence: 0.88,
    message: "Rapid accretion/erosion anomaly flagged near river mouth.",
    timestamp: "2026-08-12T21:40:00Z",
    channels: ["email", "dashboard"],
  },
  {
    id: "al-0999",
    regionId: "reg-1",
    region: "Vizag Coastal Corridor",
    severity: "moderate",
    type: "flood-risk",
    erosionRateM: 1.8,
    confidence: 0.76,
    message: "Storm-surge flood extent projection crossed watch threshold.",
    timestamp: "2026-08-09T11:05:00Z",
    channels: ["dashboard"],
  },
];

export let predictions = [
  {
    id: "pr-501",
    regionId: "reg-3",
    region: "Kakinada Mangrove Belt",
    type: "land-cover-change",
    confidence: 0.54,
    status: "flagged",
    detectedAt: "2026-08-16T04:00:00Z",
    note: "Possible illegal construction vs. seasonal sediment bar — low confidence.",
  },
  {
    id: "pr-502",
    regionId: "reg-1",
    region: "Vizag Coastal Corridor",
    type: "shoreline-position",
    confidence: 0.61,
    status: "flagged",
    detectedAt: "2026-08-17T02:30:00Z",
    note: "Cloud cover partially obscured Sentinel-2 tile; boundary uncertain.",
  },
];

export let auditLog = [];

export function logAudit(userId, action, detail) {
  auditLog.unshift({
    id: `aud-${Date.now()}`,
    userId,
    action,
    detail,
    timestamp: new Date().toISOString(),
  });
}

// Deterministic-ish synthetic time series so charts look coherent across reloads.
export function buildTimeSeries(regionId, start, end) {
  const region = regions.find((r) => r.id === regionId) || regions[0];
  const startDate = start ? new Date(start) : new Date("2025-01-01");
  const endDate = end ? new Date(end) : new Date("2026-08-01");
  const months = Math.max(
    1,
    (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth())
  );
  const baseRate = region.lastErosionRateM;
  const points = [];
  let cumulative = 0;
  for (let i = 0; i <= months; i++) {
    const d = new Date(startDate.getFullYear(), startDate.getMonth() + i, 1);
    const seasonal = Math.sin((i / 12) * Math.PI * 2) * (baseRate * 0.35);
    const noise = ((Math.sin(i * 12.9898) * 43758.5453) % 1) * 0.3;
    const monthlyRate = Math.max(0, baseRate / 12 + seasonal / 12 + noise * 0.1);
    cumulative += monthlyRate;
    points.push({
      date: d.toISOString().slice(0, 10),
      shorelinePositionM: -Number(cumulative.toFixed(2)),
      erosionRateM: Number(monthlyRate.toFixed(3)),
      confidenceLow: -Number((cumulative + 0.4 + i * 0.02).toFixed(2)),
      confidenceHigh: -Number((cumulative - 0.4 - i * 0.02).toFixed(2)),
    });
  }
  return { region: region.name, regionId: region.id, points };
}

export function nextId(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}