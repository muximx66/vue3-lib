<template>
  <div>
    <el-button @click="addFrontUnread">顶部新增未读</el-button>
    <el-button @click="addBehindUnread">底部新增未读</el-button>
    <div>
      <span>顶部最新:{{ frontUnread }}</span>
      <span>底部最新：{{ behindUnread }}</span>
    </div>
    <!-- <Scroller ref="scroller" @reach-top="onReachTop" @unread-change="onUnreadChange" :data="data" -->
    <ChatScroller ref="scroller" @unread-change="onUnreadChange" :data="data" style="height: 500px; border: 1px solid">
      <template #default="scoped">
        <Item v-bind="scoped" />
      </template>
    </ChatScroller>
    <el-button @click="sendMessage">发送消息</el-button>
  </div>
</template>
<script lang="tsx" setup>
import { shallowRef, onMounted, nextTick } from "vue";
import { getData as postData } from "./mock";
import { Row } from "./type";
import { ChatScroller } from "@/packages/chat-scroller/index";
import Item from './item.vue'

const scroller = shallowRef<InstanceType<typeof ChatScroller>>();


const data = shallowRef<Row[]>([]);
const getData = async (count?: number) => {
  return (await postData(count)).list;
};

const frontUnread = shallowRef(0)
const behindUnread = shallowRef(0)
const onUnreadChange = (front: number, behind: number) => {
  frontUnread.value = front;
  behindUnread.value = behind
}
const addFrontUnread = async () => {
  scroller.value?.addUnread(await onReachTop())
}
const addBehindUnread = async () => {
  scroller.value?.addUnread(await addBehindData())
  await nextTick();
  scroller.value?.updateUnread();
}

const sendMessage = async () => {
  const newData = await getData(1);
  data.value.push(...newData)
  data.value = [...data.value];
  await nextTick();
  scroller.value?.smoothScrollToBottom();
}


const onReachTop = async () => {
  const newData = await getData(20);
  data.value.unshift(...newData);
  data.value = [...data.value];
  await nextTick();
  scroller.value?.repairOffset(newData.map(v => v.id));
  return newData;
};

const addBehindData = async () => {
  const newData = await getData(30);
  data.value.push(...newData)
  data.value = [...data.value];
  await nextTick();
  return newData;
}


onMounted(async () => {
  await addBehindData();
  scroller.value?.scrollToBottom();
});
</script>
<style scoped lang="less"></style>
