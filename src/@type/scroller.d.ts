declare namespace Scroller {
  type UniqueKey = number | string;

  /** Virtual Config */
  type Config = {
    offset?: number;
    /** 唯一键 */
    uniqueKey: UniqueKey;
    /** 预估高度 */
    estimateHeight: number;
    /** 缓存两边的数量 */
    bufferCount: number;
    /** 更新时调用 */
    onUpdateRender?: (
      data: renderData[],
      padFront: number,
      padBehind: number
    ) => void;

    /** 触碰顶部 */
    onReachFront?: (...args: any) => any;
    /** 触碰底部 */
    onReachBehind?: (...args: any) => any;

    /** 视口高度 */
    viewHeight: () => number;
    /** 内容高度 */
    contentHeight: () => number;
    /** 视口元素 */
    viewEl: () => HTMLElement | null | undefined;
    /** 内容元素 */
    contentEl: () => HTMLElement | null | undefined;
  };

  /** 缓存数据 */
  type CacheData = {
    dom?: HTMLElement;
    size: number;
  };
}
