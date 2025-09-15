<script setup lang='tsx'>
import { Icon } from '@iconify/vue'
import { ref } from 'vue'
import { $t } from '@/locales/locales'
import { useAppStore } from '@/store/use-app-store'
import { useLayoutStore } from '@/store/use-layout-store'
import AppPreference from './app-preference.vue'
import LayoutPreference from './layout-preference.vue'
import ThemePreference from './theme-preference.vue'

const itemHeight = 32
const appStore = useAppStore()
const showDropdown = ref(false)
const layoutStore = useLayoutStore()
const dropdownOptions = [
  {
    label: () => $t('common.preference.restoreConfig'),
    key: 'restore',
  },
]
</script>

<template>
  <div>
    <n-drawer
      v-model:show="appStore.showPreferenceDrawer"
      :auto-focus="false"
      :width="layoutStore.mobile ? '100%' : 320"
      :style="{
        '--preference-item-height': itemHeight,
      }"
    >
      <n-drawer-content
        :title="$t('common.preference.title')"
        closable
        :native-scrollbar="false"
      >
        <n-tabs
          type="segment"
          animated
        >
          <n-tab-pane
            name="theme"
            :tab="$t('common.preference.theme.title')"
          >
            <theme-preference />
          </n-tab-pane>
          <n-tab-pane
            name="layout"
            :tab="$t('common.preference.layout.title')"
          >
            <layout-preference />
          </n-tab-pane>
          <n-tab-pane
            name="other"
            :tab="$t('common.preference.other')"
          >
            <app-preference />
          </n-tab-pane>
        </n-tabs>
        <template #footer>
          <n-flex
            justify="space-between"
            class="w-full"
          >
            <n-button
              icon-placement="right"
              @click="appStore.$resetAllPreference"
            >
              {{ $t('common.preference.resetConfig') }}
              <template #icon>
                <n-dropdown
                  :options="dropdownOptions"
                  @update:show="showDropdown = $event"
                  @select="appStore.$restoreAllPreference"
                >
                  <icon icon="tabler:chevron-down" />
                </n-dropdown>
              </template>
            </n-button>
            <n-button
              type="primary"
              @click="appStore.$copyAllPreference"
            >
              {{ $t('common.preference.copyConfig') }}
            </n-button>
          </n-flex>
        </template>
      </n-drawer-content>
    </n-drawer>

    <n-float-button
      v-if="layoutStore.mode === 'full-content' || !layoutStore.showNav"
      position="fixed"
      right="10"
      bottom="40"
      @click="appStore.showPreferenceDrawer = true"
    >
      <n-icon>
        <icon icon="uil:setting" />
      </n-icon>
    </n-float-button>
  </div>
</template>

<style scoped>
:deep(.preference-item) {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: calc(var(--preference-item-height) * 1px);

  & > span {
    user-select: none;
  }
}
</style>
