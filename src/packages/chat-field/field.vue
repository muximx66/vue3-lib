<template>
  <div class="editor_field">
    <Editor ref="editorR" :style="{
      overflow: ' hidden',
    }" :defaultConfig="config.default" :mode="config.mode" @dragover="$emit('dragover', $event)" @onCreated="onCreated"
      @customPaste="onPaste" @keydown.enter.prevent="onEnter" />
  </div>
</template>
<script setup lang="ts">
import { shallowRef, computed } from "vue";
import { Editor } from "@wangeditor/editor-for-vue";
import { IDomEditor } from "@wangeditor/editor";
import { useConfig } from "./editor";
import { useTexts } from "./helper";
import { insertNode as insertImg } from './modules/img/helper'
import { insertNode as insertFile } from './modules/file/helper'
import { onEnter as onEditorEnter, onPaste, BREAK_MODE } from "./events";
import "@wangeditor/editor/dist/css/style.css";

type Props = {
  breakMode?: BREAK_MODE;
  placeholder?: string;
  maxlength?: number;
  minHeight?: string;
  maxHeight?: string;
};
const props = withDefaults(defineProps<Props>(), {
  breakMode: BREAK_MODE.ENTER,
  placeholder: "请输入",
  maxlength: 500,
  minHeight: '300px',
  maxHeight: '400px',
});

type Emits = {
  (e: "enter", value: KeyboardEvent): void;
  (e: "dragover", value: DragEvent): void;
  (e: "mentionShow", value: DOMRect): void;
  (e: "mentionHide"): void;
  (e: "mentionInput", value: string): void;
  (e: "created", value: IDomEditor): void;
};
const emit = defineEmits<Emits>();


/** 显示艾特弹窗 */
const showMentionModal = () => {
  const range = window.getSelection()?.getRangeAt(0);
  if (!range) return;
  const rect = range.getBoundingClientRect()
  emit("mentionShow", rect);
};
/** 隐藏艾特弹窗 */
const hideMentionModal = () => {
  emit('mentionHide')
};
const onMentionInput = (value: string) => {
  emit("mentionInput", value);
}
/** 配置 */
const config = useConfig(() => editor.value as IDomEditor, {
  placeholder: props.placeholder || "",
  maxLength: props.maxlength,
  EXTEND_CONF: {
    mentionConfig: {
      showModal: showMentionModal,
      hideModal: hideMentionModal,
      onInput: onMentionInput,
    },
  },
});

/** 编辑器实例 */
const editor = shallowRef<IDomEditor>();
/** 编辑器创建完成 */
const onCreated = (e: IDomEditor) => {
  emit("created", e);
  editor.value = e;
};

/** 回车事件 */
const onEnter = (e: KeyboardEvent) => {
  onEditorEnter(e, props.breakMode, editor.value as IDomEditor);
  emit("enter", e);
};

/** 获取发送消息 */
const getTexts = () => {
  const texts = useTexts(editor.value as IDomEditor);
  return texts;
};

defineExpose({
  /** 获取发送文本 */
  getTexts,
  /** 插入图片 */
  insertImg: (file: File) => insertImg(file, editor.value as IDomEditor),
  /** 插入文件 */
  insertFile: (file: File) => insertFile(file, editor.value as IDomEditor),
});
</script>
<style scoped lang="less">
.editor_field {
  :deep(.w-e-text-container) {
    padding-bottom: 30px;
    font-size: 16px;
    color: #101010;

    // 计数
    .w-e-max-length-info {
      right: 0px;
      bottom: 10px;
      font-size: 12px;
      color: var(--el-color-info);
    }

    // 滚动
    .w-e-scroll {
      min-height: v-bind(minHeight);
      max-height: v-bind(maxHeight);
    }

    // 输入框
    [contenteditable="true"] {
      min-height: v-bind(minHeight);
      padding: 0.3rem;
    }

    // placeholder
    [data-slate-editor] p {
      margin: 0;
    }

    .w-e-text-placeholder {
      top: 0.3rem;
      left: 0.3rem;
      font-style: normal;
      font-size: 16px;
      color: #bcbcbc;
    }
  }
}
</style>
