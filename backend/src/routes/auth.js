import { Router } from "express";
import { users, logAudit } from "../data/mockData.js";
import { signToken } from "../middleware/auth.js";

const router = Router();

// POST /api/auth/login  — mock credential check, returns JWT + role (FR6.1)
router.post("/login", (req, res) => {
  const { email, password } = req.body || {};
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }
  const token = signToken(user);
  logAudit(user.id, "login", { email });
  res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
});

export default router;
