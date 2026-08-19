import { Router } from "express";
import { users, nextId, logAudit } from "../data/mockData.js";
import { signToken } from "../middleware/auth.js";

const router = Router();

// POST /api/auth/login — email-only mock login (no password). Matches an
// existing demo account by email if one exists (keeping its assigned role);
// otherwise provisions the email on the fly with full "admin" access so any
// email can be used to explore the whole platform. This is intentionally
// permissive for a prototype/demo — swap in real authentication (hashed
// passwords or an identity provider) before handling real users/data.
router.post("/login", (req, res) => {
  const { email } = req.body || {};
  if (!email || !email.trim()) {
    return res.status(400).json({ error: "Email is required" });
  }

  let user = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
  if (!user) {
    user = {
      id: nextId("u"),
      email: email.trim(),
      role: "admin",
      name: email.trim().split("@")[0],
    };
  }

  const token = signToken(user);
  logAudit(user.id, "login", { email: user.email });
  res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
});

export default router;