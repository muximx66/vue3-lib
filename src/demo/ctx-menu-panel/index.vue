<template>
  <div :[TRIGGER_ATTR]="item" v-for="(item, index) in data" :key="index">
    {{ item }}
  </div>
  <CtxMenuPanel :data="menuData">
    <template #default>
      <div>泥嚎</div>
      <div>泥嚎</div>
      <div>泥嚎</div>
      <div>泥嚎</div>
      <div>泥嚎</div>
      <div>泥嚎</div>
      <div>泥嚎</div>
      <div>泥嚎</div>
    </template>
  </CtxMenuPanel>
</template>
<script setup lang="tsx">
import { ref } from "vue";
import { CtxMenuPanel, TRIGGER_ATTR } from "@/packages/ctx-menu";

const menuData = ref<Map<string, any>>(new Map());

const data = ["12312", "fewfwefwef", "fwefwe", "wfr23fwe"];

data.forEach((v) => {
  menuData.value.set(v, v);
});
</script>
<style scoped lang="less"></style>
