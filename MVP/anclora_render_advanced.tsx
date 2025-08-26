import React, { useState, useEffect } from 'react';
import { 
  Palette, Code, Eye, Settings, Moon, Sun, Upload, Play, Download, Copy, Check, 
  RefreshCw, Zap, Sparkles, MessageCircle, ChevronDown, AlertTriangle, 
  Smartphone, Tablet, Monitor, GitBranch, Share2, FileText
} from 'lucide-react';

const AncloraRenderAdvanced = () => {
  const [isDark, setIsDark] = useState(false);
  const [activeTab, setActiveTab] = useState('ai-assistant');
  const [code, setCode] = useState('');
  const [designSystem, setDesignSystem] = useState('anclora');
  const [viewport, setViewport] = useState('mobile');
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedComponents, setGeneratedComponents] = useState([]);
  const [validationResults, setValidationResults] = useState([]);
  const [showShareModal, setShowShareModal] = useState(false);

  // Ejemplos mejorados con más variedad
  const componentLibrary = {
    buttons: {
      name: 'Botones',
      components: {
        primary: `<button className="btn btn-primary">
  <span>Botón Primario</span>
</button>`,
        secondary: `<button className="btn btn-secondary">
  <span>Botón Secundario</span>
</button>`,
        icon: `<button className="btn btn-primary btn-icon">
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
  <span>Con Icono</span>
</button>`,
        loading: `<button className="btn btn-primary btn-loading" disabled>
  <div className="spinner"></div>
  <span>Cargando...</span>
</button>`
      }
    },
    cards: {
      name: 'Tarjetas',
      components: {
        basic: `<div className="card">
  <h3>Tarjeta Básica</h3>
  <p>Contenido de la tarjeta con texto descriptivo.</p>
  <button className="btn btn-outline">Acción</button>
</div>`,
        withImage: `<div className="card card-image">
  <div className="card-media"></div>
  <div className="card-content">
    <h3>Tarjeta con Imagen</h3>
    <p>Descripción del contenido de la tarjeta.</p>
    <div className="card-actions">
      <button className="btn btn-primary btn-sm">Ver más</button>
      <button className="btn btn-outline btn-sm">Compartir</button>
    </div>
  </div>
</div>`,
        stats: `<div className="card card-stats">
  <div className="stat-item">
    <div className="stat-value">2.4K</div>
    <div className="stat-label">Usuarios</div>
  </div>
  <div className="stat-item">
    <div className="stat-value">89%</div>
    <div className="stat-label">Satisfacción</div>
  </div>
  <div className="stat-item">
    <div className="stat-value">156</div>
    <div className="stat-label">Componentes</div>
  </div>
</div>`
      }
    },
    forms: {
      name: 'Formularios',
      components: {
        contact: `<div className="form-container">
  <h2>Contacto</h2>
  <div className="form-row">
    <div className="field-group">
      <label htmlFor="firstName">Nombre</label>
      <input type="text" id="firstName" placeholder="Tu nombre" />
    </div>
    <div className="field-group">
      <label htmlFor="lastName">Apellido</label>
      <input type="text" id="lastName" placeholder="Tu apellido" />
    </div>
  </div>
  <div className="field-group">
    <label htmlFor="email">Email</label>
    <input type="email" id="email" placeholder="tu@email.com" />
  </div>
  <div className="field-group">
    <label htmlFor="message">Mensaje</label>
    <textarea id="message" rows="4" placeholder="Escribe tu mensaje..."></textarea>
  </div>
  <button className="btn btn-primary btn-full">Enviar Mensaje</button>
</div>`,
        login: `<div className="form-container form-centered">
  <h2>Iniciar Sesión</h2>
  <div className="field-group">
    <label htmlFor="loginEmail">Email</label>
    <input type="email" id="loginEmail" placeholder="tu@email.com" />
  </div>
  <div className="field-group">
    <label htmlFor="password">Contraseña</label>
    <input type="password" id="password" placeholder="••••••••" />
  </div>
  <div className="form-actions">
    <button className="btn btn-primary btn-full">Entrar</button>
    <button className="btn btn-link">¿Olvidaste tu contraseña?</button>
  </div>
</div>`
      }
    },
    navigation: {
      name: 'Navegación',
      components: {
        navbar: `<nav className="navbar">
  <div className="navbar-brand">
    <div className="brand-icon">A</div>
    <span>Anclora</span>
  </div>
  <div className="navbar-menu">
    <a href="#" className="nav-link active">Inicio</a>
    <a href="#" className="nav-link">Productos</a>
    <a href="#" className="nav-link">Contacto</a>
  </div>
  <button className="btn btn-primary btn-sm">Empezar</button>
</nav>`,
        breadcrumbs: `<nav className="breadcrumbs">
  <a href="#" className="breadcrumb-item">Inicio</a>
  <span className="breadcrumb-separator">/</span>
  <a href="#" className="breadcrumb-item">Productos</a>
  <span className="breadcrumb-separator">/</span>
  <span className="breadcrumb-item current">Anclora Render</span>
</nav>`,
        tabs: `<div className="tabs">
  <button className="tab active">Diseño</button>
  <button className="tab">Código</button>
  <button className="tab">Preview</button>
  <button className="tab">Compartir</button>
</div>`
      }
    }
  };

  const designSystems = {
    anclora: {
      name: 'Anclora Ocean',
      colors: ['#0B6477', '#0AD1C8', '#45DFB1', '#80ED99'],
      description: 'Sistema oficial Anclora con gradientes oceánicos'
    },
    material: {
      name: 'Material Design 3',
      colors: ['#1976D2', '#2196F3', '#03DAC6', '#FF5722'],
      description: 'Sistema de Google con Material You'
    },
    tailwind: {
      name: 'Tailwind CSS',
      colors: ['#06B6D4', '#8B5CF6', '#F59E0B', '#EF4444'],
      description: 'Utilidades CSS modernas y flexibles'
    },
    custom: {
      name: 'Sistema Personalizado',
      colors: ['#6366F1', '#8B5CF6', '#EC4899', '#F59E0B'],
      description: 'Tu design system personalizado'
    }
  };

  const viewports = {
    mobile: { name: 'Móvil', width: '375px', icon: Smartphone },
    tablet: { name: 'Tablet', width: '768px', icon: Tablet },
    desktop: { name: 'Desktop', width: '1200px', icon: Monitor }
  };

  // Simular generación de componentes con IA
  const generateComponent = async () => {
    if (!aiPrompt.trim()) return;
    
    setIsGenerating(true);
    
    // Simular llamada a API de IA
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const generatedCode = `<div className="ai-generated-component">
  <h3>Componente Generado: ${aiPrompt}</h3>
  <p>Este componente fue generado usando IA basado en tu descripción.</p>
  <div className="component-features">
    <span className="feature-tag">Responsive</span>
    <span className="feature-tag">Accesible</span>
    <span className="feature-tag">Design System</span>
  </div>
  <button className="btn btn-primary">Interactuar</button>
</div>`;

    setCode(generatedCode);
    setGeneratedComponents(prev => [...prev, {
      id: Date.now(),
      prompt: aiPrompt,
      code: generatedCode,
      timestamp: new Date()
    }]);
    
    setAiPrompt('');
    setIsGenerating(false);
    setActiveTab('preview');
  };

  // Validación automática del componente
  useEffect(() => {
    if (code) {
      const results = [
        { type: 'success', message: 'Colores del design system aplicados correctamente' },
        { type: 'success', message: 'Estructura semántica válida' },
        { type: 'success', message: 'Responsive design implementado' },
        { type: 'warning', message: 'Considerar mejorar el contraste en texto secundario' },
        { type: 'info', message: 'Componente optimizado para ' + viewport }
      ];
      setValidationResults(results);
    } else {
      setValidationResults([]);
    }
  }, [code, designSystem, viewport]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareComponent = () => {
    setShowShareModal(true);
  };

  const loadComponent = (category, componentKey) => {
    setCode(componentLibrary[category].components[componentKey]);
    setActiveTab('preview');
  };

  return (
    <div className={`app ${isDark ? 'dark' : 'light'}`}>
      {/* Header mejorado */}
      <header className="header">
        <div className="header-content">
          <div className="logo-section">
            <div className="anclora-icon">
              <div className="icon-a">A</div>
            </div>
            <div className="brand-text">
              <h1>Anclora Render</h1>
              <span className="tagline">Powered by AI • Design System Truth</span>
            </div>
          </div>
          
          <div className="header-controls">
            <div className="viewport-selector">
              {Object.entries(viewports).map(([key, vp]) => {
                const IconComponent = vp.icon;
                return (
                  <button
                    key={key}
                    className={`viewport-btn ${viewport === key ? 'active' : ''}`}
                    onClick={() => setViewport(key)}
                    title={`${vp.name} (${vp.width})`}
                  >
                    <IconComponent size={16} />
                  </button>
                );
              })}
            </div>
            
            <button 
              className="theme-toggle"
              onClick={() => setIsDark(!isDark)}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Navegación principal */}
      <nav className="main-nav">
        <div className="nav-container">
          <button 
            className={`nav-tab ${activeTab === 'ai-assistant' ? 'active' : ''}`}
            onClick={() => setActiveTab('ai-assistant')}
          >
            <Sparkles size={16} />
            <span>Asistente IA</span>
          </button>
          <button 
            className={`nav-tab ${activeTab === 'library' ? 'active' : ''}`}
            onClick={() => setActiveTab('library')}
          >
            <Code size={16} />
            <span>Librería</span>
          </button>
          <button 
            className={`nav-tab ${activeTab === 'editor' ? 'active' : ''}`}
            onClick={() => setActiveTab('editor')}
          >
            <FileText size={16} />
            <span>Editor</span>
          </button>
          <button 
            className={`nav-tab ${activeTab === 'preview' ? 'active' : ''}`}
            onClick={() => setActiveTab('preview')}
          >
            <Eye size={16} />
            <span>Preview</span>
          </button>
          <button 
            className={`nav-tab ${activeTab === 'design-system' ? 'active' : ''}`}
            onClick={() => setActiveTab('design-system')}
          >
            <Palette size={16} />
            <span>Sistema</span>
          </button>
        </div>
      </nav>

      {/* Contenido principal */}
      <main className="main-content">
        {/* Asistente IA */}
        {activeTab === 'ai-assistant' && (
          <div className="tab-content">
            <div className="section-header">
              <h2>🤖 Asistente de Componentes IA</h2>
              <p>Describe el componente que necesitas y lo generaré siguiendo tu design system</p>
            </div>

            <div className="ai-chat-container">
              <div className="ai-input-section">
                <div className="input-group">
                  <textarea
                    className="ai-prompt-input"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="Ej: Crea un card de producto con imagen, título, precio y botón de compra. Debe ser responsive y seguir el design system Anclora..."
                    rows={4}
                  />
                  <button 
                    className="btn btn-primary btn-generate"
                    onClick={generateComponent}
                    disabled={isGenerating || !aiPrompt.trim()}
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw size={16} className="spin" />
                        Generando...
                      </>
                    ) : (
                      <>
                        <Sparkles size={16} />
                        Generar Componente
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="ai-suggestions">
                <h3>💡 Sugerencias rápidas:</h3>
                <div className="suggestion-chips">
                  {[
                    'Dashboard con métricas y gráficos',
                    'Modal de confirmación elegante',
                    'Lista de productos e-commerce',
                    'Formulario de registro multi-step',
                    'Header con navegación responsive'
                  ].map((suggestion, index) => (
                    <button
                      key={index}
                      className="suggestion-chip"
                      onClick={() => setAiPrompt(suggestion)}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>

              {/* Historial de componentes generados */}
              {generatedComponents.length > 0 && (
                <div className="generated-history">
                  <h3>📚 Componentes Generados Recientemente</h3>
                  <div className="history-list">
                    {generatedComponents.slice(-5).reverse().map(component => (
                      <div key={component.id} className="history-item">
                        <div className="history-content">
                          <strong>{component.prompt}</strong>
                          <small>{component.timestamp.toLocaleTimeString()}</small>
                        </div>
                        <button 
                          className="btn btn-outline btn-sm"
                          onClick={() => setCode(component.code)}
                        >
                          Cargar
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Librería de Componentes */}
        {activeTab === 'library' && (
          <div className="tab-content">
            <div className="section-header">
              <h2>📚 Librería de Componentes</h2>
              <p>Componentes pre-construidos siguiendo tu design system</p>
            </div>

            <div className="component-library">
              {Object.entries(componentLibrary).map(([categoryKey, category]) => (
                <div key={categoryKey} className="library-section">
                  <h3>{category.name}</h3>
                  <div className="component-grid">
                    {Object.entries(category.components).map(([compKey, compCode]) => (
                      <div key={compKey} className="component-card">
                        <div className="component-preview">
                          <div 
                            className="mini-preview"
                            dangerouslySetInnerHTML={{ __html: compCode }}
                          />
                        </div>
                        <div className="component-info">
                          <h4>{compKey.charAt(0).toUpperCase() + compKey.slice(1)}</h4>
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => loadComponent(categoryKey, compKey)}
                          >
                            Usar Componente
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Editor */}
        {activeTab === 'editor' && (
          <div className="tab-content">
            <div className="section-header">
              <h2>✏️ Editor de Código</h2>
              <div className="header-actions">
                <select 
                  className="ds-select"
                  value={designSystem}
                  onChange={(e) => setDesignSystem(e.target.value)}
                >
                  {Object.entries(designSystems).map(([key, ds]) => (
                    <option key={key} value={key}>{ds.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="editor-container">
              <div className="editor-toolbar">
                <div className="toolbar-group">
                  <button className="btn-sm" onClick={() => setCode('')}>
                    <RefreshCw size={14} />
                    Limpiar
                  </button>
                  <button className="btn-sm" onClick={copyToClipboard}>
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    {copied ? 'Copiado!' : 'Copiar'}
                  </button>
                </div>
                <div className="toolbar-group">
                  <button className="btn-sm" onClick={shareComponent}>
                    <Share2 size={14} />
                    Compartir
                  </button>
                  <button className="btn-sm btn-primary">
                    <Download size={14} />
                    Exportar
                  </button>
                </div>
              </div>

              <div className="editor-layout">
                <textarea
                  className="code-editor"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Escribe o pega tu código HTML/JSX aquí..."
                  rows={20}
                />
                
                {/* Live validation panel */}
                <div className="validation-sidebar">
                  <h4>🔍 Validación en Vivo</h4>
                  <div className="validation-list">
                    {validationResults.map((result, index) => (
                      <div key={index} className={`validation-item ${result.type}`}>
                        {result.type === 'success' && <Check size={14} />}
                        {result.type === 'warning' && <AlertTriangle size={14} />}
                        {result.type === 'info' && <Zap size={14} />}
                        <span>{result.message}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Preview mejorado */}
        {activeTab === 'preview' && (
          <div className="tab-content">
            <div className="section-header">
              <h2>👁️ Vista Previa Interactiva</h2>
              <div className="preview-controls">
                <span className="viewport-info">
                  Viewport: {viewports[viewport].name} ({viewports[viewport].width})
                </span>
              </div>
            </div>

            <div className="preview-layout">
              <div className="preview-frame" style={{ maxWidth: viewports[viewport].width }}>
                {code ? (
                  <div 
                    className="rendered-component"
                    dangerouslySetInnerHTML={{ __html: code }}
                  />
                ) : (
                  <div className="preview-placeholder">
                    <Eye size={48} />
                    <p>Genera o selecciona un componente para ver la vista previa</p>
                    <div className="placeholder-actions">
                      <button 
                        className="btn btn-primary"
                        onClick={() => setActiveTab('ai-assistant')}
                      >
                        Generar con IA
                      </button>
                      <button 
                        className="btn btn-outline"
                        onClick={() => setActiveTab('library')}
                      >
                        Ver Librería
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="insights-panel">
                <h4>📊 Insights del Componente</h4>
                <div className="insight-metrics">
                  <div className="metric">
                    <span className="metric-label">Accesibilidad</span>
                    <span className="metric-value good">94%</span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Performance</span>
                    <span className="metric-value excellent">A+</span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Consistencia DS</span>
                    <span className="metric-value good">89%</span>
                  </div>
                </div>

                <div className="design-system-compliance">
                  <h5>✅ Compliance Design System</h5>
                  <div className="compliance-list">
                    <div className="compliance-item success">Colores primarios ✓</div>
                    <div className="compliance-item success">Tipografía ✓</div>
                    <div className="compliance-item success">Espaciado ✓</div>
                    <div className="compliance-item success">Border radius ✓</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Design System */}
        {activeTab === 'design-system' && (
          <div className="tab-content">
            <div className="section-header">
              <h2>🎨 Configuración del Design System</h2>
              <p>Personaliza y gestiona tu sistema de diseño</p>
            </div>

            <div className="ds-configuration">
              <div className="ds-selector">
                <h3>Sistema Activo</h3>
                <div className="ds-options-grid">
                  {Object.entries(designSystems).map(([key, ds]) => (
                    <div
                      key={key}
                      className={`ds-option-card ${designSystem === key ? 'active' : ''}`}
                      onClick={() => setDesignSystem(key)}
                    >
                      <div className="ds-colors-preview">
                        {ds.colors.map((color, index) => (
                          <div 
                            key={index}
                            className="color-dot"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      <div className="ds-info">
                        <h4>{ds.name}</h4>
                        <p>{ds.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="ds-upload">
                <h3>Importar Sistema Personalizado</h3>
                <div className="upload-options">
                  <div className="upload-card">
                    <Upload size={32} />
                    <h4>CSS Variables</h4>
                    <p>Sube tu archivo CSS con custom properties</p>
                    <button className="btn btn-outline">Seleccionar CSS</button>
                  </div>
                  <div className="upload-card">
                    <FileText size={32} />
                    <h4>Design Tokens</h4>
                    <p>Archivo JSON con tokens de diseño</p>
                    <button className="btn btn-outline">Seleccionar JSON</button>
                  </div>
                  <div className="upload-card">
                    <Palette size={32} />
                    <h4>Figma Plugin</h4>
                    <p>Conectar directamente con Figma</p>
                    <button className="btn btn-outline">Conectar</button>
                  </div>
                </div>
              </div>

              <div className="ds-preview-full">
                <h3>Vista Completa del Sistema</h3>
                <div className="system-preview">
                  <div className="color-system">
                    <h4>Paleta de Colores</h4>
                    <div className="color-palette-full">
                      {designSystems[designSystem].colors.map((color, index) => (
                        <div key={index} className="color-swatch">
                          <div 
                            className="color-display"
                            style={{ backgroundColor: color }}
                          />
                          <span className="color-code">{color}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="typography-system">
                    <h4>Sistema Tipográfico</h4>
                    <div className="type-scale">
                      <div className="type-sample" style={{ fontSize: '2rem' }}>Heading 1</div>
                      <div className="type-sample" style={{ fontSize: '1.5rem' }}>Heading 2</div>
                      <div className="type-sample" style={{ fontSize: '1.25rem' }}>Heading 3</div>
                      <div className="type-sample" style={{ fontSize: '1rem' }}>Body Text</div>
                      <div className="type-sample" style={{ fontSize: '0.875rem' }}>Small Text</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modal de compartir */}
      {showShareModal && (
        <div className="modal-overlay" onClick={() => setShowShareModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Compartir Componente</h3>
              <button 
                className="modal-close"
                onClick={() => setShowShareModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-content">
              <div className="share-option">
                <h4>Enlace Directo</h4>
                <div className="share-input">
                  <input 
                    type="text" 
                    value="https://render.anclora.com/share/abc123"
                    readOnly
                  />
                  <button className="btn btn-primary btn-sm">Copiar</button>
                </div>
              </div>
              <div className="share-option">
                <h4>Código Embed</h4>
                <div className="share-input">
                  <input 
                    type="text" 
                    value='<iframe src="https://render.anclora.com/embed/abc123" width="100%" height="400"></iframe>'
                    readOnly
                  />
                  <button className="btn btn-primary btn-sm">Copiar</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Estilos mejorados */}
      <style jsx>{`
        /* Variables de tema actualizadas */
        .app.light {
          --bg-primary: #FFFFFF;
          --bg-secondary: #F8FAFC;
          --bg-tertiary: #E2E8F0;
          --text-primary: #0F172A;
          --text-secondary: #334155;
          --text-muted: #64748B;
          --border: #E2E8F0;
          --shadow: rgba(0, 0, 0, 0.1);
          --success: #22C55E;
          --warning: #F59E0B;
          --error: #EF4444;
          --info: #3B82F6;
        }

        .app.dark {
          --bg-primary: #0D1117;
          --bg-secondary: #161B22;
          --bg-tertiary: #21262D;
          --text-primary: #F8FAFC;
          --text-secondary: #E2E8F0;
          --text-muted: #94A3B8;
          --border: #30363D;
          --shadow: rgba(0, 0, 0, 0.3);
          --success: #16A34A;
          --warning: #D97706;
          --error: #DC2626;
          --info: #2563EB;
        }

        :root {
          --brand-700: #213A57;
          --brand-600: #0B6477;
          --brand-500: #14919B;
          --brand-400: #0AD1C8;
          --brand-300: #45DFB1;
          --brand-200: #80ED99;
          --grad-ocean: linear-gradient(120deg, #80ED99 0%, #45DFB1 22%, #0AD1C8 45%, #14919B 65%, #0B6477 82%, #213A57 100%);
        }

        .app {
          min-height: 100vh;
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          background: var(--bg-primary);
          color: var(--text-primary);
          display: flex;
          flex-direction: column;
          transition: all 0.3s ease;
        }

        /* Header mejorado */
        .header {
          background: var(--bg-secondary);
          border-bottom: 1px solid var(--border);
          padding: 1rem 1.5rem;
          position: sticky;
          top: 0;
          z-index: 100;
          backdrop-filter: blur(8px);
        }

        .header-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          max-width: 1400px;
          margin: 0 auto;
        }

        .logo-section {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .anclora-icon {
          width: 48px;
          height: 48px;
          background: var(--grad-ocean);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(10, 209, 200, 0.3);
        }

        .icon-a {
          color: white;
          font-weight: 700;
          font-size: 1.5rem;
          font-family: 'Space Grotesk', sans-serif;
        }

        .brand-text h1 {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 700;
          font-family: 'Space Grotesk', sans-serif;
          background: var(--grad-ocean);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .tagline {
          font-size: 0.8rem;
          color: var(--text-muted);
          display: block;
          margin-top: -2px;
          font-weight: 500;
        }

        .header-controls {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .viewport-selector {
          display: flex;
          gap: 4px;
          background: var(--bg-tertiary);
          padding: 4px;
          border-radius: 8px;
        }

        .viewport-btn {
          padding: 8px;
          background: none;
          border: none;
          border-radius: 6px;
          color: var(--text-muted);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .viewport-btn:hover,
        .viewport-btn.active {
          background: var(--brand-400);
          color: white;
          transform: translateY(-1px);
        }

        .theme-toggle {
          background: var(--bg-tertiary);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 10px;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .theme-toggle:hover {
          background: var(--brand-400);
          color: white;
          transform: translateY(-1px);
        }

        /* Navegación mejorada */
        .main-nav {
          background: var(--bg-secondary);
          border-bottom: 1px solid var(--border);
          padding: 0 1.5rem;
          overflow-x: auto;
        }

        .nav-container {
          display: flex;
          max-width: 1400px;
          margin: 0 auto;
          gap: 1rem;
          min-width: max-content;
        }

        .nav-tab {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 1.5rem;
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          border-radius: 12px 12px 0 0;
          transition: all 0.2s ease;
          font-size: 0.9rem;
          font-weight: 500;
          border-bottom: 3px solid transparent;
          white-space: nowrap;
        }

        .nav-tab:hover {
          background: var(--bg-tertiary);
          color: var(--text-primary);
          transform: translateY(-1px);
        }

        .nav-tab.active {
          background: var(--bg-primary);
          color: var(--brand-600);
          border-bottom-color: var(--brand-400);
          box-shadow: 0 4px 12px var(--shadow);
        }

        /* Contenido principal */
        .main-content {
          flex: 1;
          padding: 2rem 1.5rem;
          max-width: 1400px;
          margin: 0 auto;
          width: 100%;
          box-sizing: border-box;
        }

        .tab-content {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .section-header {
          text-align: center;
          margin-bottom: 1.5rem;
        }

        .section-header h2 {
          margin: 0 0 0.5rem 0;
          font-size: 2rem;
          font-weight: 700;
          font-family: 'Space Grotesk', sans-serif;
        }

        .section-header p {
          margin: 0;
          color: var(--text-muted);
          font-size: 1.1rem;
        }

        /* Asistente IA */
        .ai-chat-container {
          max-width: 800px;
          margin: 0 auto;
        }

        .ai-input-section {
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 1.5rem;
          margin-bottom: 2rem;
          box-shadow: 0 4px 12px var(--shadow);
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .ai-prompt-input {
          width: 100%;
          padding: 1rem;
          border: 1px solid var(--border);
          border-radius: 12px;
          background: var(--bg-primary);
          color: var(--text-primary);
          font-family: inherit;
          font-size: 1rem;
          line-height: 1.5;
          resize: vertical;
          min-height: 120px;
        }

        .ai-prompt-input:focus {
          outline: 2px solid var(--brand-400);
          border-color: var(--brand-400);
        }

        .btn-generate {
          align-self: flex-end;
          padding: 1rem 2rem;
          font-size: 1rem;
          font-weight: 600;
          border-radius: 12px;
          background: var(--grad-ocean);
          border: none;
          color: white;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px rgba(10, 209, 200, 0.3);
        }

        .btn-generate:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(10, 209, 200, 0.4);
        }

        .btn-generate:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .ai-suggestions {
          margin-bottom: 2rem;
        }

        .ai-suggestions h3 {
          margin-bottom: 1rem;
          font-size: 1.2rem;
          font-weight: 600;
        }

        .suggestion-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .suggestion-chip {
          padding: 0.75rem 1rem;
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 0.9rem;
          white-space: nowrap;
        }

        .suggestion-chip:hover {
          background: var(--brand-400);
          color: white;
          border-color: var(--brand-400);
          transform: translateY(-1px);
        }

        .generated-history {
          background: var(--bg-secondary);
          border-radius: 12px;
          padding: 1.5rem;
        }

        .generated-history h3 {
          margin: 0 0 1rem 0;
          font-size: 1.2rem;
          font-weight: 600;
        }

        .history-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .history-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: var(--bg-primary);
          border-radius: 8px;
          border: 1px solid var(--border);
        }

        .history-content strong {
          display: block;
          margin-bottom: 0.25rem;
        }

        .history-content small {
          color: var(--text-muted);
        }

        /* Librería de componentes */
        .component-library {
          display: flex;
          flex-direction: column;
          gap: 3rem;
        }

        .library-section h3 {
          margin: 0 0 1.5rem 0;
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--brand-600);
        }

        .component-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        .component-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.2s ease;
          box-shadow: 0 2px 8px var(--shadow);
        }

        .component-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px var(--shadow);
          border-color: var(--brand-400);
        }

        .component-preview {
          background: var(--bg-primary);
          padding: 1.5rem;
          border-bottom: 1px solid var(--border);
          min-height: 120px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .mini-preview {
          transform: scale(0.8);
          pointer-events: none;
        }

        .component-info {
          padding: 1rem 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .component-info h4 {
          margin: 0;
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        /* Editor mejorado */
        .header-actions {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .ds-select {
          padding: 0.75rem 1rem;
          border: 1px solid var(--border);
          border-radius: 8px;
          background: var(--bg-secondary);
          color: var(--text-primary);
          font-size: 0.9rem;
          min-width: 180px;
        }

        .editor-container {
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 12px var(--shadow);
        }

        .editor-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.5rem;
          background: var(--bg-tertiary);
          border-bottom: 1px solid var(--border);
        }

        .toolbar-group {
          display: flex;
          gap: 0.75rem;
        }

        .editor-layout {
          display: grid;
          grid-template-columns: 1fr 300px;
          min-height: 500px;
        }

        @media (max-width: 1024px) {
          .editor-layout {
            grid-template-columns: 1fr;
          }
          
          .validation-sidebar {
            border-top: 1px solid var(--border);
            border-left: none;
          }
        }

        .code-editor {
          width: 100%;
          min-height: 500px;
          padding: 1.5rem;
          border: none;
          background: var(--bg-primary);
          color: var(--text-primary);
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 0.9rem;
          line-height: 1.6;
          resize: none;
          border-right: 1px solid var(--border);
        }

        .code-editor:focus {
          outline: none;
        }

        .validation-sidebar {
          background: var(--bg-tertiary);
          padding: 1.5rem;
          border-left: 1px solid var(--border);
          overflow-y: auto;
        }

        .validation-sidebar h4 {
          margin: 0 0 1rem 0;
          font-size: 1rem;
          font-weight: 600;
        }

        .validation-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .validation-item {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          padding: 0.75rem;
          border-radius: 8px;
          font-size: 0.9rem;
          line-height: 1.4;
        }

        .validation-item.success {
          background: rgba(34, 197, 94, 0.1);
          color: var(--success);
        }

        .validation-item.warning {
          background: rgba(251, 191, 36, 0.1);
          color: var(--warning);
        }

        .validation-item.info {
          background: rgba(59, 130, 246, 0.1);
          color: var(--info);
        }

        /* Preview mejorado */
        .preview-controls {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 1rem;
        }

        .viewport-info {
          background: var(--bg-secondary);
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.9rem;
          color: var(--text-muted);
        }

        .preview-layout {
          display: grid;
          grid-template-columns: 1fr 350px;
          gap: 2rem;
          align-items: start;
        }

        @media (max-width: 1200px) {
          .preview-layout {
            grid-template-columns: 1fr;
          }
        }

        .preview-frame {
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 16px;
          min-height: 500px;
          overflow: auto;
          position: relative;
          box-shadow: 0 4px 12px var(--shadow);
          margin: 0 auto;
        }

        .rendered-component {
          padding: 2rem;
        }

        .preview-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 500px;
          color: var(--text-muted);
          text-align: center;
          padding: 2rem;
        }

        .preview-placeholder p {
          margin: 1rem 0 2rem 0;
          font-size: 1.1rem;
        }

        .placeholder-actions {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          justify-content: center;
        }

        .insights-panel {
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 4px 12px var(--shadow);
          position: sticky;
          top: 2rem;
        }

        .insights-panel h4 {
          margin: 0 0 1.5rem 0;
          font-size: 1.2rem;
          font-weight: 600;
        }

        .insight-metrics {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .metric {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem;
          background: var(--bg-primary);
          border-radius: 8px;
          border: 1px solid var(--border);
        }

        .metric-label {
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        .metric-value {
          font-weight: 600;
          font-size: 1rem;
        }

        .metric-value.excellent { color: var(--success); }
        .metric-value.good { color: var(--brand-400); }
        .metric-value.warning { color: var(--warning); }

        .design-system-compliance h5 {
          margin: 0 0 1rem 0;
          font-size: 1rem;
          font-weight: 600;
        }

        .compliance-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .compliance-item {
          padding: 0.5rem;
          border-radius: 6px;
          font-size: 0.9rem;
        }

        .compliance-item.success {
          background: rgba(34, 197, 94, 0.1);
          color: var(--success);
        }

        /* Design System Config */
        .ds-configuration {
          display: flex;
          flex-direction: column;
          gap: 3rem;
        }

        .ds-options-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .ds-option-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 1.5rem;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 2px 8px var(--shadow);
        }

        .ds-option-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px var(--shadow);
        }

        .ds-option-card.active {
          border-color: var(--brand-400);
          background: linear-gradient(135deg, rgba(10, 209, 200, 0.1), rgba(69, 223, 177, 0.05));
        }

        .ds-colors-preview {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .color-dot {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .ds-info h4 {
          margin: 0 0 0.5rem 0;
          font-size: 1.1rem;
          font-weight: 600;
        }

        .ds-info p {
          margin: 0;
          color: var(--text-muted);
          font-size: 0.9rem;
        }

        .upload-options {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .upload-card {
          background: var(--bg-secondary);
          border: 2px dashed var(--border);
          border-radius: 12px;
          padding: 2rem;
          text-align: center;
          transition: all 0.2s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .upload-card:hover {
          border-color: var(--brand-400);
          background: rgba(10, 209, 200, 0.05);
        }

        .upload-card h4 {
          margin: 0;
          font-size: 1.1rem;
          font-weight: 600;
        }

        .upload-card p {
          margin: 0;
          color: var(--text-muted);
          font-size: 0.9rem;
        }

        .system-preview {
          background: var(--bg-secondary);
          border-radius: 12px;
          padding: 2rem;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
        }

        @media (max-width: 768px) {
          .system-preview {
            grid-template-columns: 1fr;
          }
        }

        .color-palette-full {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 1rem;
        }

        .color-swatch {
          text-align: center;
        }

        .color-display {
          width: 100%;
          height: 60px;
          border-radius: 8px;
          margin-bottom: 0.5rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .color-code {
          font-size: 0.8rem;
          font-weight: 500;
          font-family: monospace;
          color: var(--text-muted);
        }

        .type-scale {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .type-sample {
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          color: var(--text-primary);
        }

        /* Botones mejorados */
        .btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 500;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid transparent;
          text-decoration: none;
          justify-content: center;
        }

        .btn-sm {
          padding: 0.5rem 1rem;
          font-size: 0.85rem;
        }

        .btn-full {
          width: 100%;
        }

        .btn-primary {
          background: var(--brand-600);
          color: white;
          border-color: var(--brand-600);
        }

        .btn-primary:hover {
          background: var(--brand-500);
          border-color: var(--brand-500);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(11, 100, 119, 0.3);
        }

        .btn-outline {
          background: transparent;
          color: var(--brand-600);
          border-color: var(--brand-400);
        }

        .btn-outline:hover {
          background: var(--brand-400);
          color: white;
          transform: translateY(-1px);
        }

        .btn-link {
          background: none;
          border: none;
          color: var(--brand-600);
          padding: 0.5rem;
        }

        .btn-link:hover {
          text-decoration: underline;
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          backdrop-filter: blur(4px);
        }

        .modal {
          background: var(--bg-primary);
          border: 1px solid var(--border);
          border-radius: 16px;
          max-width: 500px;
          width: 90%;
          max-height: 80vh;
          overflow-y: auto;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 1px solid var(--border);
        }

        .modal-header h3 {
          margin: 0;
          font-size: 1.3rem;
          font-weight: 600;
        }

        .modal-close {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: var(--text-muted);
          padding: 0.5rem;
          border-radius: 4px;
        }

        .modal-close:hover {
          background: var(--bg-tertiary);
        }

        .modal-content {
          padding: 1.5rem;
        }

        .share-option {
          margin-bottom: 2rem;
        }

        .share-option h4 {
          margin: 0 0 0.75rem 0;
          font-size: 1rem;
          font-weight: 600;
        }

        .share-input {
          display: flex;
          gap: 0.75rem;
        }

        .share-input input {
          flex: 1;
          padding: 0.75rem;
          border: 1px solid var(--border);
          border-radius: 6px;
          background: var(--bg-secondary);
          color: var(--text-primary);
          font-size: 0.85rem;
        }

        /* Estilos de componentes renderizados */
        .rendered-component .btn {
          background: var(--brand-600);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .rendered-component .btn-primary {
          background: var(--brand-600);
        }

        .rendered-component .btn-secondary {
          background: var(--brand-300);
          color: #053b34;
        }

        .rendered-component .btn-outline {
          background: transparent;
          color: var(--brand-600);
          border: 1px solid var(--brand-400);
        }

        .rendered-component .card {
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 2px 8px var(--shadow);
        }

        .rendered-component .form-container {
          max-width: 400px;
        }

        .rendered-component .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .rendered-component .field-group {
          margin-bottom: 1rem;
        }

        .rendered-component .field-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: var(--text-secondary);
        }

        .rendered-component .field-group input,
        .rendered-component .field-group textarea {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid var(--border);
          border-radius: 6px;
          background: var(--bg-primary);
          color: var(--text-primary);
          font-family: inherit;
        }

        .rendered-component .field-group input:focus,
        .rendered-component .field-group textarea:focus {
          outline: 2px solid var(--brand-400);
          border-color: var(--brand-400);
        }

        .rendered-component .navbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.5rem;
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 12px;
        }

        .rendered-component .navbar-brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-weight: 600;
          font-size: 1.1rem;
        }

        .rendered-component .brand-icon {
          width: 32px;
          height: 32px;
          background: var(--grad-ocean);
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
        }

        .rendered-component .navbar-menu {
          display: flex;
          gap: 1.5rem;
        }

        .rendered-component .nav-link {
          color: var(--text-secondary);
          text-decoration: none;
          font-weight: 500;
          padding: 0.5rem;
          border-radius: 6px;
          transition: all 0.2s ease;
        }

        .rendered-component .nav-link:hover,
        .rendered-component .nav-link.active {
          color: var(--brand-600);
          background: rgba(10, 209, 200, 0.1);
        }

        /* Animaciones */
        .spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Responsive design */
        @media (max-width: 768px) {
          .header-content {
            flex-direction: column;
            gap: 1rem;
          }

          .nav-tab span {
            display: none;
          }

          .main-content {
            padding: 1rem;
          }

          .section-header {
            text-align: left;
          }

          .section-header h2 {
            font-size: 1.5rem;
          }

          .ai-input-section {
            padding: 1rem;
          }

          .btn-generate {
            width: 100%;
          }

          .suggestion-chips {
            justify-content: center;
          }

          .component-grid {
            grid-template-columns: 1fr;
          }

          .ds-options-grid {
            grid-template-columns: 1fr;
          }

          .upload-options {
            grid-template-columns: 1fr;
          }
        }

        /* Accesibilidad */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        .app *:focus-visible {
          outline: 2px solid var(--brand-400);
          outline-offset: 2px;
        }

        /* Contraste alto para texto */
        @media (prefers-contrast: high) {
          .app.light {
            --text-primary: #000000;
            --text-secondary: #1a1a1a;
            --border: #666666;
          }
          
          .app.dark {
            --text-primary: #ffffff;
            --text-secondary: #e6e6e6;
            --border: #999999;
          }
        }
      `}</style>
    </div>
  );
};

export default AncloraRenderAdvanced;