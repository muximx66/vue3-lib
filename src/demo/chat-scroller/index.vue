<template>
  <div>
    <Scroller ref="scroller" @reach-top="onReachTop" :data="data" style="height: 500px; border: 1px solid">
      <template #default="scoped">
        <Item v-bind="scoped" />
      </template>
    </Scroller>
  </div>
</template>
<script lang="tsx" setup>
import { shallowRef, onMounted, nextTick } from "vue";
import { getData as postData } from "./mock";
import { Row } from "./type";
import Scroller from "@/packages/chat-scroller/index.vue";
import Item from './item.vue'

const data = shallowRef<Row[]>([]);
const getData = async (count?: number) => {
  return (await postData(count)).list;
};

const scroller = shallowRef<InstanceType<typeof Scroller>>();

const onReachTop = async () => {
  const newData = await getData(20);
  data.value.unshift(...newData);
  data.value = [...data.value];
  await nextTick();
  scroller.value?.repairOffset(newData.map(v => v.id));

};


onMounted(async () => {
  data.value = await getData(30);
  await nextTick();
  scroller.value?.scrollToBottom();
});
</script>
<style scoped lang="less"></style>
