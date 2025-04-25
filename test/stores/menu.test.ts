import { useMenuStore } from '@/stores/menu'
import { usePermissionStore } from '@/stores/permission'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock dependencies
vi.mock('@/utils/menu', () => ({
  generateShowMenu: vi.fn(),
}))

describe('useMenuStore', () => {
  let store: ReturnType<typeof useMenuStore>
  let permissionStore: ReturnType<typeof usePermissionStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useMenuStore()
    permissionStore = usePermissionStore()
    vi.clearAllMocks()
  })

  describe('初始状态', () => {
    it('应该有正确的初始状态', () => {
      expect(store.collapsed).toBe(false)
      expect(store.selectedKey).toBeUndefined()
      expect(store.openKeys).toEqual([''])
      expect(store.preOpenKeys).toEqual([''])
      expect(store.menus).toEqual([])
    })
  })

  describe('toggleCollapsed', () => {
    it('应该切换折叠状态', () => {
      expect(store.collapsed).toBe(false)

      store.toggleCollapsed()
      expect(store.collapsed).toBe(true)

      store.toggleCollapsed()
      expect(store.collapsed).toBe(false)
    })
  })

  describe('setMenus', () => {
    it('应该设置菜单数据', () => {
      const mockMenus = [
        { key: '1', title: '首页', path: '/' },
        { key: '2', title: '用户管理', path: '/users' },
      ]

      store.setMenus(mockMenus)

      expect(store.menus).toEqual(mockMenus)
    })
  })

  describe('setselectedKeyByRoute', () => {
    it('应该能够设置路由', () => {
      const mockRoute = { path: '/users' }

      // 这个方法应该能够正常调用，不会报错
      expect(() => store.setselectedKeyByRoute(mockRoute)).not.toThrow()
    })

    it('当路由为空时，应该能够正常处理', () => {
      // 这个方法应该能够正常调用，不会报错
      expect(() => store.setselectedKeyByRoute(null)).not.toThrow()
    })
  })

  // describe('showMenus computed', () => {
  //   it('应该基于权限过滤显示菜单', () => {
  //     const mockGenerateShowMenu = vi.fn()
  //     vi.doMock('@/utils/menu', () => ({
  //       generateShowMenu: mockGenerateShowMenu,
  //     }))

  //     const mockMenus = [
  //       { key: '1', title: '首页', path: '/' },
  //       { key: '2', title: '用户管理', path: '/users' },
  //     ]

  //     const mockFilteredMenus = [
  //       { key: '1', title: '首页', path: '/' },
  //     ]

  //     store.setMenus(mockMenus)
  //     mockGenerateShowMenu.mockReturnValue(mockFilteredMenus)

  //     // 通过访问computed属性来触发计算
  //     const showMenus = store.showMenus

  //     expect(mockGenerateShowMenu).toHaveBeenCalledWith(mockMenus, permissionStore.checkHasAuth)
  //     expect(showMenus).toEqual(mockFilteredMenus)
  //   })
  // })

  describe('路由选择功能', () => {
    it('应该能够通过setselectedKeyByRoute设置路由', async () => {
      const mockGenerateShowMenu = await import('@/utils/menu').then(m => m.generateShowMenu)

      const mockMenus = [
        { key: '1', title: '首页', path: '/' },
        { key: '2', title: '用户管理', path: '/users' },
      ]

      const mockFlatMenus = [
        { key: '1', title: '首页', path: '/' },
        { key: '2', title: '用户管理', path: '/users' },
      ]

      vi.mocked(mockGenerateShowMenu).mockReturnValue(mockFlatMenus)

      store.setMenus(mockMenus)

      // 通过setselectedKeyByRoute设置路由
      store.setselectedKeyByRoute({ path: '/users' })

      // 等待下一个tick让watcher执行
      await new Promise(resolve => setTimeout(resolve, 0))

      expect(store.selectedKey).toBe('2')
    })

    it('当路由不匹配任何菜单时，selectedKey应该保持不变', async () => {
      const mockGenerateShowMenu = await import('@/utils/menu').then(m => m.generateShowMenu)

      const mockMenus = [
        { key: '1', title: '首页', path: '/' },
        { key: '2', title: '用户管理', path: '/users' },
      ]

      vi.mocked(mockGenerateShowMenu).mockReturnValue(mockMenus)

      store.setMenus(mockMenus)
      store.selectedKey = 'original'

      // 设置不匹配的路由
      store.setselectedKeyByRoute({ path: '/non-existent' })

      // 等待下一个tick让watcher执行
      await new Promise(resolve => setTimeout(resolve, 0))

      expect(store.selectedKey).toBe('original')
    })

    it('应该处理嵌套菜单的路由匹配', async () => {
      const mockGenerateShowMenu = await import('@/utils/menu').then(m => m.generateShowMenu)

      const mockMenus = [
        { key: '1', title: '首页', path: '/' },
        {
          key: '2',
          title: '系统管理',
          path: '/system',
          children: [
            { key: '2-1', title: '权限管理', path: '/system/permissions' },
          ],
        },
      ]

      const mockFlatMenus = [
        { key: '1', title: '首页', path: '/' },
        { key: '2', title: '系统管理', path: '/system' },
        { key: '2-1', title: '权限管理', path: '/system/permissions' },
      ]

      vi.mocked(mockGenerateShowMenu).mockReturnValue(mockFlatMenus)

      store.setMenus(mockMenus)

      // 设置嵌套路由
      store.setselectedKeyByRoute({ path: '/system/permissions' })

      // 等待下一个tick让watcher执行
      await new Promise(resolve => setTimeout(resolve, 0))

      expect(store.selectedKey).toBe('2-1')
    })
  })

  describe('集成测试', () => {
    it('应该完整地处理菜单设置、权限过滤和路由选择', async () => {
      const mockGenerateShowMenu = await import('@/utils/menu').then(m => m.generateShowMenu)

      const mockMenus = [
        { key: '1', title: '首页', path: '/' },
        { key: '2', title: '用户管理', path: '/users' },
        { key: '3', title: '系统管理', path: '/system' },
      ]

      const mockFilteredMenus = [
        { key: '1', title: '首页', path: '/' },
        { key: '2', title: '用户管理', path: '/users' },
      ]

      vi.mocked(mockGenerateShowMenu).mockReturnValue(mockFilteredMenus)

      // 设置菜单
      store.setMenus(mockMenus)

      // 验证菜单设置
      expect(store.menus).toEqual(mockMenus)

      // 验证权限过滤
      expect(store.showMenus).toEqual(mockFilteredMenus)
      expect(mockGenerateShowMenu).toHaveBeenCalledWith(mockMenus, permissionStore.checkHasAuth)

      // 设置路由
      store.setselectedKeyByRoute({ path: '/users' })

      // 等待watcher执行
      await new Promise(resolve => setTimeout(resolve, 0))

      // 验证路由选择
      expect(store.selectedKey).toBe('2')
    })
  })
})
