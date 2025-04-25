import { useDarkMode } from '@/composables/useDarkMode'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock useDark from @vueuse/core
vi.mock('@vueuse/core', () => ({
  useDark: vi.fn(),
}))

describe('useDarkMode', () => {
  let mockIsDark: { value: boolean }

  beforeEach(async () => {
    // 重置 DOM
    document.documentElement.className = ''

    // Mock useDark
    mockIsDark = { value: false }
    const { useDark } = await import('@vueuse/core')
    ;(useDark as any).mockReturnValue(mockIsDark)
  })

  it('应该返回 isDark 和 toggleDarkMode', () => {
    const { isDark, toggleDarkMode } = useDarkMode()

    expect(isDark).toBeDefined()
    expect(typeof toggleDarkMode).toBe('function')
  })

  it('应该正确配置 useDark 参数', async () => {
    const { useDark } = await import('@vueuse/core')

    useDarkMode()

    expect(useDark).toHaveBeenCalledWith({
      selector: 'html',
      valueDark: 'dark',
      valueLight: 'light',
    })
  })

  it('应该正确切换暗黑模式', async () => {
    const { toggleDarkMode } = useDarkMode()

    // 初始状态为 false
    expect(mockIsDark.value).toBe(false)

    // 切换到暗黑模式
    toggleDarkMode()

    expect(mockIsDark.value).toBe(true)
    expect(document.documentElement.classList.contains('dark')).toBe(true)

    // 再次切换回亮色模式
    toggleDarkMode()

    expect(mockIsDark.value).toBe(false)
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('应该正确处理 DOM 类名', () => {
    const { toggleDarkMode } = useDarkMode()

    // 初始状态下不应该有 dark 类
    expect(document.documentElement.classList.contains('dark')).toBe(false)

    // 切换到暗黑模式
    toggleDarkMode()
    expect(document.documentElement.classList.contains('dark')).toBe(true)

    // 切换回亮色模式
    toggleDarkMode()
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('应该响应 isDark 值的变化', () => {
    const { isDark } = useDarkMode()

    // 验证 isDark 是响应式的
    expect(isDark).toBe(mockIsDark)

    // 直接修改 mockIsDark 的值
    mockIsDark.value = true
    expect(isDark.value).toBe(true)

    mockIsDark.value = false
    expect(isDark.value).toBe(false)
  })
})
