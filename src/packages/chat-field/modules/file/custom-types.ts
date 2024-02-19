
export type ElementType = 'chatFile'

export type EmptyText = {
  text: ''
}
/** 图片元素抽象类型 */
export type ElementNode = {
  type: ElementType;
  url: string;
  id: string;
  children: EmptyText[]
}

