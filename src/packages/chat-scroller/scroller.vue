<template>
  <div class="z_chat_scroller_view" ref="view" @scroll.passive="onScroll">
    <div class="z_chat_scroller_body" ref="body">
      <Item
        :auto-update-size="autoUpdateSize"
        :unique="SLOTS.HEADER"
        :index="SLOTS.HEADER"
        @update-size="onChildSizeChange($event, null, SLOTS.HEADER)"
        :on-view-update="(fn: AnyFn) => addUpdateEvent(SLOTS.HEADER, fn)"
      >
        <slot name="header" />
      </Item>
      <Item
        v-for="(item, index) in data"
        :key="item[uniqueKey]"
        :unique="item[uniqueKey]"
        :data="item"
        :index="String(index)"
        :auto-update-size="autoUpdateSize"
        :on-view-update="(fn: AnyFn) => addUpdateEvent(item[uniqueKey], fn)"
        @update-size="onChildSizeChange($event, item, SLOTS.DEFAULT)"
      >
        <template #default="scoped">
          <slot v-bind="scoped" />
        </template>
      </Item>
      <Item
        :auto-update-size="autoUpdateSize"
        :unique="SLOTS.FOOTER"
        :index="SLOTS.FOOTER"
        @update-size="onChildSizeChange($event, null, SLOTS.FOOTER)"
        :on-view-update="(fn: AnyFn) => addUpdateEvent(SLOTS.FOOTER, fn)"
      >
        <slot name="footer" />
      </Item>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, shallowRef, watch } from "vue";
import { SLOTS, SCROLL_DIRECTION, ATTRS } from "./enum";
import { Animation } from "./animation";
import {
  useScrollEnd,
  useReachBottom,
  useReachTop,
  useViewUpdate,
} from "./events";
import {
  useViewRange,
  useRepairOffset,
  useScrollToBottom,
  useSmoothScrollByUnique,
  useSmoothScrollToBottom,
  useTriggerViewUpdateEvent,
} from "./helper";
import type { ShallowElem, ChildElem, AnyFn } from "./type";
import Item from "./scroller-item.vue";

type Props = {
  data: any[];
  uniqueKey?: string;
  autoUpdateSize?: boolean;
  scrollEndTimeout?: number;
};
type Emits = {
  (e: "scroll", value: UIEvent): void;
  (e: "scrollEnd", value: UIEvent): void;
  (e: "reachBottom", value: UIEvent): void;
  (e: "reachTop", value: UIEvent): void;
  (e: "unreadChange", front: number, behind: number, unread: any[]): void;
};

const props = withDefaults(defineProps<Props>(), {
  uniqueKey: "id",
  autoUpdateSize: true,
  scrollEndTimeout: 300,
});

const emit = defineEmits<Emits>();

/** 视口实例 */
const view = shallowRef<HTMLElement>();
/** 内容实例 */
const body = shallowRef<HTMLElement>();
const viewHeight = ref(0);
const bodyHeight = ref(0);
/** 视口更新事件 */
useViewUpdate(
  ([v, b]: ShallowElem[]) => {
    viewHeight.value = v.value?.clientHeight || 0;
    bodyHeight.value = b.value?.clientHeight || 0;
  },
  [view, body]
);

/** 子元素集合 */
const childElemMap = new Map<string, ChildElem>();
/** 子元素数组 */
let childElems: ChildElem[] = [];
/** 生成子元素 */
const genChildElem = (
  data: any,
  el: HTMLElement | void,
  size: number | void,
  type: SLOTS
) =>
  ({
    el,
    size: typeof size === "number" ? size : el?.offsetHeight || 0,
    data,
    type,
  } as ChildElem);
/** 设置子元素 */
const setChildElem = (
  unique: string,
  data: any,
  el: HTMLElement | void,
  size: number | void,
  type: SLOTS
) => {
  const elem = genChildElem(data, el, size, type);
  childElemMap.set(unique, elem);
  const uniqueKey = props.uniqueKey;
  childElems = props.data.map((v) => {
    return (childElemMap.get(v[uniqueKey]) ||
      genChildElem(v, undefined, 0, SLOTS.DEFAULT)) as ChildElem;
  });
};
/** 同步childElemes */
watch(props.data, (data) => {
  const uniqueKey = props.uniqueKey;
  data.forEach((v) => {
    const unique = v[uniqueKey];
    if (childElemMap.has(unique)) return;
    setChildElem(unique, v, undefined, 0, SLOTS.DEFAULT);
  });
});

/** 子元素尺寸变化 */
const onChildSizeChange = (el: HTMLElement, data: any, type: SLOTS) => {
  const size = el.clientHeight;
  const unique = [SLOTS.FOOTER, SLOTS.HEADER].includes(type)
    ? type
    : data[props.uniqueKey];

  // 判断是否自动滚动至底部
  const oldElem = childElemMap.get(unique);
  autoScrollToBottom(size, oldElem?.size || 0);

  // 收集子元素
  setChildElem(unique, data, el, size, type);
};

/** 更新事件集合 */
const updateEvents = new Map<string, AnyFn>();
/** 添加更新事件 */
const addUpdateEvent = async (unique: string, fn: AnyFn) => {
  updateEvents.set(unique, fn);
};

/** 未读数据 */
const unreadData: Map<string, any> = new Map();
/** 添加未读数据 */
const addUnread = (data: any[]) => {
  const uniqueKey = props.uniqueKey;
  data.forEach((v) => unreadData.set(v[uniqueKey], v));
};
/** 清空未读 */
const clearUnread = () => {
  unreadData.clear();
  updateUnread();
};
/** 更新未读数据 */
const updateUnread = () => {
  const update = (front: number, behind: number) => {
    const unread = [...unreadData.values()];
    emit("unreadChange", front, behind, unread);
    return [front, behind, unread];
  };
  if (!unreadData.size) return update(0, 0);
  const uniqueKey = props.uniqueKey;
  const [, startIndex, endIndex] = useViewRange(
    view.value as HTMLElement,
    childElems,
    uniqueKey,
    (el: ChildElem) => {
      const row = el.data;
      const unique = row[uniqueKey];
      // 更新未读
      unreadData.has(unique) && unreadData.delete(unique);
    }
  );
  const data = props.data;
  // true-behind false-front
  const direction = startIndex > data.length - endIndex - 1;
  const lessData = direction
    ? data.slice(endIndex + 1)
    : data.slice(0, startIndex);
  let count = 0;
  const unreadSize = unreadData.size;
  lessData.some((v) => {
    if (count === unreadSize) return true;
    unreadData.has(v[uniqueKey]) && count++;
  });
  const frontUnread = direction ? unreadSize - count : count;
  const behindUnread = unreadSize - frontUnread;
  return update(frontUnread, behindUnread);
};

/** 滚动方向 */
let direction: SCROLL_DIRECTION = SCROLL_DIRECTION.BEHIND;
/** 滚动偏移量 */
let offset = 0;
/** 滚动事件 */
const onScroll = async (e: UIEvent) => {
  const { scrollTop, scrollHeight, clientHeight } = e.target as HTMLElement;
  // 设置滚动方向
  direction =
    scrollTop >= offset ? SCROLL_DIRECTION.BEHIND : SCROLL_DIRECTION.FRONT;
  // 设置滚动偏移量
  offset = scrollTop;
  // 滚动
  emit("scroll", e);
  // 滚动结束
  useScrollEnd(async () => {
    emit("scrollEnd", e);
    if (view.value) {
      const uniqueKey = props.uniqueKey;
      // 获取视口元素
      useViewRange(
        view.value as HTMLElement,
        childElems,
        props.uniqueKey,
        (el: ChildElem) => {
          // 触发更新事件
          useTriggerViewUpdateEvent(updateEvents, el, uniqueKey);
          // 更新未读
          updateUnread();
        }
      );
    }
  }, props.scrollEndTimeout);
  // 更新未读
  updateUnread();
  // 触底
  if (useReachBottom(scrollTop, clientHeight, scrollHeight)) {
    emit("reachBottom", e);
  }
  // 触顶
  if (useReachTop(scrollTop)) {
    emit("reachTop", e);
  }
};

/** 修复偏移 */
const repairOffset = (data: any[]) => {
  const uniqueKey = props.uniqueKey;
  const offset = data
    .map((v) => v[uniqueKey])
    .reduce((offset, unique) => {
      const elem = childElemMap.get(unique);
      if (elem) {
        const el = () =>
          elem.el ||
          view.value?.querySelector(`[${ATTRS.ITEM_UNIQUE}="${elem.data}"]`) ||
          undefined;
        offset += elem.size || el()?.offsetHeight || 0;
      }
      return offset;
    }, 0);
  useRepairOffset(view.value as HTMLElement, offset);
};

/** 滚动到底部 */
const scrollToBottom = (fn?: any) => {
  direction = SCROLL_DIRECTION.BEHIND;
  useScrollToBottom(view.value as HTMLElement, () => {
    onScroll({ target: view.value } as any);
    fn?.();
  });
};

/** 动画栈 */
const animationTask: Animation[] = [];
/** 动画滚动到底部 */
const smoothScrollToBottom = () => {
  direction = SCROLL_DIRECTION.BEHIND;
  useSmoothScrollToBottom(view.value as HTMLElement, animationTask, () => {
    onScroll({ target: view.value } as any);
  });
};
/** 动画滚动至指定item */
const smoothScrollByUnique = (unique: string) => {
  useSmoothScrollByUnique(
    unique,
    view.value as HTMLElement,
    animationTask,
    childElemMap
  );
};

/** 自动判断是否滚动到末尾 */
const autoScrollToBottom = (newSize: number, oldSize: number) => {
  // 修复触底偏移量
  if (!oldSize || newSize - oldSize <= 0 || !view.value) return;
  const { scrollTop, clientHeight, scrollHeight } = view.value;
  if (scrollHeight <= clientHeight) return;
  const headerSize = childElemMap.get(SLOTS.HEADER)?.size || 0;
  const footerSize = childElemMap.get(SLOTS.FOOTER)?.size || 0;
  const offset =
    headerSize +
    footerSize +
    (childElems.reduce((pre, v) => {
      return pre + (v?.size || 0);
    }, 0) -
      scrollTop -
      clientHeight);
  const isReachBottom = offset >= 0 && offset <= 10;
  if (isReachBottom) {
    smoothScrollToBottom();
  }
};

defineExpose({
  addUnread,
  clearUnread,
  updateUnread,
  repairOffset,
  scrollToBottom,
  smoothScrollByUnique,
  smoothScrollToBottom,
});
</script>

<style scoped lang="less">
.z_chat_scroller_view {
  overflow: auto;
  position: relative;
}
</style>
