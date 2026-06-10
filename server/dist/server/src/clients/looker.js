import { config } from "../config.js";
let cachedToken = null;
async function getAccessToken() {
    const now = Date.now();
    if (cachedToken && cachedToken.expiresAt > now + 30_000) {
        return cachedToken.value;
    }
    const response = await fetch(`${config.looker.baseUrl}/api/4.0/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            client_id: config.looker.clientId,
            client_secret: config.looker.clientSecret,
        }),
    });
    if (!response.ok) {
        const body = await response.text();
        throw new Error(`Looker login failed (${response.status}): ${body}`);
    }
    const payload = (await response.json());
    cachedToken = {
        value: payload.access_token,
        expiresAt: now + (payload.expires_in ?? 3600) * 1000,
    };
    return payload.access_token;
}
function parseLookerRows(raw) {
    if (Array.isArray(raw)) {
        return raw;
    }
    if (typeof raw === "string") {
        const rows = [];
        for (const line of raw.split("\n")) {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith("error"))
                continue;
            try {
                rows.push(JSON.parse(trimmed));
            }
            catch {
                /* ignore malformed lines */
            }
        }
        return rows;
    }
    if (raw && typeof raw === "object") {
        return [raw];
    }
    return [];
}
export async function runLookerQuery(args) {
    const token = await getAccessToken();
    const response = await fetch(`${config.looker.baseUrl}/api/4.0/queries/run/json`, {
        method: "POST",
        headers: {
            Authorization: `token ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: args.model ?? config.looker.model,
            explore: args.explore ?? config.looker.explore,
            fields: args.fields,
            filters: args.filters ?? {},
            sorts: args.sorts ?? [],
            limit: args.limit ?? 500,
            tz: config.looker.timezone,
        }),
    });
    if (!response.ok) {
        const body = await response.text();
        throw new Error(`Looker query failed (${response.status}): ${body}`);
    }
    return parseLookerRows(await response.json());
}
export function readNumber(row, field) {
    const value = row[field];
    return typeof value === "number" ? value : Number(value ?? 0);
}
export const LOOKER_GMV_FIELD = "fact_order_delivery.food_provider_price_before_discounts_eur_local";
export const LOOKER_ORDER_COUNT_FIELD = "fact_order_delivery.food_orders_created_local";
export const LOOKER_AVG_ORDER_FIELD = "fact_order_delivery.average_food_provider_price_before_discounts_eur_local";
export const LOOKER_ACTIVE_VENDORS_FIELD = "fact_order_delivery.delivery_vendors_with_orders_finished_local";
export const LOOKER_DATE_FIELD = "fact_order_delivery.order_created_date_local_date";
export const LOOKER_CITY_FIELD = "dim_city.city_name";
export const LOOKER_COUNTRY_FIELD = "dim_city.country_name";
export const LOOKER_ACTIVE_CITIES_EXPLORE = "dim_city";
export const LOOKER_ACTIVE_CITIES_FIELD = "dim_city.is_food_delivery_active";
//# sourceMappingURL=looker.js.map