<template>
  <div ref="mention" class="mention" :style="styles">
    <div>12312312</div>
    <div>12312312</div>
    <div>12312312</div>
    <div>12312312</div>
    <div>12312312</div>
  </div>
</template>
<script setup lang="tsx">
import { computed, shallowRef } from 'vue';
type Props = {
  rect?: DOMRect;
}
const props = defineProps<Props>();

const mention = shallowRef<HTMLDivElement>();

const styles = computed(() => {
  const rect = props?.rect;
  const top = rect?.top || 0
  const left = rect?.left || 0;
  const clientHeight = window.innerHeight || document.body.offsetHeight || 0;
  return {
    left: left + 'px',
    bottom: clientHeight - top + 'px'
  }
})

</script>
<style scoped lang="less">
.mention {
  position: fixed;
}
</style>