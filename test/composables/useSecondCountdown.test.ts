import { useSecondsCountdown } from '@/composables/useSecondsCountdown'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'

describe('useSecondsCountdown', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('应该返回正确的属性和方法', () => {
    const { start, stop, current, formattedTime, isCounting } = useSecondsCountdown(10)

    expect(typeof start).toBe('function')
    expect(typeof stop).toBe('function')
    expect(current.value).toBe(10)
    expect(formattedTime.value).toBe('10')
    expect(isCounting.value).toBe(false)
  })

  it('应该正确初始化倒计时', () => {
    const { current, isCounting } = useSecondsCountdown(30)

    expect(current.value).toBe(30)
    expect(isCounting.value).toBe(false)
  })

  it('应该正确开始倒计时', () => {
    const { start, current, isCounting } = useSecondsCountdown(5)

    start()

    expect(current.value).toBe(5)
    expect(isCounting.value).toBe(true)
  })

  it('应该正确进行倒计时', async () => {
    const { start, current, isCounting } = useSecondsCountdown(3)

    start()
    expect(current.value).toBe(3)
    expect(isCounting.value).toBe(true)

    // 前进 1 秒
    vi.advanceTimersByTime(1000)
    expect(current.value).toBe(2)
    expect(isCounting.value).toBe(true)

    // 前进 1 秒
    vi.advanceTimersByTime(1000)
    expect(current.value).toBe(1)
    expect(isCounting.value).toBe(true)

    // 前进 1 秒，倒计时结束
    vi.advanceTimersByTime(1000)
    expect(current.value).toBe(0)
    expect(isCounting.value).toBe(false)
  })

  it('应该在倒计时结束时调用回调函数', () => {
    const callback = vi.fn()
    const { start } = useSecondsCountdown(2, { callback })

    start()

    // 前进 2 秒，倒计时结束
    vi.advanceTimersByTime(2000)

    expect(callback).toHaveBeenCalledTimes(1)
  })

  it('应该正确停止倒计时', () => {
    const { start, stop, current, isCounting } = useSecondsCountdown(10)

    start()
    expect(current.value).toBe(10)
    expect(isCounting.value).toBe(true)

    // 前进 3 秒
    vi.advanceTimersByTime(3000)
    expect(current.value).toBe(7)

    // 停止倒计时
    stop()
    expect(current.value).toBe(0)
    expect(isCounting.value).toBe(false)
  })

  it('应该正确格式化时间', () => {
    const { formattedTime } = useSecondsCountdown(5)

    expect(formattedTime.value).toBe('05')
  })

  it('应该正确格式化时间显示', () => {
    const { start, formattedTime } = useSecondsCountdown(5)

    start()
    expect(formattedTime.value).toBe('05')

    vi.advanceTimersByTime(1000)
    expect(formattedTime.value).toBe('04')

    vi.advanceTimersByTime(1000)
    expect(formattedTime.value).toBe('03')
  })

  it('应该在组件卸载时清理计时器', () => {
    const { start, stop } = useSecondsCountdown(10)
    const spyStop = vi.spyOn(window, 'clearInterval')

    start()
    stop()

    expect(spyStop).toHaveBeenCalled()
  })

  it('应该处理多次开始倒计时', () => {
    const { start, current, isCounting } = useSecondsCountdown(5)

    // 第一次开始
    start()
    expect(current.value).toBe(5)
    expect(isCounting.value).toBe(true)

    // 前进 2 秒
    vi.advanceTimersByTime(2000)
    expect(current.value).toBe(3)

    // 再次开始，应该重置
    start()
    expect(current.value).toBe(5)
    expect(isCounting.value).toBe(true)
  })

  it('应该处理零时间倒计时', () => {
    const callback = vi.fn()
    const { start, current, isCounting } = useSecondsCountdown(0, { callback })

    start()
    expect(current.value).toBe(0)
    expect(isCounting.value).toBe(true)

    // 立即应该触发回调
    // vi.advanceTimersByTime(0)
    // expect(callback).toHaveBeenCalledTimes(1)
  })

  it('应该在浏览器环境外不启动计时器', () => {
    const originalWindow = globalThis.window
    // @ts-expect-error - 测试环境
    delete globalThis.window

    const { start, current, isCounting } = useSecondsCountdown(5)

    start()
    expect(current.value).toBe(5)
    expect(isCounting.value).toBe(false)

    // 恢复 window
    globalThis.window = originalWindow
  })

  it('应该响应 current 值变化自动停止', async () => {
    const { start, current, isCounting } = useSecondsCountdown(5)

    start()
    await nextTick()
    expect(isCounting.value).toBe(true)

    // 手动设置 current 为 0
    current.value = 0
    await nextTick()

    expect(isCounting.value).toBe(false)
  })
})
