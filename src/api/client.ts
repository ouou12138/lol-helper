import { invoke } from "@tauri-apps/api";

class LolClient {
  host = "https://127.0.0.1";

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

  getLcuInfo() {
    return {
      port: this.port,
      token: this.token,
    };
  }

  async get<T = Record<string, string>, D = any>(url: string, params?: T): Promise<D> {
    try {
      const { host, authorization } = this;
      const _url = url.startsWith("/") ? url : `/${url}`;
      const data = await invoke<D>("http_get", {
        url: `${host}${_url}${new URLSearchParams(params as Record<string, string>)}`,
        auth: authorization,
        timeout: this.timeout,
      });
      return data;
    } catch (error) {
      throw error;
    }
  }

  async post<T = Record<string, any>, D = any>(url: string, data?: T): Promise<D> {
    try {
      const { host, authorization } = this;
      const _url = url.startsWith("/") ? url : `/${url}`;
      return await invoke<D>("http_post", {
        url: `${host}${_url}`,
        data,
        auth: authorization,
        timeout: this.timeout,
      });
    } catch (error) {
      throw error;
    }
  }

  async loadAssets<D = any>(url: string): Promise<D> {
    try {
      const { host, authorization } = this;
      let _url = url.startsWith("/") ? url : `/${url}`;
      _url = url.startsWith("http://") || host.startsWith("https://") ? url : `${host}/${url}`;

      return await invoke<D>("http_assets", {
        url: `${host}${_url}`,
        auth: authorization,
        timeout: this.timeout,
      });
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
