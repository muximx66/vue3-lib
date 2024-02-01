<template>
  <el-popover placement="top-start" trigger="click" width="300">
    <div class="emotion">
      <div class="emotion_item" v-for="(item, index) in emotions" :key="index" @click.prevent="$emit('change', item)">{{
        item }}</div>
    </div>
    <template #reference>
      <slot />
    </template>
  </el-popover>
</template>
<script setup lang="tsx">
import emotions from '@/packages/chat/emotion'

type Emits = {
  (e: 'change', value: string): void
}
defineEmits<Emits>();
</script>
<style scoped lang="less">
.emotion {
  display: grid;
  grid-template-columns: repeat(8, 1fr);

  .emotion_item {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px 0px;
    font-size: 14px;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
      background-color: #f5f5f5;
    }
  }
}
</style>