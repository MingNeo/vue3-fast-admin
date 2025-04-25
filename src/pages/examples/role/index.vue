<script setup lang="ts">
// import { ProModalDetail } from 'pro-el-components' // 测试自动导入
import * as api from './service'

const { t } = useI18n()

const roleList = ref<any[]>([])
const treeData = ref<any[]>([])
const editModalVisible = ref(false)
const permModalVisible = ref(false)
const editRole = ref<any>({})
const searchData = ref({})

const searchFields = [
  { label: t('role.name'), prop: 'name', type: 'input', fieldProps: { placeholder: t('role.name') } },
  { label: t('role.desc'), prop: 'desc', type: 'input', fieldProps: { placeholder: t('role.desc') } },
]

// 表格列配置
const columns = [
  { label: t('role.name'), prop: 'name' },
  { label: t('role.desc'), prop: 'desc' },
  {
    label: t('role.actions'),
    prop: 'actions',
    columnType: 'actions',
    width: 220,
    actions: (row: any) => [
      {
        text: t('role.edit'),
        onClick: (row?: any) => {
          editRole.value = row ? { ...row } : { perms: [] }
          editModalVisible.value = true
        },
        auth: 'role:edit',
      },
      {
        text: t('role.delete'),
        danger: true,
        onClick: () => remove(row),
        confirm: true,
        confirmText: t('common.cancel'),
        auth: 'role:delete',
      },
      {
        text: t('role.assignPerm'),
        onClick: () => {
          editRole.value = { ...row }
          permModalVisible.value = true
        },
        auth: 'role:perm',
      },
    ],
  },
]

// 编辑/创建角色弹窗表单配置
const formFields = [
  { label: t('role.name'), prop: 'name', type: 'input', fieldProps: { placeholder: t('role.name') } },
  { label: t('role.desc'), prop: 'desc', type: 'input', fieldProps: { placeholder: t('role.desc') } },
]

const permissionForm = computed(() => [
  {
    label: t('role.name'),
    prop: 'name',
    type: 'component',
    component: 'ElTree',
    fieldProps: {
      data: treeData.value,
      showCheckbox: true,
      nodeKey: 'key',
      defaultCheckedKeys: editRole.value.perms,
    },
    onClick: (_: any, { checkedKeys }: any) => {
      editRole.value.perms = checkedKeys
    },
  },
])

function saveRole(data: any) {
  api.saveRole(data)
  editModalVisible.value = false
}

function remove(row: any) {
  api.remove(row)
}

function savePerm() {
  permModalVisible.value = false
}

async function handleSearch(val: any) {
  searchData.value = val
  roleList.value = await api.getRoleList(val)
}

onMounted(async () => {
  roleList.value = await api.getRoleList()
  treeData.value = await api.getRoleTree()
})
</script>

<template>
  <CommonListPage :title="t('role.title')" :search-fields="searchFields" :columns="columns" :data="roleList" @search="handleSearch">
    <!-- 编辑角色弹窗 -->
    <ProModalDetail v-model="editModalVisible" :column="1" :title="editRole.id ? t('role.edit') : t('role.add')" :fields="formFields" :default-value="editRole" @ok="saveRole" />
    <!-- 分配权限弹窗 -->
    <ProModalDetail v-model="permModalVisible" :column="1" :title="t('role.assignPerm')" :fields="permissionForm" :default-value="editRole" @ok="savePerm" />
  </CommonListPage>
</template>
