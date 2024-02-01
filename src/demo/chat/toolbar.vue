<template>
  <div class="toolbar">
    <div class="toolbar_item">
      <Emotion @change="insertEmotion">
        <el-button>表情</el-button>
      </Emotion>
    </div>
    <div class="toolbar_item">
      <button>图片</button>
      <input type="file" multiple @change="onImgChange" />
    </div>
    <div class="toolbar_item">
      <button>文件</button>
      <input type="file" @change="onFileChange" />
    </div>
    <div class="toolbar_item">
      <button @mousedown.prevent @keydown.prevent @click="insertMention">
        艾特
      </button>
    </div>
    <div class="toolbar_item">
      <button @mousedown.prevent @keydown.prevent @click="send">发送</button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ChatImg, ChatFile, ChatMention } from "@/packages/chat/elements";
import emotions from "@/packages/chat/emotion";
import Emotion from './emotion.vue'

const props = defineProps<{
  editor: any;
}>();

const send = () => {
  return;
};

const insertMention = () => {
  const e = props.editor;
  e.insertNode({
    type: ChatMention.type,
    id: String(Date.now()),
    name: "张三",
    children: [{ text: "" }],
  } as any);
  e.move(1);
};

const insertEmotion = (value: string) => {
  value = value || emotions[Math.floor(Math.random() * emotions.length)]
  props.editor.insertNode({
    text: value,
  });
};

const onImgChange = (e: any) => {
  const files = [...e.target.files];
  files.forEach((file: File) => {
    ChatImg.insertNode(file, props.editor);
  });
};

const onFileChange = (e: any) => {
  const file = e.target.files[0];
  props.editor.insertNode({
    type: ChatFile.type,
    url: URL.createObjectURL(file),
    name: file.name,
    id: String(Date.now()),
    children: [{ text: "" }],
  } as any);
};
</script>
<style scoped>
.toolbar {
  margin-bottom: 10px;
  display: flex;

  .toolbar_item {
    position: relative;
    margin-right: 20px;

    button {
      width: 100px;
      height: 30px;
    }

    input {
      position: absolute;
      top: 0;
      left: 0;
      opacity: 0;
      width: 100px;
      height: 30px;
    }
  }
}</style>
