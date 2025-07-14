// 🧰 语言工具函数
// 提供语言相关的实用工具功能

import { LANGUAGE_DISPLAY_NAMES, POPULAR_LANGUAGES } from './languageMap'
import { normalizeLanguageName } from './languageValidator'

// 🔤 获取语言的显示名称
export const getLanguageDisplayName = (language: string): string => {
  const normalized = normalizeLanguageName(language)
  return LANGUAGE_DISPLAY_NAMES[normalized] || normalized
}

// 🌍 获取常用语言列表
export const getPopularLanguages = (): string[] => {
  return [...POPULAR_LANGUAGES]
}

// 🎯 智能语言检测和自动目标语言选择
export const detectSourceLanguage = (text: string): string => {
  // 检测中文字符
  if (/[\u4e00-\u9fff]/.test(text)) {
    return 'Chinese'
  }

  // 检测日语字符
  if (/[\u3040-\u309f\u30a0-\u30ff]/.test(text)) {
    return 'Japanese'
  }

  // 检测韩语字符
  if (/[\uac00-\ud7af]/.test(text)) {
    return 'Korean'
  }

  // 检测阿拉伯语字符
  if (/[\u0600-\u06ff]/.test(text)) {
    return 'Arabic'
  }

  // 检测俄语字符
  if (/[\u0400-\u04ff]/.test(text)) {
    return 'Russian'
  }

  // 检测希腊语字符
  if (/[\u0370-\u03ff]/.test(text)) {
    return 'Greek'
  }

  // 检测希伯来语字符
  if (/[\u0590-\u05ff]/.test(text)) {
    return 'Hebrew'
  }

  // 检测泰语字符
  if (/[\u0e00-\u0e7f]/.test(text)) {
    return 'Thai'
  }

  // 检测孟加拉语字符
  if (/[\u0980-\u09ff]/.test(text)) {
    return 'Bengali'
  }

  // 检测印地语字符
  if (/[\u0900-\u097f]/.test(text)) {
    return 'Hindi'
  }

  // 默认认为是英语
  return 'English'
}

// 🔄 自动选择目标语言
export const getAutoTargetLanguage = (sourceText: string): string => {
  const detectedLanguage = detectSourceLanguage(sourceText)

  // 如果检测到中文，翻译为英文
  if (detectedLanguage === 'Chinese') {
    return 'English'
  }

  // 其他语言翻译为中文
  return 'Chinese'
}

// 📊 语言使用统计
export interface LanguageStats {
  language: string
  displayName: string
  count: number
  lastUsed: Date
}

// 💾 语言使用历史管理（可以扩展到localStorage）
class LanguageHistoryManager {
  private history: Map<string, LanguageStats> = new Map()

  // 记录语言使用
  recordLanguageUsage(language: string): void {
    const normalized = normalizeLanguageName(language)
    const existing = this.history.get(normalized)

    if (existing) {
      existing.count += 1
      existing.lastUsed = new Date()
    } else {
      this.history.set(normalized, {
        language: normalized,
        displayName: getLanguageDisplayName(normalized),
        count: 1,
        lastUsed: new Date()
      })
    }
  }

  // 获取最近使用的语言
  getRecentLanguages(maxCount: number = 5): LanguageStats[] {
    return Array.from(this.history.values())
      .sort((a, b) => b.lastUsed.getTime() - a.lastUsed.getTime())
      .slice(0, maxCount)
  }

  // 获取最常用的语言
  getFrequentLanguages(maxCount: number = 5): LanguageStats[] {
    return Array.from(this.history.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, maxCount)
  }

  // 清除历史记录
  clearHistory(): void {
    this.history.clear()
  }
}

// 🎯 全局语言历史管理器实例
export const languageHistory = new LanguageHistoryManager()

// 🔧 快捷函数：记录语言使用
export const recordLanguageUsage = (language: string): void => {
  languageHistory.recordLanguageUsage(language)
}

// 🔧 快捷函数：获取最近使用的语言
export const getRecentLanguages = (maxCount?: number): LanguageStats[] => {
  return languageHistory.getRecentLanguages(maxCount)
}

// 🔧 快捷函数：获取最常用的语言
export const getFrequentLanguages = (maxCount?: number): LanguageStats[] => {
  return languageHistory.getFrequentLanguages(maxCount)
}

// 🎨 生成语言选择器的选项
export interface LanguageOption {
  value: string
  label: string
  displayName: string
  isPopular: boolean
  isRecent: boolean
}

export const generateLanguageOptions = (): LanguageOption[] => {
  const recent = new Set(getRecentLanguages(3).map((lang) => lang.language))

  const options: LanguageOption[] = []

  // 添加常用语言
  for (const lang of POPULAR_LANGUAGES) {
    options.push({
      value: lang,
      label: lang,
      displayName: getLanguageDisplayName(lang),
      isPopular: true,
      isRecent: recent.has(lang)
    })
  }

  return options
}
