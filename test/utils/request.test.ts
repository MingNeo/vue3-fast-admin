import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock dependencies
const mockAxiosInstance = {
  interceptors: {
    request: {
      use: vi.fn(),
    },
    response: {
      use: vi.fn(),
    },
  },
}

const mockAxios = {
  create: vi.fn(() => mockAxiosInstance),
}

vi.mock('axios', () => ({
  default: mockAxios,
}))

vi.mock('@/config', () => ({
  REQUEST_ACCESS_TOKEN_KEY: 'Authorization',
  saveLoginToken: true,
}))

vi.mock('@/utils/accessToken', () => ({
  default: {
    get: vi.fn(),
  },
  localAccessTokens: {
    cookie: {
      get: vi.fn(),
    },
  },
}))

vi.mock('lodash-es', () => ({
  isObject: vi.fn(),
}))

// Mock stores
const mockUserStore = {
  token: 'test-token',
  clearLogin: vi.fn(),
}

vi.mock('@/stores/user', () => ({
  useUserStore: vi.fn(() => mockUserStore),
}))

describe('request utils', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('createRequest', () => {
    it('应该创建axios实例', async () => {
      const { createRequest } = await import('@/utils/request')

      expect(mockAxios.create).toHaveBeenCalledWith({
        baseURL: '',
        timeout: 10000,
        withCredentials: true,
        headers: {
          post: {
            'Content-Type': 'application/json;charset=UTF-8',
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Allow-Origin': '*',
          },
        },
      })

      const config = {
        baseURL: 'https://api.example.com',
        timeout: 5000,
      }

      const instance = createRequest(config)

      expect(mockAxios.create).toHaveBeenCalledWith(config)
      expect(instance).toBe(mockAxiosInstance)
    })

    it('应该设置request拦截器', async () => {
      const { createRequest } = await import('@/utils/request')

      createRequest({})

      expect(mockAxiosInstance.interceptors.request.use).toHaveBeenCalledWith(
        expect.any(Function),
        expect.any(Function),
      )
    })

    it('应该设置response拦截器', async () => {
      const { createRequest } = await import('@/utils/request')

      createRequest({})

      expect(mockAxiosInstance.interceptors.response.use).toHaveBeenCalledWith(
        expect.any(Function),
        expect.any(Function),
      )
    })
  })

  describe('request拦截器', () => {
    it('应该添加Authorization header', async () => {
      const { createRequest } = await import('@/utils/request')

      createRequest({})

      const requestInterceptor = mockAxiosInstance.interceptors.request.use.mock.calls[0][0]

      const config = {
        headers: {},
      } as InternalAxiosRequestConfig

      const result = requestInterceptor(config)

      expect(result.headers.Authorization).toBe('Bearer test-token')
    })

    it('当token已包含Bearer时不应重复添加', async () => {
      mockUserStore.token = 'Bearer existing-token'

      const { createRequest } = await import('@/utils/request')

      createRequest({})

      const requestInterceptor = mockAxiosInstance.interceptors.request.use.mock.calls[0][0]

      const config = {
        headers: {},
      } as InternalAxiosRequestConfig

      const result = requestInterceptor(config)

      expect(result.headers.Authorization).toBe('Bearer existing-token')
    })

    // it('当saveLoginToken为false时应该使用cookie', async () => {
    //   vi.doMock('@/config', () => ({
    //     REQUEST_ACCESS_TOKEN_KEY: 'Authorization',
    //     saveLoginToken: false,
    //   }))

    //   const { createRequest } = await import('@/utils/request')

    //   createRequest({})

    //   const requestInterceptor = mockAxiosInstance.interceptors.request.use.mock.calls[0][0]

    //   const config = {
    //     headers: {},
    //   } as InternalAxiosRequestConfig

    //   const result = requestInterceptor(config)

    //   expect(result.headers.Authorization).toBeUndefined()
    // })
  })

  describe('response拦截器', () => {
    it('应该处理成功响应', async () => {
      const { createRequest } = await import('@/utils/request')

      createRequest({})

      const responseInterceptor = mockAxiosInstance.interceptors.response.use.mock.calls[0][0]

      const response = {
        status: 200,
        data: { result: 'success data' },
        config: { formatData: true },
        statusText: 'OK',
        headers: {},
      } as unknown as AxiosResponse

      const mockIsObject = await import('lodash-es').then(m => m.isObject)
      vi.mocked(mockIsObject).mockReturnValue(true)

      const result = responseInterceptor(response)

      expect(result).toBe('success data')
    })

    it('应该处理错误响应码', async () => {
      const { createRequest } = await import('@/utils/request')

      createRequest({})

      const responseInterceptor = mockAxiosInstance.interceptors.response.use.mock.calls[0][0]

      const response = {
        status: 500,
        data: {},
        config: {},
      } as AxiosResponse

      expect(() => responseInterceptor(response)).rejects.toBe(response)
    })

    it('应该处理API错误', async () => {
      const { createRequest } = await import('@/utils/request')

      createRequest({})

      const responseInterceptor = mockAxiosInstance.interceptors.response.use.mock.calls[0][0]

      const response = {
        status: 200,
        data: { error_code: 400, message: 'API Error' },
        config: {},
      } as AxiosResponse

      expect(() => responseInterceptor(response)).rejects.toBe('API Error')
      // expect(ElMessage.error).toHaveBeenCalledWith('API Error')
    })

    it('应该处理非JSON响应', async () => {
      const { createRequest } = await import('@/utils/request')

      createRequest({})

      const responseInterceptor = mockAxiosInstance.interceptors.response.use.mock.calls[0][0]

      const response = {
        status: 200,
        data: 'plain text',
        config: { responseType: 'text' },
      } as AxiosResponse

      const result = responseInterceptor(response)

      expect(result).toBe(response)
    })
  })

  describe('unLoginRedirect', () => {
    it('应该显示错误信息并清除登录状态', async () => {
      const { unLoginRedirect } = await import('@/utils/request')

      unLoginRedirect()

      // expect(ElMessage.error).toHaveBeenCalledWith('无权限, 请登录')
      expect(mockUserStore.clearLogin).toHaveBeenCalled()
    })
  })

  describe('errorHandler', () => {
    it('应该处理401错误', async () => {
      const { createRequest } = await import('@/utils/request')

      createRequest({})

      const errorHandler = mockAxiosInstance.interceptors.response.use.mock.calls[0][1]

      const error = {
        response: {
          status: 401,
          data: { message: 'Unauthorized' },
        },
      }

      expect(() => errorHandler(error)).rejects.toBe(error)
      // expect(ElMessage.error).toHaveBeenCalledWith('无权限, 请登录')
      expect(mockUserStore.clearLogin).toHaveBeenCalled()
    })

    it('应该处理其他HTTP错误', async () => {
      const { createRequest } = await import('@/utils/request')

      createRequest({})

      const errorHandler = mockAxiosInstance.interceptors.response.use.mock.calls[0][1]

      const error = {
        response: {
          status: 500,
          data: { message: 'Server Error' },
        },
      }

      expect(() => errorHandler(error)).rejects.toBe(error)
      // expect(ElMessage.error).toHaveBeenCalledWith('Server Error')
    })

    it('应该处理网络错误', async () => {
      const { createRequest } = await import('@/utils/request')

      createRequest({})

      const errorHandler = mockAxiosInstance.interceptors.response.use.mock.calls[0][1]

      const error = {
        message: 'Network Error',
      }

      expect(() => errorHandler(error)).rejects.toEqual({
        message: '网络异常',
      })
      // expect(ElMessage.error).toHaveBeenCalledWith('网络异常')
    })

    it('应该处理超时错误', async () => {
      const { createRequest } = await import('@/utils/request')

      createRequest({})

      const errorHandler = mockAxiosInstance.interceptors.response.use.mock.calls[0][1]

      const error = {
        message: 'timeout of 10000ms exceeded',
        code: 'ECONNABORTED',
      }

      expect(() => errorHandler(error)).rejects.toEqual({
        message: '数据处理中，请稍后重试',
        code: 'ECONNABORTED',
      })
      // expect(ElMessage.error).toHaveBeenCalledWith('数据处理中，请稍后重试')
    })
  })
})
