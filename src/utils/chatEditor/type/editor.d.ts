import type { NodeData } from "./element";

/** 配置 */
export type Config = {
  breakMode: BREAK_MODE;
};
/** 插入空元素 */
export type InsertEmptyElement = () => Node;
/** 插入换行 */
export type InsertBreak = () => void;
/** 添加range */
export type ExpandRange = () => void;
/** 设置range */
export type SetRange = (range: Range) => void;
/** 获取range */
export type GetRange = () => Range | void;
/** 判断是否Text节点 */
export type IsText = (node: Node) => boolean;
/** 获取行元素 */
export type GetElement = (node: Node) => Node | null;
/** 获取范围内行元素 */
export type GetRangeElements = (range: Range) => Node[];
/** 插入元素 */
export type InsertNode = (data: NodeData) => void;

/** 编辑器 */
export interface Editor {
  el: HTMLElement;
  ranges: Range[];
  config: Config;
  insertEmptyElement: InsertEmptyElement;
  insertBreak: InsertBreak;
  expandRange: ExpandRange;
  setRange: SetRange;
  getRange: GetRange;
  isText: IsText;
  getElement: GetElement;
  getRangeElements: GetRangeElements;
  insertNode: InsertNode;
}
