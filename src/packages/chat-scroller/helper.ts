import { ATTRS } from './enum'
import { Animation, EASING } from './animation'
import type { ChildElem, AnyFn } from './type'

/** 滚动至 */
export const useScrollTo = (view: HTMLElement, offset: number) => {
  view.scrollTop = offset;
}

/** 滚动至底部 */
export const useScrollToBottom = (view: HTMLElement, complete?: any) => {
  useScrollTo(view, view.scrollHeight)
  complete?.();
}

/** 动画滚动至底部 */
export const useSmoothScrollToBottom = (view: HTMLElement, animationTask: Animation[], complete?: any) => {
  while (animationTask.length) {
    animationTask.shift()?.stop();
  }
  const { scrollTop, scrollHeight, clientHeight } = view;
  const range = scrollHeight - clientHeight - scrollTop;
  const animation = new Animation({
    onComplete: complete,
    onChange: (ratio: number) => {
      useScrollTo(view, scrollTop + ratio * range)
    },
    duration: 300,
    easing: EASING.LINEAR
  })
  animation.play();
  animationTask.push(animation)
}


/** 修复偏移 */
export const useRepairOffset = (view: HTMLElement, size: number) => {
  useScrollTo(view, (view.scrollTop || 0) + size);
}

/** 触发可是范围内节点更新事件 */
export const useTriggerViewUpdateEvent = (events: Map<string, AnyFn>, el: ChildElem, uniqueKey: string) => {
  const unique = el.data[uniqueKey];
  const fn = events.get(unique);
  fn && fn();
}

/** 获取可视范围内节点 */
export const useViewRange = (view: HTMLElement, els: ChildElem[], uniqueKey: string, fn?: any) => {
  const viewStartIndex = useViewStartIndex(view, els, uniqueKey);
  let viewEndIndex = -1
  const viewOffset = view.scrollTop + view.clientHeight;
  const range = [] as ChildElem[];
  const leftEls = els.slice(viewStartIndex)
  leftEls.some((elData, i) => {
    const el = elData.el || view.querySelector(`[${ATTRS.ITEM_UNIQUE}=${elData.data[uniqueKey]}]`)
    if ((el?.offsetTop || 0) >= viewOffset) {
      const index = i - 1;
      viewEndIndex = index < 0 ? 0 : index;
      return true;
    }
    fn && fn(elData)
    range.push(elData);
  })
  if (viewEndIndex < 0) viewEndIndex = leftEls.length ? leftEls.length - 1 : 0;
  return [
    range,
    viewStartIndex,
    viewEndIndex + viewStartIndex
  ] as [ChildElem[], number, number]
}

/** 获取可视范围内开始的节点 */
export const useViewStartIndex = (view: HTMLElement, els: ChildElem[], uniqueKey: string) => {
  let low = 0;
  let high = els.length - 1;
  let mid = 0;
  const offset = view.scrollTop || 0;
  while (low < high) {
    mid = Math.floor((low + high) / 2);
    const midData = els[mid]
    const midEl = midData.el || view.querySelector(`[${ATTRS.ITEM_UNIQUE}=${midData.data[uniqueKey]}]`)
    const midOffset = Math.ceil(midEl?.offsetTop || 0)
    const midHeight = Math.ceil(midEl?.offsetHeight || 0);
    if ((midOffset === offset)) {
      return mid;
    } else if (midOffset < offset) {
      const nextOffset = midOffset + midHeight;
      if (nextOffset > offset) return mid;
      if (nextOffset === offset) return mid + 1;
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  return low > 0 ? low : 0;
}
