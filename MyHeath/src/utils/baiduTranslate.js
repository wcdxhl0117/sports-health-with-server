/*
 * @Author: wangchao
 * @Description: 百度翻译API工具
 */
import axios from 'axios'
import CryptoJS from 'crypto-js'

// 百度翻译API配置
const BAIDU_TRANSLATE_API = 'https://fanyi-api.baidu.com/api/trans/vip/translate'
const BAIDU_APP_ID = '20250418002336906'
const BAIDU_SECRET_KEY = 'azLxBIZYmISteMp65hYe'
// 是否使用模拟翻译（当百度API不可用时）
const USE_MOCK_TRANSLATION = true

// 语言代码映射（项目语言代码->百度API语言代码）
const LANGUAGE_MAP = {
  'zh-CN': 'zh',
  'en-US': 'en',
  'ja-JP': 'jp',
  'ko-KR': 'kor',
}

/**
 * 生成百度翻译API签名
 * @param {string} query - 待翻译文本
 * @param {string} salt - 随机数
 * @returns {string} 签名
 */
function generateSign(query, salt) {
  // 签名生成方式：appid+q+salt+密钥
  const str = BAIDU_APP_ID + query + salt + BAIDU_SECRET_KEY
  return CryptoJS.MD5(str).toString()
}

/**
 * 简单的模拟翻译（仅用于开发测试）
 * @param {string} text - 待翻译文本
 * @param {string} to - 目标语言
 * @returns {string} 模拟翻译结果
 */
function mockTranslate(text, to) {
  // 如果本身就是英文，则直接返回
  // 使用String.raw避免转义问题
  const englishRegex = new RegExp(String.raw`^[a-zA-Z0-9\s.,;:!?'"()\[\]{}\-_+=<>@#$%^&*|/\\]+$`)
  if (englishRegex.test(text)) {
    return text
  }

  // 英文翻译映射
  const enMapping = {
    欢迎: 'Welcome',
    登录: 'Login',
    退出登录: 'Logout',
    首页: 'Home',
    训练: 'Training',
    社区: 'Community',
    我的: 'Mine',
    康复用户: 'Rehab User',
    康复管理: 'Rehab Management',
    我的方案: 'My Plans',
    训练记录: 'Training Records',
    数据报告: 'Data Reports',
    互动管理: 'Social Management',
    我的收藏: 'My Favorites',
    我的帖子: 'My Posts',
    关注医生: 'Following Doctors',
    系统设置: 'System Settings',
    账号设置: 'Account Settings',
    隐私设置: 'Privacy Settings',
    消息通知: 'Notifications',
    关于我们: 'About Us',
    高级会员: 'Premium Member',
    标准会员: 'Standard Member',
    到期: 'Expires',
    编辑: 'Edit',
    训练天数: 'Training Days',
    关注: 'Following',
    粉丝: 'Fans',
  }

  // 日文翻译映射
  const jaMapping = {
    欢迎: 'ようこそ',
    登录: 'ログイン',
    退出登录: 'ログアウト',
    首页: 'ホーム',
    训练: 'トレーニング',
    社区: 'コミュニティ',
    我的: 'マイページ',
    康复用户: 'リハビリユーザー',
    康复管理: 'リハビリ管理',
    我的方案: 'マイプラン',
    训练记录: 'トレーニング記録',
    数据报告: 'データレポート',
    互动管理: 'ソーシャル管理',
    我的收藏: 'お気に入り',
    我的帖子: '投稿一覧',
    关注医生: 'フォロー中の医師',
    系统设置: 'システム設定',
    账号设置: 'アカウント設定',
    隐私设置: 'プライバシー設定',
    消息通知: '通知',
    关于我们: '私たちについて',
    高级会员: 'プレミアム会員',
    标准会员: '標準会員',
    到期: '期限',
    编辑: '編集',
    训练天数: 'トレーニング日数',
    关注: 'フォロー',
    粉丝: 'フォロワー',
  }

  // 韩文翻译映射
  const koMapping = {
    欢迎: '환영합니다',
    登录: '로그인',
    退出登录: '로그아웃',
    首页: '홈',
    训练: '트레이닝',
    社区: '커뮤니티',
    我的: '내 정보',
    康复用户: '재활 사용자',
    康复管理: '재활 관리',
    我的方案: '내 계획',
    训练记录: '트레이닝 기록',
    数据报告: '데이터 보고서',
    互动管理: '소셜 관리',
    我的收藏: '내 즐겨찾기',
    我的帖子: '내 게시물',
    关注医生: '팔로우 의사',
    系统设置: '시스템 설정',
    账号设置: '계정 설정',
    隐私设置: '개인 정보 설정',
    消息通知: '알림',
    关于我们: '회사 소개',
    高级会员: '프리미엄 회원',
    标准会员: '표준 회원',
    到期: '만료',
    编辑: '편집',
    训练天数: '트레이닝 일수',
    关注: '팔로우',
    粉丝: '팔로워',
  }

  // 简单的模拟翻译逻辑
  switch (to) {
    case 'en-US':
      // 返回比较合理的英文翻译（而不是截断原文）
      return enMapping[text] || `English: ${text}`
    case 'ja-JP':
      // 返回比较合理的日文翻译
      return jaMapping[text] || `日本語: ${text}`
    case 'ko-KR':
      // 返回比较合理的韩文翻译
      return koMapping[text] || `한국어: ${text}`
    default:
      return text
  }
}

/**
 * 翻译单个文本
 * @param {string} text - 待翻译文本
 * @param {string} from - 源语言
 * @param {string} to - 目标语言
 * @returns {Promise<string>} 翻译结果
 */
export async function translateText(text, from = 'zh-CN', to = 'en-US') {
  try {
    // 如果源语言和目标语言相同，直接返回原文
    if (from === to) {
      return text
    }

    // 如果开启了模拟翻译模式，使用模拟翻译
    if (USE_MOCK_TRANSLATION) {
      return mockTranslate(text, to)
    }

    // 源语言和目标语言转换为百度API支持的语言代码
    const fromLang = LANGUAGE_MAP[from] || from
    const toLang = LANGUAGE_MAP[to] || to

    // 生成随机数作为salt
    const salt = Date.now().toString()

    // 生成签名
    const sign = generateSign(text, salt)

    // 请求参数
    const params = {
      q: text,
      from: fromLang,
      to: toLang,
      appid: BAIDU_APP_ID,
      salt,
      sign,
    }

    // 发送翻译请求
    const response = await axios.get(BAIDU_TRANSLATE_API, { params })

    // 处理返回结果
    if (response.data && response.data.trans_result) {
      return response.data.trans_result[0].dst
    }

    throw new Error('翻译结果为空')
  } catch (error) {
    console.error('百度翻译API调用失败:', error)
    // 翻译失败时使用模拟翻译
    return mockTranslate(text, to)
  }
}

/**
 * 批量翻译对象中的所有值
 * @param {Object} source - 源对象，键值对形式
 * @param {string} from - 源语言
 * @param {string} to - 目标语言
 * @returns {Promise<Object>} 翻译后的对象
 */
export async function translateObject(source, from = 'zh-CN', to = 'en-US') {
  const result = {}
  // 创建翻译任务队列
  const tasks = []

  // 将对象中的值放入翻译队列
  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const text = source[key]
      // 只翻译非空字符串
      if (typeof text === 'string' && text.trim()) {
        tasks.push(
          translateText(text, from, to)
            .then((translatedText) => {
              result[key] = translatedText
            })
            .catch(() => {
              result[key] = text // 翻译失败时使用原文
            }),
        )
      } else {
        result[key] = text
      }
    }
  }

  // 等待所有翻译任务完成
  await Promise.all(tasks)
  return result
}

/**
 * 批量翻译中文文本到多种语言
 * @param {Object} zhSource - 中文源对象
 * @returns {Promise<Object>} 包含所有语言翻译的对象
 */
export async function translateToAllLanguages(zhSource) {
  try {
    // 构建翻译任务
    const translations = {
      'zh-CN': { ...zhSource }, // 中文原始内容
      'en-US': await translateObject(zhSource, 'zh-CN', 'en-US'),
      'ja-JP': await translateObject(zhSource, 'zh-CN', 'ja-JP'),
      'ko-KR': await translateObject(zhSource, 'zh-CN', 'ko-KR'),
    }

    return translations
  } catch (error) {
    console.error('批量翻译失败:', error)
    throw error
  }
}
