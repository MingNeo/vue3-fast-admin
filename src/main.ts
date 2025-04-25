import type { UserModule } from './types'
import { addCollection } from '@iconify/vue'
import { createHead } from '@unhead/vue/client'
import { createPinia } from 'pinia'
import { setupLayouts } from 'virtual:generated-layouts'
// import { ViteSSG } from 'vite-ssg'
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'
import iconSet from '@/assets/iconify.json'
import { menus } from '@/config/menus'
import App from './App.vue'
// Element Plus 样式通过 ElementPlusResolver 按需加载

import '@unocss/reset/tailwind.css'
import './styles/main.scss'
import 'uno.css'

addCollection(iconSet as any) // 本地图标库

const routeList = setupLayouts(routes)

// vite-ssg, 如需使用可手工开启
// https://github.com/antfu/vite-ssg
// export const createApp = ViteSSG(
//   App,
//   { routes, base: import.meta.env.BASE_URL },
//   (ctx) => {
//     // install all modules under `modules/`
//     Object.values(import.meta.glob<{ install: UserModule }>('./modules/*.ts', { eager: true }))
//       .forEach(i => i.install?.(ctx))
//   },
// )

// 不使用ssg
const app = createApp(App)
const pinia = createPinia()
app.use(pinia)

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routeList,
})
app.use(router)

const head = createHead()
app.use(head)

Object.values(import.meta.glob<{ install: UserModule }>('./modules/*.ts', { eager: true }))
  .forEach(i => i.install?.({ isClient: typeof window !== 'undefined', app, router }))

useMenuStore().setMenus(menus)

app.mount('#app')
