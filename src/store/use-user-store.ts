import type { RouteRecordRaw } from 'vue-router'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { HOME_ROUTE_PATH, LOGIN_ROUTE_PATH } from '@/router/routes'
import http from '@/utils/axios'

export interface UserInfo {
  name: string
  token: string
  tokenName: string
  roles: string[]
  codes: string[]
}

export interface UserLoginPayload {
  username: string
  password: string
  [x: string]: any
}

export const useUserStore = defineStore('user', () => {
  const route = useRoute()
  const router = useRouter()
  const loading = ref(false)
  const routes = ref<RouteRecordRaw[]>([]) // 当前角色拥有的路由，Admin 中根据此数据生成菜单

  const user = ref<UserInfo>({
    name: '',
    roles: [],
    codes: [],
    token: localStorage.getItem('token') ?? '',
    tokenName: localStorage.getItem('tokenName') ?? 'Authorization',
  })

  async function fetchUpdateUserInfo() {
    try {
      const { data } = await Api.queryUserInfo()
      user.value = {
        ...user.value,
        ...data,
      }
      return user.value
    }
    catch (error) {
      console.error(error)
      logout()
      return user.value
    }
  }

  async function login(payload: UserLoginPayload) {
    try {
      loading.value = true
      const res = await Api.login(payload)
      const { tokenValue, tokenName } = res.data
      user.value.token = tokenValue
      user.value.tokenName = tokenName
      localStorage.setItem('token', tokenValue)
      localStorage.setItem('tokenName', tokenName)
      const info = await fetchUpdateUserInfo()
      const redirect = route.query.redirect as string ?? HOME_ROUTE_PATH
      await router.push(redirect)
      return info
    }
    finally {
      loading.value = false
    }
  }

  function logout() {
    user.value = {
      name: '',
      token: '',
      tokenName: 'Authorization',
      roles: [],
      codes: [],
    }
    localStorage.removeItem('token')
    localStorage.removeItem('tokenName')
  }

  async function logoutWithQueryRedirect(redirect?: string) {
    try {
      // 调用后台登出接口
      await Api.logout()
    }
    catch (error) {
      // 无论成功失败都继续执行清理和跳转
      console.warn('登出接口调用失败:', error)
    }

    // 清理本地token和用户信息
    logout()
    // 跳转到登录页面
    return router.push({
      path: LOGIN_ROUTE_PATH,
      query: {
        redirect: redirect ?? route.fullPath,
      },
    })
  }

  return {
    login,
    logout,
    routes,
    fetchUpdateUserInfo,
    loginLoading: loading,
    logoutWithQueryRedirect,
    user: computed(() => user.value),
  }
})

class Api {
  static login(payload: UserLoginPayload) {
    return http<{ tokenValue: string, tokenName: string }>({
      url: '/user/login',
      method: 'post',
      data: payload,
    })
  }

  static queryUserInfo() {
    return http<Omit<UserInfo, 'token'>>({
      url: '/user/info',
      method: 'get',
    })
  }

  static logout() {
    return http({
      url: '/user/logout',
      method: 'get',
    })
  }
}
