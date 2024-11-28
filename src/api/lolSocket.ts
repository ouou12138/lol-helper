import Config from "@/data/config";
import WebSocket, { type Message } from "tauri-plugin-websocket-api";

enum OperateCode {
  Subscribe = 5,
  Unsubscribe = 6,
  OnRecieveEvent = 8,
}

const EVENT_PREFIX = "OnJsonApiEvent";
const EVENT_SUFFIX = "_all";

type EventsData = {
  events: ((data: any) => void)[];
};

type ResponseData<T> = {
  data: T | null;
  eventType: "Create" | "Update" | "Delete";
  uri: string;
};

export class LolSocket {
  socket: WebSocket | null = null;
  private host = Config.lol_client_socket;
  private authorization = "";

  private events = new Map<string, EventsData["events"]>();

  constructor(info: LcuInfo) {
    this.host = this.host + ":" + info.port;
    this.authorization = `Basic ${btoa(`riot:${info.token}`)}`;
  }

  async init() {
    const socket = await WebSocket.connect(this.host, {
      headers: {
        Authorization: this.authorization,
      },
    });
    this.socket = socket;
    this.socket.addListener(this.messageHandler.bind(this));
  }

  close() {
    this.socket?.disconnect();
  }

  private procressMessage(message: Message) {
    if (message.type !== "Text") return;
    let data = null;
    try {
      data = JSON.parse(message.data);
    } catch (error) {
      return;
    }
    return data;
  }

  messageHandler(message: Message) {
    const data = this.procressMessage(message);
    if (!data || data.length < 3) return;
    if (data[0] !== OperateCode.OnRecieveEvent) return;
    const respEventName = data[1];
    const events = this.events.get(respEventName) || [];
    const eventsAll = this.events.get(this.addSuffix(respEventName));
    const body = data[2] as ResponseData<any>;
    const uri = body?.uri || "";
    if (respEventName === this.processEventName(uri)) {
      events.forEach((event) => event(body));
    }
    if (events) {
      eventsAll.forEach((event) => event(body));
    }
  }

  private processEventName(path: string) {
    return EVENT_PREFIX + path.replace(/\//g, "_");
  }

  private addSuffix(path: string) {
    return path.replace(/\//g, "_") + EVENT_SUFFIX;
  }

  /**
   * callback 不建议使用箭头函数，会导致事件不被销毁
   * @param event
   * @param callback
   * @returns
   */
  on<T = any>(event: string, callback: (data: ResponseData<T>) => void, all: boolean = false) {
    let eventName = this.processEventName(event as string);
    console.log(this.events);
    console.log("[Listening]: ", eventName);
    const localEventName = all ? this.addSuffix(eventName) : eventName;
    let events = this.events.get(localEventName) || [];
    if (!(events && events.length > 0)) {
      this.socket.send(JSON.stringify([OperateCode.Subscribe, eventName]));
    }
    events.push(callback);
    this.events.set(localEventName, events);
    return () => {
      this.off(localEventName, callback);
    };
  }

  off(event: string, callback: (data: any) => void) {
    const eventName = "OnJsonApiEvent" + event.replace(/\//g, "_");
    this.socket.send(JSON.stringify([OperateCode.Unsubscribe, eventName]));
    const events = this.events.get(event);
    if (!events) return;
    if (events.length <= 1) {
      this.events.delete(eventName);
      return;
    }
    this.events.set(
      eventName,
      events.filter((item) => item !== callback)
    );
  }

  once<T = any>(event: string, callback?: (data: ResponseData<T>) => void): Promise<ResponseData<T>> {
    return new Promise((resolve) => {
      this.on<T>(
        event,
        (data) => {
          callback?.(data);
          resolve(data);
          this.off(this.addSuffix(this.processEventName(event)), callback);
        },
        false
      );
    });
  }
}

export class LolSocketManager {
  private static instance: LolSocket;
  private constructor() {}

  static getInstance() {
    if (this.instance === undefined) throw new Error("LolSocketManager is not initialized");
    return LolSocketManager.instance;
  }

  public static async init(info: LcuInfo) {
    LolSocketManager.instance = new LolSocket(info);
    await LolSocketManager.instance.init();
  }

  public static disconnect() {
    if (LolSocketManager.instance) {
      LolSocketManager.instance.close();
      LolSocketManager.instance = undefined;
    }
  }
}

export default LolSocketManager;
