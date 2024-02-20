import { ELEMENT_TYPE, MENU_CONFIG } from "./enum";
import { IDomEditor } from "@wangeditor/editor";
import type { ElementNode } from "./custom-types";

/** 生成抽象元素 */
export const genNode = (id: string, name: string) => {
  const resume = {
    type: ELEMENT_TYPE,
    id,
    name,
    children: [{ text: "" }],
  } as ElementNode;
  return resume;
};

/** 插入元素 */
export const insertNode = (id: string, name: string, editor: IDomEditor) => {
  const range = window.getSelection()?.getRangeAt(0);
  if (editor.selection === null) editor.restoreSelection();
  if (!range) return;
  const text = range.commonAncestorContainer.textContent || "";
  const startOffset = range.startOffset;
  const preText = text.slice(0, startOffset + 1);
  const index = preText.lastIndexOf("@");
  let deleteLength = startOffset - index;
  while (deleteLength > 0) {
    editor.deleteBackward("character");
    deleteLength--;
  }
  editor.insertNode(genNode(id, name));
};

/** 获取配置 */
export const getConfig = (editor: IDomEditor) => {
  return editor.getConfig()?.EXTEND_CONF?.[MENU_CONFIG] as {
    showModal: (editor: IDomEditor) => void;
    hideModal: (editor: IDomEditor) => void;
    onInput: (value: string, editor: IDomEditor) => void;
  };
};
