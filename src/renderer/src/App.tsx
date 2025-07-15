import { useState, useRef, useEffect } from 'react'
import './App.css'
import { translateWithDeepSeek, testDeepSeekConnection } from '../../model/openai/index'
import { TranslationManager } from '../../model/adapter'
import { AIProvider } from '../../model/aiApi'
import SettingsDialog from './components/SettingsDialog'
// import { validateLanguage, getLanguageDisplayName } from '../../model/languages'

// 🧪 Mock翻译功能 - 用于演示
const mockTranslateText = async (text: string, targetLang: string): Promise<string> => {
  // 模拟API延迟
  await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 1200))

  // 简单的Mock翻译词典
  const translations: Record<string, Record<string, string>> = {
    Chinese: {
      hello: '你好',
      world: '世界',
      'thank you': '谢谢',
      goodbye: '再见',
      'good morning': '早上好',
      'good evening': '晚上好',
      'how are you': '你好吗',
      'what is your name': '你叫什么名字',
      'nice to meet you': '很高兴见到你',
      'i love you': '我爱你',
      please: '请',
      sorry: '对不起',
      'excuse me': '不好意思',
      yes: '是的',
      no: '不是',
      translation: '翻译',
      software: '软件',
      computer: '电脑',
      internet: '互联网',
      technology: '技术'
    },
    Japanese: {
      hello: 'こんにちは',
      world: '世界',
      'thank you': 'ありがとう',
      goodbye: 'さようなら',
      'good morning': 'おはよう',
      'good evening': 'こんばんは',
      'how are you': '元気ですか',
      translation: '翻訳',
      software: 'ソフトウェア'
    },
    French: {
      hello: 'bonjour',
      world: 'monde',
      'thank you': 'merci',
      goodbye: 'au revoir',
      'good morning': 'bonjour',
      'good evening': 'bonsoir',
      translation: 'traduction',
      software: 'logiciel'
    },
    Spanish: {
      hello: 'hola',
      world: 'mundo',
      'thank you': 'gracias',
      goodbye: 'adiós',
      'good morning': 'buenos días',
      'good evening': 'buenas tardes',
      translation: 'traducción',
      software: 'software'
    }
  }

  const lowerText = text.toLowerCase().trim()
  const targetDict = translations[targetLang]

  if (targetDict && targetDict[lowerText]) {
    return targetDict[lowerText]
  }

  // 如果没有找到精确匹配，返回通用翻译
  return `🤖 Mock翻译: "${text}" → ${targetLang} (演示模式，请配置真实API Key获得准确翻译)`
}

function App(): React.JSX.Element {
  const [inputText, setInputText] = useState('')
  const [translatedText, setTranslatedText] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // 🔧 组件加载时输出日志
  useEffect(() => {
    console.log('🚀 App component loaded')
    console.log('🔧 Initial state:', { inputText, translatedText, isLoading })
  }, [])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [connectionStatus, setConnectionStatus] = useState<
    'unknown' | 'testing' | 'connected' | 'failed'
  >('unknown')
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  // 🤖 AI提供商选择状态（阶段2：测试适配器）
  const [currentProvider, setCurrentProvider] = useState<AIProvider>(() => {
    // 从localStorage加载保存的提供商设置，默认DeepSeek
    const saved = localStorage.getItem('quick-trans-current-provider')
    return (saved as AIProvider) || AIProvider.DEEPSEEK
  })

  // 监听Settings中的提供商选择变化
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'quick-trans-current-provider' && e.newValue) {
        console.log('🔄 Provider changed from Settings:', e.newValue)
        setCurrentProvider(e.newValue as AIProvider)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  // 🌍 语言选择状态
  const [targetLanguage, setTargetLanguage] = useState(() => {
    // 从localStorage加载保存的语言设置
    return localStorage.getItem('quick-trans-target-language') || 'Chinese'
  })
  const [isLanguageInputActive, setIsLanguageInputActive] = useState(false)
  const [languageInput, setLanguageInput] = useState('')

  // 🔍 调试localStorage内容
  const debugLocalStorage = (): void => {
    console.log('🔍 ==> localStorage全部内容:')
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key) {
        const value = localStorage.getItem(key)
        console.log(`🔍 Key: "${key}", Value:`, value)
      }
    }
    console.log('🔍 ==> localStorage检查结束')
  }

  // 🔑 获取API Key配置（通用版本，支持不同提供商）
  const getApiKey = (provider?: AIProvider): string | null => {
    const targetProvider = provider || currentProvider
    console.log(`🔍 Starting getApiKey() for provider: ${targetProvider}...`)
    debugLocalStorage() // 先查看localStorage所有内容

    try {
      const settings = localStorage.getItem('quick-trans-api-settings')
      console.log('🔍 localStorage data:', settings)
      if (settings) {
        const parsed = JSON.parse(settings)
        console.log('🔍 Parsed data:', parsed)
        const providerConfig = parsed.find(
          (config: { provider: string; apiKey?: string }) => config.provider === targetProvider
        )
        console.log(`🔍 ${targetProvider} config:`, providerConfig)
        return providerConfig?.apiKey || null
      } else {
        // 🔧 如果localStorage为空，提示用户配置
        console.log('⚠️ No API settings found in localStorage')
        console.log('💡 Please open Settings to configure your API Key')
        return null
      }
    } catch (error) {
      console.warn('Failed to load API settings:', error)
    }
    return null
  }

  // const [isAlwaysOnTop, setIsAlwaysOnTop] = useState(true)
  // const [message, setMessage] = useState('')
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // 🎯 双层窗口高度同步 - 让Electron窗口跟随内容高度
  const syncWindowWithContent = (): void => {
    if (!window.api?.resizeWindowHeight) return

    try {
      // 🎯 等待下一帧，确保DOM完全渲染
      requestAnimationFrame(() => {
        const container = document.querySelector('.app-container') as HTMLElement
        if (!container) return

        // 🎯 直接获取网页内容的实际高度
        // 这里就是您说的：输入框 + 输出框 + 帮助栏 + 所有间距
        const contentHeight = container.getBoundingClientRect().height

        // 🎯 应用安全边界
        const minHeight = 196 // 最小高度
        const maxHeight = Math.floor(window.screen.height * 0.8) // 屏幕80%
        const finalHeight = Math.min(Math.max(Math.ceil(contentHeight) - 2, minHeight), maxHeight) // 🎯 减去2px避免底部空隙

        console.log(`🎯 双层窗口同步:`)
        console.log(`  📐 网页内容实际高度: ${Math.ceil(contentHeight)}px`)
        console.log(`  🖥️  Electron窗口将调整为: ${finalHeight}px`)
        console.log(`  📏 限制范围: ${minHeight}px ~ ${maxHeight}px`)

        // 🎯 只在高度有明显变化时调整（避免频繁调整）
        const currentHeight = window.innerHeight
        if (Math.abs(finalHeight - currentHeight) > 3) {
          window.api.resizeWindowHeight(finalHeight, 300) // 300ms动画
        }
      })
    } catch (error) {
      console.error('🚨 Window sync failed:', error)
      // 出错时恢复到安全高度
      window.api.resizeWindowHeight(196, 300)
    }
  }

  // 🔍 测试 DeepSeek 连接
  const testConnection = async (): Promise<void> => {
    setConnectionStatus('testing')
    try {
      const isConnected = await testDeepSeekConnection()
      setConnectionStatus(isConnected ? 'connected' : 'failed')

      if (isConnected) {
        console.log('✅ DeepSeek connection test successful')
      } else {
        console.log('❌ DeepSeek connection test failed')
      }
    } catch (error) {
      console.error('🚨 Connection test error:', error)
      setConnectionStatus('failed')
    }
  }

  // 🎯 组件挂载时确保窗口大小正确并测试连接
  useEffect(() => {
    setTimeout(() => {
      syncWindowWithContent()
    }, 100)

    // 启动时测试连接
    testConnection()
  }, [])

  // 🎯 监听翻译结果变化，适时调整窗口大小
  // 现在结果区域始终显示，所以内容从placeholder变为实际翻译时需要同步窗口
  useEffect(() => {
    setTimeout(() => {
      syncWindowWithContent()
    }, 100)
  }, [translatedText]) // 🎯 只监听translatedText变化，因为这会影响结果区域的实际内容

  // 🎯 监听输入变化，输入清空时同步清空翻译结果（显示placeholder）
  useEffect(() => {
    if (!inputText.trim() && translatedText) {
      setTranslatedText('') // 🎯 输入清空时，清空翻译结果，显示placeholder
    }
  }, [inputText, translatedText])

  // 🌊 通用流式翻译（支持适配器模式）
  const translate = async (text: string): Promise<void> => {
    if (!text.trim()) return

    console.log(
      `🌊 Starting streaming translation to ${targetLanguage} using ${currentProvider}...`
    )
    setIsLoading(true)
    setTranslatedText('') // 清空之前的结果

    try {
      const apiKey = getApiKey(currentProvider)
      console.log(`🔑 ${currentProvider} API Key:-------->', ${apiKey ? 'configured' : 'missing'}`)

      if (apiKey && apiKey.trim() !== '') {
        console.log(`🔑 Using real API with streaming translation via ${currentProvider}`)

        // 🎯 根据当前提供商选择翻译方式
        if (currentProvider === AIProvider.DEEPSEEK) {
          // 🔄 保持DeepSeek原有直接调用方式（阶段3再迁移）
          await translateWithDeepSeek(
            text,
            (chunk: string, isComplete: boolean) => {
              if (chunk && !isComplete) {
                // 流式追加文本
                setTranslatedText((prev) => prev + chunk)

                // 🎯 每次更新都同步窗口高度
                setTimeout(() => {
                  syncWindowWithContent()
                }, 50)
              }

              if (isComplete) {
                console.log('✅ DeepSeek streaming translation completed')
                // 🎯 翻译完成后最终同步窗口高度
                setTimeout(() => {
                  syncWindowWithContent()
                }, 100)
              }
            },
            targetLanguage,
            apiKey // 🔑 传递API Key
          )
        } else {
          // 🚀 使用适配器模式（Gemini等新提供商）
          console.log(`🚀 Using adapter mode for ${currentProvider}`)
          const manager = new TranslationManager(currentProvider, apiKey)

          await manager.translateTo(text, targetLanguage, (chunk: string, isComplete: boolean) => {
            if (chunk && !isComplete) {
              // 流式追加文本
              setTranslatedText((prev) => prev + chunk)

              // 🎯 每次更新都同步窗口高度
              setTimeout(() => {
                syncWindowWithContent()
              }, 50)
            }

            if (isComplete) {
              console.log(`✅ ${currentProvider} streaming translation completed`)
              // 🎯 翻译完成后最终同步窗口高度
              setTimeout(() => {
                syncWindowWithContent()
              }, 100)
            }
          })
        }
      } else {
        console.log('🧪 Using Mock translation with typing effect')
        // Mock翻译也模拟流式效果
        const result = await mockTranslateText(text, targetLanguage)

        // 模拟逐字显示效果
        let index = 0
        const simulateStream = (): void => {
          if (index < result.length) {
            setTranslatedText((prev) => prev + result[index])
            index++
            setTimeout(simulateStream, 30) // 30ms延迟模拟打字效果

            // 同步窗口高度
            setTimeout(() => {
              syncWindowWithContent()
            }, 10)
          }
        }
        simulateStream()
      }
    } catch (error) {
      console.error('❌ Translation failed:', error)
      // API失败时fallback到Mock
      console.log('🔄 Falling back to Mock translation')
      try {
        const mockResult = await mockTranslateText(text, targetLanguage)
        setTranslatedText(`⚠️ API调用失败，使用Mock翻译: ${mockResult}`)
      } catch {
        setTranslatedText('❌ Translation failed. Please check your connection and API settings.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  // 🌍 简化版本：直接在事件中处理

  // 处理翻译
  const handleTranslate = async (): Promise<void> => {
    if (!inputText.trim()) {
      console.warn('⚠️ No input text to translate')
      return
    }

    console.log('🚀 handleTranslate called with:', inputText.substring(0, 50) + '...')
    await translate(inputText)
  }

  // 🔄 重新测试连接
  // const handleRetestConnection = async (): Promise<void> => {
  //   await testConnection()
  // }

  // 切换超级悬浮模式
  // const toggleAlwaysOnTop = async (): Promise<void> => {
  //   try {
  //     const result = await window.electron.ipcRenderer.invoke('toggle-always-on-top')
  //     if (result.success) {
  //       setIsAlwaysOnTop(result.isAlwaysOnTop)
  //       setMessage(result.message)
  //       setTimeout(() => setMessage(''), 3000)
  //     }
  //   } catch (error) {
  //     console.error('Toggle failed:', error)
  //     setMessage('❌ 切换失败')
  //     setTimeout(() => setMessage(''), 3000)
  //   }
  // }

  // ESC 键关闭窗口, Enter 翻译
  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (e.metaKey && e.key === 'Enter') {
      // Cmd+Enter触发翻译
      e.preventDefault()
      console.log('⌨️ Cmd+Enter pressed, triggering translation')
      handleTranslate()
    } else if (e.key === 'Escape') {
      // ESC关闭窗口
      console.log('⌨️ ESC pressed, closing window')
      // 简单隐藏，如果有window.close()也可以用
      try {
        if (window.close) {
          window.close()
        }
      } catch (error) {
        console.warn('Cannot close window:', error)
      }
    }
  }

  // 防止拖拽时选择文本
  // const handleMouseDown = (e: React.MouseEvent): void => {
  //   if (e.target instanceof HTMLElement && e.target.closest('.title-bar')) {
  //     e.preventDefault()
  //   }
  // }

  // 🎨 获取连接状态显示
  // const getConnectionStatusDisplay = (): string => {
  //   switch (connectionStatus) {
  //     case 'testing':
  //       return '🔍 Testing...'
  //     case 'connected':
  //       return '✅ DeepSeek Connected'
  //     case 'failed':
  //       return '❌ Connection Failed'
  //     case 'unknown':
  //     default:
  //       return '⚪ Unknown Status'
  //   }
  // }

  // 🌍 语言选择相关函数
  const handleLanguageClick = (): void => {
    console.log('🎯 Language clicked, activating input')
    setIsLanguageInputActive(true)
    setLanguageInput(targetLanguage)
  }

  const handleLanguageSubmit = (value: string): void => {
    console.log('🎯 Language submitted:', value)
    const trimmedValue = value.trim()
    if (trimmedValue) {
      setTargetLanguage(trimmedValue)
      // 保存到localStorage
      localStorage.setItem('quick-trans-target-language', trimmedValue)
    }
    setIsLanguageInputActive(false)
    setLanguageInput('')
  }

  const handleLanguageKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleLanguageSubmit(languageInput)
    } else if (e.key === 'Escape') {
      e.preventDefault()
      setIsLanguageInputActive(false)
      setLanguageInput('')
    }
  }

  // 🎯 点击外部区域退出语言编辑模式
  const handleContainerClick = (e: React.MouseEvent): void => {
    // 如果当前在语言编辑模式，且点击的不是特殊区域，则提交并退出编辑模式
    if (isLanguageInputActive) {
      const target = e.target as HTMLElement

      // 检查点击的元素是否是语言input或语言按钮
      const isLanguageInput =
        target.classList.contains('language-input') || target.closest('.language-input')
      const isLanguageButton =
        target.classList.contains('language-button') || target.closest('.language-button')

      // 检查是否点击了主输入区域（应该排除，让用户可以正常输入）
      const isMainInputArea = target.closest('.input-section')

      // 检查是否点击了设置按钮（应该排除，让用户可以正常点击设置）
      const isSettingsButton = target.classList.contains('help-button')

      // 只有当点击的不是这些特殊区域时，才提交语言输入
      if (!isLanguageInput && !isLanguageButton && !isMainInputArea && !isSettingsButton) {
        console.log('🎯 Clicked outside language input, submitting and exiting edit mode')
        // 像按回车键一样提交当前输入内容
        handleLanguageSubmit(languageInput)
      }
    }
  }

  return (
    <div
      className="app-container glass-effect"
      onKeyDown={handleKeyDown}
      onClick={handleContainerClick}
      tabIndex={-1}
    >
      {/* 🔍 连接状态指示器 */}
      {/* <div className="connection-status">
        <span className={`status-indicator ${connectionStatus}`}>
          {getConnectionStatusDisplay()}
        </span>
        {(connectionStatus === 'failed' || connectionStatus === 'testing') && (
          <button
            onClick={handleRetestConnection}
            className="retry-btn"
            disabled={connectionStatus === 'testing'}
          >
            {connectionStatus === 'testing' ? '🔍 Testing...' : '🔄 Retry'}
          </button>
        )}
      </div> */}

      {/* 状态消息 */}
      {/* {message && (
        <div className={`status-message ${message.includes('❌') ? 'error' : 'success'}`}>
          {message} */}
      {/* </div> */}
      {/* )} */}

      {/* 标题栏 */}
      {/* <div className="title-bar">
        <div className="title-info">
          <h2>🔍 快速翻译</h2>
          {isAlwaysOnTop && <span className="super-float-badge">超级悬浮</span>}
        </div>
        <button
          onClick={toggleAlwaysOnTop}
          className={`toggle-button button-press ${isAlwaysOnTop ? 'active' : 'inactive'}`}
          title={isAlwaysOnTop ? '切换到普通模式' : '启用超级悬浮'}
        >
          {isAlwaysOnTop ? '⬇️ 重置' : '🚀 超级悬浮'}
        </button>
      </div> */}

      {/* 输入区域 */}
      <div className="input-section">
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
          <span
            style={{
              fontSize: '10px',
              color: 'rgba(255, 255, 255, 0.6)',
              marginRight: 'auto'
            }}
          >
            Using: {currentProvider.toUpperCase()}
          </span>
        </div>
        <textarea
          ref={inputRef}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter the text to translate..."
          className="input-textarea focus-ring"
          disabled={isLoading}
          rows={4}
        />
      </div>
      {/* 结果显示 */}
      <div className="result-section">
        <div className="result-box">
          {isLoading && !translatedText ? (
            <p className="loading-text">🌊 {currentProvider.toUpperCase()} Translating...</p>
          ) : translatedText ? (
            <p className="result-text">{translatedText}</p>
          ) : (
            <p className="result-placeholder">Translation result will appear here</p>
          )}
        </div>
      </div>

      {/* 使用说明 */}
      <div className="help-section">
        <p className="help-text">
          To{' '}
          {isLanguageInputActive ? (
            <input
              type="text"
              value={languageInput}
              onChange={(e) => setLanguageInput(e.target.value)}
              onKeyDown={handleLanguageKeyDown}
              onBlur={() => handleLanguageSubmit(languageInput)}
              onClick={(e) => e.stopPropagation()} // 阻止事件冒泡到容器
              autoFocus
              className="language-input"
              style={
                {
                  display: 'inline-block',
                  width: '80px',
                  height: '20px',
                  fontSize: '12px',
                  padding: '2px 4px',
                  verticalAlign: 'middle',
                  background: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid rgba(59, 130, 246, 0.4)',
                  borderRadius: '4px',
                  outline: 'none',
                  // @ts-ignore WebkitAppRegion is not in React.CSSProperties type but is valid CSS property
                  WebkitAppRegion: 'no-drag'
                } as React.CSSProperties
              }
            />
          ) : (
            <button
              onClick={handleLanguageClick}
              className="language-button"
              style={
                {
                  display: 'inline-block',
                  background: 'transparent',
                  border: 'none',
                  color: 'inherit',
                  fontSize: '12px',
                  cursor: 'pointer',
                  padding: '0 2px',
                  textDecoration: 'underline',
                  // @ts-ignore WebkitAppRegion is not in React.CSSProperties type but is valid CSS property
                  WebkitAppRegion: 'no-drag'
                } as React.CSSProperties
              }
            >
              {targetLanguage}
            </button>
          )}
          | Cmd+Enter Translate | ESC Close | ⌘⇧Y Global Toggle
        </p>
        <p className="help-text" style={{ marginTop: '2px' }}>
          <button className="help-button" onClick={() => setIsSettingsOpen(true)}>
            settings
          </button>
          |{' '}
          <button
            className="help-button"
            onClick={() => window.open('https://github.com/hughedward/FloatQuickTrans', '_blank')}
            style={
              {
                // @ts-ignore WebkitAppRegion is not in React.CSSProperties type but is valid CSS property
                WebkitAppRegion: 'no-drag'
              } as React.CSSProperties
            }
          >
            about
          </button>
        </p>
      </div>

      {/* 设置对话框 */}
      <SettingsDialog isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  )
}

export default App
