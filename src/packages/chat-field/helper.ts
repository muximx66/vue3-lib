import { toAttr as enumToAttr } from './enum'
import { fileManager } from "./file";
import { type IDomEditor } from "@wangeditor/editor";

/** 转化属性 */
export const toAttr = enumToAttr

/** 获取元素类型 */
export const getElemAttribute = (el: any, attr: string) => {
  if (el.getAttribute) {
    return el.getAttribute(attr) || "";
  }
  if (el.dataset) {
    return el.dataset[attr] || "";
  }
  return "";
};

/**
 * @description 获取全局唯一id
 * @returns uuid
 */
export const uuid = () => {
  let d = new Date().getTime();
  if (window.performance && typeof window.performance.now === "function") {
    d += performance.now(); //use high-precision timer if available
  }
  const uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    function (c) {
      const r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
    }
  );
  return uuid;
};


/** 获取文本列表 */
export const useTexts = (editor: IDomEditor) => {
  const imgEnum = require('./modules/img/enum')
  const fileEnum = require('./modules/file/enum')
  const html = editor.getHtml();
  const div = document.createElement("div");
  div.innerHTML = html;
  const children = div.childNodes;
  if (!children || !children.length) return;
  const data: {
    type: "text" | "img" | "file";
    text?: string;
    id?: string;
    file?: File;
  }[] = [];
  children.forEach((child) => {
    const elements = child.childNodes;
    if (!elements || !elements.length) return;
    elements.forEach((el) => {
      const nodeType = el.nodeType;
      if (nodeType === 1) {
        // 元素节点
        const tagName = (el as any)?.localName || "";
        const id = getElemAttribute(el as any, imgEnum.ATTRS.ID) || "";
        if (tagName === imgEnum.ELEMENT_TYPE.toLowerCase()) {
          data.push({
            type: "img",
            id,
            file: fileManager.get(id) as File,
          });
        } else if (tagName === fileEnum.ELEMENT_TYPE.toLowerCase()) {
          data.push({
            type: "file",
            id,
            file: fileManager.get(id) as File,
          });
        }
      } else if (nodeType === 3) {
        // 文本节点
        const text = el.textContent || "";
        const preData = data[data.length - 1];
        if (!text.trim()) return;
        if (preData && preData.type === "text") {
          preData.text += `\n${text}`;
        } else {
          data.push({
            type: "text",
            text,
          });
        }
      }
    });
  });
  return data;
};
