<script setup lang="ts">
defineOptions({ inheritAttrs: false })
</script>

<template>
  <el-tabs v-bind="$attrs" :class="`common-tabs-${$attrs.type} ${$attrs?.class} bg-transparent border-0 rounded-t-lg`">
    <template v-for="(_, key) in $slots" :key="key" #[key]="slotProps">
      <slot :name="key" v-bind="slotProps || {}" />
    </template>
  </el-tabs>
</template>
