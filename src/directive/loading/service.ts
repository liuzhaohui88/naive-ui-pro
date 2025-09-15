import type { LoadingInstance } from './loading'
import type { LoadingOptions } from './types'
import { createLoadingInstance, resolveOptions } from './loading'

/**
 * 全屏 loading 是单例的
 */
let fullscreenInstance: LoadingInstance | undefined

export function Loading(options: LoadingOptions = {}): LoadingInstance {
  const resolvedOptions = resolveOptions(options)
  if (resolvedOptions.fullscreen && fullscreenInstance) {
    return fullscreenInstance
  }
  const instance = createLoadingInstance({
    ...resolvedOptions,
    onClosed: () => {
      resolvedOptions.onClosed?.()
      if (resolvedOptions.fullscreen) {
        fullscreenInstance = undefined
      }
    },
  })
  instance.show.value = resolvedOptions.show
  if (resolvedOptions.fullscreen) {
    fullscreenInstance = instance
  }
  return instance
}
