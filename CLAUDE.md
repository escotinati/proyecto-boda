# CLAUDE.md

Este archivo proporciona orientación a Claude Code (claude.ai/code) al trabajar con el código de este repositorio.

## Comandos

```bash
npm run dev       # Servidor de desarrollo en localhost:5173
npm run build     # Compilar para producción (genera /dist)
npm run preview   # Previsualizar el build de producción
npm run lint      # Ejecutar ESLint
npm run deploy    # Build + publicar en GitHub Pages (rama gh-pages)
```

## Arquitectura

Single-page application (SPA) sin router. Toda la lógica reside en **`src/App.jsx`**, que exporta `WeddingPage` como componente raíz. `FAQSection` es el único subcomponente, definido en el mismo archivo.

### Secciones (navegación por scroll con `react-scroll`)
| id | Descripción |
|----|-------------|
| `inicio` | Hero con imagen parallax y cuenta atrás en tiempo real hasta el 18-07-2026 |
| `celebracion` | Información de la ceremonia y autobús |
| `preguntas` | FAQ acordeón (estado local `openIndex`) |
| `asistencia` | Formulario RSVP con dos vistas: formulario / agradecimiento (`isSubmitted`) |

### Envío del formulario
El formulario envía los datos a **Google Sheets** mediante un Google Apps Script (`scriptURL` hardcodeada en `handleSubmit`). Usa `fetch` con `mode: 'no-cors'` y `URLSearchParams` en el body.

### Estilos
- **Tailwind CSS v4** con configuración via `postcss.config.js` (usa `@tailwindcss/postcss`, no `tailwind.config.js`)
- Clases utilitarias personalizadas en `src/index.css`: `.input-field`, `.selector-btn`, `.selector-btn-active`, `.new-bg`, etc.
- Paleta de color principal: terracota `#CD4B34` / `#D46A59`, fondo rosa `#E8C6C6`
- Fuente serif custom: **Zain** (todos los pesos en `src/fonts/*.ttf`), aplicada mediante `@font-face` en `index.css` y la clase `.serif`
- La imagen del hero se aplica por CSS (`.imgHero { background-image: url(assets/img_hero.jpg) }`)

### Animaciones
Todas las animaciones usan **Framer Motion**. El objeto `fadeInUp` es una constante reutilizable para animar secciones al entrar en viewport. El hero usa `useScroll` + `useTransform` para efectos parallax, zoom y fade.
