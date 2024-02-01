/** 滚动方向 */
enum DIRECTION_TYPE {
  FRONT = "front",
  BEHIND = "behind",
}
/** 虚拟列表类 */
export class Virtual {
  /** 配置 */
  config: Scroller.Config;
  constructor(config: Scroller.Config) {
    this.config = config;
    this.init();
  }
  /** 初始化 */
  public init() {
    const config = this.config;
    this.offset = config.offset || 0;
  }

  /** 滚动距离 */
  offset = 0;
  /** 滚动方向 */
  direction = DIRECTION_TYPE.FRONT;
  /** 滚动事件 */
  public onScroll(offset: number) {
    const config = this.config;
    // 判断滚动方向
    this.direction =
      offset < this.offset || offset === 0
        ? DIRECTION_TYPE.FRONT
        : DIRECTION_TYPE.BEHIND;
    this.offset = offset;
    // 判断触顶触底
    if (config.onReachFront || config.onReachBehind) {
      if (this.renderStart === 0 && offset === 0) {
        config.onReachFront?.();
      } else if (
        this.renderEnd === this.data.length &&
        offset + config.viewHeight() === config.contentHeight()
      ) {
        config.onReachBehind?.();
      }
    }
    // 判断更新方向
    if (this.direction === DIRECTION_TYPE.FRONT) {
      return this.onFront();
    } else {
      return this.onBehind();
    }
  }
  /** 向上滚动 */
  public onFront(): [() => number, () => number] {
    const viewStart = this.getViewStart();
    if (viewStart > this.renderStart)
      return [() => viewStart, () => this.getViewEndByViewStart(viewStart)];
    const getViewIndexArr = this.updateRangeByViewStart(viewStart);
    const data = this.data;
    if (this.viewStart > 0) {
      const uniqueKey = this.config.uniqueKey;
      const uniquesOfFixFrontOffset = this.uniquesOfFixFrontOffset;
      const uniquesOfUnableFixFrontOffset = this.uniquesOfUnableFixFrontOffset;
      data
        .slice(this.renderStart, this.viewStart)
        .forEach((row) => uniquesOfFixFrontOffset.add(row[uniqueKey]));
      data.slice(this.viewStart).forEach((row) => {
        uniquesOfUnableFixFrontOffset.add(row[uniqueKey]);
        uniquesOfFixFrontOffset.delete(row[uniqueKey]);
      });
    }
    this.updateRender();
    return getViewIndexArr;
  }
  /** 向下滚动 */
  public onBehind(): [() => number, () => number] {
    const viewEnd = this.getViewEnd();
    if (viewEnd < this.renderEnd)
      return [() => this.getViewStartByViewEnd(viewEnd), () => viewEnd];
    const getViewIndexArr = this.updateRangeByViewEnd(viewEnd);

    this.updateRender();
    return getViewIndexArr;
  }

  /** 数据 */
  data: any[] = [];
  /** 需要渲染的数据 */
  renderData: any[] = [];
  /** 更新渲染数据 */
  public updateRender() {
    if (!this.data.length) return;
    const renderData = this.data.slice(this.renderStart, this.renderEnd);
    this.renderData = renderData;
    const { onUpdateRender } = this.config;
    if (onUpdateRender) {
      onUpdateRender(this.renderData, this.padFront, this.padBehind);
    }
  }

  /** 可视开始索引 */
  viewStart = 0;
  /** 可视结束索引（不包含） */
  viewEnd = 0;
  /** 渲染开始索引 */
  renderStart = 0;
  /** 渲染结束索引(不包含) */
  renderEnd = 0;
  /** 内容前填充 */
  padFront = 0;
  /** 内容后填充 */
  padBehind = 0;
  /** 根据可视开始索引更新范围 */
  public updateRangeByViewStart(
    viewStart: number
  ): [() => number, () => number] {
    const start = this.getRenderStartByViewStart(viewStart);
    const viewEnd = this.getViewEndByViewStart(viewStart);
    const end = this.getRenderEndByViewEnd(viewEnd);
    this.updateRange(start, end, viewStart, viewEnd);
    return [() => viewStart, () => viewEnd];
  }
  /** 根据可视结束索引更新范围 */
  public updateRangeByViewEnd(viewEnd: number): [() => number, () => number] {
    const end = this.getRenderEndByViewEnd(viewEnd);
    const viewStart = this.getViewStartByViewEnd(viewEnd);
    const start = this.getRenderStartByViewStart(viewStart);
    this.updateRange(start, end, viewStart, viewEnd);
    return [() => viewStart, () => viewEnd];
  }
  /** 更新范围 */
  public updateRange(
    start: number,
    end: number,
    viewStart: number,
    viewEnd: number
  ) {
    this.viewStart = viewStart;
    this.viewEnd = viewEnd;
    this.renderStart = start;
    this.renderEnd = end;
    this.padFront = this.getPadFront();
    this.padBehind = this.getPadBehind();
  }

  /** 获取前面的padding */
  public getPadFront() {
    return this.renderStart > 0
      ? this.getOffsetByIndex(this.renderStart - 1)
      : 0;
  }
  /** 获取后面的padding */
  public getPadBehind() {
    const renderEnd = this.renderEnd;
    const lastIndex = this.data.length - 1;
    if (!renderEnd || renderEnd > lastIndex) return 0;
    return (
      this.getOffsetByIndex(lastIndex) -
      this.getOffsetByIndex(renderEnd) +
      (this.cacheData.get(this.data[lastIndex][this.config.uniqueKey])?.size ||
        0)
    );
  }

  /** 通过可视范围开始索引获取渲染开始索引 */
  public getRenderStartByViewStart(viewStart?: number) {
    viewStart = typeof viewStart === "number" ? viewStart : this.getViewStart();
    return Math.max(0, viewStart - this.config.bufferCount);
  }
  /** 获取可视范围开始索引 */
  public getViewStart() {
    let low = 0;
    let middle = 0;
    let middleOffset = 0;
    let high = this.data.length;
    const offset = this.offset;
    while (low <= high) {
      middle = low + Math.floor((high - low) / 2);
      middleOffset = this.getOffsetByIndex(middle);
      if (middleOffset === offset) {
        return middle;
      } else if (middleOffset < offset) {
        low = middle + 1;
      } else if (middleOffset > offset) {
        high = middle - 1;
      }
    }
    return low > 0 ? --low : 0;
  }
  /** 通过可视范围结束索引获取渲染开始索引 */
  public getViewEnd() {
    let low = 0;
    let middle = 0;
    let middleOffset = 0;
    let high = this.data.length;
    const offset = this.offset + this.config.viewHeight();
    while (low <= high) {
      middle = low + Math.floor((high - low) / 2);
      middleOffset = this.getOffsetByIndex(middle);
      if (middleOffset === offset) {
        return middle;
      } else if (middleOffset < offset) {
        low = middle + 1;
      } else if (middleOffset > offset) {
        high = middle - 1;
      }
    }
    return low > 0 ? --low : 0;
  }

  /** 获取可视范围结束索引 */
  public getViewEndByViewStart(start: number) {
    const offset = this.offset + this.config.viewHeight();
    while (this.getOffsetByIndex(start) < offset) {
      start++;
      if (start >= this.data.length) break;
    }
    return start;
  }
  /** 获取可视范围开始索引 */
  public getViewStartByViewEnd(viewEnd: number) {
    const offset = this.offset;
    while (this.getOffsetByIndex(viewEnd) > offset) {
      viewEnd--;
      if (viewEnd < 0) break;
    }
    return Math.max(0, viewEnd);
  }

  /** 通过可视结束索引获取渲染结束索引 */
  public getRenderEndByViewEnd(viewEnd: number) {
    return Math.min(this.data.length, viewEnd + this.config.bufferCount + 1);
  }

  /** 获取元素距离顶部高度 */
  public getOffsetByIndex(index: number) {
    let i = 0;
    let offset = 0;
    const estimateHeight = this.config.estimateHeight;
    const uniqueKey = this.config.uniqueKey;
    while (i < index) {
      offset +=
        this.getCacheDataByUnique(this.data[i][uniqueKey])?.size ||
        estimateHeight;
      i++;
    }
    return offset;
  }

  /** 缓存子数据,size-height */
  cacheData = new Map<
    Scroller.UniqueKey,
    { dom?: HTMLElement; size: number }
  >();
  /** 获取初始化的cache数据 */
  public getNewCache(data?: Partial<Scroller.CacheData>) {
    const { estimateHeight } = this.config;
    return {
      size: estimateHeight,
      ...data,
    } as Scroller.CacheData;
  }
  /** 设置新缓存数据 */
  public setCacheDataByRows(rows: any[]) {
    const { uniqueKey } = this.config;
    rows.forEach((row) => {
      this.cacheData.set(row[uniqueKey], this.getNewCache());
    });
  }
  /** 通过unique获取缓存数据 */
  public getCacheDataByUnique(unique: Scroller.UniqueKey) {
    return this.cacheData.get(unique);
  }
  /** 往后加数据 */
  public push(rows: any[]) {
    this.data.push(...rows);
    this.setCacheDataByRows(rows);
    this.updateRangeByViewStart(this.getViewStart());
    this.updateRender();
  }
  /** 往前加数据 */
  public unshift(rows: any[]) {
    this.data.unshift(...rows);
    this.setCacheDataByRows(rows);
    const uniqueKey = this.config.uniqueKey;
    rows.forEach((row) => {
      this.uniquesOfFixFrontOffset.add(row[uniqueKey]);
    });
    this.scrollTo(this.offset + this.getOffsetByIndex(rows.length));
    this.updateRangeByViewStart(this.getViewStart());
    this.updateRender();
  }

  /** 滚动到指定位置 */
  public scrollTo(offset: number) {
    const viewEl = this.config.viewEl();
    if (!viewEl) return;
    viewEl.scrollTop = offset;
    this.offset = offset;
  }
  /** 滚动到最前 */
  public scrollToFront() {
    this.scrollTo(0);
    this.direction = DIRECTION_TYPE.FRONT;
    this.onFront();
  }
  /** 滚动到最后 */
  public scrollToBehind() {
    this.scrollTo(this.config.contentHeight() - this.config.viewHeight());
    this.direction = DIRECTION_TYPE.BEHIND;
    this.onBehind();
  }

  /** 是否隐藏在可视范围前面 */
  public isHideInFront(index: number) {
    return this.getOffsetByIndex(index) < this.offset;
  }

  /** 需要修复前面offset的unique列表 */
  public uniquesOfFixFrontOffset = new Set<Scroller.UniqueKey>();
  public uniquesOfUnableFixFrontOffset = new Set<Scroller.UniqueKey>();
  /** 修复前面的offset值 */
  public fixFrontOffset(
    offset: number,
    newSize: number,
    oldSize: number,
    unique: Scroller.UniqueKey
  ) {
    this.uniquesOfFixFrontOffset.delete(unique);
    if (newSize === oldSize) return;
    this.scrollTo(offset - oldSize + newSize);
  }
  /** 元素变化触发，设置缓存数据 */
  public onElSizeChange(
    unique: Scroller.UniqueKey,
    dom: HTMLElement,
    index: number
  ) {
    const oldSize = this.getCacheDataByUnique(unique)?.size || 0;
    const newSize = dom.offsetHeight;
    /** 如果隐藏在前面，或者存在修复列表里的，则修复offset值 */
    if (this.uniquesOfFixFrontOffset.has(unique) || this.isHideInFront(index)) {
      this.fixFrontOffset(this.offset, newSize, oldSize, unique);
    }
    this.cacheData.set(
      unique,
      this.getNewCache({
        dom,
        size: newSize,
      })
    );
  }
}
