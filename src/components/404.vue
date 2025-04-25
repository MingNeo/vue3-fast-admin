<script setup lang="ts">
const tagsViewStore = useTagsViewStore()
const route = useRoute()
function closePage() {
  tagsViewStore.closeTag(route)
}
</script>

<template>
  <div class="w-full h-full flex flex-col items-center justify-center">
    <el-empty description="当前页面不存在" />
    <el-button type="primary" @click="closePage">
      关闭
    </el-button>
  </div>
</template>
