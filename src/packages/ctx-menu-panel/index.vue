<template>
  <Transition name="fade">
    <div class="z_ctx_menu_panel_body" v-if="bodyVisible" ref="body">
      <slot />
    </div>
  </Transition>
</template>
<script setup lang="tsx">
import { ref, watch, nextTick, shallowRef, onMounted, onBeforeUnmount } from 'vue'
import { triggerAttr } from './index'

type Props = {
  visible?: boolean;
  data: Map<string, any>;
}
type Emits = {
  (e: 'update:visible', value: boolean): void
}

const props = withDefaults(defineProps<Props>(), {
  visible: false
});
const emit = defineEmits<Emits>();

/** 菜单容器 */
const body = ref<HTMLElement>();
/** 显示菜单 */
const bodyVisible = ref(props.visible)
/** 监听显示 */
watch(() => props.visible, (val) => {
  if (val === bodyVisible.value) return;
  bodyVisible.value = val;
  if (!val) stopListenDocMousedown();
});
watch(bodyVisible, (val) => {
  if (val === props.visible) return;
  emit('update:visible', val)
})

const data = shallowRef<any>()

/** 右击事件 */
const onDocContextmenu = async (e: MouseEvent) => {
  const target = e.target
  if (!target) return;
  const trigger = getTrigger(target as HTMLElement);
  if (!trigger) return;
  const id = getAttribute(trigger);
  if (!props.data.has(id)) return;
  e.preventDefault();
  data.value = props.data.get(id);
  bodyVisible.value = false;
  await nextTick();
  bodyVisible.value = true;
  await nextTick();
  updatePosition(e);
  listenDocMousedown();
}

/** 更新位置 */
const updatePosition = (e: MouseEvent) => {
  if (!body.value) return
  const { clientX, clientY } = e
  const { innerWidth, innerHeight } = window;
  const { offsetWidth, offsetHeight } = body.value
  // 判断象限
  const isTop = clientY > innerHeight / 2
  const isLeft = clientX > innerWidth / 2
  // 计算位置
  const top = isTop ? clientY - offsetHeight : clientY
  const left = isLeft ? clientX - offsetWidth : clientX
  body.value.style.top = `${top}px`;
  body.value.style.left = `${left}px`;
}

/** 获取id */
const getAttribute = (el: HTMLElement) => {
  return el.getAttribute(triggerAttr) || el.dataset[triggerAttr] || '';
}

/** 获取触发元素 */
const getTrigger = (el: HTMLElement) => {
  return el.closest(`[${triggerAttr}]`) as HTMLElement
}

/** 监听点击事件 */
const onDocMousedown = (e: MouseEvent) => {
  const { target } = e;
  if (!target || !body.value?.contains(target as HTMLElement)) {
    bodyVisible.value = false;
    stopListenDocMousedown();
  }
}

const listenDocContextmenu = () => {
  document.addEventListener('contextmenu', onDocContextmenu);
}
const stopListenDocContextmenu = () => {
  document.removeEventListener('contextmenu', onDocContextmenu);
}
const listenDocMousedown = () => {
  document.addEventListener('mousedown', onDocMousedown);
}
const stopListenDocMousedown = () => {
  document.removeEventListener('mousedown', onDocMousedown);
}

onMounted(() => {
  listenDocContextmenu();
})

onBeforeUnmount(() => {
  stopListenDocMousedown();
  stopListenDocContextmenu();
})
</script>
<style scoped lang="less">
.fade-enter-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.z_ctx_menu_panel_body {
  position: fixed;
}
</style>