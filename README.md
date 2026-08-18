# CoastalAI-Sentinel

A full-stack implementation scaffold for **CoastalAI-Sentinel**, the AI-integrated
geospatial platform described in the project's SRS and System Sequence Diagrams:
coastal erosion monitoring, land-use change detection, and threshold-based
disaster risk alerting.

```
coastalai-sentinel/
├── backend/     Express REST API (mock data, real route contracts) — see backend/README.md
├── frontend/    React + Vite dashboard (map, analytics, alerts, HITL review) — see frontend/README.md
└── docker-compose.yml
```

## What this is — and isn't

This is a **fully wired, runnable full-stack application**: real authentication
flow, real routing, real RBAC, a real map and real charts driven by a real API —
not static mockups. What it does **not** include, because they require
infrastructure this environment can't provision on your behalf, are the pieces
the SRS scopes as production integrations:

| SRS requirement | This build | To reach production |
|---|---|---|
| FR1 — Sentinel/Landsat/UAV/LiDAR ingestion | Simulated ingestion trigger, mock imagery response | Wire to Copernicus Open Access Hub / USGS EarthExplorer APIs + a job scheduler |
| FR2 — AI/ML segmentation, change detection, forecasting | Deterministic synthetic time series + mock confidence scores | Train/deploy the actual models (e.g. as a separate inference service the backend calls) |
| FR4.2 — Email/SMS notification | Alerts logged and shown on dashboard only | Wire to a provider (Twilio, AWS SES/SNS) |
| FR5.1 — OGC WMS/WFS | Minimal stub endpoints returning correct shapes | Put a real map server (GeoServer/MapServer/TiTiler) behind those routes |
| Data store (FR1.3) | In-memory JS arrays, reset on restart | Postgres/PostGIS + object storage (S3) for imagery |
| Auth | Mock user table + JWT | Real user store + hashed passwords (bcrypt) or an identity provider (Auth0/Cognito) |

The API route paths and payload shapes are deliberately stable so that swapping
a mock for the real thing (e.g. mock time series → a real model service) doesn't
require frontend changes.

## Quick start (local)

```bash
# Terminal 1 — backend
cd backend
npm install
cp .env.example .env
npm run dev          # http://localhost:4000

# Terminal 2 — frontend
cd frontend
npm install
cp .env.example .env
npm run dev           # http://localhost:5173
```

Log in with any demo account from `backend/README.md` (e.g.
`officer@coastalai.gov` / `demo1234`).

## Quick start (Docker)

```bash
docker compose up --build
```

Frontend at `http://localhost:5173`, backend at `http://localhost:4000`.

## Publishing it live

- **Backend** → Render, Railway, Fly.io, or any VM: push `backend/`, set
  `JWT_SECRET` and `CORS_ORIGIN` env vars, `npm start`. Dockerfile included.
- **Frontend** → Vercel or Netlify: point at `frontend/`, build command
  `npm run build`, output dir `dist`, set `VITE_API_URL` to your deployed
  backend's `/api` URL. Or serve the Docker image behind nginx.
- Put both behind HTTPS (Vercel/Render do this automatically) — the SRS's
  "encryption in transit" NFR is satisfied by TLS termination at that layer.

## Design

Dark "survey-console" theme — deep ink navy, chart cyan/teal for data,
coral/amber for risk severity, monospace numerals for instrument-style
readouts — meant to read like a hydrographic monitoring station rather than a
generic admin template.
