import html2canvas from "html2canvas";
import Toastify from "toastify-js";

export function shotElement(
  cssPath: string,
  method: "download" | "copy" = "download",
  callbackFn?: Function,
) {
  html2canvas(document.querySelector(cssPath)!, { scale: 3 }).then(
    async (canvas) => {
      const screenshotContainer = document.getElementById(
        "screenshotContainer",
      )!;
      screenshotContainer.innerHTML = "";
      screenshotContainer.appendChild(canvas);

      switch (method) {
        case "download":
          const link = document.createElement("a");
          link.href = canvas.toDataURL("image/png");
          link.download = `日志快照-${Date.now()}.png`;
          link.click();
          await new Promise((res) => setTimeout(res, 1000));
          toast("已下载到本地磁盘！");
          break;
        case "copy":
          try {
            const blob = await new Promise<Blob | null>((resolve) => {
              canvas.toBlob((blob) => {
                resolve(blob);
              }, "image/png");
            });

            if (blob) {
              const item = new ClipboardItem({ "image/png": blob });
              await navigator.clipboard.write([item]);
              toast("已粘贴到剪切板！");
            }
          } catch (error) {
            toast("啊啊！你为什么不授权啊？笨蛋！", "error");
          }
          break;
      }

      callbackFn?.apply(undefined);
    },
  );
}

export function toast(
  text: string,
  type: "success" | "error" = "success",
  callbackFn?: Function,
) {
  Toastify({
    text,
    duration: 3000,
    close: true,
    gravity: "top",
    position: "right",
    stopOnFocus: true,
    backgroundColor: new Map([
      ["success", "linear-gradient(to right, #00b09b, #96c93d)"],
      ["error", " linear-gradient(to right, #ff5f6d, #ffc371)"],
    ]).get(type),
    onClick:
      callbackFn ||
      (() => {
        const lines = [
          "点我干嘛！",
          "不许点我！",
          "啊啊可恶！",
          "咬你哦（凶！",
        ];
        toast(lines[Math.floor(Math.random() * lines.length)], "error");
      }),
  }).showToast();
}
