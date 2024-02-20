import isUrl from "is-url";
import { type IDomEditor } from "@wangeditor/editor";

/** 禁用链接 */
export const withPlugin = <T extends IDomEditor>(editor: T) => {
  const { insertData, insertText } = editor;
  const newEditor = editor;
  newEditor.insertData = (data: DataTransfer) => {
    const text = data.getData("text/plain");
    if (isUrl(text)) {
      insertText(text);
    } else {
      insertData(data);
    }
  };
  return newEditor;
};

export default withPlugin;
