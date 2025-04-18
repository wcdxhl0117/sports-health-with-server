/*
 * @Author: wangchao
 * @Description: i18n国际化配置文件
 */
import { createI18n } from 'vue-i18n'
import zhCN from './zh-CN.json'
import enUS from './en-US.json'
import jaJP from './ja-JP.json'
import koKR from './ko-KR.json'

// 创建i18n实例
const i18n = createI18n({
  // 默认设置为false，这样能在composition API中使用
  legacy: false,
  // 全局使用t函数
  globalInjection: true,
  // 默认语言
  locale: localStorage.getItem('locale') || 'zh-CN',
  // 备用语言
  fallbackLocale: 'zh-CN',
  // 可用语言列表
  availableLocales: ['zh-CN', 'en-US', 'ja-JP', 'ko-KR'],
  // 语言包
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS,
    'ja-JP': jaJP,
    'ko-KR': koKR,
  },
  // 日期格式化选项
  datetimeFormats: {
    'zh-CN': {
      short: {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      },
      long: {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
        hour: 'numeric',
        minute: 'numeric',
      },
    },
    'en-US': {
      short: {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      },
      long: {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      },
    },
    'ja-JP': {
      short: {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      },
      long: {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
        hour: 'numeric',
        minute: 'numeric',
      },
    },
    'ko-KR': {
      short: {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      },
      long: {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
        hour: 'numeric',
        minute: 'numeric',
      },
    },
  },
  // 数字格式化选项
  numberFormats: {
    'zh-CN': {
      currency: {
        style: 'currency',
        currency: 'CNY',
      },
    },
    'en-US': {
      currency: {
        style: 'currency',
        currency: 'USD',
      },
    },
    'ja-JP': {
      currency: {
        style: 'currency',
        currency: 'JPY',
      },
    },
    'ko-KR': {
      currency: {
        style: 'currency',
        currency: 'KRW',
      },
    },
  },
})

export default i18n
