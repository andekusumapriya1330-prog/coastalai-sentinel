# CoastalAI-Sentinel — Frontend

React + Vite dashboard implementing the SRS's Visualization & Dashboard (FR3),
Alerting (FR4 view), and Human-in-the-Loop review (FR2.5/SSD-3) requirements.

## Run locally

```bash
npm install
cp .env.example .env      # point VITE_API_URL at your backend
npm run dev
```

Opens at `http://localhost:5173`. Log in with one of the demo accounts listed
in `../backend/README.md`.

## Build

```bash
npm run build       # outputs static site to dist/
npm run preview      # serve the production build locally
```

`dist/` is a static bundle — deploy it to Vercel, Netlify, Cloudflare Pages, or
any static host / nginx container (`Dockerfile` included). Set the
`VITE_API_URL` environment variable at build time to your deployed backend URL.

## Pages

- **Login** — role-based demo auth
- **Dashboard** — map of monitored regions, risk levels, live alert feed, manual ingestion trigger
- **Analytics** — per-region shoreline/erosion time series with confidence band (Recharts)
- **Alerts** — full alert log, filterable by severity
- **Review** — human-in-the-loop correction queue for low-confidence AI predictions (analyst/admin)
- **Admin** — audit log (admin only)
