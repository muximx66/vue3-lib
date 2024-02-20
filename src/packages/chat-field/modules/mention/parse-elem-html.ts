import { ELEMENT_TYPE, ATTRS } from "./enum";
import { ATTRS as COMMON_ATTRS } from "../../enum";
import { getElemAttribute } from "../../helper";
import type { ElementNode } from "./custom-types";

function parseElemHtml(elem: any): ElementNode {
  return {
    type: ELEMENT_TYPE,
    name: getElemAttribute(elem, ATTRS.NAME),
    id: getElemAttribute(elem, ATTRS.ID),
    children: [{ text: "" }], // void node 有一个空白 text
  };
}

export const parseHtmlConf = {
  selector: `span[${COMMON_ATTRS.TYPE}="${ELEMENT_TYPE}"]`, // data-w-e-type 属性，留给自定义元素，保证扩展性
  parseElemHtml,
};
