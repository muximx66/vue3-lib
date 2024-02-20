export type SymbolType = "chatMentionSymbol";

export type EmptyText = {
  text: "";
};

/** 艾特符号元素抽象类型 */
export type SymbolNode = {
  type: SymbolType;
  id: string;
  children: EmptyText[];
};
