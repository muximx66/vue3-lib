import { ELEMENT_TYPE } from "./enum";
import { uuid } from "../../helper";
import { IDomEditor } from "@wangeditor/editor";
import { fileManager } from "../../file";
import type { ElementNode } from "./custom-types";

/** 生成抽象元素 */
export const genNode = (id: string, url: string, name: string) => {
  const resume = {
    type: ELEMENT_TYPE,
    id,
    url,
    name,
    children: [{ text: "" }],
  } as ElementNode;
  return resume;
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
  editor.insertNode(
    genNode(id, URL.createObjectURL(fileCopy), fileCopy.name || "")
  );
  editor.focus();
  editor.move(1);
};
