import useAuth from '@/composables/useAuth'
import { usePermissionStore } from '@/stores/permission'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock permission store
vi.mock('@/stores/permission', () => ({
  usePermissionStore: vi.fn(),
}))

describe('useAuth', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('应该返回一个函数用于检查权限', () => {
    const mockCheckHasPermission = vi.fn()
    ;(usePermissionStore as any).mockReturnValue({
      checkHasPermission: mockCheckHasPermission,
    })

    const hasAuth = useAuth()

    expect(typeof hasAuth).toBe('function')
  })

  it('应该正确检查单个权限', () => {
    const mockCheckHasPermission = vi.fn().mockReturnValue(true)
    ;(usePermissionStore as any).mockReturnValue({
      checkHasPermission: mockCheckHasPermission,
    })

    const hasAuth = useAuth()
    const result = hasAuth('user:read')

    expect(mockCheckHasPermission).toHaveBeenCalledWith('user:read')
    expect(result).toBe(true)
  })

  it('应该正确检查多个权限', () => {
    const mockCheckHasPermission = vi.fn().mockReturnValue(false)
    ;(usePermissionStore as any).mockReturnValue({
      checkHasPermission: mockCheckHasPermission,
    })

    const hasAuth = useAuth()
    const result = hasAuth(['user:read', 'user:write'])

    expect(mockCheckHasPermission).toHaveBeenCalledWith(['user:read', 'user:write'])
    expect(result).toBe(false)
  })

  it('应该返回布尔值', () => {
    const mockCheckHasPermission = vi.fn()
    ;(usePermissionStore as any).mockReturnValue({
      checkHasPermission: mockCheckHasPermission,
    })

    const hasAuth = useAuth()

    // 测试 falsy 值
    mockCheckHasPermission.mockReturnValue(null)
    expect(hasAuth('test')).toBe(false)

    mockCheckHasPermission.mockReturnValue(undefined)
    expect(hasAuth('test')).toBe(false)

    mockCheckHasPermission.mockReturnValue('')
    expect(hasAuth('test')).toBe(false)

    // 测试 truthy 值
    mockCheckHasPermission.mockReturnValue(true)
    expect(hasAuth('test')).toBe(true)

    mockCheckHasPermission.mockReturnValue('有权限')
    expect(hasAuth('test')).toBe(true)
  })
})
