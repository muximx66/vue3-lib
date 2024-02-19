import { Element as SlateElement } from 'slate'
import { VNode, h } from 'snabbdom'
import { ELEMENT_TYPE, ATTRS } from './enum'
import { ATTRS as COMMON_ATTRS } from '../../enum'
import type { ElementNode } from './custom-types'

function renderElem(elemNode: SlateElement): VNode {
  const { url, id } = elemNode as ElementNode;
  const vNode = h("img", {
    style: {
      margin: "0 10px",
      maxWidth: "200px",
    },
    props: {
      src: url,
    },
    attrs: {
      [COMMON_ATTRS.TYPE]: ELEMENT_TYPE,
      [ATTRS.ID]: id,
      [ATTRS.URL]: url,
    },
  });
  return vNode;
}

const renderConf = {
  type: ELEMENT_TYPE, // 和 elemNode.type 一致
  renderElem,
}

export { renderConf }
