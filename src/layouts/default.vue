<script setup lang="ts">
import TagsView from '@/components/TagsView/index.vue'
import { enableMultiTags } from '@/config'
import { useTagsViewStore } from '@/stores/tagsView'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const tagsViewStore = useTagsViewStore()

const key = computed(() => route.path)
const cachedViews = computed(() => tagsViewStore.cachedViews)
</script>

<template>
  <div class="flex flex-col h-full basic-container">
    <common-header-bar />
    <div class="flex flex-1 overflow-hidden">
      <!-- 侧边栏 -->
      <div class="bg-bg-white">
        <common-side-bar />
      </div>
      <div class="flex flex-1 flex-col min-w-0">
        <CommonTagsView v-if="enableMultiTags" />
        <!-- 主要内容区 -->
        <common-page-wrapper>
          <router-view v-slot="{ Component }">
            <keep-alive v-if="enableMultiTags" :include="cachedViews">
              <component :is="Component" :key="key" />
            </keep-alive>
            <component :is="Component" v-else :key="key" />
          </router-view>
        </common-page-wrapper>
      </div>
    </div>
  </div>
</template>
