<div align="center">

# 🌍 FloatQuickTrans

**전문 플로팅 AI 번역 도구**

*실시간 스트리밍 번역 • 다중 창 지원 • 텍스트 음성 변환 • 항상 위에 표시*

[![버전](https://img.shields.io/badge/버전-1.0.12-blue.svg)](https://github.com/hughedward/FloatQuickTrans)
[![플랫폼](https://img.shields.io/badge/플랫폼-macOS%20%7C%20Windows%20%7C%20Linux-lightgrey.svg)](https://github.com/hughedward/FloatQuickTrans)
[![라이선스](https://img.shields.io/badge/라이선스-MIT-green.svg)](../LICENSE)

[English](../README.md) • [简体中文](README-zh.md) • [繁體中文](README-zh-TW.md) • [日本語](README-ja.md) • [Français](README-fr.md) • [Deutsch](README-de.md) • [Español](README-es.md) • [한국어](README-ko.md) • [Русский](README-ru.md) • [Türkçe](README-tr.md)

</div>

---

## ✨ 기능

### 🚀 **핵심 기능**
- **🌊 실시간 스트리밍 번역** - 번역이 생성되는 과정을 실시간으로 확인
- **🪟 다중 창 지원** - `Cmd+N`/`Ctrl+N`으로 여러 번역 창 생성
- **🔊 텍스트 음성 변환** - 30개 이상의 언어로 번역 내용 듣기
- **📌 항상 위에 표시** - 플로팅 창이 모든 애플리케이션 위에 유지
- **🎯 전역 단축키** - `Cmd+Shift+Y` 또는 `Option+Space`로 빠른 접근

### 🤖 **AI 제공자 지원**
- **OpenAI GPT** - GPT-3.5, GPT-4, GPT-4o
- **DeepSeek** - 고품질 번역
- **Google Gemini** - 고급 AI 기능
- **Claude** - Anthropic의 강력한 언어 모델

---

## 🖼️ 스크린샷

<div align="center">

### 메인 인터페이스
<img src="imgs/image-20250717143342743.png" width="600" height="400">

### 다중 창 모드
<img src="imgs/image-20250717143436828.png" width="600" height="400">

### 설정 패널
<img src="imgs/image-20250717143557893.png" width="600" height="400">

</div>

---

## 🚀 빠른 시작

### 필수 조건
- Node.js 18+
- pnpm (권장) 또는 npm

### 설치

```bash
# 저장소 복제
git clone https://github.com/hughedward/FloatQuickTrans.git
cd FloatQuickTrans

# 의존성 설치
pnpm install
```

### 개발

```bash
# 개발 서버 시작
pnpm dev
```

---

## 🎮 사용법

### 기본 번역
1. **텍스트 입력** - 번역할 텍스트 입력 또는 붙여넣기
2. **대상 언어 설정** - 언어 버튼을 클릭하여 변경
3. **번역** - `Cmd+Enter` 누르거나 번역 클릭
4. **듣기** - 🔊 아이콘을 클릭하여 발음 듣기

### 다중 창 워크플로우
1. **새 창 만들기** - `Cmd+N` (macOS) 또는 `Ctrl+N` (Windows) 누르기
2. **독립적 번역** - 각 창이 독립적으로 작동
3. **결과 비교** - 여러 창을 사용하여 번역 결과 비교

---

# 🛠️ 개발

### 기술 스택
- **프론트엔드**: React 19 + TypeScript
- **데스크톱**: Electron 35
- **빌드 도구**: Vite + electron-vite
- **스타일링**: CSS 글래스모피즘 효과

### 프로젝트 구조
```
src/
├── main/           # Electron 메인 프로세스
├── renderer/       # React 프론트엔드
├── preload/        # Electron 프리로드 스크립트
└── model/          # AI 제공업체 & 언어 매핑
```

### 🫰기여하기
커뮤니티 기여를 환영합니다! 기여를 원하시면 다음 단계를 따라주세요:
1.  이 저장소를 포크하세요
2.  기능 브랜치 생성 (`git checkout -b feature/놀라운기능`/`git checkout -b bugfix/xxx문제-수정`)
3.  변경사항 커밋 (`git commit -m '놀라운 기능 추가'`/`git commit -m 'xxx문제 수정:xxxx'`). 수정 후 설명이 포함된 커밋 메시지를 사용하고, 가능한 코드에 주석을 추가해 설명해주세요.
4.  브랜치에 푸시 (`git push origin feature/놀라운기능`/`git push origin bugfix/xxx문제-수정`). 코드를 깔끔하게 유지해주세요.
5.  풀 리퀘스트를 생성하세요. 한 번에 하나의 기능이나 수정에 집중하는 것을 권장하며, 너무 많은 변경을 한 번에 제출하지 마세요.
6.  우리는 PR을 검토하고 준비가 되면 병합할 것입니다. 다른 PR을 리뷰하는 데 도움을 주시면 더욱 감사하겠습니다!
7.  이해와 소통을 원활하게 하기 위해 질문 제출이나 풀 리퀘스트 등의 작업 시 영어를 사용할 것을 권장합니다.

---

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다 - 자세한 내용은 [LICENSE](../LICENSE) 파일을 참조하세요.

<div align="center">

**전 세계 커뮤니티를 위해 ❤️로 만들어졌습니다**

[⭐ 이 프로젝트에 별표 주기](https://github.com/hughedward/FloatQuickTrans) • [🐛 버그 신고](https://github.com/hughedward/FloatQuickTrans/issues) • [💡 기능 요청](https://github.com/hughedward/FloatQuickTrans/issues)

</div>

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=hughedward/FloatQuickTrans&type=Date)](https://www.star-history.com/#hughedward/FloatQuickTrans&Date)
