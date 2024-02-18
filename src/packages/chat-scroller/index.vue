<template>
  <div class="z_chat_scroller_view" ref="view" @scroll.passive="onScroll">
    <div class="z_chat_scroller_body" ref="body">
      <Item :auto-update-size="autoUpdateSize" :unique="SLOTS.HEADER" :index="SLOTS.HEADER"
        @update-size="onChildSizeChange($event, null, SLOTS.HEADER)"
        :on-view-update="(fn: AnyFn) => addUpdateEvent(SLOTS.HEADER, fn)">
        <slot name="header" />
      </Item>
      <Item v-for="(item, index) in data" :key="item[uniqueKey]" :unique="item[uniqueKey]" :data="item"
        :index="String(index)" :auto-update-size="autoUpdateSize"
        :on-view-update="(fn: AnyFn) => addUpdateEvent(item[uniqueKey], fn)"
        @update-size="onChildSizeChange($event, item, SLOTS.DEFAULT)">
        <template #default="scoped">
          <slot v-bind="scoped" />
        </template>
      </Item>
      <Item :auto-update-size="autoUpdateSize" :unique="SLOTS.FOOTER" :index="SLOTS.FOOTER"
        @update-size="onChildSizeChange($event, null, SLOTS.FOOTER)"
        :on-view-update="(fn: AnyFn) => addUpdateEvent(SLOTS.FOOTER, fn)">
        <slot name="footer" />
      </Item>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  shallowRef,
  watch,
} from "vue";
import { SLOTS, SCROLL_DIRECTION } from "./enum";
import { Animation } from './animation'
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
  useSmoothScrollToBottom,
  useTriggerViewUpdateEvent,
} from './helper'
import type { ShallowElem, ChildElem, AnyFn } from "./type";
import Item from "./Item.vue";

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
  (e: 'unreadChange', front: number, behind: number): void;
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
/** 设置子元素 */
const setChildElem = (
  unique: string,
  data: any,
  el: HTMLElement | void,
  size: number | void,
  type: SLOTS
) => {
  const elem = {
    el,
    size: typeof size === 'number' ? size : (el?.offsetHeight || 0),
    data,
    type,
  } as ChildElem;
  childElemMap.set(unique, elem);
  const uniqueKey = props.uniqueKey;
  childElems = props.data.map(v => {
    return childElemMap.get(v[uniqueKey]) as ChildElem
  });
};
/** 同步childElemes */
watch(props.data, (data) => {
  const uniqueKey = props.uniqueKey
  data.forEach(v => {
    const unique = v[uniqueKey]
    if (childElemMap.has(unique)) return;
    setChildElem(unique, v, undefined, 0, SLOTS.DEFAULT)
  })
})

/** 子元素尺寸变化 */
const onChildSizeChange = (el: HTMLElement, data: any, type: SLOTS) => {
  const size = el.clientHeight;
  const unique = [SLOTS.FOOTER, SLOTS.HEADER].includes(type)
    ? type
    : data[props.uniqueKey];

  // 修复触底偏移量
  if (!view.value) return;
  const { scrollTop, clientHeight, scrollHeight } = view.value
  if (scrollHeight <= clientHeight) return;
  const headerSize = childElemMap.get(SLOTS.HEADER)?.size || 0;
  const footerSize = childElemMap.get(SLOTS.FOOTER)?.size || 0;
  const isReachBottom = headerSize + footerSize + (childElems.reduce((pre, v) => {
    return pre + (v?.size || 0)
  }, 0) - scrollTop - clientHeight) <= 1;
  if (isReachBottom) {
    smoothScrollToBottom();
  }

  // 收集子元素
  setChildElem(unique, data, el, size, type);

};


/** 更新事件集合 */
const updateEvents = new Map<string, AnyFn>()
/** 添加更新事件 */
const addUpdateEvent = async (unique: string, fn: AnyFn) => {
  updateEvents.set(unique, fn)
}

/** 未读数据 */
const unreadData: Set<any> = new Set();
/** 添加未读数据 */
const addUnread = (data: any[]) => {
  data.forEach(v => unreadData.add(v))
}
/** 更新未读数据 */
const updateUnread = () => {
  if (!unreadData.size) return;
  const uniqueKey = props.uniqueKey
  const [, startIndex, endIndex] = useViewRange(view.value as HTMLElement, childElems, uniqueKey, (el: ChildElem) => {
    const row = el.data;
    // 更新未读
    unreadData.has(row) && unreadData.delete(row)
  })
  const data = props.data;
  // true-behind false-front
  const direction = startIndex > data.length - endIndex - 1
  const lessData = direction ?
    data.slice(endIndex + 1) : data.slice(0, startIndex)
  let count = 0;
  const unreadSize = unreadData.size;
  const unreadUniques = new Set([...unreadData].map(v => v[uniqueKey]));
  lessData.some(v => {
    if (count === unreadSize) return true;
    unreadUniques.has(v[uniqueKey]) && (count++);
  })
  const frontUnread = direction ? unreadSize - count : count;
  const behindUnread = unreadSize - frontUnread
  emit('unreadChange', frontUnread, behindUnread)
  return [frontUnread, behindUnread]
}

/** 滚动方向 */
let direction: SCROLL_DIRECTION = SCROLL_DIRECTION.BEHIND
/** 滚动偏移量 */
let offset = 0;
/** 滚动事件 */
const onScroll = async (e: UIEvent) => {
  const { scrollTop, scrollHeight, clientHeight } = e.target as HTMLElement;
  // 设置滚动方向
  direction = scrollTop > offset ? SCROLL_DIRECTION.BEHIND : SCROLL_DIRECTION.FRONT
  // 设置滚动偏移量
  offset = scrollTop;
  // 滚动
  emit("scroll", e);
  // 滚动结束
  useScrollEnd(async () => {
    emit("scrollEnd", e)
    if (view.value) {
      const uniqueKey = props.uniqueKey
      // 获取视口元素
      useViewRange(view.value as HTMLElement, childElems, props.uniqueKey, (el: ChildElem) => {
        // 触发更新事件
        useTriggerViewUpdateEvent(updateEvents, el, uniqueKey)
        // 更新未读
        updateUnread()
      })
    }
  }, props.scrollEndTimeout);
  // 更新未读
  updateUnread()
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
const repairOffset = (uniques: string[]) => {
  useRepairOffset(view.value as HTMLElement, uniques.reduce((offset, unique) => {
    const elem = childElemMap.get(unique)
    if (elem) {
      offset += elem.size
    }
    return offset
  }, 0));
}

/** 滚动到底部 */
const scrollToBottom = () => {
  direction = SCROLL_DIRECTION.BEHIND;
  useScrollToBottom(view.value as HTMLElement, () => {
    onScroll({ target: view.value } as any)
  })
}

/** 动画栈 */
const animationTask: Animation[] = [];
/** 动画滚动到底部 */
const smoothScrollToBottom = () => {
  direction = SCROLL_DIRECTION.BEHIND;
  useSmoothScrollToBottom(view.value as HTMLElement, animationTask, () => {
    onScroll({ target: view.value } as any)
  })
}

defineExpose({
  addUnread,
  updateUnread,
  repairOffset,
  scrollToBottom,
  smoothScrollToBottom
})
</script>

<style scoped lang="less">
.z_chat_scroller_view {
  overflow: auto;
  position: relative;
}
</style>
