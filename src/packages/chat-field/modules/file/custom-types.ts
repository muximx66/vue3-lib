export type ElementType = "chatFile";

export type EmptyText = {
  text: "";
};
/** 图片元素抽象类型 */
export type ElementNode = {
  type: ElementType;
  id: string;
  url: string;
  name: string;
  children: EmptyText[];
};
