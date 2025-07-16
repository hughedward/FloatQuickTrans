import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import './SettingsDialog.css'
import { useProvider } from '../context/ProviderContext'
import { AIProvider } from '../../../model/aiApi'
import { testAIConnection } from '../../../model/adapter'

// 🎯 防抖 hook
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

interface SettingsDialogProps {
  isOpen: boolean
  onClose: () => void
}

interface ModelConfig {
  name: string
  provider: 'openai' | 'deepseek' | 'gemini' | 'claude'
  apiKey: string
  baseURL: string
  model: string
  status: 'unknown' | 'testing' | 'connected' | 'failed'
}

export const SettingsDialog: React.FC<SettingsDialogProps> = ({ isOpen, onClose }) => {
  const { currentProvider, setCurrentProvider } = useProvider()
  
  // 🎯 优化：分离输入状态和保存状态，减少重渲染
  const [inputValues, setInputValues] = useState<Record<string, string>>({})
  const [models, setModels] = useState<ModelConfig[]>([
    {
      name: 'DeepSeek',
      provider: 'deepseek',
      apiKey: '',
      baseURL: 'https://api.deepseek.com',
      model: 'deepseek-chat',
      status: 'unknown'
    },
    {
      name: 'OpenAI',
      provider: 'openai',
      apiKey: '',
      baseURL: 'https://api.openai.com',
      model: 'gpt-3.5-turbo',
      status: 'unknown'
    },
    {
      name: 'Gemini',
      provider: 'gemini',
      apiKey: '',
      baseURL: 'https://generativelanguage.googleapis.com',
      model: 'gemini-pro',
      status: 'unknown'
    },
    {
      name: 'Claude',
      provider: 'claude',
      apiKey: '',
      baseURL: 'https://api.anthropic.com',
      model: 'claude-3-haiku-20240307',
      status: 'unknown'
    }
  ])

  const [showApiKey, setShowApiKey] = useState<Record<string, boolean>>({})
  const [isTestingAll, setIsTestingAll] = useState(false)
  const [actionFeedback, setActionFeedback] = useState('')
  const [autoSaveStatus, setAutoSaveStatus] = useState('')
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const testingRef = useRef<Set<string>>(new Set()) // 🎯 跟踪正在测试的提供商

  // 🎯 防抖处理输入值变化
  const debouncedInputValues = useDebounce(JSON.stringify(inputValues), 1000)

  // 🎯 防抖保存效果
  useEffect(() => {
    if (debouncedInputValues && Object.keys(inputValues).length > 0) {
      const parsedValues = JSON.parse(debouncedInputValues)
      
      // 更新 models 状态
      setModels(prev => prev.map(model => ({
        ...model,
        apiKey: parsedValues[model.provider] || model.apiKey
      })))

      // 保存到 localStorage
      setAutoSaveStatus('Auto-saving...')
      
      try {
        const savedSettings = localStorage.getItem('quick-trans-api-settings')
        if (savedSettings) {
          const parsedSettings = JSON.parse(savedSettings)
          const updatedSettings = parsedSettings.map((config: any) => ({
            ...config,
            apiKey: parsedValues[config.provider] || config.apiKey
          }))
          localStorage.setItem('quick-trans-api-settings', JSON.stringify(updatedSettings))
        }
        
        setAutoSaveStatus('Saved')
        setTimeout(() => setAutoSaveStatus(''), 2000)
      } catch (error) {
        console.warn('Failed to save settings:', error)
        setAutoSaveStatus('Save failed')
        setTimeout(() => setAutoSaveStatus(''), 2000)
      }
    }
  }, [debouncedInputValues, inputValues])

  // 加载保存的设置
  useEffect(() => {
    // 从localStorage加载当前提供商设置
    try {
      const savedProvider = localStorage.getItem('quick-trans-current-provider')
      if (savedProvider) {
        setCurrentProvider(
          savedProvider as
            | AIProvider.OPENAI
            | AIProvider.DEEPSEEK
            | AIProvider.GEMINI
            | AIProvider.CLAUDE
        )
        console.log('✅ Loaded current provider:', savedProvider)
      }
    } catch (error) {
      console.warn('Failed to load current provider:', error)
    }

    // 从localStorage加载API key设置
    try {
      const savedSettings = localStorage.getItem('quick-trans-api-settings')
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings)
        setModels(parsedSettings)
        
        // 🎯 初始化输入值状态
        const initialInputValues: Record<string, string> = {}
        parsedSettings.forEach((setting: any) => {
          initialInputValues[setting.provider] = setting.apiKey || ''
        })
        setInputValues(initialInputValues)
        
        console.log('✅ Loaded saved API settings:', parsedSettings)
      } else {
        // 如果没有保存的设置，保存当前的初始设置
        console.log('💾 No saved settings found, saving initial settings...')
        const initialModels = [
          {
            name: 'DeepSeek',
            provider: 'deepseek' as const,
            apiKey: '',
            baseURL: 'https://api.deepseek.com',
            model: 'deepseek-chat',
            status: 'unknown' as const
          },
          {
            name: 'OpenAI',
            provider: 'openai' as const,
            apiKey: '',
            baseURL: 'https://api.openai.com',
            model: 'gpt-3.5-turbo',
            status: 'unknown' as const
          },
          {
            name: 'Gemini',
            provider: 'gemini' as const,
            apiKey: '',
            baseURL: 'https://generativelanguage.googleapis.com',
            model: 'gemini-pro',
            status: 'unknown' as const
          },
          {
            name: 'Claude',
            provider: 'claude' as const,
            apiKey: '',
            baseURL: 'https://api.anthropic.com',
            model: 'claude-3-sonnet',
            status: 'unknown' as const
          }
        ]
        localStorage.setItem('quick-trans-api-settings', JSON.stringify(initialModels))
        console.log('✅ Initial settings saved:', initialModels)
      }
    } catch (error) {
      console.warn('Failed to load saved API settings:', error)
    }
  }, [])

  // 清理定时器
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [])

  // 🎯 使用 useCallback 优化事件处理函数
  const handleApiKeyChange = useCallback((provider: string, value: string): void => {
    setInputValues(prev => ({
      ...prev,
      [provider]: value
    }))
  }, [])

  const handleTestConnection = useCallback(async (provider: string): Promise<void> => {
    console.log('🔍 Testing connection for provider:', provider)
    
    // 🎯 防止重复测试
    if (testingRef.current.has(provider)) {
      console.log('⚠️ Test already in progress for', provider)
      return
    }
    
    // 🔍 获取当前 API key（优先从输入状态获取）
    const currentApiKey = inputValues[provider] || models.find(m => m.provider === provider)?.apiKey || ''
    
    console.log('🔑 Current API key:', currentApiKey ? `${currentApiKey.substring(0, 8)}...` : 'EMPTY')
    
    if (!currentApiKey || currentApiKey.trim() === '') {
      console.warn('⚠️ No API key provided for', provider)
      setModels((prev) =>
        prev.map((model) =>
          model.provider === provider
            ? { ...model, status: 'failed' }
            : model
        )
      )
      return
    }
    
    // 🔄 设置测试状态
    testingRef.current.add(provider)
    setModels((prev) =>
      prev.map((model) => (model.provider === provider ? { ...model, status: 'testing' } : model))
    )

    try {
      console.log('🚀 Starting connection test for', provider)
      
      // 🔑 先更新localStorage中的API key，确保testAIConnection能获取到最新值
      const savedSettings = localStorage.getItem('quick-trans-api-settings')
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings)
        const updatedSettings = parsedSettings.map((config: any) => 
          config.provider === provider 
            ? { ...config, apiKey: currentApiKey }
            : config
        )
        localStorage.setItem('quick-trans-api-settings', JSON.stringify(updatedSettings))
        console.log('🔑 Updated API key in localStorage for testing')
      }
      
      const isConnected = await testAIConnection(provider as AIProvider)
      console.log('🔍 Connection test result for', provider, ':', isConnected)
      
      setModels((prev) =>
        prev.map((model) =>
          model.provider === provider
            ? { ...model, status: isConnected ? 'connected' : 'failed', apiKey: currentApiKey }
            : model
        )
      )
    } catch (error) {
      console.error('❌ Connection test failed for', provider, ':', error)
      setModels((prev) =>
        prev.map((model) =>
          model.provider === provider
            ? { ...model, status: 'failed', apiKey: currentApiKey }
            : model
        )
      )
    } finally {
      // 🎯 清除测试状态
      testingRef.current.delete(provider)
    }
  }, [inputValues, models])

  const getStatusText = useCallback((status: string): string => {
    switch (status) {
      case 'connected':
        return 'Connected'
      case 'failed':
        return 'Failed'
      case 'testing':
        return 'Testing...'
      default:
        return 'Unknown'
    }
  }, [])

  const toggleApiKeyVisibility = useCallback((provider: string): void => {
    setShowApiKey((prev) => ({ ...prev, [provider]: !prev[provider] }))
  }, [])

  const handleTestAll = useCallback(async (): Promise<void> => {
    setIsTestingAll(true)
    setActionFeedback('Testing all connections...')

    // 🔍 获取有API key的模型（从输入状态和模型状态中获取）
    const modelsWithApiKey = models.filter((model) => {
      const apiKey = inputValues[model.provider] || model.apiKey
      return apiKey && apiKey.trim() !== ''
    })
    
    if (modelsWithApiKey.length === 0) {
      setActionFeedback('No API keys configured')
      setIsTestingAll(false)
      setTimeout(() => setActionFeedback(''), 3000)
      return
    }

    console.log('🚀 Testing connections for', modelsWithApiKey.length, 'providers')

    try {
      // 🔄 串行测试连接，避免并发过多导致UI阻塞
      for (const model of modelsWithApiKey) {
        if (!testingRef.current.has(model.provider)) {
          await handleTestConnection(model.provider)
          // 🎯 添加小延迟，避免请求过于密集
          await new Promise(resolve => setTimeout(resolve, 200))
        }
      }
      
      // 🔍 等待状态更新后计算结果
      setTimeout(() => {
        const currentModels = models.filter((m) => {
          const apiKey = inputValues[m.provider] || m.apiKey
          return apiKey && apiKey.trim() !== ''
        })
        const connectedCount = currentModels.filter((m) => m.status === 'connected').length
        const totalCount = currentModels.length
        
        console.log('📊 Test results:', connectedCount, '/', totalCount, 'connected')
        setActionFeedback(`Complete: ${connectedCount}/${totalCount} connected`)
      }, 500)
      
    } catch (error) {
      console.error('❌ Test all failed:', error)
      setActionFeedback('Some tests failed')
    } finally {
      setIsTestingAll(false)
      setTimeout(() => setActionFeedback(''), 3000)
    }
  }, [models, inputValues, handleTestConnection])

  // 🎯 使用 useMemo 优化渲染的模型数据
  const displayModels = useMemo(() => {
    return models.map(model => ({
      ...model,
      displayApiKey: inputValues[model.provider] !== undefined 
        ? inputValues[model.provider] 
        : model.apiKey
    }))
  }, [models, inputValues])

  if (!isOpen) return null

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="settings-content">
          {/* 头部区域 */}
          <div className="settings-header-seamless">
            <h3>Model Configuration</h3>
            <button className="close-button" onClick={onClose}>
              ×
            </button>
          </div>

          {/* 当前模型选择区域 */}
          <div className="current-provider">
            <label>Current Model:</label>
            <select
              value={currentProvider}
              onChange={(e) => setCurrentProvider(e.target.value as any)}
              className="provider-select"
            >
              <option value="deepseek">DeepSeek</option>
              <option value="openai">OpenAI</option>
              <option value="gemini">Gemini</option>
              <option value="claude">Claude</option>
            </select>
          </div>

          {/* 模型配置区域 */}
          <div className="models-container">
            {displayModels.map((model) => (
              <div key={model.provider} className="model-card">
                <div className="model-header">
                  <span className="model-name">{model.name}</span>
                </div>

                <div className="model-config">
                  <div className="config-row-horizontal">
                    <label>API Key:</label>
                    <div className="api-key-input-wrapper">
                      <input
                        type={showApiKey[model.provider] ? 'text' : 'password'}
                        value={model.displayApiKey}
                        onChange={(e) => handleApiKeyChange(model.provider, e.target.value)}
                        placeholder={model.displayApiKey ? 'Configured' : 'Enter API Key'}
                        className="api-key-field"
                        data-provider={model.provider}
                      />
                      <button
                        className="toggle-visibility-inside"
                        onClick={() => toggleApiKeyVisibility(model.provider)}
                        type="button"
                        aria-label={showApiKey[model.provider] ? 'Hide password' : 'Show password'}
                      >
                        {showApiKey[model.provider] ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    <button
                      className="test-connection"
                      onClick={() => handleTestConnection(model.provider)}
                      disabled={!model.displayApiKey || model.status === 'testing' || testingRef.current.has(model.provider)}
                    >
                      Test
                    </button>
                    <span className={`model-status-text ${model.status}`}>
                      {getStatusText(model.status)}
                    </span>
                  </div>

                  <div className="config-info-row">
                    <label>URL:</label>
                    <span className="config-value">{model.baseURL}</span>
                  </div>

                  <div className="config-info-row">
                    <label>Model:</label>
                    <span className="config-value">{model.model}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 尾部区域 */}
          <div className="settings-footer">
            <div className="action-feedback">
              {actionFeedback && <span className="feedback-text">{actionFeedback}</span>}
              {autoSaveStatus && <span className="auto-save-text">{autoSaveStatus}</span>}
            </div>
            <div className="footer-buttons">
              <button className="test-all-btn" onClick={handleTestAll} disabled={isTestingAll}>
                {isTestingAll ? 'Testing...' : 'Test All'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsDialog
