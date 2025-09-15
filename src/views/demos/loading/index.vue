<script setup lang="ts">
import { ref } from 'vue'
import { ProLoading } from '@/directive/loading'
import { $t } from '@/locales/locales'

// 1. v-loading 基础用法
const basicLoading = ref(false)

// 2. v-loading.fullscreen 全屏加载
const fullscreenLoading = ref(false)

// 3. v-loading.lock 锁定滚动
const lockLoading = ref(false)

// 4. v-loading 动态修改描述文字
const dynamicLoading = ref({
  show: false,
  description: $t('pages.demos.loading.dynamic.loadingData'),
})

// 5. 函数式调用
let functionalLoading: any = null

// 6. 函数式动态修改描述文字
let dynamicFunctionalLoading: any = null

// 基础 loading 切换
function toggleBasicLoading() {
  basicLoading.value = !basicLoading.value
}

// 全屏 loading 切换
function toggleFullscreenLoading() {
  fullscreenLoading.value = !fullscreenLoading.value
}

// 锁定滚动 loading 切换
function toggleLockLoading() {
  lockLoading.value = !lockLoading.value
}

// 动态修改描述文字
let dynamicLoadingTimeout1: any = null
let dynamicLoadingTimeout2: any = null
let dynamicLoadingTimeout3: any = null
function toggleDynamicLoading() {
  if (dynamicLoadingTimeout1) {
    clearTimeout(dynamicLoadingTimeout1)
  }
  if (dynamicLoadingTimeout2) {
    clearTimeout(dynamicLoadingTimeout2)
  }
  if (dynamicLoadingTimeout3) {
    clearTimeout(dynamicLoadingTimeout3)
  }
  if (!dynamicLoading.value.show) {
    dynamicLoading.value = {
      show: true,
      description: $t('pages.demos.loading.dynamic.loadingData'),
    }

    // 模拟异步操作，动态修改描述文字
    dynamicLoadingTimeout1 = setTimeout(() => {
      dynamicLoading.value = {
        ...dynamicLoading.value,
        description: $t('pages.demos.loading.dynamic.processingRequest'),
      }
    }, 1000)

    dynamicLoadingTimeout2 = setTimeout(() => {
      dynamicLoading.value = {
        ...dynamicLoading.value,
        description: $t('pages.demos.loading.dynamic.almostDone'),
      }
    }, 2000)

    dynamicLoadingTimeout3 = setTimeout(() => {
      dynamicLoading.value = {
        ...dynamicLoading.value,
        show: false,
      }
    }, 3000)
  }
  else {
    dynamicLoading.value = {
      ...dynamicLoading.value,
      show: false,
    }
  }
}

// 函数式调用
function showFunctionalLoading() {
  if (functionalLoading) {
    functionalLoading.show.value = false
    functionalLoading = null
    return
  }

  functionalLoading = ProLoading.service({
    description: $t('pages.demos.loading.functional.functionalLoading'),
    size: 'large',
  })

  // 3秒后自动关闭
  setTimeout(() => {
    if (functionalLoading) {
      functionalLoading.show.value = false
      functionalLoading = null
    }
  }, 3000)
}

// 函数式动态修改描述文字
let dynamicFunctionalLoadingTimeout1: any = null
let dynamicFunctionalLoadingTimeout2: any = null
let dynamicFunctionalLoadingTimeout3: any = null
let dynamicFunctionalLoadingTimeout4: any = null
let dynamicFunctionalLoadingTimeout5: any = null
function showDynamicFunctionalLoading() {
  if (dynamicFunctionalLoadingTimeout1) {
    clearTimeout(dynamicFunctionalLoadingTimeout1)
  }
  if (dynamicFunctionalLoadingTimeout2) {
    clearTimeout(dynamicFunctionalLoadingTimeout2)
  }
  if (dynamicFunctionalLoadingTimeout3) {
    clearTimeout(dynamicFunctionalLoadingTimeout3)
  }
  if (dynamicFunctionalLoadingTimeout4) {
    clearTimeout(dynamicFunctionalLoadingTimeout4)
  }
  if (dynamicFunctionalLoadingTimeout5) {
    clearTimeout(dynamicFunctionalLoadingTimeout5)
  }
  if (dynamicFunctionalLoading) {
    dynamicFunctionalLoading.show.value = false
    dynamicFunctionalLoading = null
    return
  }

  dynamicFunctionalLoading = ProLoading.service({
    description: $t('pages.demos.loading.functionalDynamic.startLoading'),
    size: 'large',
  })

  // 动态修改描述文字
  dynamicFunctionalLoadingTimeout1 = setTimeout(() => {
    if (dynamicFunctionalLoading) {
      dynamicFunctionalLoading.description.value = $t('pages.demos.loading.functionalDynamic.connectingServer')
    }
  }, 1000)

  dynamicFunctionalLoadingTimeout2 = setTimeout(() => {
    if (dynamicFunctionalLoading) {
      dynamicFunctionalLoading.description.value = $t('pages.demos.loading.functionalDynamic.fetchingData')
    }
  }, 2000)

  dynamicFunctionalLoadingTimeout3 = setTimeout(() => {
    if (dynamicFunctionalLoading) {
      dynamicFunctionalLoading.description.value = $t('pages.demos.loading.functionalDynamic.processingResult')
    }
  }, 3000)

  dynamicFunctionalLoadingTimeout4 = setTimeout(() => {
    if (dynamicFunctionalLoading) {
      dynamicFunctionalLoading.description.value = $t('pages.demos.loading.functionalDynamic.almostComplete')
    }
  }, 4000)

  dynamicFunctionalLoadingTimeout5 = setTimeout(() => {
    if (dynamicFunctionalLoading) {
      dynamicFunctionalLoading.show.value = false
      dynamicFunctionalLoading = null
    }
  }, 5000)
}
</script>

<template>
  <n-flex
    vertical
    size="large"
  >
    <n-card :title="$t('pages.demos.loading.basicUsage.title')">
      <n-flex
        vertical
        size="medium"
      >
        <n-flex
          v-loading="basicLoading"
          size="small"
          vertical
        >
          <h3>{{ $t('pages.demos.loading.basicUsage.description') }}</h3>
          <p>{{ $t('pages.demos.loading.basicUsage.description2') }}</p>
          <p>{{ $t('pages.demos.loading.basicUsage.description3') }}</p>
        </n-flex>
        <n-button
          type="primary"
          @click="toggleBasicLoading"
        >
          {{ basicLoading ? $t('pages.demos.loading.basicUsage.hideButton') : $t('pages.demos.loading.basicUsage.showButton') }}
        </n-button>
      </n-flex>
    </n-card>

    <n-card :title="$t('pages.demos.loading.fullscreen.title')">
      <n-flex
        vertical
        size="medium"
      >
        <n-flex
          v-loading.fullscreen="fullscreenLoading"
          vertical
          size="small"
        >
          <h3>{{ $t('pages.demos.loading.fullscreen.description') }}</h3>
          <p>{{ $t('pages.demos.loading.fullscreen.description2') }}</p>
          <p>{{ $t('pages.demos.loading.fullscreen.description3') }}</p>
        </n-flex>
        <n-button
          type="info"
          @click="toggleFullscreenLoading"
        >
          {{ fullscreenLoading ? $t('pages.demos.loading.fullscreen.hideButton') : $t('pages.demos.loading.fullscreen.showButton') }}
        </n-button>
      </n-flex>
    </n-card>

    <n-card :title="$t('pages.demos.loading.lock.title')">
      <n-flex
        vertical
        size="medium"
      >
        <n-flex
          vertical
          size="small"
        >
          <h3>{{ $t('pages.demos.loading.lock.description') }}</h3>
          <p>{{ $t('pages.demos.loading.lock.description2') }}</p>
          <p>{{ $t('pages.demos.loading.lock.description3') }}</p>
          <div
            v-loading.lock="lockLoading"
            class="h-200px overflow-auto p-10px"
          >
            <p>{{ $t('pages.demos.loading.lock.scrollArea') }}</p>
            <p>{{ $t('pages.demos.loading.lock.scrollAreaDesc') }}</p>
            <p>内容 1</p>
            <p>内容 2</p>
            <p>内容 3</p>
            <p>内容 4</p>
            <p>内容 5</p>
            <p>内容 6</p>
            <p>内容 7</p>
            <p>内容 8</p>
            <p>内容 9</p>
            <p>内容 10</p>
          </div>
        </n-flex>
        <n-button
          type="warning"
          @click="toggleLockLoading"
        >
          {{ lockLoading ? $t('pages.demos.loading.lock.hideButton') : $t('pages.demos.loading.lock.showButton') }}
        </n-button>
      </n-flex>
    </n-card>

    <n-card :title="$t('pages.demos.loading.dynamic.title')">
      <n-flex
        vertical
        size="medium"
      >
        <n-flex
          v-loading="dynamicLoading"
          vertical
          size="small"
        >
          <h3>{{ $t('pages.demos.loading.dynamic.description') }}</h3>
          <p>{{ $t('pages.demos.loading.dynamic.description2') }}</p>
          <p>{{ $t('pages.demos.loading.dynamic.description3') }}</p>
        </n-flex>
        <n-button
          type="success"
          @click="toggleDynamicLoading"
        >
          {{ $t('pages.demos.loading.dynamic.showButton') }}
        </n-button>
      </n-flex>
    </n-card>

    <n-card :title="$t('pages.demos.loading.functional.title')">
      <n-flex
        vertical
        size="medium"
      >
        <n-flex
          vertical
          size="small"
        >
          <h3>{{ $t('pages.demos.loading.functional.description') }}</h3>
          <p>{{ $t('pages.demos.loading.functional.description2') }}</p>
          <p>{{ $t('pages.demos.loading.functional.description3') }}</p>
        </n-flex>
        <n-button
          type="error"
          @click="showFunctionalLoading"
        >
          {{ functionalLoading ? $t('pages.demos.loading.functional.hideButton') : $t('pages.demos.loading.functional.showButton') }}
        </n-button>
      </n-flex>
    </n-card>

    <n-card :title="$t('pages.demos.loading.functionalDynamic.title')">
      <n-flex
        vertical
        size="medium"
      >
        <n-flex
          vertical
          size="small"
        >
          <h3>{{ $t('pages.demos.loading.functionalDynamic.description') }}</h3>
          <p>{{ $t('pages.demos.loading.functionalDynamic.description2') }}</p>
          <p>{{ $t('pages.demos.loading.functionalDynamic.description3') }}</p>
        </n-flex>
        <n-button
          type="primary"
          @click="showDynamicFunctionalLoading"
        >
          {{ dynamicFunctionalLoading ? $t('pages.demos.loading.functionalDynamic.hideButton') : $t('pages.demos.loading.functionalDynamic.showButton') }}
        </n-button>
      </n-flex>
    </n-card>
  </n-flex>
</template>
