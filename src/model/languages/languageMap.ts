// 🌍 全面的语言映射表
// 支持各种语言的本土名称、英文名称、ISO代码等多种输入方式

export const COMPREHENSIVE_LANGUAGES: Record<string, string> = {
  // 中文相关
  中文: 'Chinese',
  中国话: 'Chinese',
  汉语: 'Chinese',
  chinese: 'Chinese',
  zh: 'Chinese',
  cn: 'Chinese',

  // 英文相关
  英文: 'English',
  英语: 'English',
  english: 'English',
  en: 'English',

  // 日语相关（包含日语本土名称）
  日语: 'Japanese',
  日文: 'Japanese',
  japanese: 'Japanese',
  ja: 'Japanese',
  日本語: 'Japanese', // 日语本土名称
  にほんご: 'Japanese', // 平假名

  // 韩语相关（包含韩语本土名称）
  韩语: 'Korean',
  korean: 'Korean',
  ko: 'Korean',
  한국어: 'Korean', // 韩语本土名称
  조선어: 'Korean', // 朝鲜语

  // 阿拉伯语相关（包含阿拉伯语本土名称）
  阿拉伯语: 'Arabic',
  arabic: 'Arabic',
  ar: 'Arabic',
  العربية: 'Arabic', // 阿拉伯语本土名称

  // 孟加拉语相关（包含孟加拉语本土名称）
  孟加拉语: 'Bengali',
  bengali: 'Bengali',
  bn: 'Bengali',
  বাংলা: 'Bengali', // 孟加拉语本土名称

  // 印地语相关（包含印地语本土名称）
  印地语: 'Hindi',
  hindi: 'Hindi',
  hi: 'Hindi',
  हिन्दी: 'Hindi', // 印地语本土名称

  // 泰语相关（包含泰语本土名称）
  泰语: 'Thai',
  thai: 'Thai',
  th: 'Thai',
  ไทย: 'Thai', // 泰语本土名称

  // 越南语相关（包含越南语本土名称）
  越南语: 'Vietnamese',
  vietnamese: 'Vietnamese',
  vi: 'Vietnamese',
  'Tiếng Việt': 'Vietnamese', // 越南语本土名称

  // 俄语相关（包含俄语本土名称）
  俄语: 'Russian',
  russian: 'Russian',
  ru: 'Russian',
  Русский: 'Russian', // 俄语本土名称

  // 法语相关（包含法语本土名称）
  法语: 'French',
  french: 'French',
  fr: 'French',
  Français: 'French', // 法语本土名称

  // 德语相关（包含德语本土名称）
  德语: 'German',
  german: 'German',
  de: 'German',
  Deutsch: 'German', // 德语本土名称

  // 西班牙语相关（包含西班牙语本土名称）
  西班牙语: 'Spanish',
  spanish: 'Spanish',
  es: 'Spanish',
  Español: 'Spanish', // 西班牙语本土名称

  // 葡萄牙语相关（包含葡萄牙语本土名称）
  葡萄牙语: 'Portuguese',
  portuguese: 'Portuguese',
  pt: 'Portuguese',
  Português: 'Portuguese', // 葡萄牙语本土名称

  // 意大利语相关（包含意大利语本土名称）
  意大利语: 'Italian',
  italian: 'Italian',
  it: 'Italian',
  Italiano: 'Italian', // 意大利语本土名称

  // 土耳其语相关（包含土耳其语本土名称）
  土耳其语: 'Turkish',
  turkish: 'Turkish',
  tr: 'Turkish',
  Türkçe: 'Turkish', // 土耳其语本土名称

  // 波兰语相关（包含波兰语本土名称）
  波兰语: 'Polish',
  polish: 'Polish',
  pl: 'Polish',
  Polski: 'Polish', // 波兰语本土名称

  // 荷兰语相关（包含荷兰语本土名称）
  荷兰语: 'Dutch',
  dutch: 'Dutch',
  nl: 'Dutch',
  Nederlands: 'Dutch', // 荷兰语本土名称

  // 瑞典语相关（包含瑞典语本土名称）
  瑞典语: 'Swedish',
  swedish: 'Swedish',
  sv: 'Swedish',
  Svenska: 'Swedish', // 瑞典语本土名称

  // 挪威语相关（包含挪威语本土名称）
  挪威语: 'Norwegian',
  norwegian: 'Norwegian',
  no: 'Norwegian',
  Norsk: 'Norwegian', // 挪威语本土名称

  // 芬兰语相关（包含芬兰语本土名称）
  芬兰语: 'Finnish',
  finnish: 'Finnish',
  fi: 'Finnish',
  Suomi: 'Finnish', // 芬兰语本土名称

  // 希腊语相关（包含希腊语本土名称）
  希腊语: 'Greek',
  greek: 'Greek',
  el: 'Greek',
  Ελληνικά: 'Greek', // 希腊语本土名称

  // 希伯来语相关（包含希伯来语本土名称）
  希伯来语: 'Hebrew',
  hebrew: 'Hebrew',
  he: 'Hebrew',
  עברית: 'Hebrew', // 希伯来语本土名称

  // 乌克兰语相关（包含乌克兰语本土名称）
  乌克兰语: 'Ukrainian',
  ukrainian: 'Ukrainian',
  uk: 'Ukrainian',
  Українська: 'Ukrainian', // 乌克兰语本土名称

  // 捷克语相关（包含捷克语本土名称）
  捷克语: 'Czech',
  czech: 'Czech',
  cs: 'Czech',
  Čeština: 'Czech', // 捷克语本土名称

  // 匈牙利语相关（包含匈牙利语本土名称）
  匈牙利语: 'Hungarian',
  hungarian: 'Hungarian',
  hu: 'Hungarian',
  Magyar: 'Hungarian', // 匈牙利语本土名称

  // 印尼语相关（包含印尼语本土名称）
  印尼语: 'Indonesian',
  indonesian: 'Indonesian',
  id: 'Indonesian',
  'Bahasa Indonesia': 'Indonesian', // 印尼语本土名称

  // 马来语相关（包含马来语本土名称）
  马来语: 'Malay',
  malay: 'Malay',
  ms: 'Malay',
  'Bahasa Melayu': 'Malay', // 马来语本土名称

  // 菲律宾语相关（包含菲律宾语本土名称）
  菲律宾语: 'Filipino',
  filipino: 'Filipino',
  fil: 'Filipino',
  Tagalog: 'Filipino', // 他加禄语（菲律宾语）

  // 斯瓦希里语相关（包含斯瓦希里语本土名称）
  斯瓦希里语: 'Swahili',
  swahili: 'Swahili',
  sw: 'Swahili',
  Kiswahili: 'Swahili' // 斯瓦希里语本土名称
}

// 🌍 常用语言列表（用于UI显示）
export const POPULAR_LANGUAGES = [
  'Chinese',
  'English',
  'Japanese',
  'Korean',
  'French',
  'German',
  'Spanish',
  'Russian',
  'Arabic',
  'Hindi'
]

// 🔤 语言显示名称映射（用于UI显示）
export const LANGUAGE_DISPLAY_NAMES: Record<string, string> = {
  Chinese: '中文',
  English: 'EN',
  Japanese: '日本語',
  Korean: '한국어',
  French: 'FR',
  German: 'DE',
  Spanish: 'ES',
  Russian: 'Русский',
  Arabic: 'العربية',
  Hindi: 'हिन्दी',
  Thai: 'ไทย',
  Vietnamese: 'Tiếng Việt',
  Portuguese: 'Português',
  Italian: 'Italiano',
  Turkish: 'Türkçe',
  Bengali: 'বাংলা'
}
