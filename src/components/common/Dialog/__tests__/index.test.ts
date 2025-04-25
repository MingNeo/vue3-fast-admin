import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Dialog from '../index.vue'

describe('dialog 组件', () => {
  it('应该正确渲染标题', () => {
    const wrapper = mount(Dialog, {
      props: {
        title: '测试标题',
        modelValue: true,
      },
    })

    expect(wrapper.find('.el-dialog__title').text()).toBe('测试标题')
  })

  it('应该正确显示/隐藏页脚', () => {
    const wrapper = mount(Dialog, {
      props: {
        modelValue: true,
        showFooter: true,
      },
    })

    expect(wrapper.find('.dialog-footer').exists()).toBe(true)

    await wrapper.setProps({ showFooter: false })
    expect(wrapper.find('.dialog-footer').exists()).toBe(false)
  })

  it('应该正确触发关闭事件', async () => {
    const wrapper = mount(Dialog, {
      props: {
        modelValue: true,
        showFooter: true,
      },
    })

    await wrapper.find('.dialog-footer el-button').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')[0]).toEqual([false])
  })
})
