import { usePermissionStore } from '@/stores/permission'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'

describe('usePermissionStore', () => {
  let permissionStore: ReturnType<typeof usePermissionStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    permissionStore = usePermissionStore()
  })

  describe('初始状态', () => {
    it('应该有正确的初始状态', () => {
      expect(permissionStore.roles).toEqual(['admin'])
      expect(permissionStore.permissions).toEqual([])
    })
  })

  describe('setRoles', () => {
    it('应该正确设置角色', () => {
      const newRoles = ['user', 'editor']

      permissionStore.setRoles(newRoles)

      expect(permissionStore.roles).toEqual(newRoles)
    })

    it('应该替换现有角色', () => {
      permissionStore.setRoles(['role1', 'role2'])
      permissionStore.setRoles(['role3'])

      expect(permissionStore.roles).toEqual(['role3'])
    })

    it('应该能设置空角色数组', () => {
      permissionStore.setRoles([])

      expect(permissionStore.roles).toEqual([])
    })
  })

  describe('setPermissions', () => {
    it('应该正确设置权限', () => {
      const newPermissions = ['user:read', 'user:write']

      permissionStore.setPermissions(newPermissions)

      expect(permissionStore.permissions).toEqual(newPermissions)
    })

    it('应该替换现有权限', () => {
      permissionStore.setPermissions(['perm1', 'perm2'])
      permissionStore.setPermissions(['perm3'])

      expect(permissionStore.permissions).toEqual(['perm3'])
    })

    it('应该能设置空权限数组', () => {
      permissionStore.setPermissions([])

      expect(permissionStore.permissions).toEqual([])
    })
  })

  describe('checkHasPermission', () => {
    beforeEach(() => {
      permissionStore.setPermissions(['user:read', 'user:write', 'admin:delete'])
    })

    it('应该对单个权限返回true', () => {
      expect(permissionStore.checkHasPermission('user:read')).toBe(true)
      expect(permissionStore.checkHasPermission('user:write')).toBe(true)
      expect(permissionStore.checkHasPermission('admin:delete')).toBe(true)
    })

    it('应该对不存在的权限返回false', () => {
      expect(permissionStore.checkHasPermission('user:delete')).toBe(false)
      expect(permissionStore.checkHasPermission('nonexistent')).toBe(false)
    })

    it('应该对权限数组返回true如果包含任一权限', () => {
      expect(permissionStore.checkHasPermission(['user:read', 'user:delete'])).toBe(true)
      expect(permissionStore.checkHasPermission(['admin:delete', 'super:admin'])).toBe(true)
    })

    it('应该对权限数组返回false如果不包含任何权限', () => {
      expect(permissionStore.checkHasPermission(['user:delete', 'user:create'])).toBe(false)
      expect(permissionStore.checkHasPermission(['nonexistent1', 'nonexistent2'])).toBe(false)
    })

    it('应该对空权限或undefined返回false', () => {
      expect(permissionStore.checkHasPermission('')).toBe(false)
      expect(permissionStore.checkHasPermission(undefined)).toBe(false)
    })

    it('应该对空数组返回false', () => {
      expect(permissionStore.checkHasPermission([])).toBe(false)
    })
  })

  describe('checkHasRole', () => {
    beforeEach(() => {
      permissionStore.setRoles(['admin', 'editor', 'viewer'])
    })

    it('应该对单个角色返回true', () => {
      expect(permissionStore.checkHasRole('admin')).toBe(true)
      expect(permissionStore.checkHasRole('editor')).toBe(true)
      expect(permissionStore.checkHasRole('viewer')).toBe(true)
    })

    it('应该对不存在的角色返回false', () => {
      expect(permissionStore.checkHasRole('user')).toBe(false)
      expect(permissionStore.checkHasRole('nonexistent')).toBe(false)
    })

    it('应该对角色数组返回true如果包含任一角色', () => {
      expect(permissionStore.checkHasRole(['admin', 'user'])).toBe(true)
      expect(permissionStore.checkHasRole(['editor', 'super'])).toBe(true)
    })

    it('应该对角色数组返回false如果不包含任何角色', () => {
      expect(permissionStore.checkHasRole(['user', 'guest'])).toBe(false)
      expect(permissionStore.checkHasRole(['nonexistent1', 'nonexistent2'])).toBe(false)
    })

    it('应该对空角色或undefined返回false', () => {
      expect(permissionStore.checkHasRole('')).toBe(false)
      expect(permissionStore.checkHasRole(undefined)).toBe(false)
    })

    it('应该对空数组返回false', () => {
      expect(permissionStore.checkHasRole([])).toBe(false)
    })
  })

  describe('checkHasAuth', () => {
    beforeEach(() => {
      permissionStore.setRoles(['admin', 'editor'])
      permissionStore.setPermissions(['user:read', 'user:write'])
    })

    it('应该对无权限要求的路由返回true', () => {
      const meta = {}
      expect(permissionStore.checkHasAuth(meta)).toBe(true)
    })

    it('应该对有效权限返回true', () => {
      const meta = { permission: 'user:read' }
      expect(permissionStore.checkHasAuth(meta)).toBe(true)
    })

    it('应该对有效角色返回true', () => {
      const meta = { role: 'admin' }
      expect(permissionStore.checkHasAuth(meta)).toBe(true)
    })

    it('应该对权限和角色都有效时返回true', () => {
      const meta = { permission: 'user:read', role: 'admin' }
      expect(permissionStore.checkHasAuth(meta)).toBe(true)
    })

    it('应该对权限或角色其中一个有效时返回true', () => {
      const meta1 = { permission: 'user:read', role: 'invalid' }
      const meta2 = { permission: 'invalid', role: 'admin' }

      expect(permissionStore.checkHasAuth(meta1)).toBe(true)
      expect(permissionStore.checkHasAuth(meta2)).toBe(true)
    })

    it('应该对无效权限和角色返回false', () => {
      const meta = { permission: 'invalid:permission', role: 'invalid:role' }
      expect(permissionStore.checkHasAuth(meta)).toBe(false)
    })

    it('应该对权限数组正确验证', () => {
      const meta1 = { permission: ['user:read', 'invalid'] }
      const meta2 = { permission: ['invalid1', 'invalid2'] }

      expect(permissionStore.checkHasAuth(meta1)).toBe(true)
      expect(permissionStore.checkHasAuth(meta2)).toBe(false)
    })

    it('应该对角色数组正确验证', () => {
      const meta1 = { role: ['admin', 'invalid'] }
      const meta2 = { role: ['invalid1', 'invalid2'] }

      expect(permissionStore.checkHasAuth(meta1)).toBe(true)
      expect(permissionStore.checkHasAuth(meta2)).toBe(false)
    })
  })
})
