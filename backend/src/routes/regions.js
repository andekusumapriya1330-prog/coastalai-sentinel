import { Router } from "express";
import { regions } from "../data/mockData.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// GET /api/regions — monitored AOIs (FR3.1 map layer source, FR3.3 filtering)
router.get("/", requireAuth, (req, res) => {
  res.json({ regions });
});

router.get("/:id", requireAuth, (req, res) => {
  const region = regions.find((r) => r.id === req.params.id);
  if (!region) return res.status(404).json({ error: "Region not found" });
  res.json({ region });
});

export default router;
