import type { CSSProperties } from 'vue'
import type { resolveOptions } from './loading'

export type NormalizedClass = string | Record<string, any> | Array<any>

export interface LoadingOptions {
  /**
   * 等同于 n-spin 的 class 属性
   */
  class?: NormalizedClass
  /**
   * 等同于 n-spin 的 style 属性
   */
  style?: CSSProperties
  /**
   * 等同于 n-spin 的 show 属性
   */
  show?: boolean
  /**
   * 等同于 n-spin 的 content-class 属性
   */
  contentClass?: string
  /**
   * 等同于 n-spin 的 content-style 属性
   */
  contentStyle?: CSSProperties
  /**
   * 等同于 n-spin 的 description 属性
   */
  description?: string
  /**
   * 等同于 n-spin 的 size 属性
   */
  size?: 'small' | 'medium' | 'large' | number
  /**
   * 给遮罩层加的类名
   */
  maskClass?: NormalizedClass
  /**
   * 给遮罩层加的样式
   */
  maskStyle?: CSSProperties
  /**
   * 全屏修饰符，同 v-loading 指令中的 fullscreen 修饰符，不支持响应式
   */
  fullscreen?: boolean
  /**
   * 锁定滚动修饰符，同 v-loading 指令中的 lock 修饰符，不支持响应式
   */
  lock?: boolean
  /**
   * 挂载到目标元素，不支持响应式
   */
  to?: HTMLElement | string
  /**
   * 关闭后的回调
   */
  onClosed?: () => void
}

export type LoadingOptionsResolved = ReturnType<typeof resolveOptions>
