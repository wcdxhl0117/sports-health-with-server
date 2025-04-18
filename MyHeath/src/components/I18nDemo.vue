<template>
  <div class="i18n-demo">
    <h2>{{ $t('i18n_demo_title') }}</h2>

    <div class="demo-section">
      <h3>{{ $t('basic_usage') }}</h3>
      <p>{{ $t('welcome') }}</p>
    </div>

    <div class="demo-section">
      <h3>{{ $t('with_params') }}</h3>
      <p>{{ $t('hello_user', { name: userName }) }}</p>
      <van-field v-model="userName" :placeholder="$t('enter_name')" />
    </div>

    <div class="demo-section">
      <h3>{{ $t('plural') }}</h3>
      <p>{{ $tc('apple_count', appleCount, { count: appleCount }) }}</p>
      <van-stepper v-model="appleCount" min="0" max="10" />
    </div>

    <div class="demo-section">
      <h3>{{ $t('date_format') }}</h3>
      <p>{{ $d(currentDate, 'long') }}</p>
    </div>

    <div class="demo-section">
      <h3>{{ $t('language_switcher') }}</h3>
      <LanguageSwitcher />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import LanguageSwitcher from './LanguageSwitcher.vue'

const { t } = useI18n()
const userName = ref('Zhang San')
const appleCount = ref(3)
const currentDate = ref(new Date())

// 可以使用t函数进行编程式翻译
const translatedText = t('welcome')
console.log('编程式翻译示例:', translatedText)
</script>

<style scoped>
.i18n-demo {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.demo-section {
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 8px;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
}

h3 {
  margin-top: 0;
  color: #333;
}
</style>
