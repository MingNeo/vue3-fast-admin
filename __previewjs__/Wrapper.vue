<script setup>
import { getCurrentInstance } from 'vue'
import { createPinia } from 'pinia'
import '@unocss/reset/tailwind.css'
import 'uno.css'
import '../src/styles/main.scss'

const { appContext } = getCurrentInstance()
const pinia = createPinia()
appContext.app.use(pinia)
</script>

<template>
  <div class="wrapper">
    <slot />
  </div>
</template>
