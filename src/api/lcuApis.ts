import { getInstance } from "./client";

const errorCatch = <T extends (...args: any[]) => any>(fn: T) => {
  return async (...args: Parameters<T>): Promise<Awaited<ReturnType<T>>> => {
    try {
      return await fn(...args);
    } catch (error: any) {
      throw error;
    }
  };
};

export const lolSelectSession = errorCatch(() => {
  return getInstance().get<any, LolChampSelectChampSelectSession>("/lol-champ-select/v1/session");
});

export const LolSelectAction = errorCatch((data: LolChampSelectChampSelectAction) => {
  return getInstance().patch<any, LolChampSelectChampSelectAction>(
    "/lol-champ-select/v1/session/actions/" + data.id,
    data
  );
});
