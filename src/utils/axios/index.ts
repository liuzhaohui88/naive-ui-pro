import type { ApiResponse } from './types'
import axios from 'axios'
import { setupTokenInterceptor } from './request-interceptors'
import { setupResponseInterceptors } from './response-interceptors'
import { specialCodeHandlerManager } from './special-code-handler'
import { ResultCodeEnum } from './types'

/**
 * 我们提供了 2 种全局错误处理方式
 * 方式一：可以在 axios 的 handleError 中返回 Promise.reject(error)，调用侧将会进入 catch 回调，并获取错误对象
 * 方式二：如果你决定使用 useProRequest 来作为请求工具，那么可以在 message-tip-after-request-finally-plugin 插件中实现
 */

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

/**
 * 请求前添加 token 的拦截器
 */
setupTokenInterceptor(http)

/**
 * 安装响应拦截器
 */
setupResponseInterceptors(http, {
  /**
   * 拆解服务端响应数据格式，成功时返回数据，失败时需要抛出错误消息
   * @param response axios 响应体
   * @returns 拆解后的数据
   * @throws 错误消息
   */
  unwrapResponseData(response) {
    if (response.data != null) {
      const apiResponse = response.data as ApiResponse

      // 检查是否是标准的API响应格式
      if ('success' in apiResponse && 'code' in apiResponse && 'msg' in apiResponse) {
        const { code, msg, data } = apiResponse

        // 检查是否是成功状态码
        if (code === ResultCodeEnum.SUCCESS) {
          return data
        }

        // 检查是否是特殊状态码
        specialCodeHandlerManager.handle(code, msg, data)

        // 抛出错误消息
        throw new Error(msg)
      }
    }

    // 如果不是标准格式，直接返回原始数据
    return response.data
  },

  /**
   * 全局错误处理，该函数的返回体将决定调用侧的 Promise 的状态
   * @param error axios 响应错误
   */
  handleError(error) {
    // 调用侧将会进入 catch 回调，并获取错误对象
    return Promise.reject(error)
  },
})

export default http
