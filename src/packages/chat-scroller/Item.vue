<template>
  <div ref="itemRef">
    <slot :update-size="updateSize" :data="data" :on-view-update="onViewUpdate"></slot>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { AddViewUpdateEvent } from './type'
type Props = {
  data?: any;
  autoUpdateSize: boolean;
  onViewUpdate: AddViewUpdateEvent
};
const props = defineProps<Props>();
type Emits = {
  /** 更新尺寸信息 */
  (e: "updateSize", value: HTMLElement): void;
};
const emit = defineEmits<Emits>();
const itemRef = ref<HTMLElement>();

const updateSize = () => {
  const dom = itemRef.value as HTMLElement;
  emit("updateSize", dom);
};
if (props.autoUpdateSize) onMounted(updateSize);
</script>
<style scoped></style>
