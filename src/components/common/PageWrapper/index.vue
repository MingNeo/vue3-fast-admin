<script setup lang="ts">
const currentRoute = useRouter().currentRoute
const permissionStore = usePermissionStore()
const hasPermission = computed(() => permissionStore.checkHasAuth(currentRoute.value.meta))
</script>

<template>
  <div v-if="hasPermission" class="page-wrapper flex-1 flex flex-col overflow-auto h-full">
    <slot />
  </div>
  <div v-else class="flex-1 flex items-center justify-center">
    <el-empty description="无权访问当前页面" />
  </div>
</template>
