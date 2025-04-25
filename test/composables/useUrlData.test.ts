import { useUrlData } from '@/composables/useUrlData'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock Vue Router
const mockRouter = {
  replace: vi.fn(),
}

// 封装 mockLocationSearch 方法
function mockLocationSearch(search: string) {
  Object.defineProperty(window, 'location', {
    value: {
      ...window.location,
      search,
    },
    writable: true,
    configurable: true,
  })
}

vi.mock('vue-router', () => ({
  useRouter: () => mockRouter,
}))

describe('useUrlData', () => {
  beforeEach(() => {
    mockRouter.replace.mockClear()
    mockLocationSearch('')
  })

  it('应该返回响应式查询对象', () => {
    const { urlData: query } = useUrlData()

    expect(query.value).toBeDefined()
    expect(typeof query.value).toBe('object')
  })

  it('应该合并默认查询参数', () => {
    const defaultQuery = { page: 1, size: 10 }
    const { urlData: query } = useUrlData(defaultQuery)

    expect(query.value).toMatchObject(defaultQuery)
  })

  it('应该处理路由查询参数', () => {
    mockLocationSearch('?name=test&age=25')
    const { urlData: query } = useUrlData()

    console.log(query.value)
    expect(query.value.name).toBe('test')
    expect(query.value.age).toBe(25)
  })

  it('应该处理数字类型的键', () => {
    mockLocationSearch('?pageSize=20&pageNo=2&customNumber=100')
    const { urlData: query } = useUrlData()

    expect(query.value.pageSize).toBe(20)
    expect(query.value.pageNo).toBe(2)
    expect(query.value.customNumber).toBe(100)
  })

  it('应该处理数组类型的键', () => {
    mockLocationSearch('?tags=single&categories__arr=cat1,cat2')
    const { urlData: query } = useUrlData()

    expect(query.value.tags).toEqual('single')
    expect(query.value.categories).toEqual(['cat1', 'cat2'])
  })

  it('应该处理数组类型的数字键', () => {
    mockLocationSearch('?pageSize__arr=10,20')
    const { urlData: query } = useUrlData()

    expect(query.value.pageSize).toEqual([10, 20])
  })

  it('应该处理空查询参数', async () => {
    const { urlData: query } = useUrlData()

    query.value = {}

    await nextTick()
    expect(window.location.search).toBe('')
  })
})
