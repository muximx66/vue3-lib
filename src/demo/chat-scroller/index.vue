<template>
  <div>
    <Scroller
      @reach-top="onReachTop"
      @reach-bottom="onReachBottom"
      :data="data"
      style="height: 500px; border: 1px solid"
    >
      <template #default="{ data }">
        <div style="padding: 20px 30px; border-bottom: 1px solid #eee">
          {{ (data as Row).content }}
        </div>
      </template>
    </Scroller>
  </div>
</template>
<script lang="tsx" setup>
import { shallowRef, onMounted } from "vue";
import { getData as postData } from "./mock";
import { Row } from "./type";
import Scroller from "@/packages/chat-scroller/index.vue";

const data = shallowRef<Row[]>([]);
const getData = async (count?: number) => {
  return (await postData(count)).list;
};

const onReachTop = async () => {
  data.value.unshift(...(await getData(20)));
  data.value = [...data.value];
};
const onReachBottom = async () => {
  const newData = [...data.value];
  newData.push(...(await getData(20)));
  data.value = newData;
};

onMounted(async () => {
  data.value = await getData(30);
});
</script>
<style scoped lang="less"></style>
