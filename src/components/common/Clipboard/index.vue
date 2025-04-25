<script setup lang="ts">
const props = defineProps<{ text: string }>()

function handleClick() {
  const input = document.createElement('input')
  input.value = props.text
  document.body.appendChild(input)
  input.select()
  document.execCommand('Copy')
  document.body.removeChild(input)
  ElMessage.success('复制成功')
}
</script>

<template>
  <div class="pro-clipboard" @click.stop="handleClick">
    <slot>{{ text }}</slot>
    <!-- <div class="pro-clipboard__icon hidden absolute top-2 right-2 cursor-pointer group-hover:block text-[16px]">
      <slot name="icon">
        <el-icon class="ml-1 cursor-pointer">
          <Document />
        </el-icon>
      </slot>
    </div> -->
  </div>
</template>

<style lang="scss" scoped>
  .pro-clipboard {
    @apply inline-block group cursor-pointer relative px-4;
  }
</style>
