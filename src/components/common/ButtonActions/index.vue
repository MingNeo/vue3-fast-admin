<script lang="ts" setup>
import type { ButtonProps } from 'element-plus'
import useAuth from '@/composables/useAuth'

interface Action extends Omit<ButtonProps, 'text' | 'onClick' | 'type'> {
  permission?: string | string[]
  text?: string
  confirm?: boolean
  confirmText?: string
  hidden?: boolean
  onClick: (record?: any, column?: any) => void
  args?: any[]
  icon?: string
  type?: ButtonProps['type']
}

const props = defineProps<{
  actions?: Action[]
  hasAuth?: (permission: string | string[]) => boolean
}>()
const hasAuth = props.hasAuth || useAuth()
</script>

<template>
  <div class="row-button-actions flex inline-block" v-bind="$attrs">
    <template v-if="props.actions">
      <template v-for="({ onClick, args = [], text = '', permission, icon, ...actionProp }, i) in props.actions" :key="i">
        <template v-if="!permission || hasAuth(permission)">
          <el-popconfirm
            v-if="actionProp.confirm"
            :disabled="actionProp.disabled"
            :title="actionProp.confirmText || '确认?'"
            confirm-button-text="是"
            cancel-button-text="否"
            @confirm="onClick(...args)"
          >
            <el-button v-bind="actionProp" class="common-button">
              <template v-if="icon" #icon>
                <slot name="icon" />
              </template>
              {{ text }}
            </el-button>
          </el-popconfirm>
          <template v-else>
            <el-button v-bind="actionProp" class="common-button" @click="onClick(...args)">
              <template v-if="icon" #icon>
                <slot name="icon" />
              </template>
              {{ text }}
            </el-button>
          </template>
        </template>
      </template>
    </template>
    <slot />
  </div>
</template>
