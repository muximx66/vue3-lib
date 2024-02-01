import { IDomEditor, DomEditor } from "@wangeditor/editor";
import { ChatImg } from "./elements";
import xss from "./xss";

/** 粘贴 */
export const onPaste = (editor: IDomEditor, event: ClipboardEvent) => {
  event.preventDefault();
  const data = event.clipboardData as DataTransfer;
  if (!data) return false;
  const fragment = data.getData("application/x-slate-fragment");
  if (fragment) {
    const decoded = decodeURIComponent(window.atob(fragment));
    const parsed = JSON.parse(decoded) as any;
    editor.insertFragment(parsed);
    return false;
  }
  const html = data.getData("text/html");
  if (html) {
    editor.dangerouslyInsertHtml(xss(data.getData("text/html") || ""));
    return false;
  }
  const text = data.getData("text/plain");
  if (text) {
    editor.insertText(text);
    return false;
  }
  editor.insertData(data);
  return false;
};

/** 图片 */
export const onUploadImg = (file: File, editor: IDomEditor) => {
  ChatImg.insertNode(file, editor);
};

/** 换行模式 */
export enum BREAK_MODE {
  ENTER = "enter",
  CTRL_ENTER = "ctrl_enter",
}
/** 换行事件 */
export const onEnter = (
  e: KeyboardEvent,
  breakMode: BREAK_MODE,
  editor: IDomEditor
) => {
  const isCtrl = e.ctrlKey || e.metaKey;
  if (breakMode === BREAK_MODE.CTRL_ENTER ? isCtrl : true) {
    editor.insertBreak();
  }
};
