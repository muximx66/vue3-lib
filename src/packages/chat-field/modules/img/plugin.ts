import { DomEditor } from '@wangeditor/editor'
import { ELEMENT_TYPE, IS_INLINE, IS_VOID } from './enum'
import type { IDomEditor } from '@wangeditor/core'

function withPlugin<T extends IDomEditor>(editor: T): T {
  const { isInline, isVoid, move, onChange } = editor;
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
    const node = DomEditor.getSelectedNodeByType(newEditor, ELEMENT_TYPE);
    if (node) move(1);
    onChange();
  };
  return newEditor;
}

export default withPlugin
