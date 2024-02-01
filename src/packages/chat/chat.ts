import { ChatImg, ChatFile } from "./elements";
import { fileManager } from "./file";
import { type IDomEditor } from "@wangeditor/editor";

/** 获取文本列表 */
export const useTexts = (editor: IDomEditor) => {
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
        const id = (el as any)?.getAttribute("data-id") || "";
        if (tagName === ChatImg.type.toLowerCase()) {
          data.push({
            type: "img",
            id,
            file: fileManager.get(id) as File,
          });
        } else if (tagName === ChatFile.type.toLowerCase()) {
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
