import { mount } from '@vue/test-utils'
import { ElMessage } from 'element-plus'
import { describe, expect, it, vi } from 'vitest'
import Clipboard from '../index.vue'

vi.mock('element-plus', () => ({
  ElMessage: {
    success: vi.fn(),
  },
}))

describe('clipboard 组件', () => {
  // 测试基础渲染
  it('应该正确渲染传入的文本', () => {
    const wrapper = mount(Clipboard, {
      props: {
        text: '测试文本',
      },
    })

    expect(wrapper.text()).toContain('测试文本')
  })

  // 测试插槽内容
  it('应该正确渲染默认插槽内容', () => {
    const wrapper = mount(Clipboard, {
      props: {
        text: '测试文本',
      },
      slots: {
        default: '自定义内容',
      },
    })

    expect(wrapper.text()).toContain('自定义内容')
  })

  // 测试复制功能
  it('点击时应该触发复制功能', async () => {
    // 模拟 document.execCommand
    const execCommandMock = vi.fn()
    document.execCommand = execCommandMock

    const wrapper = mount(Clipboard, {
      props: {
        text: '要复制的文本',
      },
    })

    await wrapper.trigger('click')

    // 验证是否调用了复制命令
    expect(execCommandMock).toHaveBeenCalledWith('Copy')
    // 验证是否显示成功提示
    expect(ElMessage.success).toHaveBeenCalledWith('复制成功')
  })

  // 测试 DOM 操作
  it('复制时应该正确操作 DOM', async () => {
    const appendChildSpy = vi.spyOn(document.body, 'appendChild')
    const removeChildSpy = vi.spyOn(document.body, 'removeChild')

    const wrapper = mount(Clipboard, {
      props: {
        text: '要复制的文本',
      },
    })

    await wrapper.trigger('click')

    // 验证是否正确添加和移除了临时输入框
    expect(appendChildSpy).toHaveBeenCalled()
    expect(removeChildSpy).toHaveBeenCalled()

    appendChildSpy.mockRestore()
    removeChildSpy.mockRestore()
  })
})
