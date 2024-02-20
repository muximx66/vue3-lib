import { MENU_CONFIG, SYMBOL_TYPE } from "./enum";
import { IDomEditor } from "@wangeditor/editor";
import type { SymbolNode } from "./custom-types";

export const genSymbolNode = (id: string) => {
  const resume = {
    type: SYMBOL_TYPE,
    id,
  } as SymbolNode;
  return resume;
};
/** 插入元素 */
export const insertSymbolNode = (id: string, editor: IDomEditor) => {
  editor.insertNode(genSymbolNode(id));
};

/** 获取配置 */
export const getConfig = (editor: IDomEditor) => {
  return editor.getConfig()?.EXTEND_CONF?.[MENU_CONFIG] as {
    showModal: (editor: IDomEditor) => void;
    hideModal: (editor: IDomEditor) => void;
    onInput: (value: string, editor: IDomEditor) => void;
  };
};
