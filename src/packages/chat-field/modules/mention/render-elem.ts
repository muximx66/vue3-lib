import { Element as SlateElement } from "slate";
import { VNode, h } from "snabbdom";
import { ATTRS, SYMBOL_TYPE } from "./enum";
import { ATTRS as COMMON_ATTRS } from "../../enum";
import type { SymbolNode } from "./custom-types";

function renderSymbol(elemNode: SlateElement): VNode {
  console.log("render");
  const { id } = elemNode as SymbolNode;
  const vNode = h(
    "span",
    {
      attrs: {
        [COMMON_ATTRS.TYPE]: SYMBOL_TYPE,
        [ATTRS.ID]: id,
      },
    },
    "@"
  );
  return vNode;
}

const renderSymbolConf = {
  type: SYMBOL_TYPE,
  renderElem: renderSymbol,
};

export { renderSymbolConf };
