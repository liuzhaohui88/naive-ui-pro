import type { App } from 'vue'
import { preferenceConfig } from '@root/preference'
import { cloneDeep, merge } from 'lodash-es'
import { create, ProDateTime, ProInput, ProSelect } from 'pro-naive-ui'
import { ProIconifyIcons, ProIconifyIcons2 } from './components/iconify-icons'
import { WangEditor } from './components/wang-editor'
import { setupDirective } from './directive'
import { setupI18n } from './locales/locales'
import { setupRouter } from './router'
import { setupPinia } from './store'
import 'virtual:uno.css'
import './assets/reset.css'

export async function prepareCreateApp() {
  setupAppLoading()
}

export async function prepareMount(app: App) {
  await setupPinia(app)
  await setupRouter(app)
  setupI18n(app)
  setupComponents(app)
  setupDirective(app)
}

function setupComponents(app: App) {
  // pro-naive-ui 中的 pro-search-form 支持按需加载组件，所以这里需要手动注册
  app.use(create({
    components: [
      ProInput,
      ProSelect,
      ProDateTime,
    ],
  }))
  app.component(ProIconifyIcons.name!, ProIconifyIcons)
  app.component(ProIconifyIcons2.name!, ProIconifyIcons2)
  // 这里纯粹是为了方便使用，跟 pro-search-form 无关
  app.component(WangEditor.name!, WangEditor)
}

function setupAppLoading() {
  const cachedPreference = localStorage.getItem('preference')
  const finalPreference: typeof preferenceConfig = cachedPreference
    ? merge(cloneDeep(preferenceConfig), JSON.parse(cachedPreference))
    : preferenceConfig
  const { title } = finalPreference.app
  const { mode, primaryColor } = finalPreference.theme
  if (mode === 'dark') {
    document.documentElement.classList.add('dark')
    document.documentElement.style.background = '#121212'
  }
  const loadingHtml = `
    <div class="fixed inset-0 flex flex-col gap-12px justify-center items-center bg-#f7fafc dark:bg-#121212">
      <style>
        .spin {
          width: 50px;
          aspect-ratio: 1;
          --_c: no-repeat radial-gradient(farthest-side, ${primaryColor} 92%, #0000);
          background:
            var(--_c) top,
            var(--_c) left,
            var(--_c) right,
            var(--_c) bottom;
          background-size: 14px 14px;
          animation: spin 1s infinite;
        }
        @keyframes spin {
          to {
            transform: rotate(.5turn)
          }
        }
      </style>
      <div class="spin"></div>
      <div class="text-28px font-bold dark:c-#fff">${title}</div>
    </div>
  `
  const app = document.querySelector('#app')
  if (app) {
    app.innerHTML = loadingHtml
  }
}
