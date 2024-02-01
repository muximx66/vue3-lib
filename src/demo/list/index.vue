<template>
  <div>
    <div>page,duration,value</div>
    <input v-model="value1" />
    <input v-model="value2" />
    <input v-model="value3" />
    <button @click="getData">请求</button>
  </div>
  <div style="overflow: auto; max-height: 300px; border: 1px solid">
    <div>
      <div v-for="item in list" :key="item" style="border: 1px solid pink; padding: 10px">
        {{ item }}
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import {
  ListHttpQueue,
  type AddExpire,
  type Task,
  type Result,
  type Queue,
} from "@/utils/listHttpQueue";

const value1 = ref("");
const value2 = ref("");
const value3 = ref("");

const list = ref<any[]>([]);
const getData = () => {
  const [page1, duration1, val1] = value1.value.split(",");
  const [page2, duration2, val2] = value2.value.split(",");
  const [page3, duration3, val3] = value3.value.split(",");
  queue.add(
    {
      page: page1,
      duration: duration1,
      value: val1,
    },
    () => post(val1, Number(duration1))
  );
  queue.add(
    {
      page: page2,
      duration: duration2,
      value: val2,
    },
    () => post(val2, Number(duration2))
  );
  queue.add(
    {
      page: page3,
      duration: duration3,
      value: val3,
    },
    () => post(val3, Number(duration3))
  );
};
const after = (res: Result[]) => {
  res.forEach((v) => {
    if (v.params.page == 1) {
      list.value.length = 0;
    }
    list.value.push(v.res);
  });
};
const post = (value: any, duration: number = 1000) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(value);
    }, duration);
  });
};
const filter = (task: Task, queue: Queue, addExpired: AddExpire) => {
  if (task.params.page === 1) {
    queue.forEach((v: any) => addExpired(v.id));
  }
};

const queue = new ListHttpQueue(post, filter, after);
</script>
<style scoped></style>
