import { execSync } from 'child_process'

// 手动指定代理地址
import fetch from 'node-fetch'

import { HttpsProxyAgent } from 'https-proxy-agent'

// ===============proxy=================
// 读取系统 Wi-Fi 的 HTTP 代理配置
function getSystemProxyPort() {
  try {
    let port: string | null = null
    const isWindows = process.platform === 'win32'

    console.log('isWindows------>', process.platform)
    if (isWindows) {
      const output = execSync(
        'reg query "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings" /v ProxyServer'
      ).toString()
      const portLine = output.match(/:\s*(\d+)/)
      port = portLine ? portLine[1] : null
    } else {
      console.log('isWindows------>', process.platform)

      const output = execSync('networksetup -getwebproxy Wi-Fi').toString()
      const lines = output.split('\n')
      const portLine = lines.find((line) => line.startsWith('Port:'))
      port = portLine ? (portLine.split(':')[1]?.trim() ?? null) : null
    }

    if (port) {
      console.log('✅ 检测到系统代理端口:', port)
      return port
    } else {
      console.log('⚠️ 系统代理未启用')
      return null
    }
  } catch (err) {
    console.error('❌ 获取系统代理失败:', (err as Error).message)
    return null
  }
}
// ======================

const proxyPort = getSystemProxyPort()

const proxy = `http://127.0.0.1:${proxyPort}` // ✅ 改成你的代理地址
const agent = new HttpsProxyAgent(proxy)

// 将 fetch 包装起来，注入 agent
;(globalThis as any).fetch = (url: any, options: any = {}) => {
  return fetch(url, { agent, ...options })
}

export default {
  agent
}
