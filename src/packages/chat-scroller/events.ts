import { type ShallowRef, onMounted, onBeforeUnmount } from "vue";
import type { ShallowElem } from "./type";

/** 滚动结束 */
let scrollEndTimer: any = null;
export const useScrollEnd = (fn: any, timeout: number) => {
  if (scrollEndTimer) clearTimeout(scrollEndTimer);
  scrollEndTimer = setTimeout(fn, timeout);
};

/** 滚动到底部 */
export const useReachBottom = (
  scrollTop: number,
  viewHeight: number,
  contentHeight: number
) => Math.ceil(viewHeight + scrollTop) >= Math.floor(contentHeight);

/** 滚动到顶部 */
export const useReachTop = (scrollTop: number) => scrollTop <= 0;

/** 视口更新 */
export const useViewUpdate = (
  fn: (els: ShallowElem[]) => void,
  els: ShallowElem[]
) => {
  let oberver: ResizeObserver | null;
  onMounted(() => {
    oberver = new ResizeObserver(() => {
      fn(els);
    });
    els.forEach((el) => {
      el.value && oberver?.observe(el.value);
    });
  });
  onBeforeUnmount(() => {
    oberver?.disconnect();
    oberver = null;
  });
};
