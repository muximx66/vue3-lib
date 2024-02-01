import type { EditorElement, NodeData } from "./type/element";
import { elements } from "./elements";

/** 节点特有属性 */
export enum NODE_ATTRS {
  NODE_TYPE = "z-c-editor-node",
  NODE_ISLINE = "z-c-editor-isline",
}

/** 编辑管理中心 */
export class ElementManager {
  /** 元素集合 */
  public static elements: EditorElement[] = [];
  /** 元素键值集合 */
  public static elementMap: Record<string, EditorElement> = {};
  /** 初始化 */
  public static init() {
    this.registerElements(elements);
  }
  /** 注册元素 */
  public static registerElement(element: EditorElement) {
    this.elements.push(element);
    this.elementMap[element.type] = element;
  }
  /** 注册元素 */
  public static registerElements(elements: EditorElement[]) {
    elements.forEach((element) => {
      this.registerElement(element);
    });
  }
  /** 获取元素 */
  public static getElement(type: string) {
    return this.elementMap[type];
  }
}

/** 数据转化成节点 */
export const toNode = (data: NodeData) => {
  const element = ElementManager.getElement(data.type);
  if (element) {
    const el = element.toNode(data);
    setAttribute(el, NODE_ATTRS.NODE_TYPE, data.type);
    setAttribute(el, NODE_ATTRS.NODE_ISLINE, String(element.isInline));
    return el;
  }
};

/** 设置文本 */
export const setText = (element: Node, text: string) => {
  if (element.textContent) {
    element.textContent = text;
  } else if ((element as HTMLElement).innerText) {
    (element as HTMLElement).innerText = text;
  }
};

/** 设置属性 */
export const setAttribute = (element: Node, attr: string, value: string) => {
  if ((element as HTMLElement).setAttribute) {
    (element as HTMLElement).setAttribute(attr, value);
  } else if ((element as HTMLElement).dataset) {
    (element as HTMLElement).dataset[attr] = value;
  } else {
    (element as any)[attr] = value;
  }
};

/** 获取属性 */
export const getAttribute = (element: Node, attr: string) => {
  if ((element as HTMLElement).getAttribute) {
    return (element as HTMLElement).getAttribute(attr);
  } else if ((element as HTMLElement).dataset) {
    return (element as HTMLElement).dataset[attr];
  } else {
    return (element as any)[attr];
  }
};
