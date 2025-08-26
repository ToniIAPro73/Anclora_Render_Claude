# Opción 3: Astro + i18n para Anclora Render

## Estructura del proyecto Astro

```
anclora-landing/
├── src/
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Hero.astro
│   │   ├── Features.astro
│   │   ├── Comparison.astro
│   │   ├── Pricing.astro
│   │   ├── CTA.astro
│   │   └── Footer.astro
│   ├── layouts/
│   │   └── Layout.astro
│   ├── pages/
│   │   ├── index.astro (español por defecto)
│   │   └── en/
│   │       └── index.astro (versión inglés)
│   ├── i18n/
│   │   ├── es.json
│   │   ├── en.json
│   │   └── index.ts
│   └── styles/
│       └── global.css
├── astro.config.mjs
└── package.json
```

## 1. Configuración inicial

### package.json
```json
{
  "name": "anclora-landing",
  "version": "1.0.0",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview"
  },
  "dependencies": {
    "astro": "^4.0.0",
    "@astrojs/tailwind": "^5.0.0",
    "tailwindcss": "^3.4.0"
  }
}
```

### astro.config.mjs
```javascript
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [tailwind()],
  i18n: {
    defaultLocale: "es",
    locales: ["es", "en"],
    routing: {
      prefixDefaultLocale: false
    }
  }
});
```

## 2. Sistema de idiomas

### src/i18n/es.json
```json
{
  "nav": {
    "features": "Características",
    "comparison": "Comparación", 
    "pricing": "Precios",
    "contact": "Contacto"
  },
  "hero": {
    "title": "Genera Componentes con IA en Segundos",
    "subtitle": "La herramienta AI-powered que convierte tus ideas en componentes de React, Vue y Angular listos para producción. Sin configuración, sin complicaciones.",
    "tryFree": "Prueba Gratis",
    "watchDemo": "Ver Demo",
    "stats": {
      "faster": "Más Rápido",
      "developers": "Desarrolladores", 
      "satisfaction": "Satisfacción"
    }
  },
  "features": {
    "title": "¿Por qué Anclora Render?",
    "subtitle": "Todo lo que necesitas para acelerar tu desarrollo frontend",
    "items": [
      {
        "title": "IA Avanzada",
        "description": "Genera componentes perfectos con solo describir lo que necesitas"
      },
      {
        "title": "Setup en Segundos", 
        "description": "Sin configuración. Empieza a generar componentes inmediatamente"
      },
      {
        "title": "Multi-Framework",
        "description": "Soporte completo para React, Vue, Angular y más"
      }
    ]
  },
  "pricing": {
    "title": "Precios Simples y Transparentes",
    "subtitle": "Elige el plan perfecto para tu equipo",
    "free": {
      "name": "Gratuito",
      "price": "$0",
      "features": [
        "3 design systems",
        "Librería completa", 
        "Export básico",
        "Soporte comunidad"
      ],
      "cta": "Empezar Gratis"
    },
    "pro": {
      "name": "Pro",
      "price": "$19", 
      "popular": "Más Popular",
      "features": [
        "Design systems ilimitados",
        "Testing visual",
        "Colaboración en equipo", 
        "Soporte prioritario"
      ],
      "cta": "Empezar Prueba"
    }
  }
}
```

### src/i18n/en.json
```json
{
  "nav": {
    "features": "Features",
    "comparison": "Comparison",
    "pricing": "Pricing", 
    "contact": "Contact"
  },
  "hero": {
    "title": "Generate Components with AI in Seconds",
    "subtitle": "The AI-powered tool that turns your ideas into production-ready React, Vue, and Angular components. No setup, no hassle.",
    "tryFree": "Try Free",
    "watchDemo": "Watch Demo",
    "stats": {
      "faster": "Faster",
      "developers": "Developers",
      "satisfaction": "Satisfaction" 
    }
  },
  "features": {
    "title": "Why Anclora Render?",
    "subtitle": "Everything you need to accelerate your frontend development",
    "items": [
      {
        "title": "Advanced AI",
        "description": "Generate perfect components by just describing what you need"
      },
      {
        "title": "Setup in Seconds",
        "description": "No configuration. Start generating components immediately" 
      },
      {
        "title": "Multi-Framework", 
        "description": "Full support for React, Vue, Angular and more"
      }
    ]
  },
  "pricing": {
    "title": "Simple and Transparent Pricing",
    "subtitle": "Choose the perfect plan for your team",
    "free": {
      "name": "Free",
      "price": "$0",
      "features": [
        "3 design systems", 
        "Complete library",
        "Basic export",
        "Community support"
      ],
      "cta": "Start Free"
    },
    "pro": {
      "name": "Pro",
      "price": "$19",
      "popular": "Most Popular", 
      "features": [
        "Unlimited design systems",
        "Visual testing", 
        "Team collaboration",
        "Priority support"
      ],
      "cta": "Start Trial"
    }
  }
}
```

## 3. Layout principal

### src/layouts/Layout.astro
```astro
---
export interface Props {
  title: string;
  description: string;
  lang: 'es' | 'en';
}

const { title, description, lang } = Astro.props;
---

<!DOCTYPE html>
<html lang={lang}>
  <head>
    <meta charset="UTF-8" />
    <meta name="description" content={description} />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{title}</title>
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    
    <!-- Preload CSS crítico -->
    <link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin>
    
    <!-- Open Graph -->
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="/og-image.jpg" />
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
  </head>
  
  <body class="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
    <slot />
    
    <script>
      // Theme detection
      if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
      
      // Smooth scroll
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
          e.preventDefault();
          const target = document.querySelector(this.getAttribute('href'));
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
          }
        });
      });
    </script>
  </body>
</html>
```

## 4. Componentes principales

### src/components/Hero.astro
```astro
---
interface Props {
  content: {
    title: string;
    subtitle: string;
    tryFree: string;
    watchDemo: string;
    stats: {
      faster: string;
      developers: string;
      satisfaction: string;
    };
  };
}

const { content } = Astro.props;
---

<section class="py-20 bg-gradient-to-br from-teal-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-teal-900">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <h1 class="text-5xl md:text-6xl font-bold mb-6">
      <span class="bg-gradient-to-r from-teal-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
        {content.title}
      </span>
    </h1>
    
    <p class="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-gray-600 dark:text-gray-300">
      {content.subtitle}
    </p>

    <div class="flex flex-col sm:flex-row gap-4 justify-center mb-16">
      <a href="#" class="px-8 py-4 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors inline-flex items-center justify-center space-x-2">
        <span>{content.tryFree}</span>
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
        </svg>
      </a>
      <a href="#" class="px-8 py-4 border-2 border-teal-600 text-teal-600 rounded-lg font-semibold hover:bg-teal-50 dark:hover:bg-teal-900 transition-colors">
        {content.watchDemo}
      </a>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="text-center">
        <div class="text-4xl font-bold text-teal-600 mb-2">10x</div>
        <div class="text-lg text-gray-600 dark:text-gray-400">
          {content.stats.faster}
        </div>
      </div>
      <div class="text-center">
        <div class="text-4xl font-bold text-teal-600 mb-2">5K+</div>
        <div class="text-lg text-gray-600 dark:text-gray-400">
          {content.stats.developers}
        </div>
      </div>
      <div class="text-center">
        <div class="text-4xl font-bold text-teal-600 mb-2">99%</div>
        <div class="text-lg text-gray-600 dark:text-gray-400">
          {content.stats.satisfaction}
        </div>
      </div>
    </div>
  </div>
</section>
```

## 5. Páginas principales

### src/pages/index.astro (Español)
```astro
---
import Layout from '../layouts/Layout.astro';
import Header from '../components/Header.astro';
import Hero from '../components/Hero.astro';
import Features from '../components/Features.astro';
import Comparison from '../components/Comparison.astro';
import Pricing from '../components/Pricing.astro';
import CTA from '../components/CTA.astro';
import Footer from '../components/Footer.astro';

import esContent from '../i18n/es.json';

const seo = {
  title: "Anclora Render - Genera Componentes con IA en Segundos",
  description: "La herramienta AI-powered que genera componentes web en React, Vue, Angular automáticamente. Prueba gratis."
};
---

<Layout title={seo.title} description={seo.description} lang="es">
  <Header content={esContent.nav} lang="es" />
  <Hero content={esContent.hero} />
  <Features content={esContent.features} />
  <Comparison content={esContent.comparison} />
  <Pricing content={esContent.pricing} />
  <CTA content={esContent.finalCta} />
  <Footer content={esContent.footer} lang="es" />
</Layout>
```

### src/pages/en/index.astro (Inglés)
```astro
---
import Layout from '../../layouts/Layout.astro';
import Header from '../../components/Header.astro';
import Hero from '../../components/Hero.astro';
import Features from '../../components/Features.astro';
import Comparison from '../../components/Comparison.astro';
import Pricing from '../../components/Pricing.astro';
import CTA from '../../components/CTA.astro';
import Footer from '../../components/Footer.astro';

import enContent from '../../i18n/en.json';

const seo = {
  title: "Anclora Render - Generate Components with AI in Seconds",
  description: "The AI-powered tool that generates React, Vue, Angular components automatically. Try free."
};
---

<Layout title={seo.title} description={seo.description} lang="en">
  <Header content={enContent.nav} lang="en" />
  <Hero content={enContent.hero} />
  <Features content={enContent.features} />
  <Comparison content={enContent.comparison} />
  <Pricing content={enContent.pricing} />
  <CTA content={enContent.finalCta} />
  <Footer content={enContent.footer} lang="en" />
</Layout>
```

## Ventajas de Astro:

✅ **Performance**: Genera HTML estático, carga ultra rápida  
✅ **SEO**: Excelente optimización para buscadores  
✅ **i18n nativo**: Sistema de idiomas integrado  
✅ **Build time**: Generación estática en build  
✅ **Flexibilidad**: Puedes usar React/Vue si necesitas interactividad  
✅ **Bundle size**: Solo carga JavaScript cuando es necesario

## Despliegue gratuito:
- **Netlify** (recomendado para Astro)
- **Vercel** 
- **GitHub Pages**
- **Cloudflare Pages**

## Comandos para empezar:
```bash
npm create astro@latest anclora-landing
cd anclora-landing
npm install @astrojs/tailwind
npm run dev
```

¿Esta opción te parece bien o prefieres que desarrolle alguna de las otras dos opciones completamente?