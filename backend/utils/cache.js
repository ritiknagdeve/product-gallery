/**
 * Simple in-memory cache with TTL (time-to-live).
 * Avoids reading the JSON file from disk on every request.
 */
class SimpleCache {
  constructor(ttlSeconds = 60) {
    this.ttl = ttlSeconds * 1000; // convert to ms
    this.cache = new Map();
  }

  get(key) {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }
    return entry.data;
  }

  set(key, data) {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  clear() {
    this.cache.clear();
  }
}

// Export a single shared cache instance (60 second TTL)
module.exports = new SimpleCache(60);
