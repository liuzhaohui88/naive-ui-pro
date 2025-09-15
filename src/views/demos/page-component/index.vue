<script setup lang="ts">
import { NButton, NText } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useLayoutStore } from '@/store/use-layout-store'

const itemCount = ref(10)
const loading = ref(false)
const loadingTime = ref(3000)
const { mobile } = storeToRefs(useLayoutStore())

function random(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// 开启loading，3秒后自动关闭
function startLoading() {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, loadingTime.value)
}
</script>

<template>
  <pro-page
    :loading="{
      show: loading,
      description: $t('pages.demos.pageComponent.loadingText'),
    }"
  >
    <div class="mb-6">
      <h1 class="text-2xl font-bold mb-2">
        {{ $t('pages.demos.pageComponent.title') }}
      </h1>
      <div class="my-2">
        <p>{{ $t('pages.demos.pageComponent.description') }}</p>
        <p>{{ $t('pages.demos.pageComponent.description2') }}</p>
        <p>{{ $t('pages.demos.pageComponent.description3') }}</p>
      </div>
    </div>
    <div class="my-2">
      <div
        v-for="i in itemCount"
        :key="i"
      >
        {{ $t('pages.demos.pageComponent.itemText') }}{{ i }}
      </div>
    </div>

    <!-- 底部固定区域 -->
    <template #footer>
      <div class="flex justify-between items-center w-full">
        <n-text type="info">
          {{ $t('pages.demos.pageComponent.currentNumber') }}: {{ itemCount }}
        </n-text>
        <n-flex>
          <n-button
            :focusable="false"
            @click="itemCount = random(10, 80)"
          >
            {{ $t('pages.demos.pageComponent.randomNumber') }}
          </n-button>
          <n-input-number
            v-if="!mobile"
            v-model:value="loadingTime"
            :min="1000"
            :max="30000"
            :step="1000"
          >
            <template #prefix>
              {{ $t('pages.demos.pageComponent.loadingTime') }}
            </template>
          </n-input-number>
          <n-button
            type="primary"
            :focusable="false"
            @click="startLoading"
          >
            {{ $t('pages.demos.pageComponent.startLoading') }}
          </n-button>
        </n-flex>
      </div>
    </template>
  </pro-page>
</template>
