import type { MenuItem } from '@/utils/menu'
import { findMenuPathByPath, generateShowMenu } from '@/utils/menu'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock dependencies
vi.mock('@/config', () => ({
  generateMenuByAuth: true,
}))

vi.mock('path-to-regexp', () => ({
  pathToRegexp: vi.fn(),
}))

vi.mock('vue-router/auto-routes', () => ({
  routes: [
    { path: '/dashboard', meta: { role: ['admin'], permission: ['read'] } },
    { path: '/users', meta: { role: ['admin', 'user'], permission: ['user:read'] } },
    { path: '/settings', meta: { role: ['admin'], permission: ['settings:read'] } },
    { path: '/public', meta: {} },
  ],
}))

describe('menu utils', () => {
  const mockPathToRegexp = vi.fn()

  beforeEach(async () => {
    vi.clearAllMocks()
    // Mock pathToRegexp
    const pathToRegexpModule = await import('path-to-regexp')
    const { pathToRegexp } = pathToRegexpModule
    mockPathToRegexp.mockImplementation((path: string) => ({
      test: (testPath: string) => path === testPath,
    }))
    vi.mocked(pathToRegexp).mockImplementation(mockPathToRegexp)
  })

  describe('generateShowMenu', () => {
    const mockMenus: MenuItem[] = [
      {
        key: '1',
        title: '仪表盘',
        path: '/dashboard',
      },
      {
        key: '2',
        title: '用户管理',
        path: '/users',
      },
      {
        key: '3',
        title: '系统设置',
        children: [
          {
            key: '3-1',
            title: '权限设置',
            path: '/settings',
          },
          {
            key: '3-2',
            title: '公共页面',
            path: '/public',
          },
        ],
      },
      {
        key: '4',
        title: '无路径菜单',
        children: [
          {
            key: '4-1',
            title: '子菜单1',
            path: '/child1',
          },
          {
            key: '4-2',
            title: '子菜单2',
            path: '/child2',
          },
        ],
      },
    ]

    it('应该基于权限过滤菜单项', () => {
      vi.mock('@/config', () => ({
        generateMenuByAuth: true,
      }))
      const mockHasAuth = vi.fn()
      mockHasAuth.mockImplementation((meta: any) => {
        // 只允许admin角色
        return meta?.role?.includes('admin')
      })

      const result = generateShowMenu(mockMenus, mockHasAuth)

      expect(result).toHaveLength(3) // dashboard, users, 系统设置
      expect(result[0].key).toBe('1') // dashboard
      expect(result[1].key).toBe('2') // users
      expect(result[2].key).toBe('3') // 系统设置
      expect(result[2].children).toHaveLength(1) // 只有settings通过权限检查
      expect(result[2].children![0].key).toBe('3-1')
    })

    it('应该过滤掉没有权限的菜单项', () => {
      const mockHasAuth = vi.fn()
      mockHasAuth.mockImplementation((meta: any) => {
        // 只允许user角色
        return meta?.role?.includes('user')
      })

      const result = generateShowMenu(mockMenus, mockHasAuth)

      expect(result).toHaveLength(1) // 只有users
      expect(result[0].key).toBe('2')
    })

    it('应该处理没有路径的父菜单', () => {
      const mockHasAuth = vi.fn()
      mockHasAuth.mockReturnValue(false) // 所有权限检查都失败

      const result = generateShowMenu(mockMenus, mockHasAuth)

      expect(result).toHaveLength(0) // 没有菜单通过权限检查
    })

    it('应该为有权限的菜单项设置role和permission', () => {
      const mockHasAuth = vi.fn()
      mockHasAuth.mockReturnValue(true) // 所有权限检查都通过

      const result = generateShowMenu(mockMenus, mockHasAuth)

      expect(result[0].role).toEqual(['admin']) // dashboard的role
      expect(result[0].permission).toEqual(['read']) // dashboard的permission
      expect(result[1].role).toEqual(['admin', 'user']) // users的role
      expect(result[1].permission).toEqual(['user:read']) // users的permission
    })

    // it('应该处理嵌套菜单的权限继承', () => {
    //   const mockHasAuth = vi.fn()
    //   mockHasAuth.mockImplementation((meta: any) => {
    //     return meta?.role?.includes('admin')
    //   })

    //   const result = generateShowMenu(mockMenus, mockHasAuth)

    //   const systemMenu = result.find(item => item.key === '3')
    //   expect(systemMenu).toBeDefined()
    //   expect(systemMenu!.children).toHaveLength(1)

    //   // 父菜单应该继承子菜单的权限信息
    //   expect(systemMenu?.role).toBeDefined()
    //   expect(systemMenu?.permission).toBeDefined()
    // })
  })

  describe('findMenuPathByPath', () => {
    const mockMenus: MenuItem[] = [
      {
        key: '1',
        title: '仪表盘',
        path: '/dashboard',
      },
      {
        key: '2',
        title: '用户管理',
        path: '/users',
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
        title: '系统设置',
        children: [
          {
            key: '3-1',
            title: '权限设置',
            path: '/settings/permissions',
            children: [
              {
                key: '3-1-1',
                title: '角色管理',
                path: '/settings/permissions/roles',
              },
            ],
          },
        ],
      },
    ]

    it('应该找到顶级菜单路径', () => {
      const result = findMenuPathByPath(mockMenus, '/dashboard')

      expect(result).toHaveLength(1)
      expect(result[0].key).toBe('1')
      expect(result[0].title).toBe('仪表盘')
    })

    it('应该找到二级菜单路径', () => {
      const result = findMenuPathByPath(mockMenus, '/users/list')

      expect(result).toHaveLength(2)
      expect(result[0].key).toBe('2') // 父菜单
      expect(result[0].title).toBe('用户管理')
      expect(result[1].key).toBe('2-1') // 子菜单
      expect(result[1].title).toBe('用户列表')
    })

    it('应该找到三级菜单路径', () => {
      const result = findMenuPathByPath(mockMenus, '/settings/permissions/roles')

      expect(result).toHaveLength(3)
      expect(result[0].key).toBe('3') // 顶级菜单
      expect(result[1].key).toBe('3-1') // 二级菜单
      expect(result[2].key).toBe('3-1-1') // 三级菜单
    })

    it('当路径不存在时应该返回空数组', () => {
      const result = findMenuPathByPath(mockMenus, '/nonexistent')

      expect(result).toHaveLength(0)
    })

    it('应该正确处理父菜单路径', () => {
      const result = findMenuPathByPath(mockMenus, '/users')

      expect(result).toHaveLength(1)
      expect(result[0].key).toBe('2')
      expect(result[0].title).toBe('用户管理')
    })

    it('应该处理空菜单数组', () => {
      const result = findMenuPathByPath([], '/any-path')

      expect(result).toHaveLength(0)
    })

    it('应该处理复杂的嵌套结构', () => {
      const complexMenus: MenuItem[] = [
        {
          key: '1',
          title: '一级菜单',
          children: [
            {
              key: '1-1',
              title: '二级菜单',
              children: [
                {
                  key: '1-1-1',
                  title: '三级菜单',
                  children: [
                    {
                      key: '1-1-1-1',
                      title: '四级菜单',
                      path: '/deep/nested/path',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ]

      const result = findMenuPathByPath(complexMenus, '/deep/nested/path')

      expect(result).toHaveLength(4)
      expect(result.map(item => item.key)).toEqual(['1', '1-1', '1-1-1', '1-1-1-1'])
    })
  })
})
