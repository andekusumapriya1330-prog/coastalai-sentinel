import { Router } from "express";
import { regions, alerts, nextId, logAudit } from "../data/mockData.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();

// POST /api/ingestion/trigger — simulates SSD-1: Scheduler -> requestImagery ->
// runChangeDetectionModel -> evaluateThreshold -> generateAlert -> logAlertEvent.
// In production this is called by a scheduler (cron/Step Functions/Airflow), not
// directly by a browser — exposed here so the dashboard can demo the pipeline.
router.post("/trigger", requireAuth, requireRole("admin", "officer"), (req, res) => {
  const { regionId } = req.body || {};
  const region = regions.find((r) => r.id === regionId) || regions[Math.floor(Math.random() * regions.length)];

  // [internal] requestImagery(region, date) -> imageryData  — simulated
  // [internal] runChangeDetectionModel()                    — simulated
  const simulatedRate = Number((region.lastErosionRateM + (Math.random() - 0.5)).toFixed(2));
  const threshold = 2.5;
  const confidence = Number((0.7 + Math.random() * 0.25).toFixed(2));

  let alert = null;
  // [internal] evaluateThreshold(erosionRate)
  if (simulatedRate >= threshold) {
    alert = {
      id: nextId("al"),
      regionId: region.id,
      region: region.name,
      severity: simulatedRate >= 3.5 ? "high" : "moderate",
      type: "erosion",
      erosionRateM: simulatedRate,
      confidence,
      message: `Shoreline retreat of ${simulatedRate} m/yr exceeded configured threshold (${threshold} m/yr).`,
      timestamp: new Date().toISOString(),
      channels: ["email", "dashboard"],
    };
    alerts.unshift(alert); // generateAlert + logAlertEvent
  }

  logAudit(req.user.sub, "trigger_ingestion", { regionId: region.id, simulatedRate, alertGenerated: !!alert });

  res.json({
    region: region.name,
    ingestedAt: new Date().toISOString(),
    erosionRateM: simulatedRate,
    thresholdM: threshold,
    confidence,
    alertGenerated: !!alert,
    alert,
  });
});

export default router;
