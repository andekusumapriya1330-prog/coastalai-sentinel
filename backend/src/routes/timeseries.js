import { Router } from "express";
import { buildTimeSeries } from "../data/mockData.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// GET /api/timeseries/:regionId — shoreline position + erosion rate + confidence
// band over a date range (SSD-2: computeErosionTrend). FR2.3 forecasting would
// extend `points` with a `forecast: true` tail — left as a TODO for the model
// service integration.
router.get("/:regionId", requireAuth, (req, res) => {
  const { regionId } = req.params;
  const { start, end } = req.query;
  const series = buildTimeSeries(regionId, start, end);
  res.json(series);
});

export default router;
