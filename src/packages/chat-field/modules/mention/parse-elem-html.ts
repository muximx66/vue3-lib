import { ELEMENT_TYPE, ATTRS, SYMBOL_TYPE } from "./enum";
import { ATTRS as COMMON_ATTRS } from "../../enum";
import { getElemAttribute } from "../../helper";
import type { SymbolNode } from "./custom-types";

function parseSymbolHtml(elem: any): SymbolNode {
  return {
    type: SYMBOL_TYPE,
    id: getElemAttribute(elem, ATTRS.ID),
    children: [{ text: "" }], // void node 有一个空白 text
  };
}

export const parseSymbolHtmlConf = {
  selector: `span[${COMMON_ATTRS.TYPE}="${SYMBOL_TYPE}"]`, // data-w-e-type 属性，留给自定义元素，保证扩展性
  parseElemHtml: parseSymbolHtml,
};
