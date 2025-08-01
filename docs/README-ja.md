<div align="center">

# 🌍 FloatQuickTrans

**プロフェッショナルなフローティングAI翻訳ツール**

*リアルタイムストリーミング翻訳 • マルチウィンドウサポート • テキスト読み上げ • 常に最前面*

[![バージョン](https://img.shields.io/badge/バージョン-1.0.12-blue.svg)](https://github.com/hughedward/FloatQuickTrans)
[![プラットフォーム](https://img.shields.io/badge/プラットフォーム-macOS%20%7C%20Windows%20%7C%20Linux-lightgrey.svg)](https://github.com/hughedward/FloatQuickTrans)
[![ライセンス](https://img.shields.io/badge/ライセンス-MIT-green.svg)](../LICENSE)

[English](../README.md) • [简体中文](README-zh.md) • [繁體中文](README-zh-TW.md) • [日本語](README-ja.md) • [Français](README-fr.md) • [Deutsch](README-de.md) • [Español](README-es.md) • [한국어](README-ko.md) • [Русский](README-ru.md) • [Türkçe](README-tr.md)

</div>

---

## ✨ 機能

### 🚀 **コア機能**
- **🌊 リアルタイムストリーミング翻訳** - 翻訳が生成される様子をリアルタイムで確認
- **🪟 マルチウィンドウサポート** - `Cmd+N`/`Ctrl+N`で複数の翻訳ウィンドウを作成
- **🔊 テキスト読み上げ** - 30以上の言語での翻訳音声再生
- **📌 常に最前面** - フローティングウィンドウが常に最前面に表示
- **🎯 グローバルホットキー** - `Cmd+Shift+Y`または`Option+Space`で素早くアクセス

### 🤖 **AIプロバイダーサポート**
- **OpenAI GPT** - GPT-3.5, GPT-4, GPT-4o
- **DeepSeek** - 高品質翻訳
- **Google Gemini** - 高度なAI機能
- **Claude** - Anthropicの強力な言語モデル

---

## 🖼️ スクリーンショット

### メインインターフェース
-----------------------------------------------
<img src="imgs/image-20250717142153310.png" width="600" height="400">

> ⌘ + Shift + Y で全てのウィンドウの表示／非表示を切り替えることができます🦄
>
> ⌘ + N で新しいウィンドウを開けます ✨💡

<img src="imgs/image-20250717141944504.png" width="600" height="400">

### マルチウィンドウモード
<img src="imgs/image-20250717141944504.png" width="600" height="400">

### 設定パネル

> search https://aistudio.google.com/app/apikey to get an api key for gemini

<img src="imgs/image-20250717141944504.png" width="600" height="400">


---

## 🚀 クイックスタート

### 前提条件
- Node.js 18+
- pnpm（推奨）またはnpm

### インストール

```bash
# リポジトリをクローン
git clone https://github.com/hughedward/FloatQuickTrans.git
cd FloatQuickTrans

# 依存関係をインストール
pnpm install
```

### 開発

```bash
# 開発サーバーを起動
pnpm dev
```

---

## 🎮 使用方法

### 基本翻訳
1. **テキスト入力** - 翻訳したいテキストを入力またはペースト
2. **対象言語設定** - 言語ボタンをクリックして変更
3. **翻訳実行** - `Cmd+Enter`を押すか翻訳をクリック
4. **音声再生** - 🔊アイコンをクリックして発音を聞く

### マルチウィンドウワークフロー
1. **新しいウィンドウを作成** - `Cmd+N` (macOS)または`Ctrl+N` (Windows)を押す
2. **独立翻訳** - 各ウィンドウが独立して動作
3. **結果比較** - 複数のウィンドウを使用して翻訳結果を比較

---

# 🛠️ 開発

### 技術スタック
- **フロントエンド**: React 19 + TypeScript
- **デスクトップ**: Electron 35
- **ビルドツール**: Vite + electron-vite
- **スタイル**: CSS グラスモーフィズム効果

### プロジェクト構成
```
src/
├── main/           # Electron メインプロセス
├── renderer/       # React フロントエンド
├── preload/        # Electron プリロードスクリプト
└── model/          # AIプロバイダー & 言語マッピング
```

### 🫰コントリビューション
コミュニティからの貢献を歓迎します！貢献したい場合は以下の手順に従ってください：
1.  このリポジトリをフォークする
2.  フィーチャーブランチを作成（`git checkout -b feature/素晴らしい機能`/`git checkout -b bugfix/xxx問題修正`）
3.  変更をコミット（`git commit -m '素晴らしい機能を追加'`/`git commit -m 'xxx問題修正:xxxx'`）。変更後は説明的なメッセージ/略記でコミットし、コードには可能な限りコメントを追加してください。
4.  ブランチにプッシュ（`git push origin feature/素晴らしい機能`/`git push origin bugfix/xxx問題修正`）。コードはクリーンに保ってください。
5.  プルリクエストを提出。一度に多くの変更を提出せず、単一の機能や修正に集中することをお勧めします。
6.  私たちがPRをレビューし、準備が整い次第マージします。他のPRのレビューを手伝っていただけると大変助かります！
7.  理解とコミュニケーションを円滑にするため、質問やプルリクエストなどの際には英語を使用することをお勧めします。

---

## 📄 ライセンス

このプロジェクトはMITライセンスの下で提供されています - 詳細は [LICENSE](../LICENSE) ファイルをご覧ください。

<div align="center">

**グローバルコミュニティのために❤️で作成**

[⭐ プロジェクトにスター](https://github.com/hughedward/FloatQuickTrans) • [🐛 バグ報告](https://github.com/hughedward/FloatQuickTrans/issues) • [💡 機能リクエスト](https://github.com/hughedward/FloatQuickTrans/issues)

</div>

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=hughedward/FloatQuickTrans&type=Date)](https://www.star-history.com/#hughedward/FloatQuickTrans&Date)
