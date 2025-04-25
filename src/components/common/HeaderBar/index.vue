<script setup lang="ts">
const user = useUserStore()

const router = useRouter()
const { locale } = useI18n()

function gotoLogin() {
  router.push(`/login?redirect=${window.location.pathname}`)
}

function changeLang(lang: string) {
  locale.value = lang
}
</script>

<template>
  <header class="flex justify-between items-center px-5 h-14 shadow bg-bg-white z-20">
    <a class="logo cursor-pointer" href="/">
      Admin
    </a>
    <div class="right flex items-center gap-2">
      <!-- 主题切换按钮 -->
      <el-tooltip content="切换主题" placement="bottom">
        <el-button circle @click="toggleDark()">
          <icon icon="icon-park-outline:dark-mode" />
        </el-button>
      </el-tooltip>
      <!-- 语言切换按钮 -->
      <el-dropdown @command="changeLang">
        <el-button circle>
          <icon icon="icon-park-outline:translate" />
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="zh-CN">
              中文
            </el-dropdown-item>
            <el-dropdown-item command="en">
              English
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-dropdown v-if="user.info.id">
        <span class="el-dropdown-link">
          用户名
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>个人中心</el-dropdown-item>
            <el-dropdown-item>退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-button v-else type="primary" @click="gotoLogin">
        登录/注册
      </el-button>
    </div>
  </header>
</template>
