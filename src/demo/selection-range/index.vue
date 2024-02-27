<template>
  <div ref="div">
    威风威风fwejfklwejfljef;jfkwj;fllwj
  </div>
</template>
<script setup lang="tsx">
import { ref, onMounted } from 'vue'
import { useSelection } from '@/packages/selection-range'
const div = ref<HTMLDivElement>()
onMounted(() => {
  console.log(div.value?.firstChild)
  useSelection(div.value as HTMLElement, 0, 10);
})
</script>
<style scoped lang="less"></style>