/**
 * 后台统一响应格式
 */
export interface ApiResponse<T = any> {

  /**
   * 是否成功
   */
  success: boolean

  /**
   * 错误码
   */
  code: string

  /**
   * 提示信息
   */
  msg: string

  /**
   * 数据
   */
  data: T
}

/**
 * 特殊状态码常量
 */
export const ResultCodeEnum = {

  /**
   * 成功
   */
  SUCCESS: '20000',

  /**
   * 登录状态失效
   */
  LOGIN_EXPIRED: 40001,

  /**
   * UNAUTHORIZED
   */
  UNAUTHORIZED: '40300',

  /**
   * 账号被锁定
   */
  ACCOUNT_LOCKED: 40004,

} as const

/**
 * 特殊状态码处理函数类型
 */
export type SpecialCodeHandler = (code: string | number, msg: string, data: any) => void | Promise<void>
