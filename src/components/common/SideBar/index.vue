<script setup lang="ts">
const sideMenuStore = useMenuStore()
</script>

<template>
  <div class="bg-bg-white min-w-[63px] flex flex-col h-[100%]">
    <div class="flex-1 flex flex-col overflow-y-auto w-full">
      <el-menu
        class="flex-1 border-r-0!"
        :class="[sideMenuStore.collapsed ? 'menu-collapsed' : '']"
        :collapse="sideMenuStore.collapsed"
        v-bind="$attrs"
      >
        <template v-for="(item) in sideMenuStore.showMenus">
          <el-sub-menu v-if="item.children" :key="`sub-menu-${item.key}`" :index="item.key">
            <template #title>
              <icon v-if="item.icon" class="menu-icon" :icon="item.icon" />
              <span>{{ item.title }}</span>
            </template>
            <el-menu-item v-for="(subItem) in item.children" :key="subItem.key" :index="subItem.key" @click="subItem.path && $router.push(subItem.path)">
              <icon v-if="subItem.icon" class="menu-icon" :icon="subItem.icon" />
              <template #title>
                <span>{{ subItem.title }}</span>
              </template>
            </el-menu-item>
          </el-sub-menu>
          <el-menu-item v-else :key="item.key" :index="item.key" @click="item.path && $router.push(item.path)">
            <icon v-if="item.icon" class="menu-icon" :icon="item.icon" />
            <template #title>
              <span>{{ item.title }}</span>
            </template>
          </el-menu-item>
        </template>
      </el-menu>

      <div class="flex items-center gap-2 p-4 border-b" :class="sideMenuStore.collapsed ? 'justify-center' : 'justify-end'" @click="sideMenuStore.toggleCollapsed">
        <span v-if="!sideMenuStore.collapsed">收起</span>
        <icon :icon="sideMenuStore.collapsed ? 'icon-park-outline:menu-unfold' : 'icon-park-outline:menu-fold'" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.menu-icon {
  font-size: 16px;
}
// .menu-collapsed {
//   .menu-icon {
//     font-size: 18px;
//   }
// }
.menu-icon+span {
  margin-left: 8px;
}
</style>
