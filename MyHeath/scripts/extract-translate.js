/*
 * @Author: wangchao
 * @Description: 自动提取中文并翻译的脚本
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { glob } from 'glob'
import { translateToAllLanguages } from '../src/utils/baiduTranslate.js'

// 获取当前文件的目录
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')

// 语言文件路径
const LOCALES_DIR = path.join(rootDir, 'src', 'locales')
const ZH_CN_FILE = path.join(LOCALES_DIR, 'zh-CN.json')
const EN_US_FILE = path.join(LOCALES_DIR, 'en-US.json')
const JA_JP_FILE = path.join(LOCALES_DIR, 'ja-JP.json')
const KO_KR_FILE = path.join(LOCALES_DIR, 'ko-KR.json')

// 中文匹配正则表达式
const chineseRegex = /[\u4e00-\u9fa5]+/g
// 忽略的文件和目录
const ignorePatterns = [
  '**/node_modules/**',
  '**/dist/**',
  '**/.git/**',
  '**/locales/**',
  '**/*.json',
]

/**
 * 从文件内容中提取中文文本
 * @param {string} content - 文件内容
 * @returns {string[]} 提取到的中文文本数组
 */
function extractChineseFromContent(content) {
  const matches = content.match(chineseRegex)
  return matches ? [...new Set(matches)] : []
}

/**
 * 从文件中提取中文文本
 * @param {string} filePath - 文件路径
 * @returns {string[]} 提取到的中文文本数组
 */
function extractChineseFromFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    return extractChineseFromContent(content)
  } catch (error) {
    console.error(`读取文件失败: ${filePath}`, error)
    return []
  }
}

/**
 * 扫描目录下所有文件并提取中文文本
 * @param {string} dir - 目录路径
 * @returns {string[]} 提取到的中文文本数组
 */
async function extractChineseFromDir(dir) {
  const files = await glob(`${dir}/**/*.{js,jsx,vue}`, { ignore: ignorePatterns })

  let allChinese = []
  for (const file of files) {
    const chinese = extractChineseFromFile(file)
    allChinese = [...allChinese, ...chinese]
  }

  // 去重
  return [...new Set(allChinese)]
}

/**
 * 生成翻译key
 * @param {string} text - 中文文本
 * @returns {string} 翻译key
 */
function generateTranslationKey(text) {
  // 简单处理：转拼音（此处简化，仅转小写英文）
  // 实际项目中可使用更复杂的转拼音库如pinyin
  return (
    text
      .replace(/[\u4e00-\u9fa5]/g, '_') // 将中文字符替换为下划线
      .replace(/[^\w]/g, '_') // 将非单词字符替换为下划线
      .replace(/_+/g, '_') // 多个连续下划线替换为单个
      .replace(/^_|_$/g, '') // 去除首尾下划线
      .toLowerCase() || // 转为小写
    `key_${Math.random().toString(36).substring(2, 10)}`
  ) // 如果处理后为空，生成随机key
}

/**
 * 将提取的中文文本转换为翻译对象
 * @param {string[]} texts - 中文文本数组
 * @returns {Object} 翻译对象
 */
function textArrayToTranslationObject(texts) {
  const translationObj = {}

  texts.forEach((text) => {
    // 检查文本是否已经存在于翻译对象中
    if (!Object.values(translationObj).includes(text)) {
      const key = generateTranslationKey(text)

      // 确保key不重复
      let uniqueKey = key
      let counter = 1
      while (translationObj[uniqueKey]) {
        uniqueKey = `${key}_${counter}`
        counter++
      }

      translationObj[uniqueKey] = text
    }
  })

  return translationObj
}

/**
 * 合并现有翻译和新提取的翻译
 * @param {Object} existingTranslations - 现有翻译对象
 * @param {Object} newTranslations - 新提取的翻译对象
 * @returns {Object} 合并后的翻译对象
 */
function mergeTranslations(existingTranslations, newTranslations) {
  const merged = { ...existingTranslations }

  // 检查新提取的翻译是否已存在
  for (const [key, value] of Object.entries(newTranslations)) {
    // 如果值已存在但key不同，不添加重复的值
    if (!Object.values(merged).includes(value)) {
      // 确保key不重复
      let uniqueKey = key
      let counter = 1
      while (merged[uniqueKey]) {
        uniqueKey = `${key}_${counter}`
        counter++
      }

      merged[uniqueKey] = value
    }
  }

  return merged
}

/**
 * 读取现有的翻译文件
 * @param {string} filePath - 文件路径
 * @returns {Object} 翻译对象
 */
function readTranslationFile(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8')
      return JSON.parse(content)
    }
  } catch (error) {
    console.error(`读取翻译文件失败: ${filePath}`, error)
  }
  return {}
}

/**
 * 写入翻译文件
 * @param {string} filePath - 文件路径
 * @param {Object} translations - 翻译对象
 */
function writeTranslationFile(filePath, translations) {
  try {
    const content = JSON.stringify(translations, null, 2)
    fs.writeFileSync(filePath, content, 'utf-8')
    console.log(`已写入翻译文件: ${filePath}`)
  } catch (error) {
    console.error(`写入翻译文件失败: ${filePath}`, error)
  }
}

/**
 * 主函数
 */
async function main() {
  try {
    console.log('开始提取中文文本...')

    // 1. 提取所有中文文本
    const allChinese = await extractChineseFromDir(path.join(rootDir, 'src'))
    console.log(`提取到 ${allChinese.length} 个中文文本`)

    // 2. 转换为翻译对象
    const newTranslations = textArrayToTranslationObject(allChinese)

    // 3. 读取现有翻译
    const existingZhTranslations = readTranslationFile(ZH_CN_FILE)

    // 4. 合并翻译
    const mergedZhTranslations = mergeTranslations(existingZhTranslations, newTranslations)

    // 5. 调用百度翻译API翻译到其他语言
    console.log('开始翻译文本...')
    const allTranslations = await translateToAllLanguages(mergedZhTranslations)

    // 6. 写入翻译文件
    // 确保目录存在
    if (!fs.existsSync(LOCALES_DIR)) {
      fs.mkdirSync(LOCALES_DIR, { recursive: true })
    }

    writeTranslationFile(ZH_CN_FILE, allTranslations['zh-CN'])
    writeTranslationFile(EN_US_FILE, allTranslations['en-US'])
    writeTranslationFile(JA_JP_FILE, allTranslations['ja-JP'])
    writeTranslationFile(KO_KR_FILE, allTranslations['ko-KR'])

    console.log('中文提取和翻译完成！')
  } catch (error) {
    console.error('中文提取和翻译失败:', error)
  }
}

// 执行主函数
main()
