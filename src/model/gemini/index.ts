// src/model/gemini/index.ts
import { GoogleGenerativeAI } from '@google/generative-ai'
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

// 🤖 Gemini翻译API类
export class GeminiTranslator {
  private genAI: GoogleGenerativeAI
  private model: any

  constructor(apiKey?: string) {
    const effectiveApiKey = apiKey || GEMINI_CONFIG.apiKey

    this.genAI = new GoogleGenerativeAI(effectiveApiKey)
    this.model = this.genAI.getGenerativeModel({
      model: GEMINI_CONFIG.model,
      generationConfig: GEMINI_CONFIG.generationConfig
    })
  }

  // 🔍 验证API Key是否有效
  private validateApiKey(): void {
    if (!this.genAI || !this.genAI.apiKey || this.genAI.apiKey.trim() === '') {
      throw new Error('Gemini API key is required. Please configure it in Settings.')
    }
  }

  // 🌊 流式翻译方法
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
      const translatePrompt = this.buildTranslatePrompt(text, targetLang)

      // 使用generateContentStream进行流式生成
      const result = await this.model.generateContentStream(translatePrompt)

      let accumulatedText = ''

      // 🌊 处理流式响应
      for await (const chunk of result.stream) {
        const chunkText = chunk.text()

        if (chunkText) {
          accumulatedText += chunkText
          console.log('📝 Received streaming content:', chunkText)
          onStream(chunkText, false) // 实时回调每个chunk
        }
      }

      console.log('✅ Gemini translation completed:', accumulatedText)
      onStream('', true) // 标记完成
    } catch (error) {
      console.error('❌ Gemini translation failed:', error)
      const errorMessage = this.formatError(error)
      onStream(`Translation failed: ${errorMessage}`, true)
      throw error
    }
  }

  // 🔄 非流式翻译方法（作为备选）
  async translate(text: string, targetLang: string = 'Chinese'): Promise<string> {
    try {
      this.validateApiKey() // 🔑 验证API Key

      console.log('🚀 Starting Gemini translation:', {
        text: text.substring(0, 50) + '...',
        targetLang
      })

      const translatePrompt = this.buildTranslatePrompt(text, targetLang)

      const result = await this.model.generateContent(translatePrompt)
      const response = await result.response
      const translatedText = response.text()

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

      const result = await this.model.generateContent(
        'Hello, please reply with exactly "Connection successful" in English.'
      )
      const response = await result.response
      const text = response.text()

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
