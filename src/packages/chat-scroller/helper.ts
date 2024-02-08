import type { ChildElem, AnyFn } from './type'

/** 滚动至 */
export const useScrollTo = (view: HTMLElement, offset: number) => {
  view.scrollTop = offset;
}

/** 滚动至底部 */
export const useScrollToBottom = (view: HTMLElement) => {
  useScrollTo(view, view.scrollHeight)
}


/** 修复偏移 */
export const useRepairOffset = (view: HTMLElement, size: number) => {
  useScrollTo(view, (view.scrollTop || 0) + size);
}

/** 触发可是范围内节点更新事件 */
export const useTriggerViewUpdateEvent = (events: Map<string, AnyFn>, view: HTMLElement, els: ChildElem[], uniqueKey: string) => {
  useViewRange(view, els, (el: ChildElem) => {
    const unique = el.data[uniqueKey];
    const fn = events.get(unique);
    fn && fn();
  })
}

/** 获取可视范围内节点 */
export const useViewRange = (view: HTMLElement, els: ChildElem[], fn?: any) => {
  const viewStartIndex = useViewStartIndex(view, els);
  const viewOffset = view.scrollTop + view.clientHeight;
  const range = [] as ChildElem[];
  els.slice(viewStartIndex).some((el) => {
    if (el.el.offsetTop >= viewOffset) {
      return true;
    }
    fn && fn(el)
    range.push(el);
  })
  return range;
}


/** 获取可视范围内开始的节点 */
export const useViewStartIndex = (view: HTMLElement, els: ChildElem[]) => {
  let low = 0;
  let high = els.length - 1;
  let mid = 0;
  const offset = view.scrollTop || 0;
  while (low <= high) {
    mid = Math.floor((low + high) / 2);
    const midEl = els[mid]?.el;
    const midOffset = (midEl?.offsetTop || 0)
    if (midOffset === offset) {
      return mid;
    } else if (midOffset < offset) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  return low > 0 ? --low : 0;
}
