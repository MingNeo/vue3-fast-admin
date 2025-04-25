<script lang="ts" setup>
import { computed, ref, useSlots } from 'vue'

const props = withDefaults(defineProps<{
  text?: string
  maxLength?: number
  expandText?: string
  collapseText?: string
  defaultExpanded?: boolean
}>(), {
  text: '',
  maxLength: 100,
  expandText: '展开',
  collapseText: '收起',
  defaultExpanded: false,
})

const emit = defineEmits(['expand', 'collapse'])

const slots = useSlots()
const expanded = ref(props.defaultExpanded)
const hasSlotContent = computed(() => !!slots.default)

const content = computed(() => hasSlotContent.value ? '' : props.text)
const shouldTruncate = computed(() => {
  if (hasSlotContent.value) {
    const slotContent = slots.default?.()
    const first = slotContent && slotContent[0]
    const children = typeof first?.children === 'string' ? first.children : ''
    return children.length > props.maxLength
  }
  return content.value.length > props.maxLength
})

const displayContent = computed(() => {
  if (!shouldTruncate.value || expanded.value)
    return hasSlotContent.value ? undefined : content.value

  return hasSlotContent.value ? undefined : `${content.value.slice(0, props.maxLength)}...`
})

function toggle() {
  expanded.value = !expanded.value
  emit(expanded.value ? 'expand' : 'collapse')
}
</script>

<template>
  <div>
    <template v-if="hasSlotContent">
      <div v-if="!shouldTruncate || expanded">
        <slot />
      </div>
      <div v-else>
        <slot :max-length="maxLength" />...
      </div>
    </template>
    <span v-else>{{ displayContent }}</span>

    <span v-if="shouldTruncate" class="expand-collapse-button cursor-pointer text-blue-500 ml-1.5" @click="toggle">
      {{ expanded ? collapseText : expandText }}
    </span>
  </div>
</template>
