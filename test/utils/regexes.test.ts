import {
  CURRENCY_AMOUNT_REGEX,
  EMAIL_REGEX,
  ID_CARD_REGEX,
  LANDLINE_NUMBER_REGEX,
  PASSWORD_REGEX,
  PHONE_NUMBER_REGEX,
  POSTAL_CODE_REGEX,
  USERNAME_REGEX,
} from '@/utils/regexes'
import { describe, expect, it } from 'vitest'

describe('regexes utils', () => {
  describe('uSERNAME_REGEX', () => {
    it('应该匹配有效的用户名', () => {
      expect(USERNAME_REGEX.test('user123')).toBe(true)
      expect(USERNAME_REGEX.test('my_username')).toBe(true)
      expect(USERNAME_REGEX.test('test_user_123')).toBe(true)
      expect(USERNAME_REGEX.test('abcde')).toBe(true) // 5个字符
      expect(USERNAME_REGEX.test('a'.repeat(20))).toBe(true) // 20个字符
    })

    it('应该拒绝无效的用户名', () => {
      expect(USERNAME_REGEX.test('abc')).toBe(false) // 少于5个字符
      expect(USERNAME_REGEX.test('a'.repeat(21))).toBe(false) // 超过20个字符
      expect(USERNAME_REGEX.test('user-123')).toBe(false) // 包含连字符
      expect(USERNAME_REGEX.test('user@123')).toBe(false) // 包含特殊字符
      expect(USERNAME_REGEX.test('user 123')).toBe(false) // 包含空格
      expect(USERNAME_REGEX.test('用户123')).toBe(false) // 包含中文
    })
  })

  describe('pASSWORD_REGEX', () => {
    it('应该匹配有效的密码', () => {
      expect(PASSWORD_REGEX.test('Password1')).toBe(true)
      expect(PASSWORD_REGEX.test('MyPass123')).toBe(true)
      expect(PASSWORD_REGEX.test('Test1234')).toBe(true)
      expect(PASSWORD_REGEX.test('Abcdef12')).toBe(true) // 8个字符
    })

    it('应该拒绝无效的密码', () => {
      expect(PASSWORD_REGEX.test('password')).toBe(false) // 没有大写字母和数字
      expect(PASSWORD_REGEX.test('PASSWORD')).toBe(false) // 没有小写字母和数字
      expect(PASSWORD_REGEX.test('Password')).toBe(false) // 没有数字
      expect(PASSWORD_REGEX.test('password1')).toBe(false) // 没有大写字母
      expect(PASSWORD_REGEX.test('Pass1')).toBe(false) // 少于8个字符
      expect(PASSWORD_REGEX.test(`${'A'.repeat(16)}1`)).toBe(false) // 超过16个字符
    })
  })

  describe('eMAIL_REGEX', () => {
    it('应该匹配有效的邮箱', () => {
      expect(EMAIL_REGEX.test('test@example.com')).toBe(true)
      expect(EMAIL_REGEX.test('user.name@domain.co.uk')).toBe(true)
      expect(EMAIL_REGEX.test('user+tag@example.org')).toBe(true)
      expect(EMAIL_REGEX.test('user-name@example-domain.com')).toBe(true)
      expect(EMAIL_REGEX.test('123@test.cn')).toBe(true)
    })

    it('应该拒绝无效的邮箱', () => {
      expect(EMAIL_REGEX.test('invalid-email')).toBe(false)
      expect(EMAIL_REGEX.test('@example.com')).toBe(false)
      expect(EMAIL_REGEX.test('user@')).toBe(false)
      expect(EMAIL_REGEX.test('user@domain')).toBe(false)
      expect(EMAIL_REGEX.test('user..name@example.com')).toBe(false)
    })
  })

  describe('pHONE_NUMBER_REGEX', () => {
    it('应该匹配有效的手机号码', () => {
      expect(PHONE_NUMBER_REGEX.test('13812345678')).toBe(true)
      expect(PHONE_NUMBER_REGEX.test('15987654321')).toBe(true)
      expect(PHONE_NUMBER_REGEX.test('18612345678')).toBe(true)
      expect(PHONE_NUMBER_REGEX.test('17712345678')).toBe(true)
    })

    it('应该拒绝无效的手机号码', () => {
      expect(PHONE_NUMBER_REGEX.test('12812345678')).toBe(false) // 不是1[3-9]开头
      expect(PHONE_NUMBER_REGEX.test('1381234567')).toBe(false) // 少于11位
      expect(PHONE_NUMBER_REGEX.test('138123456789')).toBe(false) // 超过11位
      expect(PHONE_NUMBER_REGEX.test('1081234567')).toBe(false) // 第二位不是3-9
    })
  })

  describe('lANDLINE_NUMBER_REGEX', () => {
    it('应该匹配有效的座机号码', () => {
      expect(LANDLINE_NUMBER_REGEX.test('010-12345678')).toBe(true)
      expect(LANDLINE_NUMBER_REGEX.test('020-12345678')).toBe(true)
      expect(LANDLINE_NUMBER_REGEX.test('0755-1234567')).toBe(true)
      expect(LANDLINE_NUMBER_REGEX.test('12345678')).toBe(true) // 无区号
    })

    it('应该拒绝无效的座机号码', () => {
      expect(LANDLINE_NUMBER_REGEX.test('123456')).toBe(false) // 太短
      expect(LANDLINE_NUMBER_REGEX.test('123456789')).toBe(false) // 太长
      expect(LANDLINE_NUMBER_REGEX.test('0-1234567')).toBe(false) // 区号太短
    })
  })

  describe('iD_CARD_REGEX', () => {
    it('应该匹配有效的身份证号码', () => {
      expect(ID_CARD_REGEX.test('123456789012345')).toBe(true) // 15位
      expect(ID_CARD_REGEX.test('12345678901234567X')).toBe(true) // 18位带X
      expect(ID_CARD_REGEX.test('123456789012345678')).toBe(true) // 18位数字
      expect(ID_CARD_REGEX.test('12345678901234567x')).toBe(true) // 18位带小写x
    })

    it('应该拒绝无效的身份证号码', () => {
      expect(ID_CARD_REGEX.test('12345678901234')).toBe(false) // 14位
      expect(ID_CARD_REGEX.test('1234567890123456')).toBe(false) // 16位
      expect(ID_CARD_REGEX.test('1234567890123456789')).toBe(false) // 19位
      expect(ID_CARD_REGEX.test('12345678901234567Y')).toBe(false) // 无效字母
    })
  })

  describe('pOSTAL_CODE_REGEX', () => {
    it('应该匹配有效的邮政编码', () => {
      expect(POSTAL_CODE_REGEX.test('100000')).toBe(true)
      expect(POSTAL_CODE_REGEX.test('518000')).toBe(true)
      expect(POSTAL_CODE_REGEX.test('999999')).toBe(true)
    })

    it('应该拒绝无效的邮政编码', () => {
      expect(POSTAL_CODE_REGEX.test('000000')).toBe(false) // 不能以0开头
      expect(POSTAL_CODE_REGEX.test('12345')).toBe(false) // 少于6位
      expect(POSTAL_CODE_REGEX.test('1234567')).toBe(false) // 超过6位
      expect(POSTAL_CODE_REGEX.test('12345a')).toBe(false) // 包含字母
    })
  })

  describe('cURRENCY_AMOUNT_REGEX', () => {
    it('应该匹配有效的金额', () => {
      expect(CURRENCY_AMOUNT_REGEX.test('100')).toBe(true)
      expect(CURRENCY_AMOUNT_REGEX.test('100.00')).toBe(true)
      expect(CURRENCY_AMOUNT_REGEX.test('99.9')).toBe(true)
      expect(CURRENCY_AMOUNT_REGEX.test('0.01')).toBe(true)
      expect(CURRENCY_AMOUNT_REGEX.test('0')).toBe(true)
      expect(CURRENCY_AMOUNT_REGEX.test('1234567.89')).toBe(true)
    })

    it('应该拒绝无效的金额', () => {
      expect(CURRENCY_AMOUNT_REGEX.test('100.123')).toBe(false) // 超过2位小数
      expect(CURRENCY_AMOUNT_REGEX.test('0100')).toBe(false) // 前导零
      expect(CURRENCY_AMOUNT_REGEX.test('.99')).toBe(false) // 没有整数部分
      expect(CURRENCY_AMOUNT_REGEX.test('100.')).toBe(false) // 没有小数部分
      expect(CURRENCY_AMOUNT_REGEX.test('-100')).toBe(false) // 负数
      expect(CURRENCY_AMOUNT_REGEX.test('100,000')).toBe(false) // 包含逗号
    })
  })
})
