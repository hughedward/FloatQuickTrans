// src/model/adapter.ts
// 🎯 AI翻译器适配器 - 统一管理不同的AI提供商

import {
  AITranslator,
  AIProvider,
  StreamCallback,
  TranslationConfig,
  ModelInfo,
  TranslationError,
  LanguageDetector,
  SUPPORTED_LANGUAGES,
  DEFAULT_TRANSLATION_CONFIG
} from './aiApi'

import { DeepSeekTranslator } from './openai/index'

// 🎯 翻译器工厂类
export class TranslatorFactory {
  private static instances: Map<AIProvider, AITranslator> = new Map()

  // 🏭 获取翻译器实例
  static getTranslator(provider: AIProvider, apiKey?: string): AITranslator {
    if (!this.instances.has(provider)) {
      switch (provider) {
        case AIProvider.DEEPSEEK:
          this.instances.set(provider, new DeepSeekTranslatorAdapter(apiKey))
          break
        case AIProvider.OPENAI:
          // TODO: Implement OpenAI translator
          throw new Error('OpenAI translator not implemented yet')
        case AIProvider.CLAUDE:
          // TODO: Implement Claude translator
          throw new Error('Claude translator not implemented yet')
        case AIProvider.GEMINI:
          // TODO: Implement Gemini translator
          throw new Error('Gemini translator not implemented yet')
        default:
          throw new Error(`Unsupported AI provider: ${provider}`)
      }
    }

    return this.instances.get(provider)!
  }

  // 🔄 Reset translator instance (for changing API Key)
  static resetTranslator(provider: AIProvider): void {
    this.instances.delete(provider)
  }

  // 📋 Get supported providers list
  static getSupportedProviders(): AIProvider[] {
    return [AIProvider.DEEPSEEK] // Currently only supports DeepSeek
  }
}

// 🤖 DeepSeek翻译器适配器
class DeepSeekTranslatorAdapter implements AITranslator {
  private translator: DeepSeekTranslator

  constructor(apiKey?: string) {
    this.translator = new DeepSeekTranslator(apiKey)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async translateStream(
    text: string,
    targetLang: string,
    onStream: StreamCallback,
    config?: TranslationConfig // TODO: Implement config parameter passing
  ): Promise<void> {
    try {
      await this.translator.translateStream(text, targetLang, onStream)
    } catch (error) {
      throw TranslationError.formatError(error, AIProvider.DEEPSEEK)
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async translate(text: string, targetLang: string, config?: TranslationConfig): Promise<string> {
    try {
      return await this.translator.translate(text, targetLang)
    } catch (error) {
      throw TranslationError.formatError(error, AIProvider.DEEPSEEK)
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      return await this.translator.testConnection()
    } catch (error) {
      console.error('DeepSeek connection test failed:', error)
      return false
    }
  }

  getModelInfo(): ModelInfo {
    return this.translator.getModelInfo()
  }

  getSupportedLanguages(): string[] {
    return SUPPORTED_LANGUAGES
  }
}

// 🎯 统一翻译管理器
export class TranslationManager {
  private currentProvider: AIProvider = AIProvider.DEEPSEEK
  private currentTranslator: AITranslator

  constructor(provider: AIProvider = AIProvider.DEEPSEEK, apiKey?: string) {
    this.currentProvider = provider
    this.currentTranslator = TranslatorFactory.getTranslator(provider, apiKey)
  }

  // 🔄 Switch AI provider
  async switchProvider(provider: AIProvider, apiKey?: string): Promise<void> {
    this.currentProvider = provider
    this.currentTranslator = TranslatorFactory.getTranslator(provider, apiKey)

    // Test new provider connection
    const isConnected = await this.currentTranslator.testConnection()
    if (!isConnected) {
      throw new TranslationError(`Failed to connect to ${provider}`, provider, 'CONNECTION_FAILED')
    }
  }

  // 🌊 Smart translation (automatic language detection)
  async smartTranslate(
    text: string,
    onStream?: StreamCallback,
    config?: TranslationConfig
  ): Promise<string> {
    const targetLang = LanguageDetector.getAutoTargetLanguage(text)

    if (onStream) {
      await this.currentTranslator.translateStream(text, targetLang, onStream, config)
      return '' // Streaming translation does not return complete result
    } else {
      return await this.currentTranslator.translate(text, targetLang, config)
    }
  }

  // 🎯 Translate to specified target language
  async translateTo(
    text: string,
    targetLang: string,
    onStream?: StreamCallback,
    config?: TranslationConfig
  ): Promise<string> {
    const mergedConfig = { ...DEFAULT_TRANSLATION_CONFIG, ...config }

    if (onStream) {
      await this.currentTranslator.translateStream(text, targetLang, onStream, mergedConfig)
      return '' // Streaming translation does not return complete result
    } else {
      return await this.currentTranslator.translate(text, targetLang, mergedConfig)
    }
  }

  // 🔍 测试当前提供商连接
  async testCurrentConnection(): Promise<boolean> {
    return await this.currentTranslator.testConnection()
  }

  // 📊 获取当前模型信息
  getCurrentModelInfo(): ModelInfo {
    return this.currentTranslator.getModelInfo()
  }

  // 🌍 获取支持的语言
  getSupportedLanguages(): string[] {
    return this.currentTranslator.getSupportedLanguages()
  }

  // 📋 获取当前提供商
  getCurrentProvider(): AIProvider {
    return this.currentProvider
  }

  // 📋 获取所有支持的提供商
  getAllSupportedProviders(): AIProvider[] {
    return TranslatorFactory.getSupportedProviders()
  }
}

// 🎯 默认翻译管理器实例
export const defaultTranslationManager = new TranslationManager()

// 🎯 便捷的翻译函数（向后兼容）
export async function translateWithAI(
  text: string,
  onStream: StreamCallback,
  targetLang: string = 'Chinese',
  provider: AIProvider = AIProvider.DEEPSEEK
): Promise<void> {
  const manager = new TranslationManager(provider)
  await manager.translateTo(text, targetLang, onStream)
}

// 🔍 便捷的连接测试函数
export async function testAIConnection(
  provider: AIProvider = AIProvider.DEEPSEEK
): Promise<boolean> {
  const manager = new TranslationManager(provider)
  return await manager.testCurrentConnection()
}
