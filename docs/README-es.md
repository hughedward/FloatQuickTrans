<div align="center">

# 🌍 FloatQuickTrans

**Herramienta Profesional de Traducción IA Flotante**

*Traducción en tiempo real • Soporte multi-ventana • Texto a voz • Siempre visible*

[![Versión](https://img.shields.io/badge/versión-1.0.12-blue.svg)](https://github.com/hughedward/FloatQuickTrans)
[![Plataforma](https://img.shields.io/badge/plataforma-macOS%20%7C%20Windows%20%7C%20Linux-lightgrey.svg)](https://github.com/hughedward/FloatQuickTrans)
[![Licencia](https://img.shields.io/badge/licencia-MIT-green.svg)](../LICENSE)

[English](../README.md) • [简体中文](README-zh.md) • [繁體中文](README-zh-TW.md) • [日本語](README-ja.md) • [Français](README-fr.md) • [Deutsch](README-de.md) • [Español](README-es.md) • [한국어](README-ko.md) • [Русский](README-ru.md) • [Türkçe](README-tr.md)

</div>

---

## ✨ Características

### 🚀 **Capacidades Principales**
- **🌊 Traducción en Tiempo Real** - Observe cómo aparecen las traducciones mientras se generan
- **🪟 Soporte Multi-ventana** - Cree múltiples ventanas de traducción con `Cmd+N`/`Ctrl+N`
- **🔊 Texto a Voz** - Escuche traducciones en más de 30 idiomas
- **📌 Siempre Visible** - La ventana flotante permanece sobre todas las aplicaciones
- **🎯 Atajos Globales** - Acceso rápido con `Cmd+Shift+Y` o `Option+Space`

### 🤖 **Soporte de Proveedores IA**
- **OpenAI GPT** - GPT-3.5, GPT-4, GPT-4o
- **DeepSeek** - Traducciones de alta calidad
- **Google Gemini** - Capacidades avanzadas de IA
- **Claude** - Potente modelo de lenguaje de Anthropic

---

## 🖼️ Capturas de Pantalla

<div align="center">

### Interfaz Principal
<img src="imgs/image-20250717140752710.png" width="600" height="400">

### Modo Multi-ventana
<img src="imgs/image-20250717140456649.png" width="600" height="400">



### Panel de Configuración
<img src="imgs/image-20250717140855155.png" width="600" height="400">

</div>

---

## 🚀 Inicio Rápido

### Requisitos Previos
- Node.js 18+
- pnpm (recomendado) o npm

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/hughedward/FloatQuickTrans.git
cd FloatQuickTrans

# Instalar dependencias
pnpm install
```

### Desarrollo

```bash
# Iniciar servidor de desarrollo
pnpm dev
```

---

## 🎮 Uso

### Traducción Básica
1. **Introducir Texto** - Escriba o pegue texto para traducir
2. **Establecer Idioma Destino** - Haga clic en el botón de idioma para cambiar
3. **Traducir** - Presione `Cmd+Enter` o haga clic en traducir
4. **Escuchar** - Haga clic en el icono 🔊 para escuchar la pronunciación

### Flujo de Trabajo Multi-ventana
1. **Crear Nueva Ventana** - Presione `Cmd+N` (macOS) o `Ctrl+N` (Windows)
2. **Traducción Independiente** - Cada ventana funciona por separado
3. **Comparar Resultados** - Use múltiples ventanas para comparar traducciones

---

# 🛠️ Desarrollo

### Tecnologías utilizadas
- **Frontend**: React 19 + TypeScript
- **Escritorio**: Electron 35
- **Herramientas de construcción**: Vite + electron-vite
- **Estilos**: Efectos de cristal con CSS

### Estructura del proyecto
```
src/
├── main/           # Proceso principal de Electron
├── renderer/       # Frontend en React
├── preload/        # Scripts de precarga de Electron
└── model/          # Proveedores de IA & mapeo de idiomas
```

### 🫰 Contribuciones
¡Agradecemos las contribuciones de la comunidad! Si deseas contribuir, sigue estos pasos:
1. Haz un fork de este repositorio
2. Crea una rama de características (`git checkout -b feature/funcion-impresionante`/`git checkout -b bugfix/correccion-problema-xxx`)
3. Realiza tus cambios (`git commit -m 'Añadir funcion impresionante'`/`git commit -m 'Corregir problema xxx: xxxx'`). Por favor, utiliza mensajes descriptivos/abreviados al hacer commit y añade comentarios en el código cuando sea posible.
4. Sube los cambios a la rama (`git push origin feature/funcion-impresionante`/`git push origin bugfix/correccion-problema-xxx`). Mantén el código limpio y ordenado.
5. Abre una solicitud de extracción (Pull Request). Se recomienda enfocarse en una sola funcionalidad o corrección por PR, evitando cambios masivos.
6. Revisaremos tu PR y lo fusionaremos cuando esté listo. ¡También agradecemos si deseas ayudar revisando otros PRs!
7. Para facilitar la comprensión y la comunicación, se recomienda utilizar el inglés al enviar preguntas, solicitudes de extracción y realizar otras operaciones.

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT - consulta el archivo [LICENSE](../LICENSE) para más detalles.

<div align="center">

**Hecho con ❤️ para la comunidad global**

[⭐ Destacar este proyecto](https://github.com/hughedward/FloatQuickTrans) • [🐛 Reportar Error](https://github.com/hughedward/FloatQuickTrans/issues) • [💡 Solicitar Función](https://github.com/hughedward/FloatQuickTrans/issues)

</div>

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=hughedward/FloatQuickTrans&type=Date)](https://www.star-history.com/#hughedward/FloatQuickTrans&Date)
