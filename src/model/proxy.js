import { HttpsProxyAgent } from 'https-proxy-agent'
import fetchOrig from 'node-fetch'

// 优先级：参数 > 环境变量 > localStorage > 默认
const DEFAULT_PROXY_URL = 'http://127.0.0.1:7899'

function getProxyUrl() {
  // 1. 参数传递（由 getProxyAgent 直接接收）
  // 2. 环境变量
  if (typeof process !== 'undefined' && process.env) {
    if (process.env.HTTPS_PROXY) return process.env.HTTPS_PROXY
    if (process.env.HTTP_PROXY) return process.env.HTTP_PROXY
  }
  // 3. localStorage（仅渲染进程可用）
  if (typeof window !== 'undefined' && window.localStorage) {
    const local = window.localStorage.getItem('quick-trans-proxy-url')
    if (local) return local
  }
  // 4. 默认
  return DEFAULT_PROXY_URL
}

export function getProxyAgent(proxyUrl) {
  const url = proxyUrl || getProxyUrl()
  if (!url) return undefined
  return new HttpsProxyAgent(url)
}

// 带代理的fetch（仅Node/Electron主进程有效）
export async function fetchWithProxy(url, options = {}) {
  const agent = getProxyAgent()
  return fetchOrig(url, { ...options, agent })
}

console.log('🔍 Proxy URL:', getProxyUrl())
