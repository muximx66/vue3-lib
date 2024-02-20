<template>
  <Transition name="fade">
    <div class="ctx_menu_panel" ref="body" v-if="bodyVisible">
      <slot :data="data" />
    </div>
  </Transition>
</template>
<script lang="tsx" setup>
import { shallowRef, onMounted, onBeforeUnmount, nextTick, watch } from "vue";
import { TRIGGER_ATTR } from "./enum";

type Props = {
  visible?: boolean;
  data: Map<string | number, any>;
};
type Emits = {
  (e: "update:visible", value: boolean): void;
};

const props = withDefaults(defineProps<Props>(), {
  visible: false,
});

const emit = defineEmits<Emits>();

/** 菜单元素 */
const body = shallowRef<HTMLElement>();

/** 菜单显示 */
const bodyVisible = shallowRef(false);
/** 监听显示 */
watch(
  () => props.visible,
  (val) => {
    if (val === bodyVisible.value) return;
    bodyVisible.value = val;
    if (!val) stopListenDocClick();
  }
);
watch(bodyVisible, (val) => {
  if (val === props.visible) return;
  emit("update:visible", val);
});

/** 当前数据 */
const data = shallowRef<any>();

/** 右键菜单事件 */
const onDocContextMenu = async (e: MouseEvent) => {
  const { target } = e;
  if (!target) return;
  const el = (target as HTMLElement).closest(
    `[${TRIGGER_ATTR}]`
  ) as HTMLElement;
  if (!el) return;
  e.preventDefault();
  const id = getAttribute(el);
  const config = props.data.get(id);
  if (!config) return;
  data.value = config;
  bodyVisible.value = false;
  await nextTick();
  bodyVisible.value = true;
  await nextTick();
  updatePosition(e);
  listenDocClick();
};

/** 更新位置 */
const updatePosition = (e: MouseEvent) => {
  if (!body.value) return;
  const { clientX, clientY } = e;
  const { innerWidth, innerHeight } = window;
  const { offsetWidth, offsetHeight } = body.value;
  // 判断象限
  const isTop = clientY > innerHeight / 2;
  const isLeft = clientX > innerWidth / 2;
  // 计算位置
  const top = isTop ? clientY - offsetHeight : clientY;
  const left = isLeft ? clientX - offsetWidth : clientX;
  body.value.style.top = `${top}px`;
  body.value.style.left = `${left}px`;
  console.dir(body.value);
};

/** 获取属性 */
const getAttribute = (el: HTMLElement) => {
  return el?.getAttribute(TRIGGER_ATTR) || el?.dataset[TRIGGER_ATTR] || "";
};

/** 监听点击事件 */
const onDocClick = (e: MouseEvent) => {
  const { target } = e;
  if (body.value?.contains(target as Node)) return;
  bodyVisible.value = false;
  stopListenDocClick();
};

const listenDocContextMenu = () => {
  document.addEventListener("contextmenu", onDocContextMenu);
};
const listenDocClick = () => {
  document.addEventListener("click", onDocClick);
};
const stopListenDocContextMenu = () => {
  document.removeEventListener("contextmenu", onDocClick);
};
const stopListenDocClick = () => {
  document.removeEventListener("click", onDocClick);
};

onMounted(() => {
  listenDocContextMenu();
});
onBeforeUnmount(() => {
  stopListenDocContextMenu();
  stopListenDocClick();
});
</script>
<style scoped lang="less">
.fade-enter-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.ctx_menu_panel {
  position: fixed;
}
</style>
