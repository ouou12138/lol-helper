import { invoke } from "@tauri-apps/api";
import Config from "@/data/config";
import AssetsCacheManager from "./cache";

enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  DELETE = "DELETE",
}

type AssetsResponse = {
  data: number[];
  file_type: string;
};

class LolClient {
  host = Config.lol_client_base;

  port = 0;
  private token = "";

  private authorization = "";

  private timeout = 30;

  constructor(lcu: LcuInfo) {
    this.port = Number(lcu.port);
    this.token = lcu.token;

    this.host = this.host + ":" + this.port;

    this.authorization = `Basic ${btoa(`riot:${this.token}`)}`;
  }

  getLcuInfo(): LcuInfo {
    return {
      port: this.port,
      token: this.token,
    };
  }

  private processUrl(url: string) {
    const { host } = this;
    let _url = url.startsWith("/") ? url : `/${url}`;
    return _url.startsWith("http://") || _url.startsWith("https://") ? _url : `${host}${_url}`;
  }

  async request<R = any>(method: HttpMethod, url: string, data?: Record<string, any>): Promise<R> {
    const { authorization } = this;
    const _url = this.processUrl(url);
    const response = await invoke<R>("http_request", {
      method: method,
      url: _url,
      data: data,
      auth: authorization,
      timeout: this.timeout,
    });
    return response;
  }

  async get<T = Record<string, string>, D = any>(url: string, params?: T): Promise<D> {
    try {
      let _url = `${url}${new URLSearchParams(params as Record<string, string>)}`;
      return this.request<D>(HttpMethod.GET, _url);
    } catch (error) {
      console.error(error);

      throw error;
    }
  }

  async post<T = Record<string, any>, D = any>(url: string, data?: T): Promise<D> {
    try {
      return this.request<D>(HttpMethod.POST, url, data);
    } catch (error) {
      throw error;
    }
  }

  async patch<T = Record<string, any>, D = any>(url: string, data?: T): Promise<D> {
    try {
      return this.request<D>(HttpMethod.PATCH, url, data);
    } catch (error) {
      throw error;
    }
  }

  async loadAssets(url: string): Promise<Blob> {
    try {
      const { authorization } = this;
      const _url = this.processUrl(url);
      let resp = await AssetsCacheManager.get(url);
      let blob: Blob = null;
      if (resp) {
        blob = await resp.blob();
      } else {
        const response = await invoke<AssetsResponse>("http_assets", {
          url: _url,
          auth: authorization,
          timeout: this.timeout,
        });
        const u8arr = new Uint8Array(response.data);
        blob = new Blob([u8arr], { type: response.file_type });
        AssetsCacheManager.set(url, blob);
      }
      return blob;
    } catch (error: any) {
      throw new Error(error.message || "未知错误");
    }
  }
}

let instance: LolClient | null = null;

export const create = (lcu: LcuInfo) => {
  instance = new LolClient(lcu);
  return instance;
};

export const getInstance = () => {
  if (!instance) throw new Error("No lol client instance found");
  return instance;
};
