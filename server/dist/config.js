import { config as loadEnv } from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
const rootDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
loadEnv({ path: path.join(rootDir, ".env") });
loadEnv({ path: path.join(rootDir, ".env.local"), override: true });
function readEnv(name) {
    return process.env[name]?.trim() ?? "";
}
export const config = {
    rootDir,
    staticDir: path.join(rootDir, "out"),
    port: parseInt(process.env.PORT || "8080", 10),
    host: process.env.HOST || "0.0.0.0",
    isProduction: process.env.NODE_ENV === "production",
    cacheTtlMs: parseInt(process.env.SFOOD_CACHE_TTL_MS || "60000", 10),
    looker: {
        baseUrl: readEnv("LOOKER_BASE_URL") || "https://bolt.cloud.looker.com",
        clientId: readEnv("LOOKER_CLIENT_ID"),
        clientSecret: readEnv("LOOKER_CLIENT_SECRET"),
        model: readEnv("LOOKER_MODEL") || "curated",
        explore: readEnv("LOOKER_EXPLORE") || "fact_order_delivery",
        timezone: readEnv("LOOKER_TIMEZONE") || "Europe/Bucharest",
    },
    salesforce: {
        loginUrl: readEnv("SALESFORCE_LOGIN_URL") ||
            readEnv("SALESFORCE_INSTANCE_URL") ||
            "https://login.salesforce.com",
        clientId: readEnv("SALESFORCE_CLIENT_ID"),
        clientSecret: readEnv("SALESFORCE_CLIENT_SECRET"),
        username: readEnv("SALESFORCE_USERNAME"),
        password: readEnv("SALESFORCE_PASSWORD"),
        securityToken: readEnv("SALESFORCE_SECURITY_TOKEN"),
    },
};
export function lookerConfigured() {
    return Boolean(config.looker.clientId && config.looker.clientSecret);
}
export function salesforceConfigured() {
    return Boolean(config.salesforce.clientId &&
        config.salesforce.clientSecret &&
        config.salesforce.username &&
        config.salesforce.password);
}
//# sourceMappingURL=config.js.map