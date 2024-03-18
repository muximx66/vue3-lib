<template>
  <div ref="div" class="selection_range">
    威风威风fwejfklwejfljef;jfkwj;fllwj
    <img :src="require('@/assets/logo.png')" />
  </div>
  <el-input type="textarea" />
  <el-button @click="select">选中</el-button>
  <el-button @click.prevent="getSelection">获取选中</el-button>
  <el-button @click.prevent="copy">复制选中</el-button>
</template>
<script setup lang="tsx">
import { ref } from "vue";
const div = ref<HTMLDivElement>();
const select = () => {
  const selection = document.getSelection();
  if (!selection) return;
  selection.removeAllRanges();
  const range = document.createRange();
  range.selectNodeContents(div.value as any);
  selection.addRange(range);
};

const getSelection = () => {
  const selection = window.getSelection();
  const range = selection?.getRangeAt(0);
  console.log(range);
};

const copy = () => {
  const selection = document.getSelection();
  if (!selection) return;
  window.navigator.clipboard.writeText(selection as any);
};
</script>
<style scoped lang="less">
.selection_range {
  border: 1px solid #999;
  width: 500px;
  height: 500px;
  word-break: break-all;
}
</style>
