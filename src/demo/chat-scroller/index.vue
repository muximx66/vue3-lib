<template>
  <div>
    <el-button @click="addFrontUnread">顶部新增未读</el-button>
    <el-button @click="addBehindUnread">底部新增未读</el-button>
    <div>
      <span>顶部最新:{{ frontUnread }}</span>
      <span>底部最新：{{ behindUnread }}</span>
    </div>
    <ChatScroller ref="scroller" @reach-top="onReachTop" @unread-change="onUnreadChange" :data="data"
      style="height: 500px; border: 1px solid">
      <template #default="scoped">
        <Item v-bind="scoped" />
      </template>
    </ChatScroller>
    <div class="field">
      <div class="toolbar">
        <div class="toolbar_item">
          <el-button type="primary" size="small" class="item_btn">
            <input type="file" @change="onImgChange" />
            图片
          </el-button>
        </div>
        <div class="toolbar_item">
          <el-button type="primary" size="small" class="item_btn">
            <input type="file" @change="onFileChange" />
            文件
          </el-button>
        </div>
        <div class="toolbar_item">
          <el-button type="primary" size="small" class="item_btn" @click="getTexts">
            获取文本
          </el-button>
        </div>
      </div>
      <ChatField ref="field" @mention-hide="mentionVisible = false" @mention-show="onMentionShow" min-height="150px"
        max-height="150px" />
      <el-button @click="sendMessage" style="margin-right: 20px">发送消息</el-button>
      <el-button @click="sendImg">发送图片</el-button>
    </div>
    <Mention v-if="mentionVisible" :rect="mentionRect" />
  </div>
</template>
<script lang="tsx" setup>
import { shallowRef, onMounted, nextTick } from "vue";
import { getData as postData, getImg as mockImg } from "./mock";
import { Row } from "./type";
import { ChatScroller } from "@/packages/chat-scroller/index";
import ChatField from "@/packages/chat-field/index";
import Item from "./item.vue";
import Mention from './mention.vue'

const scroller = shallowRef<InstanceType<typeof ChatScroller>>();

const mentionVisible = shallowRef(false)
const mentionRect = shallowRef<DOMRect>();
const onMentionShow = (rect: DOMRect) => {
  mentionRect.value = rect;
  mentionVisible.value = true;
}

const data = shallowRef<Row[]>([]);
const getData = async (count?: number) => {
  return (await postData(count)).list;
};

const field = shallowRef<InstanceType<typeof ChatField>>();
const onImgChange = (e: any) => {
  const file = e.target.files[0] as File;
  field.value?.insertImg(file);
};
const onFileChange = (e: any) => {
  const file = e.target.files[0] as File;
  field.value?.insertFile(file);
};
const getTexts = () => {
  const texts = field.value?.getTexts();
  console.log(texts);
};

const frontUnread = shallowRef(0);
const behindUnread = shallowRef(0);
const onUnreadChange = (front: number, behind: number) => {
  frontUnread.value = front;
  behindUnread.value = behind;
};
const addFrontUnread = async () => {
  scroller.value?.addUnread(await onReachTop());
};
const addBehindUnread = async () => {
  scroller.value?.addUnread(await addBehindData());
  await nextTick();
  scroller.value?.updateUnread();
};

const sendMessage = async () => {
  const newData = await getData(1);
  data.value.push(...newData);
  data.value = [...data.value];
  await nextTick();
  scroller.value?.smoothScrollToBottom();
};

const sendImg = async () => {
  const imgData = mockImg(1);
  const newData = [imgData];
  data.value.push(...newData);
  data.value = [...data.value];
  await nextTick();
  scroller.value?.smoothScrollToBottom();
};

const onReachTop = async () => {
  const newData = await getData(20);
  data.value.unshift(...newData);
  data.value = [...data.value];
  await nextTick();
  scroller.value?.repairOffset(newData);
  return newData;
};

const addBehindData = async () => {
  const newData = await getData(30);
  data.value.push(...newData);
  data.value = [...data.value];
  await nextTick();
  return newData;
};

onMounted(async () => {
  await addBehindData();
  scroller.value?.scrollToBottom();
});
</script>
<style scoped lang="less">
.field {
  padding: 10px;
  border: 1px solid;
  border-top: none;

  .toolbar {
    display: flex;
    margin-top: 20px;

    .toolbar_item {
      margin-right: 20px;

      .item_btn {
        position: relative;

        input {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          opacity: 0;
        }
      }
    }
  }
}
</style>
