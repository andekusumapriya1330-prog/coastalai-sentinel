import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";

import authRoutes from "./routes/auth.js";
import regionRoutes from "./routes/regions.js";
import alertRoutes from "./routes/alerts.js";
import ingestionRoutes from "./routes/ingestion.js";
import timeseriesRoutes from "./routes/timeseries.js";
import predictionRoutes from "./routes/predictions.js";
import ogcRoutes from "./routes/ogc.js";
import auditRoutes from "./routes/audit.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "coastalai-sentinel-backend", time: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/regions", regionRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/ingestion", ingestionRoutes);
app.use("/api/timeseries", timeseriesRoutes);
app.use("/api/predictions", predictionRoutes);
app.use("/api/ogc", ogcRoutes);
app.use("/api/audit", auditRoutes);

app.use((req, res) => res.status(404).json({ error: "Not found" }));

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`CoastalAI-Sentinel API listening on http://localhost:${PORT}`);
});
