import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

export function signToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email, role: user.role, name: user.name },
    SECRET,
    { expiresIn: "8h" }
  );
}

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Missing bearer token" });
  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

// FR6.1 — role-based access control
export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: `Requires role: ${roles.join(" or ")}` });
    }
    next();
  };
}
