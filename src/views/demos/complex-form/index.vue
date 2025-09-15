<script setup lang="ts">
import { useTimeoutFn } from '@vueuse/core'
import { useMessage } from 'naive-ui'
import { createProForm } from 'pro-naive-ui'
import { ref } from 'vue'
import { $t } from '@/locales/locales'
import BasicInfoCard from './base-info-card.vue'
import ContentCard from './content-card.vue'
import DataTableCard from './table-card.vue'

const loading1 = ref(false)
const loading2 = ref(false)
const loading3 = ref(false)
const message = useMessage()
const pageLoading = ref(true)

const form = createProForm({
  onSubmit: (values) => {
    console.log('Form submitted:', values)
    message.success($t('pages.demos.complexForm.submitSuccess'))
  },
})

useTimeoutFn(() => {
  pageLoading.value = false
}, 3000)

function delay(time: number) {
  return new Promise<void>((resolve) => {
    const timer = setTimeout(() => {
      resolve()
      clearTimeout(timer)
    }, time)
  })
}

async function fillForm() {
  loading1.value = true
  await delay(1000)
  form.restoreValidation()
  form.values.value = {
    ...form.values.value,
    username: 'admin',
    email: 'admin@example.com',
    phone: '1234567890',
    gender: 'male',
    status: 'active',
    birthDate: '2021.01.01',
  }
  loading1.value = false
  loading2.value = true
  await delay(1000)
  form.values.value = {
    ...form.values.value,
    contentTitle: 'test',
    category: 'test',
    tags: ['test'],
    publishTime: '2021.01.01 14:20:38',
    dynamicList: [
      {
        name: 'test',
        value: 18,
      },
    ],
    content: `<h1>hello world</h1>`,
  }
  loading2.value = false
  loading3.value = true
  await delay(1000)
  form.values.value = {
    ...form.values.value,
    department: 'marketing',
    position: 'junior',
    level: 'p3',
    list: [
      { title: 'test1', now: Date.now() },
      { title: 'test2' },
      { title: 'test3', now: Date.now() },
    ],
  }
  loading3.value = false
}
</script>

<template>
  <pro-page
    :loading="{
      show: pageLoading,
      description: $t('pages.demos.complexForm.loadingText'),
    }"
  >
    <pro-form :form="form">
      <n-flex
        vertical
        :size="12"
      >
        <basic-info-card v-loading="loading1" />
        <content-card v-loading="loading2" />
        <data-table-card v-loading="loading3" />
      </n-flex>
    </pro-form>
    <template #footer>
      <n-flex
        class="w-full"
        justify="flex-end"
      >
        <n-button
          type="error"
          @click="fillForm"
        >
          {{ $t('pages.demos.complexForm.fillForm') }}
        </n-button>
        <n-button
          type="primary"
          @click="form.submit"
        >
          {{ $t('pages.demos.complexForm.submit') }}
        </n-button>
      </n-flex>
    </template>
  </pro-page>
</template>
