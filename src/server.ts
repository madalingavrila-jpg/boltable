import compression from "compression";
import express from "express";
import fs from "node:fs";
import helmet from "helmet";
import path from "node:path";
import { config } from "./config.js";

if (!fs.existsSync(config.staticDir)) {
  throw new Error(
    `Static export missing at ${config.staticDir}. Run npm run build first.`,
  );
}

const app = express();
app.set("trust proxy", 1);

app.use(
  helmet({
    contentSecurityPolicy: false,
  }),
);
app.use(compression({ threshold: 1024 }));

app.get("/health", (_req, res) => {
  res.json({ ok: true, app: "sfood" });
});

app.use(
  express.static(config.staticDir, {
    index: "index.html",
    maxAge: config.isProduction ? "1h" : 0,
    fallthrough: false,
  }),
);

app.listen(config.port, config.host, () => {
  console.log(`sfood listening on http://${config.host}:${config.port}`);
});
