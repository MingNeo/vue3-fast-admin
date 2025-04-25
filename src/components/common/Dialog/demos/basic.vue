<script setup lang="ts">
import { ref } from 'vue'
import Dialog from '../index.vue'

const visible = ref(false)
</script>

<template>
  <div>
    <el-button @click="visible = true">
      打开对话框
    </el-button>

    <Dialog
      v-model="visible"
      title="基础对话框"
      show-footer
      cancel-text="关闭"
      confirm-text="确定"
    >
      这是一个基础对话框示例
    </Dialog>
  </div>
</template>
