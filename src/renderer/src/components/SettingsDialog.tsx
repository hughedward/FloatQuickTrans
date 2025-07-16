import React, { useState, useEffect, useRef } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import './SettingsDialog.css'
import { useProvider } from '../context/ProviderContext'
import { AIProvider } from '../../../model/aiApi'

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
  const [models, setModels] = useState<ModelConfig[]>([
    {
      name: 'DeepSeek',
      provider: 'deepseek',
      apiKey: 'sk-',
      baseURL: 'https://api.deepseek.com',
      model: 'deepseek-chat',
      status: 'connected'
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
        console.log('✅ Loaded saved API settings:', parsedSettings)
      } else {
        // 如果没有保存的设置，保存当前的初始设置
        console.log('💾 No saved settings found, saving initial settings...')
        const initialModels = [
          {
            name: 'DeepSeek',
            provider: 'deepseek' as const,
            apiKey: '', // 🔑 需要用户手动配置
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

  if (!isOpen) return null

  const handleApiKeyChange = (provider: string, value: string): void => {
    const updatedModels = models.map((model) =>
      model.provider === provider ? { ...model, apiKey: value } : model
    )
    setModels(updatedModels)

    // 清除之前的定时器
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    // 设置新的定时器进行延迟保存
    setAutoSaveStatus('Auto-saving...')
    saveTimeoutRef.current = setTimeout(() => {
      console.log('Auto-saving settings for', provider)
      // 保存到localStorage
      localStorage.setItem('quick-trans-api-settings', JSON.stringify(updatedModels))
      setAutoSaveStatus('Saved')
      setTimeout(() => setAutoSaveStatus(''), 2000) // 2秒后清除保存状态
    }, 2000) // 2秒延迟
  }

  const handleTestConnection = async (provider: string): Promise<void> => {
    setModels((prev) =>
      prev.map((model) => (model.provider === provider ? { ...model, status: 'testing' } : model))
    )

    // 模拟连接测试
    setTimeout(() => {
      setModels((prev) =>
        prev.map((model) =>
          model.provider === provider
            ? {
                ...model,
                status: model.apiKey ? 'connected' : 'failed'
              }
            : model
        )
      )
    }, 1500)
  }

  const getStatusText = (status: string): string => {
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
  }

  const toggleApiKeyVisibility = (provider: string): void => {
    setShowApiKey((prev) => ({ ...prev, [provider]: !prev[provider] }))
  }

  // 处理提供商选择变化
  // const handleProviderChange = (provider: 'openai' | 'deepseek' | 'gemini' | 'claude'): void => {
  //   setCurrentProvider(provider)
  //   // 保存到localStorage，让App.tsx能读取
  //   localStorage.setItem('quick-trans-current-provider', provider)
  //   console.log('✅ Current provider saved:', provider)
  // }

  const handleTestAll = async (): Promise<void> => {
    setIsTestingAll(true)
    setActionFeedback('Testing all connections...')

    const testPromises = models
      .filter((model) => model.apiKey.trim() !== '')
      .map((model) => handleTestConnection(model.provider))

    try {
      await Promise.all(testPromises)
      const connectedCount = models.filter((m) => m.status === 'connected').length
      const totalCount = models.filter((m) => m.apiKey.trim() !== '').length
      setActionFeedback(`Complete: ${connectedCount}/${totalCount} connected`)
    } catch {
      setActionFeedback('Some tests failed')
    } finally {
      setIsTestingAll(false)
      setTimeout(() => setActionFeedback(''), 3000)
    }
  }

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
            {models.map((model) => (
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
                        value={model.apiKey}
                        onChange={(e) => handleApiKeyChange(model.provider, e.target.value)}
                        placeholder={model.apiKey ? 'Configured' : 'Enter API Key'}
                        className="api-key-field"
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
                      disabled={!model.apiKey || model.status === 'testing'}
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
