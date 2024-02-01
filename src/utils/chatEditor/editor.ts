import type { Editor, Config } from "./type/editor";
import type { NodeData } from "./type/element";
import { setAttribute } from "./element";
import { withEvents, BREAK_MODE } from "./events";
import { createRange } from "./utils";

/** 创建编辑器 */
export const createEditor = (el: HTMLElement, opts?: Partial<Config>) => {
  const config = {
    breakMode: opts?.breakMode || BREAK_MODE.ENTER,
  };
  const editor = {
    el,
    config,
    ranges: [],
  } as any;
  withMethods(withEvents(withAttrs(withStyles(editor))));
  (editor as Editor).insertBreak();
  return editor as Editor;
};

/** 方法 */
const withMethods = (editor: Editor) => {
  /** 插入节点 */
  editor.insertNode = (data: NodeData) => {};
  /** 插入回车 */
  editor.insertBreak = () => {
    const curRange = editor.getRange();
    const curElements = curRange ? editor.getRangeElements(curRange) : [];
    const element = editor.insertEmptyElement();
    const range = createRange(element);
    range.collapse(true);
    editor.setRange(range);
  };
  /** 获取范围内行元素 */
  editor.getRangeElements = (range: Range) => {
    const { startContainer, endContainer } = range;
    const startElement = editor.getElement(startContainer);
    const endElement = editor.getElement(endContainer);
    if (!startElement || !endElement) return [];
    const elements = [];
    let element = startElement;
    while (element) {
      elements.push(element);
      if (element === endElement) break;
      element = element.nextSibling as Node;
    }
    return elements;
  };
  /** 添加range */
  editor.expandRange = () => {
    const selection = window.getSelection();
    if (!selection) return;
    const range = selection.getRangeAt(0);
    if (!range) return;
    if (document.activeElement !== editor.el) return;
    editor.ranges.push(range);
  };
  /** 设置range */
  editor.setRange = (range: Range) => {
    if (range === editor.getRange()) return;
    const selection = window.getSelection();
    if (!selection) return;
    selection.removeAllRanges();
    selection.addRange(range);
  };
  /** 获取range */
  editor.getRange = () => {
    const ranges = editor.ranges;
    if (!ranges.length) return;
    return editor.ranges[editor.ranges.length - 1];
  };
  return editor;
};

/** 样式 */
const withStyles = (editor: Editor) => {
  const { el } = editor;
  el.style.outline = "none";
  el.style.border = "none";
  return editor;
};

/** 属性 */
const withAttrs = (editor: Editor) => {
  const { el } = editor;
  setAttribute(el, "contenteditable", "true");
  return editor;
};
