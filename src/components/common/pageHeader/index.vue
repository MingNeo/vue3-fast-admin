<script lang="ts" setup>
defineProps<{
  showBack?: boolean
  title?: string
  actions?: any[]
  tabs?: string[]
  tabActiveKey?: number
}>()

const emit = defineEmits(['cancel', 'update:tabActiveKey'])

const query = useUrlData()

function handleCancel() {
  emit('cancel')
}

function handleUpdateTabActiveKey(...args: any) {
  query.value = {}
  setTimeout(() => {
    emit('update:tabActiveKey', ...args)
  }, 100)
}
</script>

<template>
  <div class="header t-page-header relative z-20 h-[60px] flex justify-between items-center bg-bg-white px-6 py-3 shadow-[0_2px_6px_-5px_rgba(0,0,0,0.04),0_2px_6px_rgba(0,0,0,0.06)]" v-bind="$attrs">
    <div class="title flex items-center">
      <Icon v-if="showBack" icon="icon-park-outline:left" class="back-icon mr-2 cursor-pointer" @click="handleCancel" />
      <slot name="title">
        <div v-if="title" class="mr-[10px]">
          {{ title }}
        </div>

        <common-tabs v-if="tabs" :active-key="tabActiveKey" @update:active-key="handleUpdateTabActiveKey">
          <el-tab-pane v-for="(item, index) in tabs" :key="index" :tab="item" />
        </common-tabs>
      </slot>
    </div>

    <div class="text-right">
      <slot name="actions">
        <CommonButtonActions v-if="actions?.length" class="footer" :actions="actions" />
      </slot>
    </div>
  </div>
</template>
