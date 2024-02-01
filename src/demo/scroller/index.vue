<template>
  <Scroller :data="list" :height="500" ref="scroller" :auto-update-size="false">
    <template #default="scoped">
      <Item v-bind="scoped" />
    </template>
  </Scroller>
  <div><input type="file" @change="fileChange" /></div>
  <button @click="sendMul">发送多条</button>
</template>
<script setup lang="ts">
import { ref, onMounted, nextTick } from "vue";
import Scroller from "@/packages/scroller/index.vue";
import Item from "./Item.vue";

const scroller = ref();
onMounted(() => {
  scroller.value.init();
  console.log(list);
});
const fileChange = (e: any) => {
  const file = e.target.files[0];
  scroller.value?.push([
    {
      id: new Date().getTime(),
      img: URL.createObjectURL(file),
    },
  ]);
};

const sendMul = async () => {
  scroller.value?.push(list);
  await nextTick();
  scroller.value?.scrollToBehind();
};

const imgs = [
  "https://img1.baidu.com/it/u=4270144465,1604793144&fm=253&app=120&size=w931&n=0&f=JPEG&fmt=auto?sec=1704387600&t=251be30427ffc98fcd1e6f61c9c6ff20",
  "https://img0.baidu.com/it/u=1505576873,3746429877&fm=253&app=120&size=w931&n=0&f=JPEG&fmt=auto?sec=1704387600&t=b57d4dd2b30eed18cd116acffdb026b3",
  "https://img1.baidu.com/it/u=2790304584,1258411054&fm=253&fmt=auto&app=120&f=JPEG?w=1280&h=800",
  "https://img1.baidu.com/it/u=194391385,3764499482&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=281",
];
const list = Array.from({ length: 100 })
  .fill("", 0, 1000)
  .map((_, index) => ({
    id: index,
    img: imgs[index % 4],
    content: `第${index}行附件为克服了就附件我看了就行附件为克服了就附件我看了就行附件为克服了就附件我看了就行附件为克服了就附件我看了就行附件为克服了就附件我看了就行附件为克服了就附件我看了就行附件为克服了就附件我看了就行附件为克服了就附件我看了就`,
  }));
</script>
