<template>
  <div class="chat">
    <div contenteditable="true" @dragover.prevent @drop.prevent="onDrop" @paste="change"
      style="width: 300px; height: 300px; border: 1px solid"></div>
    <div class="chat_toolbar">
      <Toolbar :editor="editor" />
    </div>
    <div class="chat_field">
      <Field @created="onCreated" @mention-show="onMention" @mention-input="onMentionInput"
        @mention-hide="onMentionHide" />
    </div>
    <Mention :editor="editor" v-if="mentionShow" :rect="mentionRect" :keyword="mentionKeyword" />
  </div>
</template>
<script setup lang="ts">
import { shallowRef, ref } from "vue";
import Toolbar from "./toolbar.vue";
import Field from "@/packages/chat/field.vue";
import Mention from './mention.vue'

const onDrop = (e: any) => {
  console.log(e);
};

const editor = shallowRef<any>();
const onCreated = (e: any) => {
  editor.value = e;
};

const mentionShow = ref(false)
const mentionRect = ref<DOMRect>({} as DOMRect)
const mentionKeyword = ref('')
const onMention = (rect: DOMRect) => {
  mentionRect.value = rect;
  mentionShow.value = true;
}
const onMentionHide = () => {
  mentionShow.value = false;
}
const onMentionInput = (value: string) => {
  mentionKeyword.value = value;
}

const change = (e: ClipboardEvent) => {
  if (e.clipboardData && e.clipboardData.items) {
    let items = e.clipboardData.items || [];
    let file = null;
    if (items && items.length) {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.indexOf("image") !== -1) {
          file = item.getAsFile();
          console.log(file);
        } else {
          const str = item.getAsString((e) => {
            console.log(e);
          });
          console.log(str);
        }
      }
    }
  }
};
</script>
<style scoped>
.chat {
  margin: 0 auto;
  margin-top: 200px;
  width: 600px;

  .chat_field {
    overflow: hidden;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 10px;
  }
}
</style>
