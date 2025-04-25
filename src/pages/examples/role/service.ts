let roleList = [
  { id: 1, name: 'admin', desc: '超级管理员', perms: ['user:add', 'user:edit', 'role:add'] },
  { id: 2, name: 'user', desc: '普通用户', perms: [] },
]

export async function getRoleList(params: any = {}) {
  if (params.name)
    return roleList.filter(r => r.name.includes(params.name))
  if (params.desc)
    return roleList.filter(r => r.desc.includes(params.desc))
  return roleList
}

export async function saveRole(data: any) {
  if (data.id) {
    const idx = roleList.findIndex(r => r.id === data.id)
    if (idx > -1)
      roleList[idx] = { ...data }
  }
  else {
    roleList.push({ ...data, id: Date.now() })
  }
}

export async function remove(row: any) {
  roleList = roleList.filter(r => r.id !== row.id)
}

export async function getRoleTree() {
  return [
    { label: '用户', key: 'user', children: [
      { label: '新增', key: 'user:add' },
      { label: '编辑', key: 'user:edit' },
      { label: '删除', key: 'user:delete' },
      { label: '分配角色', key: 'user:role' },
    ] },
    { label: '角色', key: 'role', children: [
      { label: '新增', key: 'role:add' },
      { label: '编辑', key: 'role:edit' },
      { label: '删除', key: 'role:delete' },
      { label: '分配权限', key: 'role:perm' },
    ] },
  ]
}
