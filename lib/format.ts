import type { TrendDirection } from "@/types/dashboard";

const eurCompact = new Intl.NumberFormat("en-IE", {
  style: "currency",
  currency: "EUR",
  notation: "compact",
  maximumFractionDigits: 1,
});

const eurFull = new Intl.NumberFormat("en-IE", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

const eurPrecise = new Intl.NumberFormat("en-IE", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const integer = new Intl.NumberFormat("en-IE");

export function formatEurCompact(value: number): string {
  return eurCompact.format(value);
}

export function formatEur(value: number): string {
  return eurFull.format(value);
}

export function formatEurPrecise(value: number): string {
  return eurPrecise.format(value);
}

export function formatInteger(value: number): string {
  return integer.format(Math.round(value));
}

export function formatPercentChange(current: number, previous: number): string {
  if (previous <= 0) {
    return current > 0 ? "+100%" : "0%";
  }
  const pct = ((current - previous) / previous) * 100;
  const sign = pct >= 0 ? "+" : "";
  return `${sign}${pct.toFixed(1)}%`;
}

export function trendFromDelta(current: number, previous: number): TrendDirection {
  return current >= previous ? "up" : "down";
}

export function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  const diffMs = Date.now() - then;
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}
