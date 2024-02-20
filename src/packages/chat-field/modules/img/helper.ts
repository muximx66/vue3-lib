import { ELEMENT_TYPE } from "./enum";
import { IDomEditor } from "@wangeditor/editor";
import { uuid } from "../../helper";
import { fileManager } from "../../file";
import type { ElementNode } from "./custom-types";

/** 生成抽象元素 */
export const genNode = (id: string, url: string) => {
  const node = {
    type: ELEMENT_TYPE,
    id,
    url,
    children: [{ text: "" }],
  } as ElementNode;
  return node;
};

/** 插入元素 */
export const insertNode = (file: File | string, editor: IDomEditor) => {
  let fileCopy: File;
  let id: string;
  if (typeof file === "string") {
    id = file;
    fileCopy = fileManager.get(file) as File;
  } else {
    id = uuid();
    fileCopy = file;
    fileManager.set(id, file);
  }
  editor.insertNode(genNode(id, URL.createObjectURL(fileCopy)));
  editor.focus();
  editor.move(1);
};
