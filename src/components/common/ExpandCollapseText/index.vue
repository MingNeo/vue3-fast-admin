<script lang="ts" setup>
import { computed, defineProps, ref, withDefaults } from 'vue'

const props = withDefaults(
  defineProps<{
    value?: string
    defaultShow?: boolean
    maxLength?: number
    showButton?: boolean
  }>(),
  { defaultShow: false, maxLength: 50, value: '', showButton: true },
)

const show = ref(props.defaultShow)
const showSummary = computed(() => props.value.length > props.maxLength)
const summaryText = computed(() =>
  (showSummary.value && !show.value)
    ? `${props.value.slice(0, props.maxLength)}...`
    : props.value,
)

function toggle() {
  show.value = !show.value
}
</script>

<template>
  <div>
    <span>{{ summaryText }}</span>
    <span v-if="showButton && showSummary" class="arrow cursor-pointer text-[#007aff]" @click="toggle">
      {{ show ? '收起' : '展开' }}
    </span>
  </div>
</template>
