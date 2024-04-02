<script lang="ts" setup>
defineProps<{
  danger?: boolean
}>()
</script>

<template>
  <a :class="`link ${danger ? 'danger text-red' : ''}`" v-bind="$attrs">
    <slot />
  </a>
</template>
