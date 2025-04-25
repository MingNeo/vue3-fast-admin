import type { MenuItem } from '@/utils/menu'
import { useShowMenu } from '@/composables/useShowMenu'
import { usePermissionStore } from '@/stores/permission'
import { generateShowMenu } from '@/utils/menu'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock dependencies
vi.mock('@/stores/permission', () => ({
  usePermissionStore: vi.fn(),
}))

vi.mock('@/utils/menu', () => ({
  generateShowMenu: vi.fn(),
}))

describe('useShowMenu', () => {
  let mockPermissionStore: any
  let mockGenerateShowMenu: any

  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()

    // Mock permission store
    mockPermissionStore = {
      checkHasAuth: vi.fn(),
    }
    ;(usePermissionStore as any).mockReturnValue(mockPermissionStore)

    // Mock generateShowMenu
    mockGenerateShowMenu = vi.mocked(generateShowMenu)
  })

  const mockMenus: MenuItem[] = [
    {
      key: '1',
      title: '仪表盘',
      path: '/dashboard',
      icon: 'icon-park-outline:data',
    },
    {
      key: '2',
      title: '用户管理',
      path: '/users',
      icon: 'icon-park-outline:user',
    },
    {
      key: '3',
      title: '系统设置',
      icon: 'icon-park-outline:setting',
      children: [
        {
          key: '3-1',
          title: '权限管理',
          path: '/settings/permissions',
          icon: 'icon-park-outline:permissions',
        },
        {
          key: '3-2',
          title: '角色管理',
          path: '/settings/roles',
          icon: 'icon-park-outline:user-positioning',
        },
      ],
    },
  ]

  describe('基本功能测试', () => {
    it('应该返回经过权限过滤的菜单数组', () => {
      const expectedResult = [
        { key: '1', title: '仪表盘', path: '/dashboard' },
        { key: '2', title: '用户管理', path: '/users' },
      ]

      mockGenerateShowMenu.mockReturnValue(expectedResult)

      const result = useShowMenu(mockMenus)

      expect(mockGenerateShowMenu).toHaveBeenCalledWith(mockMenus, mockPermissionStore.checkHasAuth)
      expect(result).toEqual(expectedResult)
    })

    it('应该正确传递权限检查函数', () => {
      const mockCheckHasAuth = vi.fn()
      mockPermissionStore.checkHasAuth = mockCheckHasAuth
      mockGenerateShowMenu.mockReturnValue([])

      useShowMenu(mockMenus)

      expect(mockGenerateShowMenu).toHaveBeenCalledWith(mockMenus, mockCheckHasAuth)
    })

    it('应该处理空菜单数组', () => {
      mockGenerateShowMenu.mockReturnValue([])

      const result = useShowMenu([])

      expect(mockGenerateShowMenu).toHaveBeenCalledWith([], mockPermissionStore.checkHasAuth)
      expect(result).toEqual([])
    })
  })

  describe('权限过滤测试', () => {
    it('应该过滤掉没有权限的菜单项', () => {
      const expectedResult = [
        { key: '1', title: '仪表盘', path: '/dashboard' },
      ]

      mockGenerateShowMenu.mockReturnValue(expectedResult)

      const result = useShowMenu(mockMenus)

      expect(result).toEqual(expectedResult)
      expect(result).toHaveLength(1)
    })

    it('应该保留有权限的菜单项', () => {
      const expectedResult = mockMenus

      mockGenerateShowMenu.mockReturnValue(expectedResult)

      const result = useShowMenu(mockMenus)

      expect(result).toEqual(expectedResult)
      expect(result).toHaveLength(3)
    })

    it('应该处理嵌套菜单的权限过滤', () => {
      const expectedResult = [
        {
          key: '3',
          title: '系统设置',
          icon: 'icon-park-outline:setting',
          children: [
            {
              key: '3-1',
              title: '权限管理',
              path: '/settings/permissions',
              icon: 'icon-park-outline:permissions',
            },
          ],
        },
      ]

      mockGenerateShowMenu.mockReturnValue(expectedResult)

      const result = useShowMenu(mockMenus)

      expect(result).toEqual(expectedResult)
      expect(result[0].children).toHaveLength(1)
    })
  })

  describe('边界情况测试', () => {
    it('应该处理权限检查函数为空的情况', () => {
      mockPermissionStore.checkHasAuth = null
      mockGenerateShowMenu.mockReturnValue([])

      const result = useShowMenu(mockMenus)

      expect(mockGenerateShowMenu).toHaveBeenCalledWith(mockMenus, null)
      expect(result).toEqual([])
    })

    it('应该处理权限检查函数抛出异常的情况', () => {
      const mockCheckHasAuth = vi.fn().mockImplementation(() => {
        throw new Error('权限检查失败')
      })
      mockPermissionStore.checkHasAuth = mockCheckHasAuth
      mockGenerateShowMenu.mockImplementation(() => {
        throw new Error('权限检查失败')
      })

      expect(() => useShowMenu(mockMenus)).toThrow('权限检查失败')
    })

    it('应该处理菜单数组为 null 或 undefined 的情况', () => {
      mockGenerateShowMenu.mockReturnValue([])

      const result1 = useShowMenu(null as any)
      const result2 = useShowMenu(undefined as any)

      expect(mockGenerateShowMenu).toHaveBeenCalledWith(null, mockPermissionStore.checkHasAuth)
      expect(mockGenerateShowMenu).toHaveBeenCalledWith(undefined, mockPermissionStore.checkHasAuth)
      expect(result1).toEqual([])
      expect(result2).toEqual([])
    })
  })

  describe('返回值测试', () => {
    it('应该返回正确的数据结构', () => {
      const expectedResult = [
        {
          key: '1',
          title: '仪表盘',
          path: '/dashboard',
          icon: 'icon-park-outline:data',
          role: ['admin'],
          permission: ['dashboard:read'],
        },
      ]

      mockGenerateShowMenu.mockReturnValue(expectedResult)

      const result = useShowMenu(mockMenus)

      expect(result).toEqual(expectedResult)
      expect(result[0]).toHaveProperty('key')
      expect(result[0]).toHaveProperty('title')
      expect(result[0]).toHaveProperty('path')
      expect(result[0]).toHaveProperty('icon')
      expect(result[0]).toHaveProperty('role')
      expect(result[0]).toHaveProperty('permission')
    })

    it('应该返回具有正确类型的菜单项', () => {
      const expectedResult = mockMenus

      mockGenerateShowMenu.mockReturnValue(expectedResult)

      const result = useShowMenu(mockMenus)

      expect(Array.isArray(result)).toBe(true)
      result.forEach((menu) => {
        expect(menu).toHaveProperty('key')
        expect(menu).toHaveProperty('title')
        expect(typeof menu.key).toBe('string')
        expect(typeof menu.title).toBe('string')
        if (menu.path) {
          expect(typeof menu.path).toBe('string')
        }
        if (menu.children) {
          expect(Array.isArray(menu.children)).toBe(true)
        }
      })
    })
  })

  describe('组合测试', () => {
    it('应该正确处理复杂的菜单结构', () => {
      const complexMenus: MenuItem[] = [
        {
          key: '1',
          title: '仪表盘',
          path: '/dashboard',
        },
        {
          key: '2',
          title: '用户管理',
          children: [
            {
              key: '2-1',
              title: '用户列表',
              path: '/users/list',
            },
            {
              key: '2-2',
              title: '用户详情',
              path: '/users/detail',
            },
          ],
        },
        {
          key: '3',
          title: '系统管理',
          children: [
            {
              key: '3-1',
              title: '权限管理',
              path: '/system/permissions',
              children: [
                {
                  key: '3-1-1',
                  title: '角色管理',
                  path: '/system/permissions/roles',
                },
              ],
            },
          ],
        },
      ]

      const expectedResult = [
        { key: '1', title: '仪表盘', path: '/dashboard' },
        {
          key: '2',
          title: '用户管理',
          children: [
            { key: '2-1', title: '用户列表', path: '/users/list' },
          ],
        },
      ]

      mockGenerateShowMenu.mockReturnValue(expectedResult)

      const result = useShowMenu(complexMenus)

      expect(mockGenerateShowMenu).toHaveBeenCalledWith(complexMenus, mockPermissionStore.checkHasAuth)
      expect(result).toEqual(expectedResult)
    })
  })
})
