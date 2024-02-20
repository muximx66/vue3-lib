import { DomEditor } from "@wangeditor/editor";
import { Editor, Node, Transforms } from 'slate'
import { SYMBOL_TYPE, SYMBOL_IS_INLINE, SYMBOL_IS_VOID } from "./enum";
import { insertSymbolNode } from "./helper";
import { uuid } from "../../helper";
import type { IDomEditor } from "@wangeditor/core";

export function withSymbolPlugin<T extends IDomEditor>(editor: T): T {
  const { isInline, isVoid, normalizeNode, onChange, insertText } = editor;
  const newEditor = editor;
  newEditor.isInline = (elem: any) => {
    if (elem?.type === SYMBOL_TYPE) return SYMBOL_IS_INLINE;
    return isInline(elem);
  };
  newEditor.isVoid = (elem: any) => {
    const type = DomEditor.getNodeType(elem);
    if (type === SYMBOL_TYPE) return SYMBOL_IS_VOID;
    return isVoid(elem);
  };
  newEditor.onChange = () => {
    const node = DomEditor.getSelectedNodeByType(newEditor, SYMBOL_TYPE);
    console.log(node)
    onChange();
  }
  newEditor.normalizeNode = ([node, path]) => {
    const type = DomEditor.getNodeType(node)
    if (type !== SYMBOL_TYPE) {
      return normalizeNode([node, path])
    }

    // 如果链接内容为空，则删除
    const str = Node.string(node)
    // if (str === '') {
    //   return Transforms.removeNodes(newEditor, { at: path })
    // }
    return normalizeNode([node, path])
  }
  newEditor.insertText = (text: string) => {
    const elems = DomEditor.getSelectedElems(newEditor);
    const isSelectedVoidElem = elems.some((elem: any) =>
      newEditor.isVoid(elem)
    );
    if (isSelectedVoidElem) {
      insertText(text);
      return;
    }
    if (text === "@") {
      insertSymbolNode(uuid(), newEditor);
      return;
    }
    insertText(text);
  };
  return newEditor;
}
