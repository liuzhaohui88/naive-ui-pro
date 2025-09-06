import type { SpecialCodeHandler } from './types'
import { useUserStore } from '@/store/use-user-store'

/**
 * 特殊状态码处理器
 * 可以根据需要扩展更多的特殊状态码处理逻辑
 */
export class SpecialCodeHandlerManager {
  private handlers: Record<string | number, SpecialCodeHandler> = {}

  /**
   * 注册特殊状态码处理器
   * @param code 状态码
   * @param handler 处理函数
   */
  register(code: string | number, handler: SpecialCodeHandler) {
    this.handlers[code] = handler
  }

  /**
   * 处理特殊状态码
   * @param code 状态码
   * @param msg 消息
   * @param data 数据
   */
  async handle(code: string | number, msg: string, data: any) {
    const handler = this.handlers[code]
    if (handler) {
      try {
        await handler(code, msg, data)
      }
      catch (error) {
        console.error(`处理特殊状态码 ${code} 时出错:`, error)
      }
    }
  }

  /**
   * 获取所有已注册的处理器
   */
  getHandlers() {
    return { ...this.handlers }
  }
}

/**
 * 创建默认的特殊状态码处理器
 */
export function createDefaultSpecialCodeHandlers(): Record<string | number, SpecialCodeHandler> {
  return {
    // 登录状态失效
    40001: (_code, msg, _data) => {
      console.warn('登录状态失效:', msg)
      const userStore = useUserStore()
      userStore.logoutWithQueryRedirect()
    },

    // 权限不足
    40003: (_code, msg, _data) => {
      console.warn('权限不足:', msg)
      // 可以显示权限不足的提示
    },

    // 账号被锁定
    40004: (_code, msg, _data) => {
      console.warn('账号被锁定:', msg)
      const userStore = useUserStore()
      userStore.logoutWithQueryRedirect()
    },

    // 需要重新登录
    40005: (_code, msg, _data) => {
      console.warn('需要重新登录:', msg)
      const userStore = useUserStore()
      userStore.logoutWithQueryRedirect()
    },

    // 可以继续添加更多的特殊状态码处理
  }
}

/**
 * 全局特殊状态码处理器实例
 */
export const specialCodeHandlerManager = new SpecialCodeHandlerManager()

// 注册默认处理器
const defaultHandlers = createDefaultSpecialCodeHandlers()
Object.entries(defaultHandlers).forEach(([code, handler]) => {
  specialCodeHandlerManager.register(code, handler)
})
