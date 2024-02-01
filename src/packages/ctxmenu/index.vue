<template>
  <div @contextmenu.prevent="onContextMenu" v-bind="$attrs">
    <slot name="reference" />
  </div>
  <Transition name="fade">
    <div class="z_menu_body" v-if="bodyVisible" ref="body">
      <slot />
    </div>
  </Transition>
</template>
<script setup lang="tsx">
import { ref, watch, nextTick, shallowRef, onBeforeUnmount } from 'vue'
type Props = {
  visible?: boolean
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
  bodyVisible.value = val;
  if (!val) stopListenDocClick.value?.();
});
watch(bodyVisible, (val) => {
  if (val === props.visible) return;
  emit('update:visible', val)
})

/** 右击事件 */
const onContextMenu = async (e: MouseEvent) => {
  bodyVisible.value = false;
  await nextTick();
  bodyVisible.value = true;
  await nextTick();
  updatePosition(e);
  addDocClick();
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

/** 监听点击事件 */
const stopListenDocClick = shallowRef<() => void>();
const addDocClick = () => {
  const fn = (e: MouseEvent) => {
    const { target } = e;
    if (body.value?.contains(target as Node)) return;
    bodyVisible.value = false;
    stopListenDocClick.value?.();
  }
  const stop = () => document.removeEventListener('click', fn)
  document.addEventListener('click', fn)
  stopListenDocClick.value = stop;
}
onBeforeUnmount(() => {
  stopListenDocClick.value?.()
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

.z_menu_body {
  position: fixed;
}
</style>