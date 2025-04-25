<script setup lang="ts">
</script>

<template>
  <div class="flex flex-col h-full basic-container">
    <common-header-bar />
    <div class="flex flex-1 overflow-hidden">
      <!-- 侧边栏 -->
      <div class="bg-bg-white">
        <common-side-bar />
      </div>
      <!-- 主要内容区 -->
      <common-page-wrapper>
        <RouterView />
      </common-page-wrapper>
    </div>
  </div>
</template>
