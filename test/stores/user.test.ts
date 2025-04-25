import * as api from '@/api/user'
import { useUserStore } from '@/stores/user'
import localAccessToken from '@/utils/accessToken'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// 模拟 API 模块
vi.mock('@/api/user', () => ({
  login: vi.fn(),
  getCaptcha: vi.fn(),
  getInfo: vi.fn(),
  logout: vi.fn(),
}))

// 模拟 accessToken 工具
vi.mock('@/utils/accessToken', () => ({
  default: {
    get: vi.fn(),
    set: vi.fn(),
    remove: vi.fn(),
  },
}))

// 模拟 permission store
const mockPermissionStore = {
  setRoles: vi.fn(),
  setPermissions: vi.fn(),
}

vi.mock('@/stores/permission', () => ({
  usePermissionStore: vi.fn(() => mockPermissionStore),
}))

// 模拟配置
vi.mock('@/config', () => ({
  saveLoginToken: true,
}))

// 模拟 lodash-es
vi.mock('lodash-es', () => ({
  debounce: vi.fn(fn => fn),
}))

const mockApi = api as any
const mockAccessToken = localAccessToken as any

describe('useUserStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('should initialize with correct default values', () => {
    mockAccessToken.get.mockReturnValue('test-token')
    const userStore = useUserStore()

    expect(userStore.token).toBe('test-token')
    expect(userStore.info).toEqual({})
  })

  it('should initialize with empty token if not found', () => {
    mockAccessToken.get.mockReturnValue(null)
    const userStore = useUserStore()

    expect(userStore.token).toBe(null)
  })

  describe('login', () => {
    it('should login successfully and save token', async () => {
      const userStore = useUserStore()
      const loginParams = { username: 'test', password: 'password' }
      const mockResult = { token: 'new-token', expireTime: 3600 }

      mockApi.login.mockResolvedValue(mockResult)

      await userStore.login(loginParams)

      expect(mockApi.login).toHaveBeenCalledWith(loginParams)
      expect(userStore.token).toBe('new-token')
      expect(mockAccessToken.set).toHaveBeenCalledWith('new-token', 3600000)
    })

    it('should handle login error', async () => {
      const userStore = useUserStore()
      const loginParams = { username: 'test', password: 'wrong' }
      const error = new Error('Login failed')

      mockApi.login.mockRejectedValue(error)

      await expect(userStore.login(loginParams)).rejects.toThrow('Login failed')
    })
  })

  describe('getCaptcha', () => {
    it('should get captcha successfully', async () => {
      const userStore = useUserStore()
      const mockCaptcha = { captcha: 'base64-image' }

      mockApi.getCaptcha.mockResolvedValue(mockCaptcha)

      const result = await userStore.getCaptcha()

      expect(mockApi.getCaptcha).toHaveBeenCalled()
      expect(result).toBe(mockCaptcha)
    })
  })

  describe('getInfo', () => {
    it('should get user info successfully with roles and permissions', async () => {
      const userStore = useUserStore()
      const mockUserInfo = {
        id: 1,
        username: 'testuser',
        roles: ['admin', 'user'],
        permissions: ['create', 'read', 'update', 'delete'],
      }

      mockApi.getInfo.mockResolvedValue(mockUserInfo)

      const result = await userStore.getInfo()

      expect(mockApi.getInfo).toHaveBeenCalled()
      expect(userStore.info).toEqual(mockUserInfo)
      expect(mockPermissionStore.setRoles).toHaveBeenCalledWith(['admin', 'user'])
      expect(mockPermissionStore.setPermissions).toHaveBeenCalledWith(['create', 'read', 'update', 'delete'])
      expect(result).toEqual({
        ...mockUserInfo,
        roles: ['admin', 'user'],
      })
    })

    it('should handle user info without roles and permissions', async () => {
      const userStore = useUserStore()
      const mockUserInfo = {
        id: 1,
        username: 'testuser',
      }

      mockApi.getInfo.mockResolvedValue(mockUserInfo)

      const result = await userStore.getInfo()

      expect(userStore.info).toEqual(mockUserInfo)
      expect(mockPermissionStore.setRoles).not.toHaveBeenCalled()
      expect(mockPermissionStore.setPermissions).not.toHaveBeenCalled()
      expect(result).toEqual({
        ...mockUserInfo,
        roles: undefined,
      })
    })

    it('should handle getInfo error', async () => {
      const userStore = useUserStore()
      const error = new Error('Get info failed')

      mockApi.getInfo.mockRejectedValue(error)

      await expect(userStore.getInfo()).rejects.toThrow('Get info failed')
    })
  })

  describe('clearLogin', () => {
    it('should clear login state', () => {
      const userStore = useUserStore()

      userStore.token = 'test-token'
      userStore.info = { username: 'test' }

      userStore.clearLogin()

      expect(userStore.token).toBe('')
      expect(userStore.info).toEqual({})
      expect(mockAccessToken.remove).toHaveBeenCalled()
      expect(mockPermissionStore.setRoles).toHaveBeenCalledWith([])
    })
  })

  describe('logout', () => {
    it('should logout successfully', async () => {
      const userStore = useUserStore()
      userStore.token = 'test-token'
      userStore.info = { username: 'test' }

      mockApi.logout.mockResolvedValue({})

      await userStore.logout()

      expect(mockApi.logout).toHaveBeenCalledWith('test-token')
      expect(userStore.token).toBe('')
      expect(userStore.info).toEqual({})
      expect(mockAccessToken.remove).toHaveBeenCalled()
    })

    it('should handle logout error but still clear login', async () => {
      const userStore = useUserStore()
      userStore.token = 'test-token'
      userStore.info = { username: 'test' }

      const error = new Error('Logout failed')
      mockApi.logout.mockRejectedValue(error)

      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      await userStore.logout()

      expect(consoleSpy).toHaveBeenCalledWith('logout fail:', error)
      expect(userStore.token).toBe('')
      expect(userStore.info).toEqual({})
      expect(mockAccessToken.remove).toHaveBeenCalled()

      consoleSpy.mockRestore()
    })
  })

  describe('updateUserInfo', () => {
    it('should update user info', () => {
      const userStore = useUserStore()
      const newInfo = { username: 'updated', email: 'test@test.com' }

      userStore.updateUserInfo(newInfo)

      expect(userStore.info).toEqual(newInfo)
    })
  })
})
