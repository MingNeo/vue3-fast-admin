<script setup lang="ts">
import type { TagView } from '@/stores/tagsView'
import { useTagsViewStore } from '@/stores/tagsView'
import { ArrowDown } from '@element-plus/icons-vue'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const tagsViewStore = useTagsViewStore()

const visitedViews = computed(() => tagsViewStore.visitedViews)

function handleClick(tag: TagView) {
  if (tag.path) {
    router.push({
      path: tag.path,
      query: tag.query,
    })
  }
}

function handleCommand(command: string) {
  switch (command) {
    case 'closeOthers':
      closeOthersTags()
      break
    case 'closeAll':
      closeAllTags()
      break
  }
}

async function closeOthersTags() {
  await tagsViewStore.delOthersViews(route as unknown as TagView)
  router.push(route.path)
}

function closeAllTags() {
  tagsViewStore.delAllViews()
  router.push('/')
}
</script>

<template>
  <div class="tags-view-container">
    <el-scrollbar class="tags-view-wrapper">
      <div class="tags-view-item">
        <template v-if="visitedViews.length > 0">
          <el-tag
            v-for="tag in visitedViews"
            :key="tag.path + (tag.query?.t || '')"
            :closable="!tag.meta?.affix"
            :effect="tagsViewStore.checkIsActive(tag) ? 'dark' : 'plain'"
            :class="{ active: tagsViewStore.checkIsActive(tag) }"
            @click="handleClick(tag)"
            @close="tagsViewStore.closeTag(tag)"
          >
            {{ tag.title || 'no-name' }}
          </el-tag>
        </template>
      </div>
    </el-scrollbar>
    <el-dropdown v-if="visitedViews.length > 0" class="tags-view-more" trigger="click" @command="handleCommand">
      <el-button type="primary" link>
        更多操作
        <el-icon><ArrowDown /></el-icon>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="closeOthers">
            关闭其他
          </el-dropdown-item>
          <el-dropdown-item command="closeAll">
            关闭所有
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<style lang="scss" scoped>
.tags-view-container {
  height: 34px;
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 16px;

  .tags-view-wrapper {
    flex: 1;
    overflow: hidden;

    .tags-view-item {
      display: flex;
      align-items: center;
      padding: 0 16px;
      height: 33px;

      .el-tag {
        margin-right: 8px;
        cursor: pointer;
        height: 26px;
        line-height: 26px;
        border-radius: 2px;

        &.active {
          background-color: var(--el-color-primary);
          color: #fff;
          border-color: var(--el-color-primary);

          .el-tag__close {
            color: #fff;
          }
        }

        .el-tag__close {
          color: #666;

          &:hover {
            color: #fff;
            background-color: #666;
          }
        }
      }
    }
  }
}
</style>
