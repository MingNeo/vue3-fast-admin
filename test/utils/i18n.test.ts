import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock Vue's getCurrentInstance
const mockInstance = {
  proxy: {
    $t: vi.fn(),
  },
}

vi.mock('vue', () => ({
  getCurrentInstance: vi.fn(() => mockInstance),
}))

describe('i18n utils', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('t function', () => {
    it('应该调用Vue实例的$t方法', async () => {
      const { t } = await import('@/utils/i18n')

      mockInstance.proxy.$t.mockReturnValue('翻译后的文本')

      const result = t('test.key')

      expect(mockInstance.proxy.$t).toHaveBeenCalledWith('test.key')
      expect(result).toBe('翻译后的文本')
    })

    it('应该能够处理不同的key', async () => {
      const { t } = await import('@/utils/i18n')

      mockInstance.proxy.$t.mockImplementation((key: string) => `translated_${key}`)

      expect(t('common.save')).toBe('translated_common.save')
      expect(t('user.name')).toBe('translated_user.name')
      expect(t('error.message')).toBe('translated_error.message')
    })

    it('应该处理空字符串key', async () => {
      const { t } = await import('@/utils/i18n')

      mockInstance.proxy.$t.mockReturnValue('')

      const result = t('')

      expect(mockInstance.proxy.$t).toHaveBeenCalledWith('')
      expect(result).toBe('')
    })

    it('应该处理特殊字符的key', async () => {
      const { t } = await import('@/utils/i18n')

      const specialKey = 'test.key-with_special.chars123'
      mockInstance.proxy.$t.mockReturnValue('special translation')

      const result = t(specialKey)

      expect(mockInstance.proxy.$t).toHaveBeenCalledWith(specialKey)
      expect(result).toBe('special translation')
    })
  })
})
