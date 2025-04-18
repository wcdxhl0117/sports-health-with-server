/*
 * @Author: wangchao
 * @Description: i18n文本提取配置文件
 */
export default {
  // 源文件路径规则
  vueFiles: './src/**/*.?(js|vue|jsx)',
  // 源语言文件路径
  languageFiles: './src/locales/zh-CN.json',
  // 模板语言文件路径
  templateLanguageFiles: [
    './src/locales/en-US.json',
    './src/locales/ja-JP.json',
    './src/locales/ko-KR.json',
  ],
  // 是否自动写入新提取的key到语言文件
  output: true,
  // 是否检查冗余key
  check: true,
  // 中文提取规则
  chineseCharacters: true,
  // 自定义过滤规则
  exclude: ['\\u', '\\d', '\\.'],
}
