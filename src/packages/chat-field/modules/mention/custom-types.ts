export type ElementType = "chatMention";

export type EmptyText = {
  text: "";
};
/** 图片元素抽象类型 */
export type ElementNode = {
  type: ElementType;
  id: string;
  name: string;
  children: EmptyText[];
};
