<template>
  <div>
    <div v-if="row.content">
      {{ row.content }}
    </div>
    <div v-if="row.img" style="max-width: 300px">
      <img @load="onImgLoaded" :src="row.img" style="width: 100%" />
    </div>
  </div>
</template>
<script setup lang="ts">
type Props = {
  row: any;
  index: number;
  updateSize: () => void;
};
const props = defineProps<Props>();
const onImgLoaded = () => {
  props.updateSize();
};
</script>
<style scoped></style>
