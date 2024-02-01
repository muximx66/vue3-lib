<template>
  <div ref="itemRef" :style="styles">
    <slot :row="row" :index="index" :updateSize="updateSize"></slot>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
type Props = {
  row: any;
  index: number;
  estimateHeight: number;
  autoUpdateSize: boolean;
};
const props = defineProps<Props>();
type Emits = {
  /** 更新尺寸信息 */
  (
    e: "update:size",
    value: { row: any; dom: HTMLElement; index: number }
  ): void;
};
const emits = defineEmits<Emits>();
const itemRef = ref<HTMLElement>();
const styles = computed(() => ({
  minHeight: `${props.row.size || props.estimateHeight}px`,
}));

const updateSize = () => {
  const { row, index } = props;
  const dom = itemRef.value as HTMLElement;
  emits("update:size", { row, dom, index });
};
if (props.autoUpdateSize) onMounted(updateSize);
</script>
<style scoped></style>
