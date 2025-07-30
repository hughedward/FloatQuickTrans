<div align="center">

# 🌍 FloatQuickTrans🎉

**A Professional Floating AI Translation Tool**

*Real-time streaming translation • Multi-window support • Text-to-speech • Always on top*

[![Version](https://img.shields.io/badge/version-1.0.12-blue.svg)](https://github.com/hughedward/FloatQuickTrans)
[![Platform](https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Linux-lightgrey.svg)](https://github.com/hughedward/FloatQuickTrans)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

[English](README.md) • [简体中文](docs/README-zh.md) • [繁體中文](docs/README-zh-TW.md) • [日本語](docs/README-ja.md) • [Français](docs/README-fr.md) • [Deutsch](docs/README-de.md) • [Español](docs/README-es.md) • [한국어](docs/README-ko.md) • [Русский](docs/README-ru.md) • [Türkçe](docs/README-tr.md)

</div>

---

### 👀 Quick Look (Videos)
[![IMAGE ALT TEXT HERE](https://img.youtube.com/vi/vU78uvya_OE/0.jpg)](https://www.youtube.com/watch?v=vU78uvya_OE)
[![IMAGE ALT TEXT HERE](https://img.youtube.com/vi/ki4z5593GHs/0.jpg)](https://www.youtube.com/watch?v=ki4z5593GHs)


## ✨ Features

### 🚀 **Core Capabilities**
- **🌊 Real-time Streaming Translation** - Watch translations appear as they're generated
- **🪟 Multi-window Support** - Create multiple translation windows with `Cmd+N`/`Ctrl+N`
- **🔊 Text-to-Speech** - Listen to translations in 30+ languages
- **📌 Always on Top** - Floating window stays above all applications
- **🎯 Global Hotkeys** - Quick access with `Cmd+Shift+Y` or `Option+Space`

### 🤖 **AI Provider Support**
- <i>TODO</i>: **OpenAI GPT** - GPT-3.5, GPT-4, GPT-4o
- **DeepSeek** - High-quality translations
- **Google Gemini** - Advanced AI capabilities
- <i>TODO</i>:**Claude** - Anthropic's powerful language model

> <i><font color=red>⚠️ OpenAI and Claude:  No API keys available yet, so no support for now.  Sorry about that.</font></i>

### 🌐 **Language Support**
- **30+ Languages** - Major world languages supported
- **Smart Detection** - Automatic input language recognition
- **Flexible Input** - Support for various language name formats

---

## 🖼️ Screenshots

### Main Interface
Floating window stays above all applications

---
<img width="180" height="83" alt="image" src="https://github.com/user-attachments/assets/8c778713-f022-4353-8828-b50546800b54" /><img width="162" height="83" alt="image" src="https://github.com/user-attachments/assets/71a261be-285d-4a0a-9cdd-cd1332c19ff4" />
 <img src="imgs/image-20250717153112790.png">




 <img src="imgs/image-20250717151804217.png" width="400" height="250">

 <img src="imgs/image-20250717120434391.png" width="400" height="250">

### Multi-window Mode

 <img src="imgs/image-20250717120315825.png" width="600" height="300">

 <img src="imgs/image-202507171407527101.png" width="600" height="300">



### Settings Panel

> **Go** https://aistudio.google.com/app/apikey  🧚‍♀️
>
> Or https://platform.deepseek.com/usage 🐳

 <img src="imgs/image-20250717120503183.png" width="400" height="200">

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/hughedward/FloatQuickTrans.git
cd FloatQuickTrans

# Install dependencies
pnpm install
```

### Development

```bash
# Start development server
pnpm dev
```

### Build

```bash
# Build for your platform
pnpm build

# Platform-specific builds
pnpm build:mac    # macOS
pnpm build:win    # Windows
pnpm build:linux  # Linux
```

---

## ⚙️ Configuration

### API Setup
1. Click the **Settings** button in the app
2. Choose your preferred AI provider
3. Enter your API key
4. Select default translation language

### Supported Providers
| Provider | API Key Required | Features |
|----------|------------------|----------|
| OpenAI | TODO | GPT-3.5, GPT-4, GPT-4o |
| DeepSeek | ✅ | High-quality translation |
| Google Gemini | ✅ | Advanced AI capabilities |
| Claude | TODO | Anthropic's language model |

---

## 🎮 Usage

### Basic Translation
1. **Input Text** - Type or paste text to translate
2. **Set Target Language** - Click language button to change
3. **Translate** - Press `Cmd+Enter` or click translate
4. **Listen** - Click 🔊 icon to hear pronunciation

### Multi-window Workflow
1. **Create New Window** - Press `Cmd+N` (macOS) or `Ctrl+N` (Windows)
2. **Independent Translation** - Each window works separately
3. **Compare Results** - Use multiple windows to compare translations

### Global Hotkeys
- `Cmd+Shift+Y` / `Ctrl+Shift+Y` - Show/hide all windows
- `Cmd+N` / `Ctrl+N` - Create new translation window
- `Cmd+Enter` - Execute translation
- `ESC` - Close current window

---

## 🛠️ Development

### Tech Stack
- **Frontend**: React 19 + TypeScript
- **Desktop**: Electron 35
- **Build Tool**: Vite + electron-vite
- **Styling**: CSS with glass morphism effects

### Project Structure
```
src/
├── main/           # Electron main process
├── renderer/       # React frontend
├── preload/        # Electron preload scripts
└── model/          # AI providers & language maps
```

### Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built with [Electron](https://electronjs.org/) and [React](https://reactjs.org/)
- Icons from [Bootstrap Icons](https://icons.getbootstrap.com/)
- AI providers: OpenAI, DeepSeek, Google, Anthropic

---

<div align="center">

**Made with ❤️ for the global community**

[⭐ Star this project](https://github.com/hughedward/FloatQuickTrans) • [🐛 Report Bug](https://github.com/hughedward/FloatQuickTrans/issues) • [💡 Request Feature](https://github.com/hughedward/FloatQuickTrans/issues)

</div>

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=hughedward/FloatQuickTrans&type=Date)](https://www.star-history.com/#hughedward/FloatQuickTrans&Date)

> thanks `https://www.star-history.com/#hughedward/FloatQuickTrans&Date`
>
> <img width="901" height="570" alt="image" src="https://github.com/user-attachments/assets/79a4f463-ab08-40b4-84c2-4f6116d11dc4" />
>
> **If you find my work helpful, I’d be truly grateful if you’d consider sponsoring me.**
>
>  <img width="230" height="280" alt="image" src="https://github.com/user-attachments/assets/fed12b34-16f4-4488-abf3-c06aa968604c" />
>
> <a href="https://buy.stripe.com/cNi9AU02E0tN2h1dUDbjW01">
> <img src="./imgs/sponsor-stripe02.png" alt="Sponsor me" width="180" height="60">
> </a>
>
> <img width="121" height="119" alt="image" src="https://github.com/user-attachments/assets/1b4d46bc-f434-4dce-a594-c2261c0db0cf" />
> Your support is the driving force behind my creations.🎉







