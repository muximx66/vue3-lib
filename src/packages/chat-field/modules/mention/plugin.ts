import { DomEditor, SlateEditor } from "@wangeditor/editor";
import { ELEMENT_TYPE, IS_INLINE, IS_VOID } from "./enum";
import { getConfig } from "./helper";
import type { IDomEditor } from "@wangeditor/core";

function withPlugin<T extends IDomEditor>(editor: T): T {
  const { isInline, isVoid, insertText, onChange, move } = editor;
  const newEditor = editor;
  newEditor.isInline = (elem: any) => {
    const type = DomEditor.getNodeType(elem);
    if (type === ELEMENT_TYPE) return IS_INLINE;
    return isInline(elem);
  };
  newEditor.isVoid = (elem: any) => {
    const type = DomEditor.getNodeType(elem);
    if (type === ELEMENT_TYPE) return IS_VOID;
    return isVoid(elem);
  };
  newEditor.onChange = () => {
    const selection = newEditor.selection;
    console.log(selection?.anchor, selection?.focus);
    const node = DomEditor.getSelectedNodeByType(newEditor, ELEMENT_TYPE);
    if (node) move(1);
    if (
      newEditor.isFocused() &&
      selection &&
      selection.anchor.offset === selection.focus.offset
    ) {
      const [node] = SlateEditor.node(newEditor, newEditor.selection as any);
      if (!(node as any).type && (node as any).text) {
        const offset = newEditor.selection?.anchor.offset || 0;
        const text = (node as any).text || "";
        const frontText = text.slice(0, offset + 1);
        const behindText = text.slice(offset + 1);
        const hide = () => {
          const { hideModal } = getConfig(newEditor) || {};
          if (hideModal) {
            hideModal(newEditor);
          }
        };
        if (frontText.indexOf("@") > -1) {
          const { onInput, showModal } = getConfig(newEditor) || {};
          if (showModal) {
            showModal(newEditor);
          }
          if (onInput) {
            const index = frontText.lastIndexOf("@");
            const value = frontText.slice(index + 1);
            onInput(value, newEditor);
          }
        } else if (behindText.indexOf("@") > -1) {
          hide();
        } else {
          hide();
        }
      }
    }
    onChange();
  };
  newEditor.insertText = (text: string) => {
    const elems = DomEditor.getSelectedElems(newEditor);
    const isSelectedVoidElem = elems.some((elem: any) =>
      newEditor.isVoid(elem)
    );
    if (isSelectedVoidElem) {
      insertText(text);
      return;
    }
    const [node, path] = SlateEditor.node(
      newEditor,
      newEditor.selection as any
    );
    if (text === "@") {
      const { showModal } = getConfig(newEditor) || {};
      if (showModal) {
        showModal(newEditor);
      }
    }
    insertText(text);
  };
  return newEditor;
}

export default withPlugin;
