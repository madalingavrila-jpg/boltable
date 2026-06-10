import { Router } from "express";
import { config } from "../config.js";
import { loadDashboardModel } from "../services/dashboard.js";

export const apiRouter = Router();

const API_CACHE = "public, max-age=60, stale-while-revalidate=120";

apiRouter.get("/health", (_req, res) => {
  res.json({ ok: true, app: "sfood", time: new Date().toISOString() });
});

apiRouter.get("/status", (_req, res) => {
  res.json({
    ok: true,
    app: "sfood",
    dataSource: config.dashboardSheetUrl ? "sheet" : "json",
    dataPath: config.dashboardSheetUrl || "data/dashboard.json",
    dataFlow:
      "Cursor (Looker + Salesforce MCP) → data/dashboard.json → /api/dashboard",
  });
});

apiRouter.get("/dashboard", async (_req, res) => {
  const model = await loadDashboardModel();
  res.setHeader("Cache-Control", API_CACHE);
  res.json(model);
});
