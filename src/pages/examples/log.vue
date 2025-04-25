<script setup lang="ts">
// import { ProModalDetail } from 'pro-el-components' // 使用自动导入

const { t } = useI18n()

const mockData = ref([
  { id: 1, user: 'admin', action: `${t('log.action')}1`, time: '2024-05-01 10:00', detail: '登录系统' },
  { id: 2, user: 'admin', action: `${t('log.action')}2`, time: '2024-05-01 10:10', detail: '添加用户 user1' },
  { id: 3, user: 'user', action: `${t('log.action')}3`, time: '2024-05-01 11:00', detail: '修改邮箱' },
])
const searchData = ref<Record<string, any>>({})
const detailVisible = ref(false)
const detailLog = ref<any>({})

const searchFields = [
  { label: t('log.user'), prop: 'user', type: 'input', fieldProps: { placeholder: t('log.user') } },
  { label: t('log.action'), prop: 'action', type: 'input', fieldProps: { placeholder: t('log.action') } },
]

const columns = [
  { label: t('log.user'), prop: 'user' },
  { label: t('log.action'), prop: 'action' },
  { label: t('log.time'), prop: 'time' },
  {
    label: t('user.actions'),
    prop: 'actions',
    columnType: 'actions',
    width: 120,
    actions: (row: any) => [
      {
        text: t('log.detail'),
        onClick: () => showDetail(row),
      },
    ],
  },
]

const detailFields = [
  { label: t('log.user'), prop: 'user', type: 'text' },
  { label: t('log.action'), prop: 'action', type: 'text' },
  { label: t('log.time'), prop: 'time', type: 'text' },
  { label: t('log.detail'), prop: 'detail', type: 'text' },
]

const dataSource = computed(() => {
  let arr = mockData.value
  if (searchData.value.user)
    arr = arr.filter(l => l.user.includes(searchData.value.user))
  if (searchData.value.action)
    arr = arr.filter(l => l.action.includes(searchData.value.action))
  return arr
})

function handleSearch(val: any) {
  searchData.value = val
}

function showDetail(row: any) {
  detailLog.value = row
  detailVisible.value = true
}
</script>

<template>
  <CommonListPage title="日志管理" :search-fields="searchFields" :columns="columns" :data="dataSource" @search="handleSearch">
    <ProModalDetail v-model="detailVisible" :title="t('log.detail')" :fields="detailFields" :default-value="detailLog" :view-mode="true" />
  </CommonListPage>
</template>
