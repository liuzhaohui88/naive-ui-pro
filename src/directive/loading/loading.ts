import type { CSSProperties } from 'vue'
import type { LoadingOptions, LoadingOptionsResolved } from './types'
import { isString } from 'lodash-es'
import { NSpin } from 'naive-ui'
import { camelize, computed, h, mergeProps, reactive, render, toRefs } from 'vue'
import Spinner from '@/components/spin/index.vue'
import { useThemeStore } from '@/store/use-theme-store'

export function createLoadingInstance(resolvedOptions: LoadingOptionsResolved) {
  const themeStore = useThemeStore()
  const data = reactive({
    ...resolvedOptions,
    show: false,
    originalOverflow: '',
    originalPosition: '',
  })
  const vnode = h({
    name: 'Loading',
    render() {
      return h(
        'div',
        mergeProps({
          style: {
            // 以下三项 vars naive-ui 内部缺失
            '--n-font-size': '14px',
            '--n-bezier': 'cubic-bezier(.4, 0, .2, 1)',
            '--n-text-color': themeStore.isDark ? '#fff' : '#000',
            'background': themeStore.isDark ? 'rgba(0, 0, 0, 0.38)' : 'rgba(255, 255, 255, 0.5)',
          },
          class: 'size-full flex items-center justify-center',
        }, {
          class: data.maskClass,
          style: data.maskStyle,
        }),
        h(NSpin, {
          rotate: false,
          show: data.show,
          size: data.size,
          class: data.class,
          style: data.style,
          description: data.description,
          contentClass: data.contentClass,
          contentStyle: data.contentStyle,
        }, {
          icon: () => {
            return h(Spinner, { size: data.size })
          },
        }),
      )
    },
  })
  const container = document.createElement('div')
  container.className = data.fullscreen
    ? 'fixed inset-0 z-9999'
    : 'absolute inset-0 z-99'
  return {
    ...toRefs(data),
    $el: container,
    show: computed({
      get() {
        return data.show
      },
      set(val) {
        const target = resolvedOptions.to
        if (val) {
          const overflow = data.originalOverflow = getStyle(target, 'overflow')
          const position = data.originalPosition = getStyle(target, 'position')
          if (!['absolute', 'fixed', 'sticky'].includes(position)) {
            target.classList.add('relative!')
          }
          if (resolvedOptions.lock && !['hidden'].includes(overflow)) {
            target.classList.add('overflow-hidden!')
          }
          render(vnode, container)
          target.appendChild(container)
        }
        else {
          target.classList.remove('relative!')
          target.classList.remove('overflow-hidden!')
          render(null, container)
          container.remove()
          resolvedOptions.onClosed?.()
        }
        data.show = val
      },
    }),
  }
}

export function resolveOptions(options: LoadingOptions) {
  let to: HTMLElement
  if (isString(options.to)) {
    to = document.querySelector<HTMLElement>(options.to) ?? document.body
  }
  else {
    to = options.to ?? document.body
  }
  const size = options.size ?? 'medium'
  return {
    to,
    size,
    class: options.class,
    style: options.style,
    onClosed: options.onClosed,
    show: options.show ?? true,
    lock: options.lock ?? false,
    maskClass: options.maskClass,
    maskStyle: options.maskStyle,
    description: options.description,
    contentClass: options.contentClass,
    contentStyle: options.contentStyle,
    fullscreen: to === document.body && (options.fullscreen ?? true),
  }
}

/**
 * copy from element-plus
 */
function getStyle(element: HTMLElement, styleName: keyof CSSProperties): string {
  if (!element || !styleName) {
    return ''
  }
  let key = camelize(styleName)
  if (key === 'float') {
    key = 'cssFloat'
  }
  try {
    const style = (element.style as any)[key]
    if (style) {
      return style
    }
    const computed: any = document.defaultView?.getComputedStyle(element, '')
    return computed ? computed[key] : ''
  }
  catch {
    return (element.style as any)[key]
  }
}

export type LoadingInstance = ReturnType<typeof createLoadingInstance>
