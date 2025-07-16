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

import { DeepSeekTranslator } from './deepseek/index'
import { GeminiTranslator } from './gemini/index'

// 🎯 翻译器工厂类
export class TranslatorFactory {
  private static instances: Map<AIProvider, AITranslator> = new Map()
  private static instanceApiKeys: Map<AIProvider, string> = new Map() // 🔑 缓存每个实例对应的 API key

  // 🏭 获取翻译器实例
  static getTranslator(provider: AIProvider, apiKey?: string): AITranslator {
    console.log(
      '🔍 TranslatorFactory.getTranslator called with:',
      provider,
      'API Key:',
      apiKey ? `${apiKey.substring(0, 8)}...` : 'UNDEFINED'
    )

    const currentApiKey = apiKey || ''
    const cachedApiKey = this.instanceApiKeys.get(provider) || ''
    const hasInstance = this.instances.has(provider)

    console.log(
      '🔍 Current API key:',
      currentApiKey ? `${currentApiKey.substring(0, 8)}...` : 'EMPTY'
    )
    console.log('🔍 Cached API key:', cachedApiKey ? `${cachedApiKey.substring(0, 8)}...` : 'EMPTY')
    console.log('🔍 Has instance:', hasInstance)
    console.log('🔍 API key changed:', currentApiKey !== cachedApiKey)

    // 🔄 如果 API key 改变了，或者没有实例，需要重新创建
    const needsRecreation =
      !hasInstance || (currentApiKey !== cachedApiKey && currentApiKey.trim() !== '')

    if (needsRecreation) {
      if (hasInstance) {
        console.log('🔄 API key changed, recreating translator instance for:', provider)
        this.instances.delete(provider)
      } else {
        console.log('🔍 Creating new translator instance for:', provider)
      }

      console.log('🔍 Provider type:', typeof provider)
      console.log('🔍 AIProvider.DEEPSEEK value:', AIProvider.DEEPSEEK)
      console.log('🔍 provider === AIProvider.DEEPSEEK:', provider === AIProvider.DEEPSEEK)

      switch (provider) {
        case AIProvider.DEEPSEEK:
          console.log(
            '🔍 Creating new DeepSeekTranslatorAdapter with API Key:',
            currentApiKey ? `${currentApiKey.substring(0, 8)}...` : 'UNDEFINED'
          )
          this.instances.set(provider, new DeepSeekTranslatorAdapter(currentApiKey))
          this.instanceApiKeys.set(provider, currentApiKey) // 🔑 缓存 API key
          break
        case AIProvider.OPENAI:
          throw new Error('OpenAI translator not implemented yet')
        case AIProvider.CLAUDE:
          throw new Error('Claude translator not implemented yet')
        case AIProvider.GEMINI:
          this.instances.set(provider, new GeminiTranslatorAdapter(currentApiKey))
          this.instanceApiKeys.set(provider, currentApiKey) // 🔑 缓存 API key
          break
        default:
          console.log('🚨 Unknown provider in switch:', provider)
          throw new Error(`Unsupported AI provider: ${provider}`)
      }
    } else {
      console.log('🔍 Using existing translator instance for:', provider, '(API key unchanged)')
    }

    return this.instances.get(provider)!
  }

  // 🔄 Reset translator instance (for changing API Key)
  static resetTranslator(provider: AIProvider): void {
    this.instances.delete(provider)
    this.instanceApiKeys.delete(provider) // 🔑 同时清除缓存的 API key
  }

  // 🔄 Reset all translator instances
  static resetAllTranslators(): void {
    this.instances.clear()
    this.instanceApiKeys.clear() // 🔑 清除所有缓存的 API key
  }

  // 📋 Get supported providers list
  static getSupportedProviders(): AIProvider[] {
    return [AIProvider.DEEPSEEK, AIProvider.GEMINI] // Currently only Gemini adapter is fully implemented
  }
}

// 🤖 DeepSeek翻译器适配器
class DeepSeekTranslatorAdapter implements AITranslator {
  private translator: DeepSeekTranslator

  constructor(apiKey?: string) {
    console.log(
      '🔍 DeepSeekTranslatorAdapter constructor - received API Key:',
      apiKey ? `${apiKey.substring(0, 8)}...` : 'UNDEFINED'
    )
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

// 🤖 Gemini翻译器适配器
class GeminiTranslatorAdapter implements AITranslator {
  private translator: GeminiTranslator

  constructor(apiKey?: string) {
    this.translator = new GeminiTranslator(apiKey)
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
      throw TranslationError.formatError(error, AIProvider.GEMINI)
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async translate(text: string, targetLang: string, config?: TranslationConfig): Promise<string> {
    try {
      return await this.translator.translate(text, targetLang)
    } catch (error) {
      throw TranslationError.formatError(error, AIProvider.GEMINI)
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      return await this.translator.testConnection()
    } catch (error) {
      console.error('Gemini connection test failed:', error)
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
    console.log(
      '🔍 TranslationManager constructor called with provider:',
      provider,
      'API Key:',
      apiKey ? `${apiKey.substring(0, 8)}...` : 'UNDEFINED'
    )
    // 🔄 如果提供了新的 API key，清理缓存确保使用最新的
    // if (apiKey && apiKey.trim() !== '') {
    //   TranslatorFactory.resetTranslator(provider)
    // }
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
