<template>
  <div
    class="z_virtual_scroller_view"
    ref="viewRef"
    :style="{ overflow: 'auto', height: `${height}px` }"
    @scroll.passive="onScroll"
  >
    <div
      class="z_virtual_scroller_content"
      ref="contentRef"
      :style="{ paddingTop: `${padFront}px`, paddingBottom: `${padBehind}px` }"
    >
      <slot name="header" />
      <Item
        v-for="(item, index) in list"
        :estimate-height="estimateHeight"
        :row="item"
        :index="index"
        :key="item[uniqueKey]"
        :auto-update-size="autoUpdateSize"
        @update:size="onElSizeChange"
      >
        <template #default="scoped">
          <slot v-bind="scoped" />
        </template>
      </Item>
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, shallowRef, onMounted, onUnmounted } from "vue";
import Item from "./Item.vue";
import { Virtual } from "./virtual";

type Props = {
  data?: any[];
  height?: number;
  uniqueKey?: string | number;
  estimateHeight?: number;
  bufferCount?: number;
  autoUpdateSize?: boolean;
  onReachFront?: (...args: any) => any;
  onReachBehind?: (...args: any) => any;
};
const props = withDefaults(defineProps<Props>(), {
  uniqueKey: "id",
  height: 500,
  estimateHeight: 30,
  bufferCount: 20,
  autoUpdateSize: true,
});

type Emits = {
  (
    e: "scroll",
    value: [getViewStart: () => number, getViewEnd: () => number]
  ): void;
};
const emits = defineEmits<Emits>();

/** 视口实例 */
const viewRef = shallowRef<HTMLElement>();
const viewHeight = ref(0);
const getViewHeight = () =>
  viewHeight.value || viewRef.value?.clientHeight || 0;

/** 内容实例 */
const contentRef = shallowRef<HTMLElement>();
const contentHeight = ref(0);
const getContentHeight = () =>
  contentHeight.value || contentRef.value?.clientHeight || 0;

/** 渲染列表 */
const list = ref<any>([]);
const padFront = ref(0);
const padBehind = ref(0);
/** 更新渲染列表 */
const onUpdateRender = (renderData: any[], front: number, behind: number) => {
  list.value = renderData;
  padFront.value = front;
  padBehind.value = behind;
};

/** 虚拟列表实例 */
const virtual = shallowRef<Virtual>();

/** 子元素尺寸变化 */
const onElSizeChange = (value: {
  row: any;
  dom: HTMLElement;
  index: number;
}) => {
  const { row, dom, index } = value;
  virtual.value?.onElSizeChange(row[props.uniqueKey], dom, index);
};

/** 滚动事件 */
const onScroll = (e: UIEvent) => {
  if (!virtual.value) return;
  const target = e.target as HTMLElement;
  emits(
    "scroll",
    virtual.value.onScroll(e.target ? target?.scrollTop || 0 : 0)
  );
};
/** 滚动到最后 */
const scrollToBehind = () => {
  virtual.value?.scrollToBehind();
};

/** 初始化 */
const init = () => {
  virtual.value = new Virtual({
    uniqueKey: props.uniqueKey,
    estimateHeight: props.estimateHeight,
    bufferCount: props.bufferCount,
    onReachBehind: props.onReachBehind,
    onReachFront: props.onReachFront,
    onUpdateRender,
    viewHeight: getViewHeight,
    contentHeight: getContentHeight,
    viewEl: () => viewRef.value,
    contentEl: () => contentRef.value,
  });
};
const push = async (data: any[] = []) => {
  virtual.value?.push(data);
};
const unshift = async (data: any[] = []) => {
  virtual.value?.unshift(data);
};

let observer = new ResizeObserver(() => {
  viewHeight.value = viewRef.value?.clientHeight || 0;
  contentHeight.value = contentRef.value?.clientHeight || 0;
});
onMounted(() => {
  observer.observe(viewRef.value as HTMLElement);
  observer.observe(contentRef.value as HTMLElement);
  init();
});
onUnmounted(() => {
  observer?.disconnect();
});

defineExpose({
  init,
  push,
  unshift,
  scrollToBehind,
});
</script>

<style scoped lang="scss"></style>
