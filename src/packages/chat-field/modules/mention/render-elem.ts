import { Element as SlateElement } from "slate";
import { VNode, h } from "snabbdom";
import { ATTRS, SYMBOL_TYPE } from "./enum";
import { ATTRS as COMMON_ATTRS } from "../../enum";
import type { SymbolNode } from "./custom-types";

function renderSymbol(elemNode: SlateElement, children: VNode[] | null): VNode {
  const { id } = elemNode as SymbolNode;
  const child: any = [h('span', '@')]
  if (children) child.push(...children)
  return h('span', {
    attrs: {
      [ATTRS.ID]: id
    }
  }, child)
}

const renderSymbolConf = {
  type: SYMBOL_TYPE,
  renderElem: renderSymbol,
};

export { renderSymbolConf };
