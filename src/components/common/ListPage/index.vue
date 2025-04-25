<script setup lang="ts">
import type { TableProps } from 'pro-el-components'
// import { ProListPageContent, ProSearchForm, ProTable } from 'pro-el-components'

defineOptions({
  name: 'ListPage',
  inheritAttrs: false,
})

defineProps<{
  title: string
  searchFields?: any[]
  data: TableProps['data']
  columns: TableProps['columns']
  tableProps?: TableProps
  actions?: any[]
}>()

const emit = defineEmits(['search', 'detail'])
function handleSearch(searchFormData: any) {
  emit('search', searchFormData)
}
</script>

<template>
  <div class="flex flex-col h-full space-y-2">
    <common-breadcrumb class="pt-5 px-5 pb-3" />
    <ProListPageContent :title="title" :actions="actions">
      <ProSearchForm v-if="searchFields" class="mb-5" :fields="searchFields" @submit="handleSearch" @reset="handleSearch" />
      <ProTable :data="data" :columns="columns" v-bind="tableProps" />
      <slot />
      <template v-for="slot in $slots" :key="slot">
        <slot :name="slot" />
      </template>
    </ProListPageContent>
  </div>
</template>
