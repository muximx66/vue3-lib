import { Editor } from "./type/editor";

/** 换行类型 */
export enum BREAK_MODE {
  ENTER = "ENTER",
  CTRL_ENTER = "CTRL_ENTER",
}

/** 事件 */
export const withEvents = (editor: Editor) => {
  const { el, config } = editor;
  el.addEventListener("mousedown", () => {
    editor.expandRange();
  });
  el.addEventListener("mouseup", () => {
    editor.expandRange();
  });
  el.addEventListener("touchstart", () => {
    editor.expandRange();
  });
  el.addEventListener("touchend", () => {
    editor.expandRange();
  });
  el.addEventListener("keydown", (e: KeyboardEvent) => {
    editor.expandRange();
    const { key, keyCode, code, ctrlKey, metaKey } = e;
    // 拦截前删除(前)
    if (key === "Delete" || code === "Delete" || keyCode === 46) {
      e.preventDefault();
    } else if (key === "Backspace" || code === "Backspace" || keyCode === 8) {
      // 拦截删除(后)
      e.preventDefault();
      // 拦截回车
    } else if (keyCode == 13 || code === "Enter" || key === "Enter") {
      e.preventDefault();
      const { breakMode } = config;
      const isCtrl = ctrlKey || metaKey;
      if (breakMode === BREAK_MODE.CTRL_ENTER ? isCtrl : true) {
        editor.insertBreak();
      }
    }
  });
  return editor;
};
