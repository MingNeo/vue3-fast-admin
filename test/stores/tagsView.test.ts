import type { RouteLocationNormalized } from 'vue-router'
import { useTagsViewStore } from '@/stores/tagsView'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock dependencies
const mockMenuStore = {
  menus: [
    {
      title: '首页',
      path: '/dashboard',
      children: [
        { title: '仪表盘', path: '/dashboard' },
        { title: '分析', path: '/dashboard/analysis' },
      ],
    },
    {
      title: '用户管理',
      path: '/users',
    },
  ],
}

const mockRoute = {
  path: '/dashboard',
  query: {},
}

const mockRouter = {
  push: vi.fn(),
}

vi.mock('@/stores/menu', () => ({
  useMenuStore: () => mockMenuStore,
}))

vi.mock('vue-router', () => ({
  useRoute: () => mockRoute,
  useRouter: () => mockRouter,
}))

describe('useTagsViewStore', () => {
  let tagsViewStore: ReturnType<typeof useTagsViewStore>

  const createMockRoute = (overrides: Partial<RouteLocationNormalized> = {}): RouteLocationNormalized => ({
    name: 'dashboard' as any,
    path: '/dashboard',
    params: {},
    query: {},
    hash: '',
    fullPath: '/dashboard',
    matched: [],
    meta: { title: '仪表盘', keepAlive: true },
    redirectedFrom: undefined,
    ...overrides,
  })

  beforeEach(() => {
    setActivePinia(createPinia())
    tagsViewStore = useTagsViewStore()
    vi.clearAllMocks()
  })

  describe('初始状态', () => {
    it('应该有正确的初始状态', () => {
      expect(tagsViewStore.visitedViews).toEqual([])
      expect(tagsViewStore.cachedViews).toEqual([])
    })
  })

  describe('addView', () => {
    it('应该同时添加访问视图和缓存视图', () => {
      const route = createMockRoute()

      tagsViewStore.addView(route)

      expect(tagsViewStore.visitedViews).toHaveLength(1)
      expect(tagsViewStore.cachedViews).toContain('dashboard')
    })

    it('应该从菜单中获取标题', () => {
      const route = createMockRoute({ path: '/dashboard' })

      tagsViewStore.addView(route)

      expect(tagsViewStore.visitedViews[0].title).toBe('仪表盘')
    })

    it('应该使用路由meta中的标题作为备选', () => {
      const route = createMockRoute({
        path: '/unknown',
        meta: { title: 'Meta标题' },
      })

      tagsViewStore.addView(route)

      expect(tagsViewStore.visitedViews[0].title).toBe('Meta标题')
    })

    it('应该使用路由名称作为标题', () => {
      const route = createMockRoute({
        path: '/unknown',
        name: 'UnknownRoute' as any,
        meta: {},
      })

      tagsViewStore.addView(route)

      expect(tagsViewStore.visitedViews[0].title).toBe('UnknownRoute')
    })

    it('应该使用路径作为最后的标题选择', () => {
      const route = createMockRoute({
        path: '/unknown/path',
        name: undefined,
        meta: {},
      })

      tagsViewStore.addView(route)

      expect(tagsViewStore.visitedViews[0].title).toBe('/unknown/path')
    })
  })

  describe('addVisitedView', () => {
    it('应该添加新的访问视图', () => {
      const route = createMockRoute()

      tagsViewStore.addVisitedView(route)

      expect(tagsViewStore.visitedViews).toHaveLength(1)
      expect(tagsViewStore.visitedViews[0].path).toBe('/dashboard')
    })

    it('应该更新已存在的视图而不是添加重复项', () => {
      const route1 = createMockRoute({ meta: { title: '旧标题' } })
      const route2 = createMockRoute({ meta: { title: '新标题' } })

      tagsViewStore.addVisitedView(route1)
      tagsViewStore.addVisitedView(route2)

      expect(tagsViewStore.visitedViews).toHaveLength(1)
      expect(tagsViewStore.visitedViews[0].title).toBe('仪表盘') // 从菜单获取
    })

    it('应该区分不同查询参数的相同路径', () => {
      const route1 = createMockRoute({ query: { id: '1' } })
      const route2 = createMockRoute({ query: { id: '2' } })

      tagsViewStore.addVisitedView(route1)
      tagsViewStore.addVisitedView(route2)

      expect(tagsViewStore.visitedViews).toHaveLength(2)
    })
  })

  describe('addCachedView', () => {
    it('应该为keepAlive的路由添加缓存', () => {
      const route = createMockRoute({ meta: { keepAlive: true } })

      tagsViewStore.addCachedView(route)

      expect(tagsViewStore.cachedViews).toContain('dashboard')
    })

    it('不应该为非keepAlive的路由添加缓存', () => {
      const route = createMockRoute({ meta: { keepAlive: false } })

      tagsViewStore.addCachedView(route)

      expect(tagsViewStore.cachedViews).not.toContain('dashboard')
    })

    it('不应该重复添加缓存项', () => {
      const route = createMockRoute({ meta: { keepAlive: true } })

      tagsViewStore.addCachedView(route)
      tagsViewStore.addCachedView(route)

      expect(tagsViewStore.cachedViews.filter(v => v === 'dashboard')).toHaveLength(1)
    })
  })

  describe('delView', () => {
    it('应该删除访问视图和缓存视图', async () => {
      const route = createMockRoute()
      tagsViewStore.addView(route)

      const result = await tagsViewStore.delView(route as any)

      expect(tagsViewStore.visitedViews).toHaveLength(0)
      expect(tagsViewStore.cachedViews).toHaveLength(0)
      expect(result).toHaveProperty('visitedViews')
      expect(result).toHaveProperty('cachedViews')
    })
  })

  describe('delVisitedView', () => {
    it('应该删除指定的访问视图', async () => {
      const route1 = createMockRoute({ path: '/route1' })
      const route2 = createMockRoute({ path: '/route2' })

      tagsViewStore.addVisitedView(route1)
      tagsViewStore.addVisitedView(route2)

      await tagsViewStore.delVisitedView(route1 as any)

      expect(tagsViewStore.visitedViews).toHaveLength(1)
      expect(tagsViewStore.visitedViews[0].path).toBe('/route2')
    })

    it('应该根据路径和查询参数匹配视图', async () => {
      const route1 = createMockRoute({ path: '/dashboard', query: { id: '1' } })
      const route2 = createMockRoute({ path: '/dashboard', query: { id: '2' } })

      tagsViewStore.addVisitedView(route1)
      tagsViewStore.addVisitedView(route2)

      await tagsViewStore.delVisitedView(route1 as any)

      expect(tagsViewStore.visitedViews).toHaveLength(1)
      expect(tagsViewStore.visitedViews[0].query).toEqual({ id: '2' })
    })
  })

  describe('delOthersViews', () => {
    it('应该删除除指定视图外的其他视图', async () => {
      const route1 = createMockRoute({ path: '/route1' })
      const route2 = createMockRoute({ path: '/route2' })
      const route3 = createMockRoute({ path: '/route3' })

      tagsViewStore.addView(route1)
      tagsViewStore.addView(route2)
      tagsViewStore.addView(route3)

      await tagsViewStore.delOthersViews(route2 as any)

      expect(tagsViewStore.visitedViews).toHaveLength(1)
      expect(tagsViewStore.visitedViews[0].path).toBe('/route2')
    })

    it('应该保留固定(affix)的视图', async () => {
      const route1 = createMockRoute({ path: '/route1', meta: { affix: true } })
      const route2 = createMockRoute({ path: '/route2' })
      const route3 = createMockRoute({ path: '/route3' })

      tagsViewStore.addVisitedView(route1)
      tagsViewStore.addVisitedView(route2)
      tagsViewStore.addVisitedView(route3)

      await tagsViewStore.delOthersViews(route2 as any)

      expect(tagsViewStore.visitedViews).toHaveLength(2)
      expect(tagsViewStore.visitedViews.map(v => v.path)).toContain('/route1')
      expect(tagsViewStore.visitedViews.map(v => v.path)).toContain('/route2')
    })
  })

  describe('delAllViews', () => {
    it('应该删除所有视图', async () => {
      const route1 = createMockRoute({ path: '/route1' })
      const route2 = createMockRoute({ path: '/route2' })

      tagsViewStore.addView(route1)
      tagsViewStore.addView(route2)

      await tagsViewStore.delAllViews()

      expect(tagsViewStore.visitedViews).toHaveLength(0)
      expect(tagsViewStore.cachedViews).toHaveLength(0)
    })

    it('应该保留固定(affix)的视图', async () => {
      const route1 = createMockRoute({ path: '/route1', meta: { affix: true } })
      const route2 = createMockRoute({ path: '/route2' })

      tagsViewStore.addVisitedView(route1)
      tagsViewStore.addVisitedView(route2)

      await tagsViewStore.delAllViews()

      expect(tagsViewStore.visitedViews).toHaveLength(1)
      expect(tagsViewStore.visitedViews[0].path).toBe('/route1')
    })
  })

  describe('updateVisitedView', () => {
    it('应该更新指定的访问视图', () => {
      const route = createMockRoute()
      tagsViewStore.addVisitedView(route)

      const updatedView = {
        path: '/dashboard',
        query: {},
        title: '更新的标题',
        meta: {},
      } as any
      tagsViewStore.updateVisitedView(updatedView)

      expect(tagsViewStore.visitedViews[0].title).toBe('更新的标题')
    })
  })

  describe('checkIsActive', () => {
    it('应该正确检查标签是否活跃', () => {
      mockRoute.path = '/dashboard'
      mockRoute.query = { id: '1' }

      const activeTag = { path: '/dashboard', query: { id: '1' } }
      const inactiveTag = { path: '/dashboard', query: { id: '2' } }

      expect(tagsViewStore.checkIsActive(activeTag as any)).toBe(true)
      expect(tagsViewStore.checkIsActive(inactiveTag as any)).toBe(false)
    })
  })

  describe('closeTag', () => {
    it('应该关闭标签并导航到其他视图', async () => {
      const route1 = createMockRoute({ path: '/route1' })
      const route2 = createMockRoute({ path: '/route2' })

      tagsViewStore.addView(route1)
      tagsViewStore.addView(route2)

      mockRoute.path = '/route2'
      mockRoute.query = {}

      await tagsViewStore.closeTag(route2 as any)

      expect(mockRouter.push).toHaveBeenCalledWith({
        path: '/route1',
        query: {},
      })
    })

    it('应该在关闭最后一个标签时导航到首页', async () => {
      const route = createMockRoute()
      tagsViewStore.addView(route)

      mockRoute.path = '/dashboard'
      mockRoute.query = {}

      await tagsViewStore.closeTag(route as any)

      expect(mockRouter.push).toHaveBeenCalledWith('/')
    })
  })
})
