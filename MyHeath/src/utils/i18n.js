/*
 * @Author: wangchao
 * @Description: i18n工具函数
 */
import { useI18n } from 'vue-i18n'

/**
 * 切换语言
 * @param {string} locale - 目标语言代码
 */
export function changeLocale(locale) {
  const { locale: currentLocale } = useI18n()
  currentLocale.value = locale
  localStorage.setItem('locale', locale)
  document.querySelector('html').setAttribute('lang', locale)
}

/**
 * 获取当前语言
 * @returns {string} 当前语言代码
 */
export function getCurrentLocale() {
  return localStorage.getItem('locale') || 'zh-CN'
}

/**
 * 处理带参数的翻译文本
 * @param {string} key - 翻译key
 * @param {object} params - 参数对象
 * @returns {string} 翻译后的文本
 */
export function translateWithParams(key, params) {
  const { t } = useI18n()
  return t(key, params)
}

/**
 * 处理复数形式翻译
 * @param {string} key - 翻译key
 * @param {number} count - 数量
 * @param {object} options - 其他选项
 * @returns {string} 翻译后的文本
 */
export function translatePlural(key, count, options = {}) {
  const { t } = useI18n()
  return t(key, { count, ...options })
}

/**
 * 检查是否存在翻译key
 * @param {string} key - 翻译key
 * @returns {boolean} 是否存在
 */
export function hasTranslation(key) {
  const { te } = useI18n()
  return te(key)
}
