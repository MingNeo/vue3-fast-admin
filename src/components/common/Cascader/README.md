# Cascader
级联选择。基于element-plus的Cascader组件二次封装。扩充以下功能：

- 传入一个service获取全量数据
- 增加viewMode模式用于回显

<demo src="./demos/demo1.vue" />

## 使用方法

```html
<script setup lang="ts">
import { getCascadeList } from '@/api/cascade'

const value = ref()
</script>

<template>
  <common-cascader
    v-model="value"
    :service="getCascadeList"
    clearable
  />
</template>

```

### API
继承自element-plus的Cascader组件，以下为差异的API
| 参数        | 说明 | 类型    | 默认值 |
| ----------- | ---------- | ------- | ------ |
| service      | 获取全量数据的service | `() => Promise<any[]>` | -      |

### 事件

| 事件        | 说明 | 类型    |
| ----------- | ---------- | ------- |
| change       | 选中值发生变化时的回调函数 | `(selectedValue: Id[] \| Array<Id[]>, selectedOptions: any[]) => void` |
