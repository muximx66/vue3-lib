<template>
  <div class="z_chat_scroller_view" ref="view" @scroll.passive="onScroll">
    <div class="z_chat_scroller_body" ref="body">
      <Item
        :auto-update-size="autoUpdateSize"
        @update-size="onChildSizeChange($event, null, SLOTS.HEADER)"
      >
        <slot name="header" />
      </Item>
      <Item
        v-for="item in data"
        :key="item[uniqueKey]"
        :data="item"
        :auto-update-size="autoUpdateSize"
        @update-size="onChildSizeChange($event, item, SLOTS.DEFAULT)"
      >
        <template #default="scoped">
          <slot v-bind="scoped" />
        </template>
      </Item>
      <Item
        :auto-update-size="autoUpdateSize"
        @update-size="onChildSizeChange($event, null, SLOTS.FOOTER)"
      >
        <slot name="footer" />
      </Item>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  shallowRef,
  onMounted,
  onUnmounted,
  watch,
  ShallowRef,
} from "vue";
import { SLOTS } from "./enum";
import {
  useScrollEnd,
  useReachBottom,
  useReachTop,
  useViewUpdate,
} from "./events";
import type { ShallowElem, ChildElem } from "./type";
import Item from "./Item.vue";

type Props = {
  data: any[];
  uniqueKey?: string | number;
  autoUpdateSize?: boolean;
};
const props = withDefaults(defineProps<Props>(), {
  uniqueKey: "id",
  autoUpdateSize: true,
});

type Emits = {
  (e: "scroll", value: UIEvent): void;
  (e: "scrollEnd", value: UIEvent): void;
  (e: "reachBottom", value: UIEvent): void;
  (e: "reachTop", value: UIEvent): void;
};
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
const childElems = new Map<string, ChildElem>();
/** 设置子元素 */
const setChildElem = (
  id: string,
  el: HTMLElement,
  size: number | undefined,
  data: any,
  type: SLOTS
) => {
  childElems.set(id, {
    el,
    size: size || el.offsetHeight,
    data,
    type,
  });
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

/** 滚动事件 */
const onScroll = (e: UIEvent) => {
  const { scrollTop, scrollHeight, clientHeight } = e.target as HTMLElement;
  // 滚动
  emit("scroll", e);
  // 滚动结束
  useScrollEnd(() => emit("scrollEnd", e), 500);
  // 触底
  if (useReachBottom(scrollTop, clientHeight, scrollHeight)) {
    emit("reachBottom", e);
  }
  // 触顶
  if (useReachTop(scrollTop)) {
    emit("reachTop", e);
  }
};
</script>

<style scoped lang="less">
.z_chat_scroller_view {
  overflow: auto;
}
</style>
