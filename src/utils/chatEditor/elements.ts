import type { EditorElement, NodeData } from "./type/element";
import { setText } from "./element";

export const text: EditorElement = {
  type: "text",
  isInline: true,
  toNode: (data: NodeData) => {
    const el = document.createElement("span");
    const text = data.props?.text || "";
    setText(el, text);
    return el;
  },
};

/** 行元素 */
export const element: EditorElement = {
  type: "element",
  isInline: false,
  toNode: (data: NodeData) => {
    const el = document.createElement("div");
    return el;
  },
};

/** 元素集合 */
export const elements = [element];
