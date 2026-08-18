import { Router } from "express";
import { predictions, nextId, logAudit } from "../data/mockData.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();

// GET /api/predictions?status=flagged — low-confidence AI outputs queued for
// human-in-the-loop review (SSD-3, FR2.5)
router.get("/", requireAuth, (req, res) => {
  const { status } = req.query;
  const result = status ? predictions.filter((p) => p.status === status) : predictions;
  res.json({ predictions: result });
});

// POST /api/predictions/:id/correction — analyst submits corrected boundary,
// system stores correction + queues for retraining (FR2.5)
router.post(
  "/:id/correction",
  requireAuth,
  requireRole("analyst", "admin"),
  (req, res) => {
    const prediction = predictions.find((p) => p.id === req.params.id);
    if (!prediction) return res.status(404).json({ error: "Prediction not found" });

    const { correctedLabel, notes } = req.body || {};
    prediction.status = "corrected";
    prediction.correction = {
      id: nextId("corr"),
      correctedLabel: correctedLabel || "unspecified",
      notes: notes || "",
      correctedBy: req.user.sub,
      correctedAt: new Date().toISOString(),
      queuedForRetraining: true,
    };

    logAudit(req.user.sub, "submit_correction", { predictionId: prediction.id });

    res.json({ confirmation: "received", prediction });
  }
);

export default router;
