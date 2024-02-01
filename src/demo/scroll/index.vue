<template>
  <div class="chat">
    <Scroller ref="scrollerRef" :height="700" :estimate-height="50" :auto-update-size="false"
      :on-reach-front="onReachTop">
      <template #default="scoped">
        <Item v-bind="scoped" />
      </template>
    </Scroller>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { getHistory, getData } from "./mock";
import Scroller from "@/packages/scroller/index.vue";
import Item from "./Item.vue";

const scrollerRef = ref<InstanceType<typeof Scroller>>();

const onReachTop = () => {
  unshiftHistory();
};
const unshiftHistory = async () => {
  scrollerRef.value?.unshift((await getHistoryData()).list);
};
const pushNewData = async () => {
  scrollerRef.value?.push((await getNewData()).list);
};
let timer: any = null;
const keepAliveGetNewData = () => {
  timer = setInterval(pushNewData, 2000);
};

const getHistoryData = async () => {
  return await getHistory();
};
const getNewData = async () => {
  return await getData();
};

onMounted(async () => {
  pushNewData();
});
onBeforeUnmount(() => {
  clearInterval(timer);
});
</script>
<style scoped lang="less">
.chat {
  width: 500px;
  background: rgb(246, 246, 246);
  box-shadow: 0 0 10px #ccc;
}
</style>
