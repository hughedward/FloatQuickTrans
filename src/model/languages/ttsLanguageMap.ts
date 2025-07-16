// 🔊 TTS语音合成语言映射表
// 标准语言名称 → TTS语言代码

// 🌟 主流语言（优先支持，质量最佳）
export const PRIMARY_TTS_LANGUAGES: Record<string, string> = {
  'Chinese': 'zh-CN',
  'English': 'en-US', 
  'Japanese': 'ja-JP',
  'French': 'fr-FR',
  'German': 'de-DE',
  'Spanish': 'es-ES',
  'Korean': 'ko-KR',
  'Russian': 'ru-RU'
}

// 🌍 扩展语言（额外支持）
export const EXTENDED_TTS_LANGUAGES: Record<string, string> = {
  'Italian': 'it-IT',
  'Portuguese': 'pt-BR',
  'Dutch': 'nl-NL',
  'Hindi': 'hi-IN',
  'Thai': 'th-TH',
  'Arabic': 'ar-001',
  'Hebrew': 'he-IL',
  'Vietnamese': 'vi-VN',
  'Malay': 'ms-MY',
  'Indonesian': 'id-ID',
  'Bulgarian': 'bg-BG',
  'Romanian': 'ro-RO',
  'Croatian': 'hr-HR',
  'Slovak': 'sk-SK',
  'Ukrainian': 'uk-UA',
  'Greek': 'el-GR',
  'Norwegian': 'nb-NO',
  'Danish': 'da-DK',
  'Finnish': 'fi-FI',
  'Swedish': 'sv-SE',
  'Catalan': 'ca-ES',
  'Hungarian': 'hu-HU',
  'Turkish': 'tr-TR',
  'Polish': 'pl-PL',
  'Czech': 'cs-CZ'
}

// 🎯 完整的TTS语言映射（主流 + 扩展）
export const COMPLETE_TTS_LANGUAGES: Record<string, string> = {
  ...PRIMARY_TTS_LANGUAGES,
  ...EXTENDED_TTS_LANGUAGES
}

// 🔍 获取TTS语言代码的函数
export const getTTSLanguageCode = (standardLanguageName: string): string => {
  return COMPLETE_TTS_LANGUAGES[standardLanguageName] || 'en-US'
}

// 📋 支持的语言列表（用于UI显示）
export const SUPPORTED_TTS_LANGUAGES = Object.keys(COMPLETE_TTS_LANGUAGES)

// 🌟 主流语言列表（用于优先显示）
export const PRIMARY_LANGUAGE_LIST = Object.keys(PRIMARY_TTS_LANGUAGES)