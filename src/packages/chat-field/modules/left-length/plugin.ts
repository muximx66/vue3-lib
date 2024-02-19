import { type IDomEditor, DomEditor } from '@wangeditor/editor'

/** 长度拦截 */
const withPlugin = <T extends IDomEditor>(editor: T) => {
  DomEditor.getLeftLengthOfMaxLength = (e: IDomEditor) => {
    const { maxLength, onMaxLength } = e.getConfig()
    // 未设置 maxLength ，则返回 number 最大值
    if (typeof maxLength !== 'number' || maxLength <= 0) return Infinity
    // const editorText = editor.getText().replace(/\r|\n|(\r\n)/g, '') // 去掉换行
    const editorText = e.getText()
    const curLength = editorText.length
    const leftLength = maxLength - curLength
    if (leftLength <= 0) {
      // 触发 maxLength 限制，不再继续插入文字
      if (onMaxLength) onMaxLength(e)
    }
    return leftLength
  }
  return editor;
}

export default withPlugin