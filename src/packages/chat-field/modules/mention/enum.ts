import { toAttr } from "../../helper";

/** 元素类型 */
export const ELEMENT_TYPE = "chatMention";

/** 配置关键字 */
export const MENU_CONFIG = "mentionConfig";

/** 属性值 */
export const ATTRS = {
  ID: toAttr("id"),
  NAME: toAttr("name"),
  URL: toAttr("url"),
};

export const IS_INLINE = true;

export const IS_VOID = true;
