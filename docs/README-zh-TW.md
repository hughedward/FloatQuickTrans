<div align="center">

# 🌍 FloatQuickTrans

**專業的懸浮AI翻譯工具**

*即時串流翻譯 • 多視窗支援 • 語音朗讀 • 始終置頂*

[![版本](https://img.shields.io/badge/版本-1.0.12-blue.svg)](https://github.com/hughedward/FloatQuickTrans)
[![平台](https://img.shields.io/badge/平台-macOS%20%7C%20Windows%20%7C%20Linux-lightgrey.svg)](https://github.com/hughedward/FloatQuickTrans)
[![授權](https://img.shields.io/badge/授權-MIT-green.svg)](../LICENSE)

[English](../README.md) • [简体中文](README-zh.md) • [繁體中文](README-zh-TW.md) • [日本語](README-ja.md) • [Français](README-fr.md) • [Deutsch](README-de.md) • [Español](README-es.md) • [한국어](README-ko.md) • [Русский](README-ru.md) • [Türkçe](README-tr.md)

</div>

---

## ✨ 功能特色

### 🚀 **核心功能**
- **🌊 即時串流翻譯** - 觀看翻譯內容即時生成
- **🪟 多視窗支援** - 使用 `Cmd+N`/`Ctrl+N` 建立多個翻譯視窗
- **🔊 語音朗讀** - 支援30+種語言的文字朗讀
- **📌 始終置頂** - 懸浮視窗始終保持在最前方
- **🎯 全局熱鍵** - 使用 `Cmd+Shift+Y` 或 `Option+Space` 快速存取

### 🤖 **AI提供商支援**
- **OpenAI GPT** - GPT-3.5, GPT-4, GPT-4o
- **DeepSeek** - 高品質翻譯
- **Google Gemini** - 先進的AI能力
- **Claude** - Anthropic的強大語言模型

---

## 🖼️ 應用截圖

<div align="center">

### 主界面
<img src="imgs/image-20250717144819949.png" width="600" height="300">

### 多視窗模式
<img src="imgs/image-20250717144819949.png" width="600" height="300">

### 設定面板
<img src="imgs/image-20250717144819949.png" width="600" height="300">

</div>

---

## 🚀 快速開始

### 環境要求
- Node.js 18+
- pnpm（推薦）或 npm

### 安裝

```bash
# 複製儲存庫
git clone https://github.com/hughedward/FloatQuickTrans.git
cd FloatQuickTrans

# 安裝依賴
pnpm install
```

### 開發

```bash
# 啟動開發伺服器
pnpm dev
```

---

## 🎮 使用方法

### 基礎翻譯
1. **輸入文字** - 輸入或貼上要翻譯的文字
2. **設定目標語言** - 點擊語言按鈕進行更改
3. **執行翻譯** - 按 `Cmd+Enter` 或點擊翻譯
4. **語音朗讀** - 點擊 🔊 圖示聽取發音

### 多視窗工作流
1. **建立新視窗** - 按 `Cmd+N` (macOS) 或 `Ctrl+N` (Windows)
2. **獨立翻譯** - 每個視窗獨立工作
3. **對比結果** - 使用多個視窗對比翻譯結果

---

# 🛠️ 開發

### 技術棧
- **前端**: React 19 + TypeScript
- **桌面**: Electron 35
- **建構工具**: Vite + electron-vite
- **樣式**: CSS 玻璃態效果

### 專案結構
```
src/
├── main/           # Electron 主進程
├── renderer/       # React 前端
├── preload/        # Electron 預載腳本
└── model/          # AI提供商 & 語言映射
```

### 🫰參與貢獻
我們歡迎社區貢獻！若您想參與貢獻，請按以下步驟操作：
1.  Fork本代碼庫
2.  創建特性分支（`git checkout -b feature/驚艷功能`/`git checkout -b bugfix/修復-xxx問題`）
3.  提交更改（`git commit -m '新增驚艷功能'`/`git commit -m '修復xxx問題:xxxx'`）。修改後請用描述性信息/簡寫提交，代碼中請盡可能添加註釋說明。
4.  推送至分支（`git push origin feature/驚艷功能`/`git push origin bugfix/修復-xxx問題`）。請保持代碼整潔。
5.  發起拉取請求。建議每次專注於單個功能或修復，避免一次性提交過多改動。
6.  我們將審核您的PR並在準備就緒後合併。若您願意協助審核其他PR，我們也將不勝感激！
7.  為了方便理解和溝通，建議在提交問題和拉取請求等操作時使用英語。

---

## 📄 許可證

本專案採用 MIT 許可證 - 查看 [LICENSE](../LICENSE) 文件了解詳情。

<div align="center">

**用 ❤️ 為全球社群製作**

[⭐ 給專案點星](https://github.com/hughedward/FloatQuickTrans) • [🐛 回報問題](https://github.com/hughedward/FloatQuickTrans/issues) • [💡 功能建議](https://github.com/hughedward/FloatQuickTrans/issues)

</div>

## Star History
[![Star History Chart](https://api.star-history.com/svg?repos=hughedward/FloatQuickTrans&type=Date)](https://www.star-history.com/#hughedward/FloatQuickTrans&Date)
