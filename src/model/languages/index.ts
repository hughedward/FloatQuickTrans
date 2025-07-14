// 🌍 语言支持模块统一导出
// 提供完整的多语言支持功能

// 导出语言映射表
export { COMPREHENSIVE_LANGUAGES, POPULAR_LANGUAGES, LANGUAGE_DISPLAY_NAMES } from './languageMap'

// 导出语言验证器
export {
  validateLanguage,
  processLanguageInput,
  isSupportedLanguage,
  getLanguageSuggestions,
  normalizeLanguageName
} from './languageValidator'

export type { LanguageValidationResult } from './languageValidator'

// 导出语言工具函数
export {
  getLanguageDisplayName,
  getPopularLanguages,
  detectSourceLanguage,
  getAutoTargetLanguage,
  languageHistory,
  recordLanguageUsage,
  getRecentLanguages,
  getFrequentLanguages,
  generateLanguageOptions
} from './languageUtils'

export type { LanguageStats, LanguageOption } from './languageUtils'
