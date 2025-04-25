import type { ComponentResolver } from 'unplugin-vue-components/types'
import path from 'node:path'
import VueI18n from '@intlify/unplugin-vue-i18n/vite'
import { unheadVueComposablesImports } from '@unhead/vue'
import Vue from '@vitejs/plugin-vue'
import { ProElComponentsResolver } from 'pro-el-components/resolver'
import Unocss from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import VueRouter from 'unplugin-vue-router/vite'
import { defineConfig } from 'vite'
import { viteMockServe } from 'vite-plugin-mock'
// import generateSitemap from 'vite-ssg-sitemap'
import Layouts from 'vite-plugin-vue-layouts'
import devServerConfig from './dev.server.config'

function IconParkResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (name.startsWith('Iconify'))
        return { name: 'Icon', from: '@iconify/vue' }
      // 暂时使用iconify，后续可能指定自己icon组件
      if (name.startsWith('Icon'))
        return { name: 'Icon', from: '@iconify/vue' }
    },
  }
}

export default defineConfig(({ command }) => ({
  base: './',
  resolve: {
    alias: {
      '@/': `${path.resolve(__dirname, 'src')}/`,
    },
  },

  server: devServerConfig,

  plugins: [
    VueRouter({
      exclude: ['**/components/*.vue', '**/pages/**/children/**/*.vue', '**/_*.vue'],
      //   extendRoute: async (route) => {
      //     // Redirect from '/' to '/manage'
      //     // if (route.path === '/')
      //     //   return { ...route, redirect: 'manage' }
      //     return route
      //   },
    }),

    // https://github.com/JohnCampionJr/vite-plugin-vue-layouts
    Layouts({ defaultLayout: 'default' }),

    // https://github.com/antfu/unplugin-auto-import
    AutoImport({
      resolvers: [
        ElementPlusResolver(),
        ProElComponentsResolver(),
      ],
      imports: [
        'vue',
        'vue-router',
        'vue-i18n',
        unheadVueComposablesImports,
        '@vueuse/core',
      ],
      dts: 'src/auto-imports.d.ts',
      dirs: [
        'src/composables/**/*.ts',
        'src/stores',
        'src/utils',
      ],
      vueTemplate: true,
    }),

    // https://github.com/antfu/unplugin-vue-components
    Components({
      resolvers: [
        ElementPlusResolver({
          importStyle: 'css',
        }),
        ProElComponentsResolver(),
        IconParkResolver(),
      ],
      extensions: ['vue'],
      include: [/\.vue$/, /\.vue\?vue/],
      directoryAsNamespace: true,
      dts: 'src/components.d.ts',
    }),

    // https://github.com/antfu/unocss
    // 配置见 unocss.config.ts
    Unocss(),

    // https://github.com/intlify/bundle-tools/tree/main/packages/unplugin-vue-i18n
    VueI18n({
      runtimeOnly: true,
      compositionOnly: true,
      fullInstall: true,
      include: [path.resolve(__dirname, 'locales/**')],
    }),

    // https://github.com/vbenjs/vite-plugin-mock
    // 如需对接真实接口可把mock下接口改为/mock/api/xxx
    viteMockServe({
      mockPath: 'mock',
      enable: command === 'serve',
    }),
    Vue(),
  ],

  // https://github.com/vitest-dev/vitest
  test: {
    include: ['test/**/*.test.ts', 'src/**/test/**/*.test.ts'],
    environment: 'jsdom',
    css: false,
    exclude: ['**/*.css'],
    deps: {
      inline: ['@vue', '@vueuse', 'vue-demi', /element-plus/],
    },
  },

  // css: {
  //   preprocessorOptions: {
  //     scss: {
  //       api: 'modern-compiler',
  //       importers: [],
  //     },
  //   },
  // },

  // vite-ssg如需使用可手工开启
  // https://github.com/antfu/vite-ssg
  // ssgOptions: {
  //   script: 'async',
  //   formatting: 'minify',
  //   onFinished() { generateSitemap() },
  // },

  ssr: {
    noExternal: ['workbox-window', /vue-i18n/],
  },
}))
