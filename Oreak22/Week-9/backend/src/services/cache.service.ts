import NodeCache from "node-cache";

const ttl = Number(process.env.CACHE_TTL_SECONDS || 60);
const cache = new NodeCache({
  stdTTL: ttl,
  checkperiod: Math.max(10, Math.floor(ttl / 2)),
});

export function get<T = any>(key: string): T | null {
  const v = cache.get<T>(key);
  return v === undefined ? null : v;
}

export function set<T = any>(key: string, value: T, ttlSec?: number) {
  cache.set(key, value, ttlSec || 13);
}

