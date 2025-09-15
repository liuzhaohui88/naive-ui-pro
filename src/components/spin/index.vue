<script setup lang="ts">
import type { PropType } from 'vue'
import { useThemeVars } from 'naive-ui'
import { computed } from 'vue'
import { useThemeStore } from '@/store/use-theme-store'

const props = defineProps({
  size: {
    type: [String, Number] as PropType<'small' | 'medium' | 'large' | number>,
    default: 'medium',
  },
})

const vars = useThemeVars()
const themeStore = useThemeStore()

const size = computed(() => {
  switch (props.size) {
    case 'small':
      return pxToNumber(vars.value.heightSmall)
    case 'medium':
      return pxToNumber(vars.value.heightMedium)
    case 'large':
      return pxToNumber(vars.value.heightLarge)
    default:
      return props.size
  }
})

const backgroundSize = computed(() => {
  const scale = 3.3
  const finalSize = size.value / scale
  return `${finalSize}px ${finalSize}px`
})

function pxToNumber(str: string) {
  return Number(str.slice(0, -2))
}
</script>

<template>
  <div class="spinner" />
</template>

<style scoped>
.spinner {
  width: calc(v-bind('size') * 1px);
  height: calc(v-bind('size') * 1px);
  --c: radial-gradient(farthest-side, v-bind('themeStore.primaryColor') 92%, #0000);
  background:
    var(--c) 50% 0,
    var(--c) 50% 100%,
    var(--c) 100% 50%,
    var(--c) 0 50%;
  background-size: v-bind('backgroundSize');
  background-repeat: no-repeat;
  animation: spinner-kh173p 1s infinite;
}

@keyframes spinner-kh173p {
  to {
    transform: rotate(0.5turn);
  }
}
</style>
