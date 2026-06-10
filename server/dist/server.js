import compression from "compression";
import express from "express";
import helmet from "helmet";
import path from "node:path";
import { config } from "./config.js";
import { apiRouter } from "./routes/api.js";
const app = express();
app.set("trust proxy", 1);
app.use(helmet({
    contentSecurityPolicy: false,
}));
app.use(compression({ threshold: 1024 }));
app.use("/api", apiRouter);
app.use(express.static(config.staticDir, {
    index: false,
    maxAge: config.isProduction ? "1y" : 0,
    etag: true,
    lastModified: true,
    setHeaders(res, filePath) {
        if (/\.html$/.test(filePath)) {
            res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        }
    },
}));
app.get("/", (_req, res) => {
    res.sendFile(path.join(config.staticDir, "index.html"));
});
app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) {
        next();
        return;
    }
    const filePath = path.join(config.staticDir, req.path);
    if (filePath.startsWith(config.staticDir)) {
        res.sendFile(filePath, (error) => {
            if (error) {
                res.sendFile(path.join(config.staticDir, "index.html"));
            }
        });
        return;
    }
    next();
});
app.listen(config.port, config.host, () => {
    console.log(`sfood listening on http://${config.host}:${config.port}`);
});
//# sourceMappingURL=server.js.map