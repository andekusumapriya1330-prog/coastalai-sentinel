import { Router } from "express";
import { auditLog } from "../data/mockData.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();

// GET /api/audit — admin-only audit trail (FR6.2)
router.get("/", requireAuth, requireRole("admin"), (req, res) => {
  res.json({ auditLog: auditLog.slice(0, 200) });
});

export default router;
