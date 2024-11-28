/**
 * 为了避免频繁请求静态资源，使用缓存
 */

const UPDATE_TIME = 0.5 * 60; //seconds

const CACHE_NAME = "assets-v1";

export class AssetsCache {
  async get(key: string): Promise<Response | undefined> {
    const cache = await caches.open(CACHE_NAME);
    return cache.match(key);
  }

  constructor() {
    caches.delete(CACHE_NAME);
    caches.open(CACHE_NAME);
  }

  set<T extends BodyInit = Blob>(key: string, value: T) {
    const resp = new Response(value, {
      status: 200,
      statusText: "OK",
      headers: {
        "Cache-Control": `max-age=${UPDATE_TIME}`,
        "Content-Length": (value as Blob)?.size?.toString() || String(0),
      },
    });
    caches.open(CACHE_NAME).then((cache) => cache.put(key, resp));
  }
}

class AssetsCacheManager {
  private static cache: AssetsCache = new AssetsCache();
  static get(key: string): Promise<Response | undefined> {
    return this.cache.get(key);
  }
  static set<T extends BodyInit>(key: string, value: T) {
    this.cache.set(key, value);
  }
}

export default AssetsCacheManager;
