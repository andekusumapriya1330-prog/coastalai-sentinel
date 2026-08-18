# CoastalAI-Sentinel — Backend API

Express REST API implementing the endpoints described in the SRS (FR1–FR6): data
ingestion triggers, AI/ML analytics results, dashboard queries, alerting, OGC-style
map endpoints, and role-based access control with audit logging.

> **Data is simulated.** There is no live connection to Copernicus/USGS, no trained
> model, and no SMS/email gateway wired up — see `src/data/mockData.js` for the
> generators. Swap those out for real ingestion jobs, a trained model service, and
> a notification provider (e.g. Twilio/SES) when you move past the prototype stage.
> The route contracts (paths, payload shapes) are built so that swap doesn't require
> changing the frontend.

## Run locally

```bash
npm install
cp .env.example .env
npm run dev
```

API listens on `http://localhost:4000` by default.

## Demo accounts (mock auth, POST /api/auth/login)

| email | password | role |
|---|---|---|
| officer@coastalai.gov | demo1234 | officer |
| researcher@coastalai.gov | demo1234 | researcher |
| analyst@coastalai.gov | demo1234 | analyst |
| admin@coastalai.gov | demo1234 | admin |

## Endpoints

- `POST /api/auth/login` — returns a JWT + role
- `GET  /api/regions` — monitored AOIs with current risk level
- `GET  /api/alerts` — alert log (FR4.3)
- `POST /api/ingestion/trigger` — simulate a scheduled ingestion + change-detection run (SSD-1)
- `GET  /api/timeseries/:regionId?start=&end=` — shoreline/erosion time series + confidence band (SSD-2)
- `GET  /api/predictions?status=flagged` — low-confidence predictions awaiting review (SSD-3)
- `POST /api/predictions/:id/correction` — submit a human correction, queues retraining
- `GET  /api/ogc/wms` , `GET /api/ogc/wfs` — minimal OGC-style capability stubs (FR5.1)
- `GET  /api/audit` — audit log (admin only)

## Deploying

Any Node host works (Render, Railway, Fly.io, an EC2/VM behind nginx). A `Dockerfile`
is included:

```bash
docker build -t coastalai-backend .
docker run -p 4000:4000 --env-file .env coastalai-backend
```

Set `CORS_ORIGIN` to your deployed frontend URL in production.
