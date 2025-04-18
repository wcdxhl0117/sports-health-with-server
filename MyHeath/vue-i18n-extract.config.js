/*
 * @Author: wangchao wcd126yx@126.com
 * @Date: 2025-04-18 21:21:13
 * @LastEditors: wangchao
 * @LastEditTime: 2025-04-18 21:21:46
 * @Description: file content
 */
export default {
  // 源代码文件路径
  vueFiles: './src/**/*.?(js|vue|jsx)',

  // 提取中文文本配置
  extractionConfig: {
    // 正则表达式捕获中文文本
    customRegex: [
      // 匹配中文字符的正则表达式
      /[一-龟]/g,
      // 匹配vue-i18n的$t函数使用
      /\$t\(['"]([^'"]*)['"]\)/g,
      // 匹配t函数使用
      /t\(['"]([^'"]*)['"]\)/g,
    ],
  },

  // 输出配置
  output: true,

  // 语言文件配置
  languageFiles: {
    // 中文作为源语言
    'zh-CN': './src/locales/zh-CN.json',
    // 其他语言作为目标语言
    'en-US': './src/locales/en-US.json',
    'ja-JP': './src/locales/ja-JP.json',
    'ko-KR': './src/locales/ko-KR.json',
  },

  // 缺失翻译处理
  writeOptions: {
    // 对于未翻译的key，使用key作为值
    keepExistingKeys: true,
    keepExistingValues: true,
    // 对有中文但没有翻译key的情况，自动生成翻译key
    generateTranslationKeys: true,
    createMissingTranslations: true,
    // 自动排序key
    sortLangKeys: true,
  },
}
