import { Router } from "express";
import { alerts } from "../data/mockData.js";
import { requireAuth } from "../middleware/auth.js";
import { withAudit } from "../middleware/audit.js";

const router = Router();

// GET /api/alerts — alert log with location, severity, model confidence (FR4.3)
router.get("/", requireAuth, withAudit("view_alerts"), (req, res) => {
  const { severity, regionId } = req.query;
  let result = alerts;
  if (severity) result = result.filter((a) => a.severity === severity);
  if (regionId) result = result.filter((a) => a.regionId === regionId);
  res.json({ alerts: result.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)) });
});

export default router;
