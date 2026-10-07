# SwiftWheels Fleet Workspace

A React and Tailwind CSS fleet-management app with a Node.js/Express API, MongoDB storage, session-based sign-in, and separate administrator and stakeholder access.

## Requirements

- Node.js 20.19+ (or 22.12+)
- MongoDB 6+ (local) or a MongoDB Atlas cluster

## Set up the database and API

1. Start MongoDB locally, or create a MongoDB Atlas cluster.
2. Copy `back-end/.env.example` to `back-end/.env`. Set `MONGODB_URI` to your local MongoDB URL or Atlas connection string and set `MONGODB_DB` to the database name. Add a random `SESSION_SECRET` of at least 32 characters and unique administrator credentials. Collections and indexes are created automatically; the administrator account is created on first server startup if that username does not already exist.
3. In a terminal, run:

   ```powershell
   cd back-end
   npm install
   npm run dev
   ```

Public signup creates stakeholder accounts only. Admin accounts are provisioned through the server environment and have write access to fleet, customer, and promotion records. Stakeholders have read-only access to the dashboards, fleet, promotions, and reports.

To change the password for an administrator that already exists in MongoDB, update `ADMIN_PASSWORD` in `back-end/.env`, stop the API, and run `npm run admin:reset-password` from the `back-end` directory. Then restart the API with `npm run dev`. Restarting the API by itself does not change an existing administrator's password.

## Run the React app

In a second terminal, run:

```powershell
cd front-end
npm install
npm run dev
```

Open the local Vite URL shown in the terminal (normally `http://localhost:5173`). Vite proxies `/api` requests to the Node API on port `5001`. Start MongoDB and the backend before signing in or creating an account.

Production builds can be checked with `npm run build` from `front-end`.
