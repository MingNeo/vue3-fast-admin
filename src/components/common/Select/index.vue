<script lang="ts" setup>
import { debounce } from 'lodash-es'

const props = withDefaults(defineProps<{
  service?: (keyword?: string) => Promise<Record<string, any>[]>
  fieldNames?: { label: string, value: string | number }
  options?: Record<string, any>[]
  searchable?: boolean
  readonly?: boolean
  emptyText?: string
  modelValue?: any
}>(), { fieldNames: () => ({ label: 'name', value: 'id' }), emptyText: '暂无数据' })

const attrs = useAttrs() as any

const loading = ref(false)

function formatOptions(result?: Record<string, any>[]) {
  return (result || []).map(item => ({
    ...item,
    [props.fieldNames.label]: item[props.fieldNames.label],
  }))
}

const options = ref<Record<string, any>[]>(formatOptions(props.options))

watch(() => props.options, v => options.value = formatOptions(v))

async function fetchData(keyword?: string) {
  if (props.service) {
    loading.value = true

    try {
      const result = await props.service(keyword)
      options.value = formatOptions(result)
    }
    catch (error) {}
    loading.value = false
  }
}

watchEffect(() => fetchData())

const handleSearch = debounce((value: string) => {
  fetchData(value)
}, 1000)

// 查看模式下回显
function getDisplayText() {
  if (props.modelValue) {
    if (attrs.multiple)
      return props.modelValue.map((item: string | number) => options.value.find(option => option[props.fieldNames.value] === item)?.[props.fieldNames.label] || item).join('；')
    return options.value.find(option => option[props.fieldNames.value] === props.modelValue)?.[props.fieldNames.label] || props.modelValue
  }
  return '--'
}
</script>

<template>
  <el-select
    v-if="!readonly"
    :loading="loading"
    :model-value="modelValue"
    v-bind="$attrs"
    :field-names="fieldNames"
    :filterable="false"
    v-on="searchable ? { remoteMethod: handleSearch } : {}"
  >
    <el-option
      v-for="item in options"
      :key="item[fieldNames.value]"
      :label="item[fieldNames.label]"
      :value="item[fieldNames.value]"
    />
    <template #empty>
      {{ loading ? '' : emptyText }}
    </template>
  </el-select>
  <template v-else>
    {{ getDisplayText() }}
  </template>
</template>
