<script lang="ts" setup>
defineProps<{
  modelValue?: boolean
  showFooter?: boolean
  cancelText?: string
  confirmText?: string
  confirmLoading?: boolean
  footerClass?: string
}>()

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

function handleConfirm() {
  emit('confirm')
  emit('update:modelValue', false)
}

function handleCancel() {
  emit('cancel')
  emit('update:modelValue', false)
}
</script>

<template>
  <ElDialog :model-value="modelValue" :show-close="false" align-center v-bind="$attrs" @update:model-value="emit('update:modelValue', $event)">
    <template #footer>
      <slot name="footer">
        <div v-if="showFooter" class="dialog-footer flex justify-center" :class="footerClass">
          <el-button @click="handleCancel">
            {{ cancelText || '取消' }}
          </el-button>
          <el-button v-loading="!!confirmLoading" type="primary" @click="handleConfirm">
            {{ confirmText || '提交' }}
          </el-button>
        </div>
      </slot>
    </template>

    <template v-for="(_, key) in $slots" :key="key" #[key]="slotProps">
      <slot :name="key" v-bind="slotProps || {}" />
    </template>
  </ElDialog>
</template>

<style lang="scss">
  .el-dialog {
    --el-dialog-width: 50%;
  }
</style>
