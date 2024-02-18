<template>
  <div ref="itemRef" v-bind:[ATTRS.ITEM_UNIQUE]="unique">
    <slot :update-size="updateSize" :data="data" :index="index" :on-view-update="onViewUpdate"></slot>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ATTRS } from './enum'
import type { AddViewUpdateEvent } from './type'
type Props = {
  index: string;
  data?: any;
  unique: string;
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
