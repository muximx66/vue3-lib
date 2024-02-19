import { toAttr } from '../../helper'

/** 元素类型 */
export const ELEMENT_TYPE = 'chatFile'

/** 属性值 */
export const ATTRS = {
  ID: toAttr('id'),
  NAME: toAttr('name'),
  URL: toAttr('url')
}

export const IS_INLINE = true;

export const IS_VOID = true;