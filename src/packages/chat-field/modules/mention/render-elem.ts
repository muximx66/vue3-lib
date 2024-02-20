import { Element as SlateElement } from "slate";
import { VNode, h } from "snabbdom";
import { ELEMENT_TYPE, ATTRS } from "./enum";
import { ATTRS as COMMON_ATTRS } from "../../enum";
import type { ElementNode } from "./custom-types";

function renderElem(elemNode: SlateElement): VNode {
  const { id, name } = elemNode as ElementNode;
  const vNode = h(
    "span",
    {
      attrs: {
        [COMMON_ATTRS.TYPE]: ELEMENT_TYPE,
        [ATTRS.ID]: id,
        [ATTRS.NAME]: name,
      },
      style: {
        color: "#1890ff",
        paddingRight: "4px",
      },
    },
    `@${name}`
  );
  return vNode;
}

const renderConf = {
  type: ELEMENT_TYPE, // 和 elemNode.type 一致
  renderElem,
};

export { renderConf };
