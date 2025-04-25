import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock dependencies
vi.mock('@/config', () => ({
  ACCESS_TOKEN_SAVE_KEY: 'test-token-key',
  accessTokenSaveBy: 'localStorage',
}))

vi.mock('js-cookie', () => ({
  default: {
    get: vi.fn(),
    set: vi.fn(),
    remove: vi.fn(),
  },
}))

// Mock browser storage APIs
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
}

const mockSessionStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
})

Object.defineProperty(window, 'sessionStorage', {
  value: mockSessionStorage,
  writable: true,
})

describe('accessToken utils', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('localStorage 模式', () => {
    it('应该能够获取token', async () => {
      mockLocalStorage.getItem.mockReturnValue('test-token')

      // 动态导入以确保mock生效
      const { default: localAccessToken } = await import('@/utils/accessToken')

      const result = localAccessToken.get()

      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('test-token-key')
      expect(result).toBe('test-token')
    })

    it('应该能够设置token', async () => {
      const { default: localAccessToken } = await import('@/utils/accessToken')

      localAccessToken.set('new-token')

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('test-token-key', 'new-token')
    })

    it('应该能够删除token', async () => {
      const { default: localAccessToken } = await import('@/utils/accessToken')

      localAccessToken.remove()

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('test-token-key')
    })

    it('应该能够使用自定义key获取token', async () => {
      mockLocalStorage.getItem.mockReturnValue('custom-token')

      const { default: localAccessToken } = await import('@/utils/accessToken')

      const result = localAccessToken.get('custom-key')

      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('custom-key')
      expect(result).toBe('custom-token')
    })
  })

  // vi.doMock('@/config', () => ({
  //   ACCESS_TOKEN_SAVE_KEY: 'test-token-key',
  //   accessTokenSaveBy: 'sessionStorage',
  // }))
})
