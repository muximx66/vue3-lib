<template>
  <div ref="mentionRef" class="mention" :style="{
    bottom,
    left
  }">
    <input v-model.trim="queryText" @change="onChange" />
    <div v-for="(item, index) in list" :key="index" @click="insert(item)">{{ item.name }}</div>
  </div>
</template>
<script setup lang="tsx">
import { ref, computed, watch } from 'vue'
import { ChatMention } from '@/packages/chat/elements'

type Props = {
  rect: DOMRect;
  keyword: string;
  editor: any;
}
const props = defineProps<Props>();

const mentionRef = ref<any>()

const bottom = computed(() => {
  console.log(props.rect)
  return (window.innerHeight - props?.rect?.top || 0) + 'px';
})
const left = computed(() => {
  return (props.rect.left || 0) + 'px'
})

const insert = (item: any) => {
  ChatMention.insertNode(item.id, item.name, props.editor)
}

const queryText = ref('')
watch(() => props.keyword, (val) => {
  onChange();
});
const onChange = () => {
  const text = queryText.value;
  const keyword = props.keyword;
  if (!text && !keyword) {
    list.value = data;
    return
  }
  const reg = new RegExp(text, 'g');
  const reg2 = new RegExp(props.keyword || '', 'g')
  list.value = data.filter(item => {
    return reg.test(item.name) && !reg2.test(item.name)
  })
  console.log(list.value)
}
const data = [
  {
    name: '123211',
    id: '1',
  },
  {
    name: '3333',
    id: '2',
  },
  {
    name: '123sdfsd211',
    id: '3',
  },
  {
    name: 'wfwefwe',
    id: '4',
  }

]
const list = ref<any[]>(data)
</script>
<style scoped lang="less">
.mention {
  position: fixed;
}
</style>