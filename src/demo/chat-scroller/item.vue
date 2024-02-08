<template>
  <div style="padding: 20px 30px; border-bottom: 1px solid #eee">
    <span v-if="data.msgType === 'M'">{{ (data as Row).content }}</span>
    <div v-if="data.msgType === 'T'" style="color:#666;text-align: center;">—— {{ data.tip }} ——</div>
    <template v-if="data.msgType === 'I'">
      <img v-show="imgSrc" :src="imgSrc" style=" max-width:180px;max-height:200px" />
      <div v-show="!imgSrc" style="width:150px;height:180px;background:#eee;"></div>
    </template>
  </div>
</template>
<script setup lang="tsx">
import { shallowRef, nextTick } from 'vue'
import type { Row } from './type'
import type { AddViewUpdateEvent } from '@/packages/chat-scroller/type'

type Props = {
  data: Row;
  onViewUpdate: AddViewUpdateEvent;
  updateSize: () => void;
}
const props = defineProps<Props>()

props.onViewUpdate(() => {
  const { msgType, imgUrl } = props.data
  if (msgType !== 'I' || imgSrc.value) return;
  const img = new Image()
  img.src = imgUrl as string;
  img.onload = async (e: Event) => {
    console.log(e)
    imgSrc.value = img.src
    await nextTick();
    props.updateSize()
  }
})

const imgSrc = shallowRef('')

</script>
<style scoped lang="less"></style>