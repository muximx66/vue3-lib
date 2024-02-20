import { toAttr } from "../../helper";

/** 元素类型 */
export const ELEMENT_TYPE = "chatMention";

export const SYMBOL_TYPE = "chatMentionSymbol";

/** 配置关键字 */
export const MENU_CONFIG = "mentionConfig";

/** 属性值 */
export const ATTRS = {
  ID: toAttr("id"),
  NAME: toAttr("name"),
  URL: toAttr("url"),
};

export const SYMBOL_IS_INLINE = true;

export const SYMBOL_IS_VOID = false;

export const IS_INLINE = true;

export const IS_VOID = true;
