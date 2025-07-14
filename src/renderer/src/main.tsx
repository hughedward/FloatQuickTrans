import './assets/main.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

// 类型定义
declare global {
  interface Window {
    electron: any
    api: {
      resizeWindowHeight: (
        targetHeight: number,
        duration?: number
      ) => Promise<{ success: boolean; error?: string }>
    }
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
