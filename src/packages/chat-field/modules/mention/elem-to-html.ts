import { Element } from "slate";
import { SYMBOL_TYPE, ATTRS } from "./enum";
import { ATTRS as COMMON_ATTRS } from "../../enum";
import { SymbolNode } from "./custom-types";

/** 转化为html */
function symbolToHtml(elemNode: Element): string {
  const type = SYMBOL_TYPE;
  const { id } = elemNode as SymbolNode;
  const html = `<${type} ${ATTRS.ID}="${id}" ${COMMON_ATTRS.TYPE}="${type}"></${type}>`;
  return html;
}

export const symbolToHtmlConf = {
  type: SYMBOL_TYPE,
  elemToHtml: symbolToHtml,
};
