/*
 * @Author: wangchao wcd126yx@126.com
 * @Date: 2025-04-13 13:56:58
 * @LastEditors: wangchao
 * @LastEditTime: 2025-04-18 20:09:16
 * @Description: file content
 */
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }

  return { count, doubleCount, increment }
})
