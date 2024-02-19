import { Element } from 'slate'
import { ELEMENT_TYPE } from './enum'
import { ElementNode } from './custom-types'
import { toAttr } from '../../helper'

/** 转化为html */
function elemToHtml(elemNode: Element): string {
  const type = ELEMENT_TYPE
  const { id } = elemNode as ElementNode
  const html = `<${type} ${toAttr("id")}="${id}" ${toAttr(
    "type"
  )}="${type}"></${type}>`;
  return html;
}

export const elemToHtmlConf = {
  type: ELEMENT_TYPE,
  elemToHtml,
}
