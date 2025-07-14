// 🛠️ 语言验证器
// 提供语言输入验证和标准化功能

import { COMPREHENSIVE_LANGUAGES } from './languageMap'

// 🔍 语言验证结果类型
export interface LanguageValidationResult {
  valid: boolean
  language?: string
  displayName?: string
  error?: string
}

// 🛡️ 验证用户输入的语言
export const validateLanguage = (input: string): LanguageValidationResult => {
  const normalized = input.trim()

  if (!normalized) {
    return { valid: false, error: 'Please enter a language' }
  }

  // 首先尝试精确匹配
  const exactMatch = COMPREHENSIVE_LANGUAGES[normalized]
  if (exactMatch) {
    return { valid: true, language: exactMatch }
  }

  // 然后尝试不区分大小写匹配
  const lowerCaseMatch = COMPREHENSIVE_LANGUAGES[normalized.toLowerCase()]
  if (lowerCaseMatch) {
    return { valid: true, language: lowerCaseMatch }
  }

  // 如果都没找到，采用宽松策略：让AI尝试理解
  return { valid: true, language: normalized }
}

// 🎯 处理语言输入（分层验证策略）
export const processLanguageInput = (input: string): string => {
  const result = validateLanguage(input)

  if (result.valid && result.language) {
    // 1. 首先尝试从预定义列表匹配
    if (COMPREHENSIVE_LANGUAGES[input] || COMPREHENSIVE_LANGUAGES[input.toLowerCase()]) {
      return result.language
    }

    // 2. 如果没有匹配，但看起来像语言名称，就直接传递给AI
    if (result.language === input) {
      console.log(`Unknown language "${input}", letting AI handle it`)
      return input
    }
  }

  // 3. 默认回退
  return 'Chinese'
}

// 🔍 检查是否为支持的语言
export const isSupportedLanguage = (input: string): boolean => {
  return Boolean(COMPREHENSIVE_LANGUAGES[input] || COMPREHENSIVE_LANGUAGES[input.toLowerCase()])
}

// 🌊 获取语言建议（用于自动完成）
export const getLanguageSuggestions = (input: string, maxSuggestions: number = 5): string[] => {
  if (!input) return []

  const normalized = input.toLowerCase()
  const suggestions = Object.keys(COMPREHENSIVE_LANGUAGES)
    .filter((key) => key.toLowerCase().includes(normalized))
    .slice(0, maxSuggestions)

  return suggestions
}

// 🎯 标准化语言名称
export const normalizeLanguageName = (input: string): string => {
  const result = validateLanguage(input)
  return result.language || input
}
