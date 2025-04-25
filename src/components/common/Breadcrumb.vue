<script setup lang="ts">
import { findMenuPathByPath } from '@/utils/menu'
import { ArrowRight } from '@element-plus/icons-vue'

defineProps<{
  separatorIcon?: string
}>()

const route = useRoute()
const menuStore = useMenuStore()
const breadcrumbItems = computed(() => {
  const home = { title: '主页', path: '/' }
  const menuPath = findMenuPathByPath(menuStore.showMenus, route.path)
  return [home, ...menuPath]
})
</script>

<template>
  <el-breadcrumb :separator-icon="separatorIcon || ArrowRight">
    <el-breadcrumb-item v-for="item in breadcrumbItems" :key="item.path" :to="item.path">
      {{ item.title }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>
