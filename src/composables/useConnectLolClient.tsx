import { create } from "@/api/client";
import MSLoading from "@/components/MSLoading.vue";
import useUserStore from "@/store/useUserStore";
import { dialog, invoke } from "@tauri-apps/api";
import { appWindow } from "@tauri-apps/api/window";

const DIALOG_ID = "connect-lol-dialog";
const CONNECT_RETRY_TIMES = 1;
const GET_LCU_INFO_ERROR = 10001;

const dialogComponent: Component = () => {
  return (
    <>
      <div className="w-400px h-100px bg-#fff dark:bg-darkSecondary rounded rounded-10px flex items-center dark:color-#eee">
        <div className="inline-block w-50px h-50px mr-10px">
          <MSLoading />
        </div>
        <span>等待客户端连接，请稍后......</span>
      </div>
    </>
  );
};

const createDialog = () => {
  const wrapper = document.createElement("div");
  wrapper.className = "fixed top-0 left-0 w-100vw h-100vh flex items-center justify-center bg-#000/60 z-99";
  const dialog = document.createElement("dialog");
  dialog.className =
    "backdrop:bg-#000/70 backdrop:rounded-10px focus:outline-none dark:bg-darkSecondary border-none rounded-10px";
  dialog.setAttribute("id", DIALOG_ID);
  wrapper.appendChild(dialog);
  return dialog;
};

const useConnectLolClient = () => {
  const userStore = useUserStore();
  const showLoading = () => {
    const page = document.querySelector("#page");
    let dialog: HTMLDialogElement | null = document.querySelector("#" + DIALOG_ID);
    dialog && page?.removeChild(dialog.parentElement);
    dialog = createDialog();
    const app = createApp(dialogComponent);
    app.mount(dialog);
    page?.appendChild(dialog.parentElement);
    dialog.show();

    return () => {
      dialog?.close();
      page?.removeChild(dialog.parentElement);
      dialog = null;
    };
  };

  const startConnecting = async (count: number = 0) => {
    const close = showLoading();
    try {
      const data = await invoke<LcuInfo>("get_lcu_info");
      console.log("Client info:", data);
      create(data);
      await userStore.updateUserInfo();
      close();
    } catch (error: any) {
      console.error(error);
      if (Number(error.code) === GET_LCU_INFO_ERROR && count <= CONNECT_RETRY_TIMES) {
        setTimeout(() => {
          startConnecting(count + 1);
        }, 5000);
        return;
      }
      console.error(error);
      close();
      const confirm = await dialog.confirm(`客户端连接失败(Error:${String(error.message).trim() || "未知错误"})`, {
        okLabel: "退出程序",
        cancelLabel: "重试",
        type: "error",
      });
      return confirm ? appWindow.close() : startConnecting();
    }
  };

  return {
    startConnecting,
  };
};

export default useConnectLolClient;
