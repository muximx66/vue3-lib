<template>
  <div class="z_chat_scroller_view" ref="view" @scroll.passive="onScroll">
    <div class="z_chat_scroller_body" ref="body">
      <Item :auto-update-size="autoUpdateSize" @update-size="onChildSizeChange($event, null, SLOTS.HEADER)"
        :on-view-update="(fn: AnyFn) => addUpdateEvent(SLOTS.HEADER, fn)">
        <slot name="header" />
      </Item>
      <Item v-for="item in data" :key="item[uniqueKey]" :data="item" :auto-update-size="autoUpdateSize"
        :on-view-update="(fn: AnyFn) => addUpdateEvent(item[uniqueKey], fn)"
        @update-size="onChildSizeChange($event, item, SLOTS.DEFAULT)">
        <template #default="scoped">
          <slot v-bind="scoped" />
        </template>
      </Item>
      <Item :auto-update-size="autoUpdateSize" @update-size="onChildSizeChange($event, null, SLOTS.FOOTER)"
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
} from "vue";
import { SLOTS } from "./enum";
import {
  useScrollEnd,
  useReachBottom,
  useReachTop,
  useViewUpdate,
} from "./events";
import { useRepairOffset, useTriggerViewUpdateEvent, useScrollToBottom } from './helper'
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
const getViewHeight = () => viewHeight.value || view.value?.clientHeight || 0;
const getBodyHeight = () => bodyHeight.value || body.value?.clientHeight || 0;
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
  id: string,
  el: HTMLElement,
  size: number | undefined,
  data: any,
  type: SLOTS
) => {
  const elem = {
    el,
    size: size || el.offsetHeight,
    data,
    type,
  } as ChildElem;
  childElemMap.set(id, elem);
  const uniqueKey = props.uniqueKey;
  childElems = props.data.map(v => {
    return childElemMap.get(v[uniqueKey]) as ChildElem
  });
  (window as any).ChildElemMap = childElemMap;
};

/** 子元素尺寸变化 */
const onChildSizeChange = (el: HTMLElement, data: any, type: SLOTS) => {
  const size = el.clientHeight;
  const unique = [SLOTS.FOOTER, SLOTS.HEADER].includes(type)
    ? type
    : data[props.uniqueKey];
  // 收集子元素
  setChildElem(unique, el, size, data, type);
};


/** 更新事件集合 */
const updateEvents = new Map<string, AnyFn>()
/** 添加更新事件 */
const addUpdateEvent = (unique: string, fn: AnyFn) => {
  updateEvents.set(unique, fn)
}

/** 滚动事件 */
const onScroll = async (e: UIEvent) => {
  const { scrollTop, scrollHeight, clientHeight } = e.target as HTMLElement;

  // 滚动
  emit("scroll", e);
  // 滚动结束
  useScrollEnd(async () => {
    emit("scrollEnd", e)
    // 更新视口
    if (view.value) {
      useTriggerViewUpdateEvent(updateEvents, view.value, childElems, props.uniqueKey)
    }
  }, props.scrollEndTimeout);
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
  useScrollToBottom(view.value as HTMLElement)
}

defineExpose({
  repairOffset,
  scrollToBottom
})
</script>

<style scoped lang="less">
.z_chat_scroller_view {
  overflow: auto;
}
</style>
