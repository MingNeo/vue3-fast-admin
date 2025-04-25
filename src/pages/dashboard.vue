<script setup lang="ts">
import { CountUp } from 'countup.js'
import { onMounted, ref } from 'vue'

const userCount = ref<HTMLElement | null>(null)
const visitCount = ref<HTMLElement | null>(null)
const sales = ref<HTMLElement | null>(null)
const activeUser = ref<HTMLElement | null>(null)

onMounted(() => {
  animateNumber(userCount.value, 1234)
  animateNumber(visitCount.value, 56789)
  animateNumber(sales.value, 98765)
  animateNumber(activeUser.value, 321)
})

function animateNumber(targetEl: HTMLElement | null, endVal: number) {
  if (!targetEl)
    return
  const countUp = new CountUp(targetEl, endVal, { duration: 1.2, separator: ',' })
  countUp.start()
}
</script>

<template>
  <div class="min-h-screen p-6">
    <div class="w-full flex gap-6 flex-wrap">
      <div class="flex-1 text-center py-6 rounded-[18px] shadow-md relative overflow-hidden text-white bg-gradient-to-br from-[#6a93ff] to-[#a4bafe]">
        <div class="text-base text-white mb-2 mt-[18px]">
          用户数
        </div>
        <div class="text-[36px] font-bold text-white mb-2">
          <span ref="userCount">0</span>
        </div>
      </div>
      <div class="flex-1 text-center py-6 rounded-[18px] shadow-md relative overflow-hidden text-white bg-gradient-to-br from-[#ffb86c] to-[#ff9a9e]">
        <div class="text-base text-white mb-2 mt-[18px]">
          访问量
        </div>
        <div class="text-[36px] font-bold text-white mb-2">
          <span ref="visitCount">0</span>
        </div>
      </div>

      <div class="flex-1 text-center py-6 rounded-[18px] shadow-md relative overflow-hidden text-white bg-gradient-to-br from-[#ff5858] to-[#f09819]">
        <div class="text-base text-white mb-2 mt-[18px]">
          活跃用户
        </div>
        <div class="text-[36px] font-bold text-white mb-2">
          <span ref="activeUser">0</span>
        </div>
      </div>

      <div class="flex-1 text-center py-6 rounded-[18px] shadow-md relative overflow-hidden text-white bg-gradient-to-br from-[#43e97b] to-[#38f9d7]">
        <div class="text-base text-white mb-2 mt-[18px]">
          销售额
        </div>
        <div class="text-[36px] font-bold text-white mb-2">
          <span ref="sales">0</span>
        </div>
      </div>
    </div>
    <div class="mt-6 flex gap-6">
      <div class="flex-1 p-4 rounded-[18px] shadow-md bg-bg-white/60 backdrop-blur-[12px] border border-white/30 overflow-hidden">
        <div class="text-base mb-2">
          趋势图
        </div>
        <div class="h-[300px] flex items-center justify-center text-gray-400">
          <!-- 这里可集成 ECharts 图表组件 -->
          [趋势图占位]
        </div>
      </div>
      <div class="flex-1 p-4 rounded-[18px] shadow-md bg-bg-white/60 backdrop-blur-[12px] border border-white/30 overflow-hidden">
        <div class="text-base mb-2">
          饼图
        </div>
        <div class="h-[300px] flex items-center justify-center text-gray-400">
          <!-- 这里可集成 ECharts 饼图组件 -->
          [饼图占位]
        </div>
      </div>
    </div>
  </div>
</template>
