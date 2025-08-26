import React, { useState, useEffect } from 'react';
import { Moon, Sun, Menu, X, Check, ArrowRight, Zap, Cpu, Layers, TestTube, Rocket, Bot } from 'lucide-react';

const AncloraLanding = () => {
  const [isDark, setIsDark] = useState(false);
  const [language, setLanguage] = useState('es');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Detectar preferencias del sistema
  useEffect(() => {
    const savedTheme = localStorage.getItem('anclora-theme');
    const savedLang = localStorage.getItem('anclora-lang') || 'es';
    
    if (savedTheme) {
      setIsDark(savedTheme === 'dark');
    } else {
      setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    
    setLanguage(savedLang);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('anclora-theme', newTheme ? 'dark' : 'light');
  };

  const toggleLanguage = () => {
    const newLang = language === 'es' ? 'en' : 'es';
    setLanguage(newLang);
    localStorage.setItem('anclora-lang', newLang);
  };

  // Contenido multiidioma
  const content = {
    es: {
      nav: {
        features: 'Características',
        comparison: 'Comparación',
        pricing: 'Precios',
        contact: 'Contacto'
      },
      hero: {
        title: 'Genera Componentes con IA en Segundos',
        subtitle: 'La herramienta AI-powered que convierte tus ideas en componentes de React, Vue y Angular listos para producción. Sin configuración, sin complicaciones.',
        tryFree: 'Prueba Gratis',
        watchDemo: 'Ver Demo',
        stats: {
          faster: 'Más Rápido',
          developers: 'Desarrolladores',
          satisfaction: 'Satisfacción'
        }
      },
      features: {
        title: '¿Por qué Anclora Render?',
        subtitle: 'Todo lo que necesitas para acelerar tu desarrollo frontend',
        items: [
          {
            icon: Bot,
            title: 'IA Avanzada',
            description: 'Genera componentes perfectos con solo describir lo que necesitas'
          },
          {
            icon: Zap,
            title: 'Setup en Segundos',
            description: 'Sin configuración. Empieza a generar componentes inmediatamente'
          },
          {
            icon: Layers,
            title: 'Multi-Framework',
            description: 'Soporte completo para React, Vue, Angular y más'
          },
          {
            icon: Cpu,
            title: 'Design Systems',
            description: 'Componentes consistentes con tu design system personalizado'
          },
          {
            icon: TestTube,
            title: 'Testing Visual',
            description: 'Validación automática y testing de regresión visual'
          },
          {
            icon: Rocket,
            title: 'Listo para Producción',
            description: 'Código optimizado y listo para usar en tus proyectos'
          }
        ]
      },
      comparison: {
        title: 'Comparación con Alternativas',
        subtitle: 'Ve por qué Anclora Render es la mejor opción',
        features: [
          'Setup en segundos',
          'Generación con IA',
          'Multi-framework',
          'Testing visual',
          'Precio inicial'
        ]
      },
      pricing: {
        title: 'Precios Simples y Transparentes',
        subtitle: 'Elige el plan perfecto para tu equipo',
        free: {
          name: 'Gratuito',
          price: '$0',
          features: [
            '3 design systems',
            'Librería completa',
            'Export básico',
            'Soporte comunidad'
          ],
          cta: 'Empezar Gratis'
        },
        pro: {
          name: 'Pro',
          price: '$19',
          popular: 'Más Popular',
          features: [
            'Design systems ilimitados',
            'Testing visual',
            'Colaboración en equipo',
            'Soporte prioritario'
          ],
          cta: 'Empezar Prueba'
        },
        enterprise: {
          name: 'Enterprise',
          price: '$199',
          features: [
            'White-label',
            'SSO + seguridad avanzada',
            'Integraciones personalizadas',
            'Soporte dedicado'
          ],
          cta: 'Contactar Ventas'
        }
      },
      finalCta: {
        title: '¿Listo para Acelerar tu Desarrollo?',
        subtitle: 'Únete a miles de desarrolladores que ya están creando componentes 10x más rápido',
        startFree: 'Empezar Gratis Ahora',
        talkSales: 'Hablar con Ventas'
      },
      footer: {
        product: 'Producto',
        resources: 'Recursos',
        company: 'Empresa',
        legal: 'Legal',
        rights: 'Todos los derechos reservados.'
      }
    },
    en: {
      nav: {
        features: 'Features',
        comparison: 'Comparison',
        pricing: 'Pricing',
        contact: 'Contact'
      },
      hero: {
        title: 'Generate Components with AI in Seconds',
        subtitle: 'The AI-powered tool that turns your ideas into production-ready React, Vue, and Angular components. No setup, no hassle.',
        tryFree: 'Try Free',
        watchDemo: 'Watch Demo',
        stats: {
          faster: 'Faster',
          developers: 'Developers',
          satisfaction: 'Satisfaction'
        }
      },
      features: {
        title: 'Why Anclora Render?',
        subtitle: 'Everything you need to accelerate your frontend development',
        items: [
          {
            icon: Bot,
            title: 'Advanced AI',
            description: 'Generate perfect components by just describing what you need'
          },
          {
            icon: Zap,
            title: 'Setup in Seconds',
            description: 'No configuration. Start generating components immediately'
          },
          {
            icon: Layers,
            title: 'Multi-Framework',
            description: 'Full support for React, Vue, Angular and more'
          },
          {
            icon: Cpu,
            title: 'Design Systems',
            description: 'Consistent components with your custom design system'
          },
          {
            icon: TestTube,
            title: 'Visual Testing',
            description: 'Automatic validation and visual regression testing'
          },
          {
            icon: Rocket,
            title: 'Production Ready',
            description: 'Optimized code ready to use in your projects'
          }
        ]
      },
      comparison: {
        title: 'Comparison with Alternatives',
        subtitle: 'See why Anclora Render is the best choice',
        features: [
          'Setup in seconds',
          'AI Generation',
          'Multi-framework',
          'Visual testing',
          'Starting price'
        ]
      },
      pricing: {
        title: 'Simple and Transparent Pricing',
        subtitle: 'Choose the perfect plan for your team',
        free: {
          name: 'Free',
          price: '$0',
          features: [
            '3 design systems',
            'Complete library',
            'Basic export',
            'Community support'
          ],
          cta: 'Start Free'
        },
        pro: {
          name: 'Pro',
          price: '$19',
          popular: 'Most Popular',
          features: [
            'Unlimited design systems',
            'Visual testing',
            'Team collaboration',
            'Priority support'
          ],
          cta: 'Start Trial'
        },
        enterprise: {
          name: 'Enterprise',
          price: '$199',
          features: [
            'White-label',
            'SSO + advanced security',
            'Custom integrations',
            'Dedicated support'
          ],
          cta: 'Contact Sales'
        }
      },
      finalCta: {
        title: 'Ready to Accelerate Your Development?',
        subtitle: 'Join thousands of developers already creating components 10x faster',
        startFree: 'Start Free Now',
        talkSales: 'Talk to Sales'
      },
      footer: {
        product: 'Product',
        resources: 'Resources',
        company: 'Company',
        legal: 'Legal',
        rights: 'All rights reserved.'
      }
    }
  };

  const t = content[language];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark 
        ? 'bg-gray-900 text-gray-100' 
        : 'bg-white text-gray-900'
    }`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 backdrop-blur-md border-b transition-colors ${
        isDark 
          ? 'bg-gray-900/80 border-gray-700' 
          : 'bg-white/80 border-gray-200'
      }`}>
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-blue-600 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-full"></div>
              </div>
              <span className="text-xl font-bold text-teal-600">Anclora Render</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className={`hover:text-teal-600 transition-colors ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {t.nav.features}
              </a>
              <a href="#comparison" className={`hover:text-teal-600 transition-colors ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {t.nav.comparison}
              </a>
              <a href="#pricing" className={`hover:text-teal-600 transition-colors ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {t.nav.pricing}
              </a>
              <a href="#contact" className={`hover:text-teal-600 transition-colors ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {t.nav.contact}
              </a>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleLanguage}
                className={`px-3 py-1 text-sm border rounded transition-colors ${
                  isDark 
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-800' 
                    : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {language === 'es' ? 'EN' : 'ES'}
              </button>
              
              <button
                onClick={toggleTheme}
                className={`p-2 rounded transition-colors ${
                  isDark 
                    ? 'text-gray-300 hover:bg-gray-800' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-col space-y-4">
                <a href="#features" onClick={() => setIsMenuOpen(false)}>{t.nav.features}</a>
                <a href="#comparison" onClick={() => setIsMenuOpen(false)}>{t.nav.comparison}</a>
                <a href="#pricing" onClick={() => setIsMenuOpen(false)}>{t.nav.pricing}</a>
                <a href="#contact" onClick={() => setIsMenuOpen(false)}>{t.nav.contact}</a>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <section className={`py-20 ${
        isDark 
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-teal-900' 
          : 'bg-gradient-to-br from-teal-50 via-blue-50 to-indigo-50'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-teal-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              {t.hero.title}
            </span>
          </h1>
          
          <p className={`text-xl md:text-2xl mb-8 max-w-3xl mx-auto ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {t.hero.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button className="px-8 py-4 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors flex items-center justify-center space-x-2">
              <span>{t.hero.tryFree}</span>
              <ArrowRight size={20} />
            </button>
            <button className={`px-8 py-4 border-2 border-teal-600 text-teal-600 rounded-lg font-semibold hover:bg-teal-50 transition-colors ${
              isDark ? 'hover:bg-teal-900' : ''
            }`}>
              {t.hero.watchDemo}
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-teal-600 mb-2">10x</div>
              <div className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {t.hero.stats.faster}
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-teal-600 mb-2">5K+</div>
              <div className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {t.hero.stats.developers}
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-teal-600 mb-2">99%</div>
              <div className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {t.hero.stats.satisfaction}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">{t.features.title}</h2>
            <p className={`text-xl ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {t.features.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {t.features.items.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className={`p-6 rounded-xl border transition-all hover:transform hover:scale-105 ${
                  isDark 
                    ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' 
                    : 'bg-white border-gray-200 hover:shadow-lg'
                }`}>
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                    <IconComponent size={24} className="text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section id="comparison" className={`py-20 ${
        isDark ? 'bg-gray-800' : 'bg-gray-50'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">{t.comparison.title}</h2>
            <p className={`text-xl ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {t.comparison.subtitle}
            </p>
          </div>

          <div className={`rounded-xl overflow-hidden shadow-xl ${
            isDark ? 'bg-gray-900' : 'bg-white'
          }`}>
            {/* Header */}
            <div className="bg-gradient-to-r from-teal-600 to-blue-600 text-white p-4">
              <div className="grid grid-cols-4 gap-4 font-semibold">
                <div>Característica</div>
                <div className="text-center">Anclora Render</div>
                <div className="text-center">Storybook</div>
                <div className="text-center">Figma Dev</div>
              </div>
            </div>

            {/* Rows */}
            {t.comparison.features.map((feature, index) => (
              <div key={index} className={`grid grid-cols-4 gap-4 p-4 border-b ${
                isDark ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <div className="font-medium">{feature}</div>
                <div className="text-center">
                  <Check className="text-green-500 mx-auto" size={20} />
                </div>
                <div className="text-center">
                  {index === 0 || index === 1 ? (
                    <span className="text-red-500 text-xl">✗</span>
                  ) : (
                    <Check className="text-green-500 mx-auto" size={20} />
                  )}
                </div>
                <div className="text-center">
                  {index <= 1 ? (
                    <span className="text-red-500 text-xl">✗</span>
                  ) : index === 4 ? (
                    <span className="text-sm">$12/mes</span>
                  ) : (
                    <Check className="text-green-500 mx-auto" size={20} />
                  )}
                </div>
              </div>
            ))}

            {/* Pricing row */}
            <div className={`grid grid-cols-4 gap-4 p-4 ${
              isDark ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <div className="font-medium">
                {language === 'es' ? 'Precio inicial' : 'Starting price'}
              </div>
              <div className="text-center font-semibold text-green-600">
                {language === 'es' ? 'Gratis' : 'Free'}
              </div>
              <div className="text-center font-semibold text-green-600">
                {language === 'es' ? 'Gratis' : 'Free'}
              </div>
              <div className="text-center font-semibold">$12/mes</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">{t.pricing.title}</h2>
            <p className={`text-xl ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {t.pricing.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <div className={`p-8 rounded-xl border transition-all ${
              isDark 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-gray-200'
            }`}>
              <h3 className="text-2xl font-bold mb-4">{t.pricing.free.name}</h3>
              <div className="text-4xl font-bold text-teal-600 mb-2">
                {t.pricing.free.price}
                <span className="text-lg font-normal text-gray-500">/mes</span>
              </div>
              
              <ul className="space-y-3 mb-8">
                {t.pricing.free.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <Check className="text-green-500" size={16} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button className={`w-full py-3 px-6 border-2 border-teal-600 text-teal-600 rounded-lg font-semibold hover:bg-teal-50 transition-colors ${
                isDark ? 'hover:bg-teal-900' : ''
              }`}>
                {t.pricing.free.cta}
              </button>
            </div>

            {/* Pro Plan */}
            <div className={`p-8 rounded-xl border-2 border-teal-500 relative transform scale-105 ${
              isDark ? 'bg-gray-800' : 'bg-white'
            }`}>
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-teal-500 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  {t.pricing.pro.popular}
                </span>
              </div>
              
              <h3 className="text-2xl font-bold mb-4">{t.pricing.pro.name}</h3>
              <div className="text-4xl font-bold text-teal-600 mb-2">
                {t.pricing.pro.price}
                <span className="text-lg font-normal text-gray-500">/mes</span>
              </div>
              
              <ul className="space-y-3 mb-8">
                {t.pricing.pro.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <Check className="text-green-500" size={16} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button className="w-full py-3 px-6 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors">
                {t.pricing.pro.cta}
              </button>
            </div>

            {/* Enterprise Plan */}
            <div className={`p-8 rounded-xl border transition-all ${
              isDark 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-gray-200'
            }`}>
              <h3 className="text-2xl font-bold mb-4">{t.pricing.enterprise.name}</h3>
              <div className="text-4xl font-bold text-teal-600 mb-2">
                {t.pricing.enterprise.price}
                <span className="text-lg font-normal text-gray-500">/mes</span>
              </div>
              
              <ul className="space-y-3 mb-8">
                {t.pricing.enterprise.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <Check className="text-green-500" size={16} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button className={`w-full py-3 px-6 border-2 border-teal-600 text-teal-600 rounded-lg font-semibold hover:bg-teal-50 transition-colors ${
                isDark ? 'hover:bg-teal-900' : ''
              }`}>
                {t.pricing.enterprise.cta}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-teal-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">{t.finalCta.title}</h2>
          <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
            {t.finalCta.subtitle}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-white text-teal-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              {t.finalCta.startFree}
            </button>
            <button className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-teal-600 transition-colors">
              {t.finalCta.talkSales}
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className={`py-16 ${
        isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
      } border-t`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold text-lg mb-4">{t.footer.product}</h4>
              <ul className="space-y-2">
                <li><a href="#" className={`hover:text-teal-600 transition-colors ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {t.nav.features}
                </a></li>
                <li><a href="#" className={`hover:text-teal-600 transition-colors ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {t.nav.pricing}
                </a></li>
                <li><a href="#" className={`hover:text-teal-600 transition-colors ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  API
                </a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-4">{t.footer.resources}</h4>
              <ul className="space-y-2">
                <li><a href="#" className={`hover:text-teal-600 transition-colors ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {language === 'es' ? 'Documentación' : 'Documentation'}
                </a></li>
                <li><a href="#" className={`hover:text-teal-600 transition-colors ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Blog
                </a></li>
                <li><a href="#" className={`hover:text-teal-600 transition-colors ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {language === 'es' ? 'Comunidad' : 'Community'}
                </a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-4">{t.footer.company}</h4>
              <ul className="space-y-2">
                <li><a href="#" className={`hover:text-teal-600 transition-colors ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {language === 'es' ? 'Sobre nosotros' : 'About us'}
                </a></li>
                <li><a href="#" className={`hover:text-teal-600 transition-colors ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {t.nav.contact}
                </a></li>
                <li><a href="#" className={`hover:text-teal-600 transition-colors ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {language === 'es' ? 'Carreras' : 'Careers'}
                </a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-4">{t.footer.legal}</h4>
              <ul className="space-y-2">
                <li><a href="#" className={`hover:text-teal-600 transition-colors ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {language === 'es' ? 'Privacidad' : 'Privacy'}
                </a></li>
                <li><a href="#" className={`hover:text-teal-600 transition-colors ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {language === 'es' ? 'Términos' : 'Terms'}
                </a></li>
                <li><a href="#" className={`hover:text-teal-600 transition-colors ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Cookies
                </a></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              © 2025 Anclora Render. {t.footer.rights}
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="https://twitter.com/anclora" className={`hover:text-teal-600 transition-colors ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                𝕏
              </a>
              <a href="https://github.com/anclora" className={`hover:text-teal-600 transition-colors ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                GitHub
              </a>
              <a href="https://discord.gg/anclora" className={`hover:text-teal-600 transition-colors ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Discord
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AncloraLanding;