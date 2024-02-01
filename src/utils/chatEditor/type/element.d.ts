/** 节点抽象数据 */
export type NodeData = {
  type: string;
  props?: Record<string | number | symbol, any>;
  children?: NodeData[];
};
/** 编辑器元素接口 */
export interface EditorElement {
  type: string;
  isInline: boolean;
  delete?: (startOffset: number, endOffset: number, node: Node) => Node | void;
  toNode: (node: NodeData) => Node;
}
