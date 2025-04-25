<script setup lang="ts">
// import { ProModalDetail } from 'pro-el-components' // 使用自动导入
import { computed, ref } from 'vue'

// console.log(ProModalDetail) // 移除测试代码

const { t } = useI18n()

const userList = ref([
  { id: 1, username: 'admin', email: 'admin@test.com', role: 'admin' },
  { id: 2, username: 'user', email: 'user@test.com', role: 'user' },
])
const roles = ref(['admin', 'user', 'editor'])
const editVisible = ref(false)
const roleVisible = ref(false)
const editUser = ref<any>({})
const searchData = ref<{ username?: string, email?: string, role?: string }>({})

const searchFields = [
  { label: t('user.username'), prop: 'username', type: 'input', fieldProps: { placeholder: t('user.username') } },
  { label: t('user.email'), prop: 'email', type: 'input', fieldProps: { placeholder: t('user.email') } },
  { label: t('user.role'), prop: 'role', type: 'select', options: roles.value.map(r => ({ label: r, value: r })), fieldProps: { placeholder: t('user.role') } },
]

const columns = [
  { label: t('user.username'), prop: 'username' },
  { label: t('user.email'), prop: 'email' },
  { label: t('user.role'), prop: 'role' },
  {
    label: t('user.actions'),
    prop: 'actions',
    columnType: 'actions',
    width: 220,
    actions: (row: any) => [
      {
        text: t('user.edit'),
        onClick: () => openEdit(row),
        auth: 'user:edit',
      },
      {
        text: t('user.delete'),
        danger: true,
        onClick: () => remove(row),
        confirm: true,
        confirmText: t('common.cancel'),
        auth: 'user:delete',
      },
      {
        text: t('user.assignRole'),
        onClick: () => openRole(row),
        auth: 'user:role',
      },
    ],
  },
]

const formFields = [
  { label: t('user.username'), prop: 'username', type: 'input' },
  { label: t('user.email'), prop: 'email', type: 'input' },
]

const roleFields = [
  { label: t('user.role'), prop: 'role', type: 'select', options: roles.value.map(r => ({ label: r, value: r })), fieldProps: { placeholder: t('user.role') } },
]

function openEdit(row?: any) {
  editUser.value = row ? { ...row } : {}
  editVisible.value = true
}

function saveUser(data: any) {
  if (data.id) {
    const idx = userList.value.findIndex(u => u.id === data.id)
    if (idx > -1)
      userList.value[idx] = { ...data }
  }
  else {
    userList.value.push({ ...data, id: Date.now() })
  }
  editVisible.value = false
}

function remove(row: any) {
  userList.value = userList.value.filter(u => u.id !== row.id)
}

function openRole(row: any) {
  editUser.value = { ...row }
  roleVisible.value = true
}

function saveRole(data: any) {
  const idx = userList.value.findIndex(u => u.id === editUser.value.id)
  if (idx > -1)
    userList.value[idx].role = data.role
  roleVisible.value = false
}

function handleSearch(val: any) {
  searchData.value = val
}

const filteredUsers = computed(() => {
  let arr = userList.value
  if (searchData.value.username)
    arr = arr.filter(u => u.username.includes(searchData.value.username!))
  if (searchData.value.email)
    arr = arr.filter(u => u.email.includes(searchData.value.email!))
  if (searchData.value.role)
    arr = arr.filter(u => u.role === searchData.value.role)
  return arr
})

const actions = [
  {
    text: t('user.add'),
    onClick: () => openEdit(),
    type: 'primary',
    auth: 'user:add',
  },
]
</script>

<template>
  <CommonListPage :title="t('user.title')" :search-fields="searchFields" :columns="columns" :data="filteredUsers" :actions="actions" @search="handleSearch">
    <!-- 编辑用户弹窗 -->
    <ProModalDetail v-model="editVisible" :column="1" :title="editUser.id ? t('user.edit') : t('user.add')" :fields="formFields" :default-value="editUser" @ok="saveUser" />
    <!-- 分配角色弹窗 -->
    <ProModalDetail v-model="roleVisible" :column="1" :title="t('user.assignRole')" :fields="roleFields" :default-value="editUser" @ok="saveRole" />
  </CommonListPage>
</template>
