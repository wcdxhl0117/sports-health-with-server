<template>
  <div class="language-switcher">
    <van-dropdown-menu>
      <van-dropdown-item
        v-model="currentLocale"
        :options="localeOptions"
        @change="handleLocaleChange"
      />
    </van-dropdown-menu>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale, availableLocales } = useI18n()
const currentLocale = ref(locale.value)

// 根据可用语言生成下拉选项
const localeOptions = availableLocales.map((locale) => {
  const labels = {
    'zh-CN': '中文',
    'en-US': 'English',
    'ja-JP': '日本語',
    'ko-KR': '한국어',
  }
  return {
    text: labels[locale],
    value: locale,
  }
})

// 切换语言处理函数
const handleLocaleChange = (value) => {
  locale.value = value
  localStorage.setItem('locale', value)
}

// 监听语言变化
watch(locale, (newLocale) => {
  currentLocale.value = newLocale
  document.querySelector('html').setAttribute('lang', newLocale)
})
</script>

<style scoped>
.language-switcher {
  display: inline-block;
}
</style>
