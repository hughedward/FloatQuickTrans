import { app, shell, BrowserWindow, ipcMain, Tray, Menu, nativeImage } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

// 全局变量
let mainWindow: BrowserWindow | null = null
let tray: Tray | null = null

function createWindow(): void {
  // Create the browser window with super floating configuration
  mainWindow = new BrowserWindow({
    width: 520,
    height: 196,
    show: false,
    autoHideMenuBar: true,
    // 🚀 超级悬浮核心配置 - 参考 free-cluely
    type: 'panel', // 🏷️ 保持面板类型，寻找其他解决方案
    alwaysOnTop: true, // 始终置顶
    skipTaskbar: false, // 任务栏显示
    resizable: false, // 固定大小
    frame: false, // 无边框
    transparent: true, // 启用透明背景！
    // vibrancy: 'fullscreen-ui', // 🏷️ 已禁用系统级毛玻璃效果，让主体完全透明
    visualEffectState: 'active', // 视觉效果状态
    titleBarStyle: 'hidden', // 隐藏标题栏
    fullscreenable: false, // 禁止全屏
    maximizable: false, // 禁止最大化
    minimizable: false, // 禁止最小化
    closable: true, // 允许关闭
    acceptFirstMouse: true, // 接受第一次鼠标点击
    movable: true, // 允许移动窗口（配合 CSS 拖拽）
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      nodeIntegration: false,
      contextIsolation: true
    }
  })

  // 额外的超级悬浮设置
  mainWindow.setAlwaysOnTop(true, 'floating') // 🏷️ 改为浮动级别，不遮挡输入法
  mainWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true }) // 全屏模式下也可见

  // 禁用窗口在失去焦点时隐藏
  if (process.platform === 'darwin') {
    mainWindow.setWindowButtonVisibility(false) // 隐藏窗口按钮
  }

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show()
    // 确保窗口获得焦点后立即设置超级悬浮
    mainWindow?.focus()
    mainWindow?.setAlwaysOnTop(true, 'floating')
  })

  // 防止窗口失去焦点时隐藏
  mainWindow.on('blur', () => {
    mainWindow?.setAlwaysOnTop(true, 'floating')
  })

  // 修改窗口关闭行为：关闭时隐藏到托盘，而不是退出应用
  mainWindow.on('close', (event) => {
    if (process.platform === 'darwin') {
      // macOS：隐藏窗口到托盘
      event.preventDefault()
      mainWindow?.hide()
    } else {
      // Windows/Linux：最小化到托盘
      event.preventDefault()
      mainWindow?.hide()
    }
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// 创建系统托盘
function createTray(): void {
  try {
    // 托盘图标路径 - 兼容开发和构建环境
    let trayIconPath: string
    if (is.dev) {
      // 开发模式：从项目根目录获取
      trayIconPath = join(process.cwd(), 'build/tray-icon.png')
    } else {
      // 构建模式：使用相对路径
      trayIconPath = join(__dirname, '../../build/tray-icon.png')
    }

    console.log('🔍 托盘图标路径:', trayIconPath)

    // 创建托盘图标（macOS模板图标）
    let trayIcon = nativeImage.createFromPath(trayIconPath)

    // 确保图标尺寸适合托盘显示（16x16为标准）
    if (trayIcon.getSize().width > 16 || trayIcon.getSize().height > 16) {
      trayIcon = trayIcon.resize({ width: 16, height: 16 })
    }

    if (process.platform === 'darwin') {
      trayIcon.setTemplateImage(true) // 在macOS上设置为模板图标
    }

    // 创建托盘实例
    tray = new Tray(trayIcon)

    // 设置托盘提示文本
    tray.setToolTip('FloatQuickTrans - 单击：显示/隐藏窗口，右键：菜单')

    // 创建托盘右键菜单
    const contextMenu = Menu.buildFromTemplate([
      {
        label: '关于 FloatQuickTrans',
        click: () => {
          shell.openExternal('https://github.com/yourusername/electron-quick-trans-github')
        }
      },
      {
        label: '退出',
        click: () => {
          app.quit()
        }
      }
    ])

    // 设置托盘右键菜单
    tray.setContextMenu(contextMenu)

    // 托盘图标单击事件：切换窗口显示/隐藏
    tray.on('click', () => {
      if (mainWindow?.isVisible()) {
        hideWindow()
      } else {
        showWindow()
      }
    })

    // macOS：双击托盘图标显示窗口
    tray.on('double-click', () => {
      showWindow()
    })

    console.log('✅ 系统托盘创建成功')
  } catch (error) {
    console.error('❌ 创建托盘失败:', error)
  }
}

// 显示窗口
function showWindow(): void {
  if (mainWindow) {
    if (mainWindow.isMinimized()) {
      mainWindow.restore()
    }
    mainWindow.show()
    mainWindow.focus()

    // 确保超级悬浮设置
    if (isAlwaysOnTop) {
      mainWindow.setAlwaysOnTop(true, 'floating')
    }
  }
}

// 隐藏窗口
function hideWindow(): void {
  if (mainWindow) {
    mainWindow.hide()
  }
}

// 切换超级悬浮模式
function toggleAlwaysOnTop(): void {
  if (mainWindow) {
    isAlwaysOnTop = !isAlwaysOnTop

    if (isAlwaysOnTop) {
      mainWindow.setAlwaysOnTop(true, 'floating')
      mainWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true })
    } else {
      mainWindow.setAlwaysOnTop(false)
      mainWindow.setVisibleOnAllWorkspaces(false)
    }

    // 更新托盘菜单
    updateTrayMenu()
  }
}

// 更新托盘菜单
function updateTrayMenu(): void {
  if (tray) {
    const contextMenu = Menu.buildFromTemplate([
      {
        label: '关于 FloatQuickTrans',
        click: () => {
          shell.openExternal('https://github.com/hughedward/FloatQuickTrans')
        }
      },
      {
        label: '退出',
        click: () => {
          app.quit()
        }
      }
    ])

    tray.setContextMenu(contextMenu)
  }
}

// 添加 IPC 处理程序用于动态切换超级悬浮模式
let isAlwaysOnTop = true

ipcMain.handle('toggle-always-on-top', () => {
  const windows = BrowserWindow.getAllWindows()
  if (windows.length > 0) {
    const mainWindow = windows[0]
    isAlwaysOnTop = !isAlwaysOnTop

    if (isAlwaysOnTop) {
      mainWindow.setAlwaysOnTop(true, 'floating') // 🏷️ 浮动级别，不遮挡输入法
      mainWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true })
    } else {
      mainWindow.setAlwaysOnTop(false)
      mainWindow.setVisibleOnAllWorkspaces(false)
    }

    return {
      success: true,
      isAlwaysOnTop,
      message: isAlwaysOnTop ? '🚀 超级悬浮已启用！' : '📌 普通置顶模式'
    }
  }
  return { success: false, message: '❌ 窗口未找到' }
})

// 添加窗口宽度调整功能
ipcMain.handle('resize-window-width', (event, targetWidth: number, duration: number = 300) => {
  try {
    const window = BrowserWindow.fromWebContents(event.sender)
    if (window) {
      const [currentWidth, currentHeight] = window.getSize()

      // 创建平滑过渡动画
      const startWidth = currentWidth
      const widthDiff = targetWidth - startWidth
      const startTime = Date.now()

      const animate = (): void => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)

        // 使用 easeOutCubic 缓动函数，让动画更优雅
        const easeProgress = 1 - Math.pow(1 - progress, 3)
        const newWidth = Math.round(startWidth + widthDiff * easeProgress)

        window.setSize(newWidth, currentHeight, false)

        if (progress < 1) {
          setTimeout(animate, 16) // 约60fps
        }
      }

      animate()
      return { success: true }
    }
    return { success: false, error: 'Window not found' }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
})

// 添加窗口高度调整功能
ipcMain.handle('resize-window-height', (event, targetHeight: number, duration: number = 300) => {
  try {
    const window = BrowserWindow.fromWebContents(event.sender)
    if (window) {
      const [currentWidth, currentHeight] = window.getSize()

      // 创建平滑过渡动画
      const startHeight = currentHeight
      const heightDiff = targetHeight - startHeight
      const startTime = Date.now()

      const animate = (): void => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)

        // 使用 easeOutCubic 缓动函数，让动画更优雅
        const easeProgress = 1 - Math.pow(1 - progress, 3)
        const newHeight = Math.round(startHeight + heightDiff * easeProgress)

        window.setSize(currentWidth, newHeight, false)

        if (progress < 1) {
          setTimeout(animate, 16) // 约60fps
        }
      }

      animate()
      return { success: true }
    }
    return { success: false, error: 'Window not found' }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron.quick-trans')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()
  createTray()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// 修改退出行为：有托盘时，窗口关闭不退出应用
app.on('window-all-closed', () => {
  // 不自动退出应用，让用户通过托盘菜单退出
  // 应用会在后台运行，通过托盘图标控制
})

// 确保托盘图标在应用退出时被清理
app.on('before-quit', () => {
  if (tray) {
    tray.destroy()
    tray = null
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
