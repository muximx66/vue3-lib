<template>
  <div class="item" :class="{
    'item--self': row.owner === 'M',
  }">
    <div class="item_tip" v-if="row.msgType === 'T'"></div>
    <div class="item_date" v-if="row.date">{{ row.date }}</div>
    <div class="item_head" v-if="row.msgType !== 'T'">
      <div class="head_avatar"></div>
      <div class="head_nickname">{{ row.nickname }}</div>
    </div>
    <div class="item_content" v-if="row.msgType === 'M'">
      <div class="content_text">
        {{ row.content }}
      </div>
    </div>
    <div class="item_img" v-if="row.msgType === 'I'">
      <img :src="row.imgUrl" @load="onImgLoaded" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted } from "vue";
import type { Row } from "./type";
type Props = {
  row: Row;
  updateSize: () => void;
};
const props = defineProps<Props>();

const onImgLoaded = () => {
  props.updateSize();
};
onMounted(() => {
  if (props.row.msgType === "I") return;
  props.updateSize();
});
</script>
<style scoped lang="less">
.item {
  padding: 20px 30px 0;

  .item_tip {
    font-size: 14px;
    color: #999999;
    text-align: center;
  }

  .item_date {
    margin-bottom: 10px;
    font-size: 15px;
    color: #999999;
    text-align: center;
  }

  .item_head {
    display: flex;
    align-items: center;

    .head_avatar {
      overflow: hidden;
      margin-right: 10px;
      width: 36px;
      height: 36px;
      background: #eee;
      border-radius: 50%;
    }

    .head_nickname {
      font-size: 14px;
      color: #555555;
    }
  }

  .item_content {
    display: flex;
    margin: 0 46px;
    position: relative;

    .content_text {
      padding: 10px 14px;
      background: #ffffff;
      border-radius: 6px;
      font-size: 15px;
      white-space: pre-wrap;
      word-break: break-all;
      line-height: 24px;
      box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.1);
    }
  }

  .item_img {
    display: flex;
    margin: 0 46px;

    img {
      max-width: 300px;
      border-radius: 6px;
    }
  }

  &--self {
    .item_head {
      flex-direction: row-reverse;

      .head_avatar {
        margin-right: 0;
        margin-left: 10px;
      }
    }

    .item_content {
      justify-content: flex-end;

      .content_text {
        box-shadow: none;
        color: #ffffff;
        background: #1995f2;
      }
    }

    .item_img {
      justify-content: flex-end;
    }
  }
}</style>
