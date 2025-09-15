<script setup lang="ts">
import type { ProPageSlots } from './slots'
import { isBoolean } from 'lodash-es'
import { useThemeVars } from 'naive-ui'
import { computed } from 'vue'
import { useLayoutStore } from '@/store/use-layout-store'
import { proPageProps } from './props'

defineOptions({
  name: 'ProPage',
})
const props = defineProps(proPageProps)
const slots = defineSlots<ProPageSlots>()
const vars = useThemeVars()
const layoutStore = useLayoutStore()

const mergedConfig = computed(() => {
  const footerHeight = `${props.footerHeight ?? 58}px`
  const mergedVLoadingOptions = isBoolean(props.loading)
    ? {
        size: 'large',
        show: props.loading,
      }
    : {
        size: 'large',
        ...(props.loading ?? {}),
      }
  return {
    footerHeight,
    background: vars.value.cardColor,
    loadingZIndex: mergedVLoadingOptions.show ? 1 : -1,
    containerPageBottom: slots.footer ? footerHeight : 0,
    footerPositionBottom: layoutStore.showFooter ? `${layoutStore.footerHeight}px` : 0,
    vLoadingOptions: mergedVLoadingOptions,
  }
})
</script>

<template>
  <div class="pro-page">
    <slot />
    <div
      v-loading="mergedConfig.vLoadingOptions"
      class="pro-page__loading"
    />
    <footer
      v-if="slots.footer"
      class="pro-page__footer"
    >
      <slot name="footer" />
    </footer>
  </div>
</template>

<style scoped lang="scss">
.pro-page {
  min-height: 100%;
  padding-bottom: v-bind('mergedConfig.containerPageBottom');
  box-sizing: border-box;

  &__loading {
    position: absolute;
    left: 0;
    top: 0;
    z-index: v-bind('mergedConfig.loadingZIndex');
    width: calc(100% - var(--pro-layout-content-margin-left, 0px));
    height: calc(100% - var(--pro-layout-content-margin-top, 0px));
    margin-left: var(--pro-layout-content-margin-left, 0); // 兼容 sidebar-layout、mixed-sidebar-layout 的布局
    margin-top: var(--pro-layout-content-margin-top, 0); // 兼容 sidebar-layout、mixed-sidebar-layout 的布局
    transition:
      width 0.3s var(--n-bezier),
      margin-left 0.3s var(--n-bezier);
  }

  &__footer {
    position: absolute;
    bottom: v-bind('mergedConfig.footerPositionBottom');
    left: 0;
    padding: 0 16px;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    z-index: 1;
    height: v-bind('mergedConfig.footerHeight');
    background-color: v-bind('mergedConfig.background');
    margin-left: var(--pro-layout-content-margin-left, 0); // 兼容 sidebar-layout、mixed-sidebar-layout 的布局
    width: calc(100% - var(--pro-layout-content-margin-left, 0px));
    transition:
      width 0.3s var(--n-bezier),
      margin-left 0.3s var(--n-bezier);
  }
}
</style>
