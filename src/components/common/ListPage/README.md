# ListPage
用于快速生成通用列表页，包含面包屑、筛选区、标题、按钮行、内容区域(table)

## 使用方法

```vue
<script lang="ts" setup>
import ListPage from '@/components/ListPage.vue' // 可忽略，自动引入

const actions = [{
  text: '新增',
  onClick: handleCreate,
  type: 'primary',
}]
</script>

<template>
  <ListPage title="日志管理" :search-fields="searchFields" :columns="columns" :data="dataSource" @search="handleSearch" />
</template>
```

你在很多 admin 工程中都会看到类似当前组件的实现，类似的组件可以快速搭建出一个通用样式的列表页，但是当有定制化需求的时候，就会显得力不从心。

因此，该组件与其他工程中类似组件唯一的也是最大的区别是，该组件并不是一个单独实现的组件，而是多个内置组件的简单组合。
因此，当你需要时，可以随时回退至原始的写法！

为了简单，ListPage未继承ProSearchForm、ProTable的slot，仅透传了 props，当需要使用 slot 扩展更多自定义内容时、或者在任意位置任意修改样式，建议替换为以下原始写法。
等同于以下原始写法。
```vue
<template>
  <common-breadcrumb class="p-5" />
  <CommonListPageContent :title="title">
    <ProSearchForm v-if="searchFields" :fields="searchFields" class="mb-4" @submit="emit('search', $event)" />
    <ProTable :data="data" :columns="columns" v-bind="tableProps" />
    <slot />
  </CommonListPageContent>
</template>
```

## API

### Props
| 参数名 | 类型   | 默认值 | 说明           |
| ------ | ------ | ------ | -------------- |
| title  | String | ''     | 页面的标题名称 |
| searchFields | any[] | []     | 筛选区配置 |
| data | TableProps['data'] | []     | 表格数据 |
| columns | TableProps['columns'] | []     | 表格列配置 |
| tableProps | TableProps | {}     | 其他表格配置 |

### Slots
| 插槽名   | 说明               |
| -------- | ------------------ |
| -        | 页面主要内容的插槽 |
| title  | 页面顶部标题的插槽，使用此插槽则通过title参数设置无效 |
| actions  | 页面顶部操作的插槽 |
