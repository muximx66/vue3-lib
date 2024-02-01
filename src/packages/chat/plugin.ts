import { type IDomEditor , DomEditor } from '@wangeditor/editor'
import isUrl from 'is-url'

/** 禁用链接 */
export const withDisableLink = <T extends IDomEditor>(editor:T) => {
  const { insertData ,insertText }=editor
  const newEditor=editor
  newEditor.insertData = (data: DataTransfer) => { 
    const text = data.getData('text/plain')
    if(isUrl(text)){
      insertText(text)
    }else{
      insertData(data)
    }
  }
  return newEditor;
}

export const withGetLeftLengthOfMaxLength = <T extends IDomEditor>(editor:T) => {
  DomEditor.getLeftLengthOfMaxLength = (e:IDomEditor) => {
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


export const plugins = [withDisableLink,withGetLeftLengthOfMaxLength]
