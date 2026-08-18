import { logAudit } from "../data/mockData.js";

// FR6.2 — audit logging middleware. Wrap a route handler with this to record
// who did what. Kept lightweight/in-memory for the prototype; point it at a
// durable store (Postgres, CloudWatch, etc.) in production.
export function withAudit(action) {
  return (req, res, next) => {
    res.on("finish", () => {
      if (res.statusCode < 400) {
        logAudit(req.user?.sub || "anonymous", action, {
          method: req.method,
          path: req.originalUrl,
          status: res.statusCode,
        });
      }
    });
    next();
  };
}
