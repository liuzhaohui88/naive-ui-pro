import type { App } from 'vue'
import { ProLoading } from './loading'

export function setupDirective(app: App) {
  app.directive('loading', ProLoading.directive)
}
