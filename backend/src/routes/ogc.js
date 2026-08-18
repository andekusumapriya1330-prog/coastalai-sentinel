import { Router } from "express";
import { regions } from "../data/mockData.js";

const router = Router();

// GET /api/ogc/wms — minimal OGC WMS-style GetCapabilities stub (FR5.1).
// A production build should sit behind a real map server (GeoServer/MapServer/
// TiTiler) — this stub documents the contract for third-party GIS integration.
router.get("/wms", (req, res) => {
  res.set("Content-Type", "application/xml");
  res.send(`<?xml version="1.0" encoding="UTF-8"?>
<WMS_Capabilities version="1.3.0">
  <Service><Name>CoastalAI-Sentinel WMS</Name></Service>
  <Capability>
    <Layer>
      <Title>CoastalAI-Sentinel Monitored Regions</Title>
      ${regions.map((r) => `<Layer queryable="1"><Name>${r.id}</Name><Title>${r.name}</Title></Layer>`).join("\n      ")}
    </Layer>
  </Capability>
</WMS_Capabilities>`);
});

// GET /api/ogc/wfs — minimal OGC WFS-style feature stub (FR5.1)
router.get("/wfs", (req, res) => {
  res.json({
    type: "FeatureCollection",
    features: regions.map((r) => ({
      type: "Feature",
      id: r.id,
      geometry: { type: "Point", coordinates: [r.lng, r.lat] },
      properties: { name: r.name, riskLevel: r.riskLevel, lastErosionRateM: r.lastErosionRateM },
    })),
  });
});

export default router;
