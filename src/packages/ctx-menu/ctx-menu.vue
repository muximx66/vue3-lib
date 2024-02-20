<template>
  <CtxMenuPanel :data="data" v-model:visible="visible">
    <template #default="scoped">
      <el-card
        class="ctx_menu"
        :style="{
          height: height + 'px',
        }"
      >
        <div class="menu_body">
          <div
            class="body_item"
            v-for="item in menus"
            :key="item.value"
            @click="execute(item, scoped)"
          >
            {{ item.label }}
          </div>
        </div>
      </el-card>
    </template>
  </CtxMenuPanel>
</template>
<script lang="tsx" setup>
import { ref } from "vue";
import CtxMenuPanel from "./ctx-menu-panel.vue";
type MenuItem = {
  label: string;
  value: string;
  exec: any;
};
type Props = {
  data: Map<string | number, any>;
  menus: MenuItem[];
};
type Emits = {
  (e: "takeback", value: any): void;
};

const props = defineProps<Props>();

const emit = defineEmits<Emits>();

/** 显示 */
const visible = ref(false);

/** 菜单高度 */
const height = props.menus.length * 40;

/** 执行 */
const execute = (config: any, data: any) => {
  config.exec(data.data);
  visible.value = false;
};
</script>
<style scoped lang="less">
.card_body {
  :deep(.el-card__body) {
    padding: 0;
    height: 100%;
  }
}
.ctx_menu {
  .card_body();
  z-index: 1;

  .menu_body {
    display: grid;
    grid-template-rows: repeat(2, 1fr);
    height: 100%;
    .body_item {
      display: flex;
      align-items: center;
      padding: 0 20px;
      height: 40px;
      color: #222;
      font-size: 14px;
      cursor: pointer;
      &:hover {
        background: #f5f5f5;
      }
    }
  }
}
</style>
