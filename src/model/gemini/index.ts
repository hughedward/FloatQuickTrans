// src/model/gemini/index.ts
// 不再 import getProxyAgent
// import { getProxyAgent } from '../proxy'
import { StreamCallback, ModelInfo } from '../aiApi'

// 🎯 Gemini翻译配置
const GEMINI_CONFIG = {
  apiKey: '', // 🔑 默认为空，运行时从localStorage获取
  model: 'gemini-1.5-flash', // 使用最新的Flash模型，支持流式
  generationConfig: {
    temperature: 0.1, // 低温度确保翻译准确性
    maxOutputTokens: 2000
  }
}

const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:streamGenerateContent?alt=sse'

// 🤖 Gemini翻译API类
export class GeminiTranslator {
  private apiKey: string

  constructor(apiKey?: string) {
    this.apiKey = apiKey || GEMINI_CONFIG.apiKey
  }

  // 🔍 验证API Key是否有效
  private validateApiKey(): void {
    if (!this.apiKey || this.apiKey.trim() === '') {
      throw new Error('Gemini API key is required. Please configure it in Settings.')
    }
  }

  // 🌊 流式翻译方法（fetch+SSE）
  async translateStream(
    text: string,
    targetLang: string = 'Chinese',
    onStream: StreamCallback
  ): Promise<void> {
    try {
      this.validateApiKey() // 🔑 验证API Key
      console.log('🚀 Starting Gemini streaming translation:', {
        text: text.substring(0, 50) + '...',
        targetLang
      })

      // 构建翻译提示词
      const prompt = this.buildTranslatePrompt(text, targetLang)

      // 构建请求体
      const body = JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: GEMINI_CONFIG.generationConfig
        // model: GEMINI_CONFIG.model // 可选
      })

      // fetch + SSE 解析
      const res = await fetch(GEMINI_API_URL + `&key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body
      })
      if (!res.ok) throw new Error(`Gemini API error: ${res.status} ${res.statusText}`)

      // 解析 SSE 流
      const reader = res.body?.getReader()
      let accumulatedText = ''
      let done = false
      let buffer = ''
      const decoder = new TextDecoder('utf-8')
      while (!done && reader) {
        const { value, done: doneReading } = await reader.read()
        done = doneReading
        if (value) {
          buffer += decoder.decode(value)
          let lines = buffer.split('\n')
          buffer = lines.pop() || ''
          for (const line of lines) {
            if (line.startsWith('data:')) {
              const data = line.slice(5).trim()
              if (data === '[DONE]') {
                onStream('', true)
                return
              }
              try {
                const parsed = JSON.parse(data)
                const chunkText = parsed.candidates?.[0]?.content?.parts?.[0]?.text || ''
                if (chunkText) {
                  accumulatedText += chunkText
                  onStream(chunkText, false)
                }
              } catch (e) {
                // 忽略解析错误
              }
            }
          }
        }
      }
      onStream('', true)
    } catch (error) {
      console.error('❌ Gemini translation failed:', error)
      const errorMessage = this.formatError(error)
      onStream(`Translation failed: ${errorMessage}`, true)
      throw error
    }
  }

  // 🔄 非流式翻译方法（fetch）
  async translate(text: string, targetLang: string = 'Chinese'): Promise<string> {
    try {
      this.validateApiKey() // 🔑 验证API Key
      console.log('🚀 Starting Gemini translation:', {
        text: text.substring(0, 50) + '...',
        targetLang
      })
      const prompt = this.buildTranslatePrompt(text, targetLang)
      const body = JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: GEMINI_CONFIG.generationConfig
      })
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body
      })
      if (!res.ok) throw new Error(`Gemini API error: ${res.status} ${res.statusText}`)
      const json = await res.json()
      const translatedText = json.candidates?.[0]?.content?.parts?.[0]?.text || ''
      console.log('✅ Gemini translation completed:', translatedText)
      return translatedText
    } catch (error) {
      console.error('❌ Gemini translation failed:', error)
      throw new Error(this.formatError(error))
    }
  }

  // 🔍 测试连接方法
  async testConnection(): Promise<boolean> {
    try {
      this.validateApiKey() // 🔑 验证API Key
      console.log('🔍 Testing Gemini connection...')
      const body = JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              { text: 'Hello, please reply with exactly "Connection successful" in English.' }
            ]
          }
        ],
        generationConfig: GEMINI_CONFIG.generationConfig
      })
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body
      })
      if (!res.ok) return false
      const json = await res.json()
      const text = json.candidates?.[0]?.content?.parts?.[0]?.text || ''
      const isSuccessful = text.includes('successful') || text.includes('Connection successful')
      console.log(
        isSuccessful ? '✅ Gemini connection successful' : '⚠️ Gemini connection abnormal'
      )
      return isSuccessful
    } catch (error) {
      console.error('❌ Gemini connection test failed:', error)
      return false
    }
  }

  // 📊 获取模型信息
  getModelInfo(): ModelInfo {
    return {
      provider: 'Gemini',
      model: GEMINI_CONFIG.model,
      baseURL: 'https://generativelanguage.googleapis.com',
      features: [
        'Streaming Response',
        'Multi-language Translation',
        'Google AI Technology',
        'Fast Response Speed'
      ]
    }
  }

  // 🛠️ 构建翻译提示词
  private buildTranslatePrompt(text: string, targetLang: string): string {
    // 智能检测翻译方向
    const hasChineseChars = /[\u4e00-\u9fff]/.test(text)

    if (targetLang === 'Chinese' && hasChineseChars) {
      // If target is Chinese but input already contains Chinese, may need Chinese-English mutual translation
      return `Please translate the following text into fluent and natural Chinese. Only return the translation result without any explanations:\n\n${text}`
    } else if (targetLang === 'English') {
      return `Please translate the following text into natural English. Only return the translation result without any explanations:\n\n${text}`
    } else {
      return `Please translate the following text into ${targetLang}. Only return the translation result without any explanations:\n\n${text}`
    }
  }

  // 🛠️ 格式化错误信息
  private formatError(error: unknown): string {
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return 'Invalid API key, please check configuration'
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        return 'Network connection failed, please check network'
      } else if (error.message.includes('quota') || error.message.includes('limit')) {
        return 'API quota exceeded, please try again later'
      } else {
        return error.message
      }
    }
    return 'Unknown error'
  }
}

// 🎯 简化的直接调用函数（流式）
export async function translateWithGemini(
  text: string,
  onStream: StreamCallback,
  targetLang: string = 'Chinese',
  apiKey?: string
): Promise<void> {
  if (!apiKey) {
    onStream('❌ Gemini API key is required. Please configure it in Settings.', true)
    return
  }
  const translator = new GeminiTranslator(apiKey)
  await translator.translateStream(text, targetLang, onStream)
}

// 🎯 简化的直接调用函数（非流式）
export async function translateTextWithGemini(
  text: string,
  targetLang: string = 'Chinese',
  apiKey?: string
): Promise<string> {
  if (!apiKey) {
    throw new Error('Gemini API key is required. Please configure it in Settings.')
  }
  const translator = new GeminiTranslator(apiKey)
  return await translator.translate(text, targetLang)
}

// 🔍 连接测试函数
export async function testGeminiConnection(apiKey?: string): Promise<boolean> {
  try {
    if (!apiKey) {
      console.error('❌ Gemini API key is required for connection test')
      return false
    }
    const translator = new GeminiTranslator(apiKey)
    return await translator.testConnection()
  } catch (error) {
    console.error('❌ Gemini connection test failed:', error)
    return false
  }
}

// 默认导出
export default GeminiTranslator
