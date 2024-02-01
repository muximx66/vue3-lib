<template>
  <div>
    <div style="padding: 10px; border: 1px solid; width: 500px; height: 300px">
      <div ref="editorRef" style="height: 100%"></div>
    </div>

    <button @click="change">change</button>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref, shallowRef } from "vue";
import { type Editor } from "../../utils/chatEditor/type/editor";
import { createEditor } from "../../utils/chatEditor/editor";
const editorRef = ref<any>();

const change = () => { };

const editor = shallowRef<Editor>();
onMounted(() => {
  editor.value = createEditor(editorRef.value);
});
</script>
<style>
.empty-element {
  line-height: 50px;
  font-size: 16px;
}
</style>
