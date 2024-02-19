
/** 属性前缀 */
export const ATTRS_PREFIX = "data-w-e-";

export const toAttr = (key: string) => `${ATTRS_PREFIX}${key}`;

/** 通用属性 */
export const ATTRS = {
  /** 元素类型 */
  TYPE: toAttr("type"),
  /** 元素是否void */
  IS_VOID: toAttr("is-void"),
  /** 元素是否inline */
  IS_INLINE: toAttr("is-inline"),
};