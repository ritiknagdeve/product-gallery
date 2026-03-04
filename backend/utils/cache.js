// In-memory cache with TTL to avoid reading JSON on every request
const TTL_MS = 60 * 1000;
const cache = new Map();

function get(key) {
  const entry = cache.get(key);
  if (!entry) return null;

  if (Date.now() - entry.timestamp > TTL_MS) {
    cache.delete(key);
    return null;
  }

  return entry.data;
}

function set(key, data) {
  cache.set(key, { data, timestamp: Date.now() });
}

function clear() {
  cache.clear();
}

module.exports = { get, set, clear };
