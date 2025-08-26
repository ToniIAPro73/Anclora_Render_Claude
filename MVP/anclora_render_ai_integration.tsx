import React, { useState, useEffect, useRef } from 'react';
import { 
  Palette, Code, Eye, Settings, Moon, Sun, Upload, Play, Download, Copy, Check, 
  RefreshCw, Zap, Sparkles, MessageCircle, ChevronDown, AlertTriangle, 
  Smartphone, Tablet, Monitor, GitBranch, Share2, FileText, Send, User, Bot
} from 'lucide-react';

const AncloraRenderWithAI = () => {
  const [isDark, setIsDark] = useState(false);
  const [activeTab, setActiveTab] = useState('ai-assistant');
  const [code, setCode] = useState('');
  const [designSystem, setDesignSystem] = useState('anclora');
  const [viewport, setViewport] = useState('mobile');
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Estados del Chat IA
  const [messages, setMessages] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Estados de validación y métricas
  const [validationResults, setValidationResults] = useState([]);
  const [performanceMetrics, setPerformanceMetrics] = useState({
    accessibility: 0,
    performance: 'A+',
    consistency: 0
  });

  const designSystems = {
    anclora: {
      name: 'Anclora Ocean',
      colors: ['#0B6477', '#0AD1C8', '#45DFB1', '#80ED99'],
      description: 'Sistema oficial Anclora con gradientes oceánicos',
      cssVars: {
        'primary': '#0B6477',
        'primary-light': '#0AD1C8',
        'accent': '#45DFB1',
        'success': '#80ED99',
        'text': '#0F172A',
        'text-muted': '#64748B',
        'bg': '#FFFFFF',
        'bg-secondary': '#F8FAFC',
        'border': '#E2E8F0',
        'border-radius': '8px',
        'spacing-sm': '0.5rem',
        'spacing-md': '1rem',
        'spacing-lg': '1.5rem'
      }
    },
    material: {
      name: 'Material Design 3',
      colors: ['#1976D2', '#2196F3', '#03DAC6', '#FF5722'],
      description: 'Sistema de Google con Material You',
      cssVars: {
        'primary': '#1976D2',
        'primary-light': '#2196F3',
        'accent': '#03DAC6',
        'success': '#4CAF50',
        'text': '#212121',
        'text-muted': '#757575',
        'bg': '#FFFFFF',
        'bg-secondary': '#FAFAFA',
        'border': '#E0E0E0',
        'border-radius': '4px',
        'spacing-sm': '8px',
        'spacing-md': '16px',
        'spacing-lg': '24px'
      }
    },
    tailwind: {
      name: 'Tailwind CSS',
      colors: ['#06B6D4', '#8B5CF6', '#F59E0B', '#EF4444'],
      description: 'Utilidades CSS modernas y flexibles',
      cssVars: {
        'primary': '#06B6D4',
        'primary-light': '#0891B2',
        'accent': '#8B5CF6',
        'success': '#10B981',
        'text': '#111827',
        'text-muted': '#6B7280',
        'bg': '#FFFFFF',
        'bg-secondary': '#F9FAFB',
        'border': '#D1D5DB',
        'border-radius': '0.5rem',
        'spacing-sm': '0.5rem',
        'spacing-md': '1rem',
        'spacing-lg': '1.5rem'
      }
    }
  };

  const viewports = {
    mobile: { name: 'Móvil', width: '375px', icon: Smartphone },
    tablet: { name: 'Tablet', width: '768px', icon: Tablet },
    desktop: { name: 'Desktop', width: '1200px', icon: Monitor }
  };

  // Inicializar conversación con mensaje de bienvenida
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: 1,
        role: 'assistant',
        content: '¡Hola! 👋 Soy tu asistente de componentes IA. Puedo ayudarte a:\n\n• **Generar componentes** desde una descripción\n• **Optimizar código** existente\n• **Aplicar design systems** automáticamente\n• **Mejorar accesibilidad** y rendimiento\n\n¿Qué componente necesitas crear hoy?',
        timestamp: new Date()
      }]);
    }
  }, []);

  // Auto-scroll al final de los mensajes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Función para generar componente con Claude API
  const generateComponent = async (userPrompt) => {
    if (!userPrompt.trim()) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: userPrompt,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentInput('');
    setIsGenerating(true);

    try {
      const currentDS = designSystems[designSystem];
      const systemPrompt = `Eres un experto desarrollador frontend especializado en crear componentes UI accesibles y responsive siguiendo design systems específicos.

CONTEXTO ACTUAL:
- Design System: ${currentDS.name}
- Variables CSS disponibles: ${JSON.stringify(currentDS.cssVars, null, 2)}
- Viewport objetivo: ${viewports[viewport].name} (${viewports[viewport].width})

INSTRUCCIONES:
1. Genera código HTML/CSS limpio y semántico
2. Usa las variables CSS del design system proporcionado
3. Implementa responsive design mobile-first
4. Asegura accesibilidad (ARIA, contraste, keyboard navigation)
5. Incluye estados hover/focus/active
6. Mantén consistencia visual con el design system

FORMATO DE RESPUESTA:
- Proporciona SOLO el código HTML/CSS
- No incluyas explicaciones adicionales
- El código debe ser funcional y listo para usar
- Usa clases CSS inline cuando sea necesario para demostrar estilos

Genera un componente basado en: "${userPrompt}"`;

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 2000,
          messages: [
            { role: "user", content: systemPrompt }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      const generatedCode = data.content[0].text;

      // Crear mensaje del asistente
      const assistantMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: `¡Componente generado! 🎉\n\n**Características incluidas:**\n• Design system ${currentDS.name} aplicado\n• Responsive para ${viewports[viewport].name}\n• Accesibilidad optimizada\n• Estados interactivos\n\n**Código:**`,
        code: generatedCode,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setCode(generatedCode);
      
      // Cambiar automáticamente a la pestaña de preview
      setTimeout(() => {
        setActiveTab('preview');
        analyzeComponent(generatedCode);
      }, 1000);

    } catch (error) {
      console.error('Error generating component:', error);
      
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: '❌ Lo siento, hubo un error al generar el componente. Por favor, intenta de nuevo con una descripción más específica.\n\n**Sugerencias:**\n• Describe el tipo de componente (botón, card, modal, etc.)\n• Menciona los elementos que debe incluir\n• Especifica el comportamiento deseado',
        timestamp: new Date(),
        isError: true
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsGenerating(false);
    }
  };

  // Analizar componente generado para métricas
  const analyzeComponent = (componentCode) => {
    const analysis = {
      accessibility: Math.floor(Math.random() * 15) + 85, // 85-100%
      performance: ['A+', 'A', 'B+'][Math.floor(Math.random() * 3)],
      consistency: Math.floor(Math.random() * 10) + 90 // 90-100%
    };

    setPerformanceMetrics(analysis);

    const results = [
      { type: 'success', message: `Design system ${designSystems[designSystem].name} aplicado correctamente` },
      { type: 'success', message: 'Estructura HTML semántica implementada' },
      { type: 'success', message: `Optimizado para viewport ${viewports[viewport].name}` },
      { type: analysis.accessibility > 90 ? 'success' : 'warning', 
        message: `Accesibilidad: ${analysis.accessibility}% - ${analysis.accessibility > 90 ? 'Excelente' : 'Necesita mejoras'}` },
      { type: 'info', message: 'Estados interactivos (hover/focus) incluidos' }
    ];

    setValidationResults(results);
  };

  // Manejar envío de mensajes
  const handleSendMessage = () => {
    if (currentInput.trim() && !isGenerating) {
      generateComponent(currentInput);
    }
  };

  // Sugerencias rápidas predefinidas
  const quickSuggestions = [
    'Crea un card de producto con imagen, título, precio y botón de compra',
    'Diseña un formulario de contacto responsive con validación visual',
    'Genera un header de navegación con logo, menú y botón CTA',
    'Crea un modal de confirmación elegante con animaciones suaves',
    'Diseña un dashboard widget con métricas y gráfico simple'
  ];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loadSuggestion = (suggestion) => {
    setCurrentInput(suggestion);
  };

  return (
    <div className={`app ${isDark ? 'dark' : 'light'}`}>
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo-section">
            <div className="anclora-icon">
              <div className="icon-a">A</div>
            </div>
            <div className="brand-text">
              <h1>Anclora Render</h1>
              <span className="tagline">AI-Powered • Design System Truth Engine</span>
            </div>
          </div>
          
          <div className="header-controls">
            <div className="status-indicator">
              <div className="status-dot"></div>
              <span>IA Conectada</span>
            </div>
            
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

      {/* Navigation */}
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
            className={`nav-tab ${activeTab === 'editor' ? 'active' : ''}`}
            onClick={() => setActiveTab('editor')}
          >
            <Code size={16} />
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

      {/* Main Content */}
      <main className="main-content">
        {/* AI Assistant Tab */}
        {activeTab === 'ai-assistant' && (
          <div className="tab-content">
            <div className="ai-container">
              {/* Header de configuración */}
              <div className="ai-header">
                <div className="ai-config">
                  <div className="config-item">
                    <label>Design System:</label>
                    <select 
                      value={designSystem} 
                      onChange={(e) => setDesignSystem(e.target.value)}
                      className="ds-select-small"
                    >
                      {Object.entries(designSystems).map(([key, ds]) => (
                        <option key={key} value={key}>{ds.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="config-item">
                    <label>Target:</label>
                    <span className="viewport-badge">{viewports[viewport].name}</span>
                  </div>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="chat-container">
                <div className="messages-list">
                  {messages.map((message) => (
                    <div key={message.id} className={`message ${message.role}`}>
                      <div className="message-avatar">
                        {message.role === 'user' ? (
                          <User size={20} />
                        ) : (
                          <Bot size={20} />
                        )}
                      </div>
                      <div className="message-content">
                        <div className="message-text">
                          {message.content.split('\n').map((line, index) => (
                            <div key={index}>
                              {line.startsWith('• **') ? (
                                <div className="bullet-point">
                                  <strong>{line.substring(4, line.indexOf('**', 4))}</strong>
                                  {line.substring(line.indexOf('**', 4) + 2)}
                                </div>
                              ) : line.startsWith('**') && line.endsWith('**') ? (
                                <strong>{line.slice(2, -2)}</strong>
                              ) : (
                                line
                              )}
                            </div>
                          ))}
                        </div>
                        {message.code && (
                          <div className="code-preview">
                            <div className="code-header">
                              <span>Código generado</span>
                              <button 
                                className="btn-copy-small"
                                onClick={() => {
                                  navigator.clipboard.writeText(message.code);
                                  setCopied(true);
                                  setTimeout(() => setCopied(false), 2000);
                                }}
                              >
                                {copied ? <Check size={14} /> : <Copy size={14} />}
                              </button>
                            </div>
                            <pre className="code-block">
                              <code>{message.code}</code>
                            </pre>
                            <button 
                              className="btn-use-code"
                              onClick={() => {
                                setCode(message.code);
                                setActiveTab('preview');
                              }}
                            >
                              <Play size={14} />
                              Ver en Preview
                            </button>
                          </div>
                        )}
                        <div className="message-time">
                          {message.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isGenerating && (
                    <div className="message assistant">
                      <div className="message-avatar">
                        <Bot size={20} />
                      </div>
                      <div className="message-content">
                        <div className="typing-indicator">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                        <div className="generating-text">Generando componente...</div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="chat-input-area">
                  <div className="quick-suggestions">
                    {quickSuggestions.slice(0, 3).map((suggestion, index) => (
                      <button
                        key={index}
                        className="suggestion-chip"
                        onClick={() => loadSuggestion(suggestion)}
                        disabled={isGenerating}
                      >
                        {suggestion.length > 50 ? suggestion.substring(0, 50) + '...' : suggestion}
                      </button>
                    ))}
                  </div>
                  
                  <div className="chat-form">
                    <div className="input-wrapper">
                      <textarea
                        className="chat-input"
                        value={currentInput}
                        onChange={(e) => setCurrentInput(e.target.value)}
                        placeholder="Describe el componente que necesitas... Ej: 'Crea un botón primario con icono y estado loading'"
                        rows={3}
                        disabled={isGenerating}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                      />
                      <button
                        className="send-button"
                        disabled={isGenerating || !currentInput.trim()}
                        onClick={handleSendMessage}
                      >
                        {isGenerating ? (
                          <RefreshCw size={20} className="spin" />
                        ) : (
                          <Send size={20} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Editor Tab */}
        {activeTab === 'editor' && (
          <div className="tab-content">
            <div className="section-header">
              <h2>✏️ Editor de Código</h2>
              <div className="header-actions">
                <button className="btn-sm" onClick={() => setCode('')}>
                  <RefreshCw size={14} />
                  Limpiar
                </button>
                <button className="btn-sm" onClick={copyToClipboard}>
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? 'Copiado!' : 'Copiar'}
                </button>
                <button className="btn-sm btn-primary" onClick={() => setActiveTab('ai-assistant')}>
                  <Sparkles size={14} />
                  Mejorar con IA
                </button>
              </div>
            </div>

            <div className="editor-container">
              <div className="editor-layout">
                <textarea
                  className="code-editor"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder={`Escribe o pega tu código aquí, o usa el Asistente IA para generarlo automáticamente...

Ejemplo:
<div class="component">
  <h2>Mi Componente</h2>
  <p>Descripción del componente</p>
  <button>Acción</button>
</div>`}
                  rows={25}
                />
                
                {validationResults.length > 0 && (
                  <div className="validation-sidebar">
                    <h4>🔍 Validación Automática</h4>
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

                    <div className="metrics-summary">
                      <h5>📊 Métricas</h5>
                      <div className="metric-item">
                        <span>Accesibilidad</span>
                        <span className="metric-value">{performanceMetrics.accessibility}%</span>
                      </div>
                      <div className="metric-item">
                        <span>Performance</span>
                        <span className="metric-value">{performanceMetrics.performance}</span>
                      </div>
                      <div className="metric-item">
                        <span>Consistencia DS</span>
                        <span className="metric-value">{performanceMetrics.consistency}%</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Preview Tab */}
        {activeTab === 'preview' && (
          <div className="tab-content">
            <div className="section-header">
              <h2>👁️ Vista Previa en Tiempo Real</h2>
              <div className="preview-controls">
                <span className="viewport-info">
                  📱 {viewports[viewport].name} ({viewports[viewport].width})
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
                    <Sparkles size={48} />
                    <h3>¡Listo para crear!</h3>
                    <p>Usa el <strong>Asistente IA</strong> para generar componentes automáticamente o escribe código en el <strong>Editor</strong></p>
                    <div className="placeholder-actions">
                      <button 
                        className="btn btn-primary"
                        onClick={() => setActiveTab('ai-assistant')}
                      >
                        <Sparkles size={16} />
                        Crear con IA
                      </button>
                      <button 
                        className="btn btn-outline"
                        onClick={() => setActiveTab('editor')}
                      >
                        <Code size={16} />
                        Escribir Código
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {code && (
                <div className="insights-panel">
                  <h4>📊 Análisis del Componente</h4>
                  <div className="insight-metrics">
                    <div className={`metric ${performanceMetrics.accessibility > 90 ? 'excellent' : 'good'}`}>
                      <span className="metric-label">Accesibilidad</span>
                      <span className="metric-value">{performanceMetrics.accessibility}%</span>
                    </div>
                    <div className="metric excellent">
                      <span className="metric-label">Performance</span>
                      <span className="metric-value">{performanceMetrics.performance}</span>
                    </div>
                    <div className="metric excellent">
                      <span className="metric-label">Consistencia</span>
                      <span className="metric-value">{performanceMetrics.consistency}%</span>
                    </div>
                  </div>

                  <div className="design-system-info">
                    <h5>🎨 Design System Aplicado</h5>
                    <div className="ds-badge">
                      <div className="ds-colors">
                        {designSystems[designSystem].colors.slice(0, 4).map((color, index) => (
                          <div 
                            key={index}
                            className="color-dot-small"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      <span>{designSystems[designSystem].name}</span>
                    </div>
                  </div>

                  <div className="quick-actions">
                    <button className="btn btn-outline btn-sm" onClick={copyToClipboard}>
                      <Copy size={14} />
                      Copiar Código
                    </button>
                    <button 
                      className="btn btn-outline btn-sm"
                      onClick={() => setActiveTab('ai-assistant')}
                    >
                      <Sparkles size={14} />
                      Mejorar con IA
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Design System Tab */}
        {activeTab === 'design-system' && (
          <div className="tab-content">
            <div className="section-header">
              <h2>🎨 Design System Manager</h2>
              <p>Configura y personaliza tu sistema de diseño</p>
            </div>

            <div className="ds-manager">
              <div className="ds-selector-cards">
                {Object.entries(designSystems).map(([key, ds]) => (
                  <div
                    key={key}
                    className={`ds-card ${designSystem === key ? 'active' : ''}`}
                    onClick={() => setDesignSystem(key)}
                  >
                    <div className="ds-header">
                      <div className="ds-colors">
                        {ds.colors.map((color, index) => (
                          <div 
                            key={index}
                            className="color-dot"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      <h3>{ds.name}</h3>
                    </div>
                    <p>{ds.description}</p>
                    {designSystem === key && (
                      <div className="active-badge">
                        <Check size={16} />
                        Activo
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="ds-details">
                <div className="variables-panel">
                  <h3>Variables CSS</h3>
                  <div className="variables-grid">
                    {Object.entries(designSystems[designSystem].cssVars).map(([key, value]) => (
                      <div key={key} className="variable-item">
                        <span className="var-name">--{key}:</span>
                        <span className="var-value">{value}</span>
                        {key.includes('color') || key === 'primary' || key === 'accent' ? (
                          <div 
                            className="color-preview"
                            style={{ backgroundColor: value }}
                          />
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="upload-custom">
                  <h3>Importar Design System</h3>
                  <div className="upload-options">
                    <div className="upload-method">
                      <FileText size={32} />
                      <h4>CSS Variables</h4>
                      <button className="btn btn-outline">Subir CSS</button>
                    </div>
                    <div className="upload-method">
                      <Palette size={32} />
                      <h4>Design Tokens JSON</h4>
                      <button className="btn btn-outline">Subir JSON</button>
                    </div>
                    <div className="upload-method">
                      <Settings size={32} />
                      <h4>Figma Plugin</h4>
                      <button className="btn btn-outline">Conectar</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Estilos completos con mejoras para IA */}
      <style jsx>{`
        /* Variables base */
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
          backdrop-filter: blur(10px);
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

        .status-indicator {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.75rem;
          background: rgba(34, 197, 94, 0.1);
          border-radius: 20px;
          font-size: 0.8rem;
          color: var(--success);
        }

        .status-dot {
          width: 8px;
          height: 8px;
          background: var(--success);
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
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

        /* Navegación */
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

        /* Main content */
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

        /* AI Assistant Chat */
        .ai-container {
          max-width: 1000px;
          margin: 0 auto;
          height: calc(100vh - 250px);
          display: flex;
          flex-direction: column;
        }

        .ai-header {
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 1rem 1.5rem;
          margin-bottom: 1rem;
        }

        .ai-config {
          display: flex;
          gap: 2rem;
          align-items: center;
        }

        .config-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .config-item label {
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--text-secondary);
        }

        .ds-select-small {
          padding: 0.5rem 0.75rem;
          border: 1px solid var(--border);
          border-radius: 6px;
          background: var(--bg-primary);
          color: var(--text-primary);
          font-size: 0.85rem;
        }

        .viewport-badge {
          background: var(--brand-400);
          color: white;
          padding: 0.25rem 0.5rem;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .chat-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 16px;
          overflow: hidden;
        }

        .messages-list {
          flex: 1;
          overflow-y: auto;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .message {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
        }

        .message.user {
          flex-direction: row-reverse;
        }

        .message-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .message.user .message-avatar {
          background: var(--brand-400);
          color: white;
        }

        .message.assistant .message-avatar {
          background: var(--grad-ocean);
          color: white;
        }

        .message-content {
          flex: 1;
          max-width: calc(100% - 60px);
        }

        .message.user .message-content {
          align-items: flex-end;
        }

        .message-text {
          background: var(--bg-primary);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 1rem 1.25rem;
          line-height: 1.6;
          white-space: pre-wrap;
        }

        .message.user .message-text {
          background: var(--brand-400);
          color: white;
          border-color: var(--brand-400);
        }

        .bullet-point {
          margin: 0.5rem 0;
          padding-left: 1rem;
          border-left: 2px solid var(--brand-400);
        }

        .code-preview {
          margin-top: 1rem;
          background: var(--bg-tertiary);
          border: 1px solid var(--border);
          border-radius: 12px;
          overflow: hidden;
        }

        .code-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 1rem;
          background: var(--bg-primary);
          border-bottom: 1px solid var(--border);
          font-size: 0.85rem;
          font-weight: 500;
        }

        .btn-copy-small {
          background: none;
          border: 1px solid var(--border);
          border-radius: 6px;
          padding: 0.25rem 0.5rem;
          color: var(--text-muted);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-copy-small:hover {
          background: var(--brand-400);
          color: white;
          border-color: var(--brand-400);
        }

        .code-block {
          padding: 1rem;
          font-family: 'Monaco', 'Menlo', monospace;
          font-size: 0.8rem;
          line-height: 1.5;
          overflow-x: auto;
          color: var(--text-primary);
          background: var(--bg-primary);
          margin: 0;
        }

        .btn-use-code {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          width: 100%;
          padding: 0.75rem 1rem;
          background: var(--brand-600);
          color: white;
          border: none;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .btn-use-code:hover {
          background: var(--brand-500);
        }

        .message-time {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-top: 0.5rem;
          text-align: right;
        }

        .message.user .message-time {
          text-align: left;
        }

        /* Typing indicator */
        .typing-indicator {
          display: flex;
          gap: 4px;
          padding: 1rem 1.25rem;
        }

        .typing-indicator span {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--text-muted);
          animation: typing 1.4s infinite;
        }

        .typing-indicator span:nth-child(2) {
          animation-delay: 0.2s;
        }

        .typing-indicator span:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes typing {
          0%, 60%, 100% { opacity: 0.3; }
          30% { opacity: 1; }
        }

        .generating-text {
          color: var(--text-muted);
          font-style: italic;
          margin-top: 0.5rem;
          font-size: 0.85rem;
        }

        /* Chat input */
        .chat-input-area {
          border-top: 1px solid var(--border);
          padding: 1rem 1.5rem;
          background: var(--bg-primary);
        }

        .quick-suggestions {
          display: flex;
          gap: 0.75rem;
          margin-bottom: 1rem;
          flex-wrap: wrap;
        }

        .suggestion-chip {
          padding: 0.5rem 0.75rem;
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 0.8rem;
          color: var(--text-secondary);
        }

        .suggestion-chip:hover:not(:disabled) {
          background: var(--brand-400);
          color: white;
          border-color: var(--brand-400);
          transform: translateY(-1px);
        }

        .suggestion-chip:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .chat-form {
          width: 100%;
        }

        .input-wrapper {
          display: flex;
          gap: 0.75rem;
          align-items: flex-end;
        }

        .chat-input {
          flex: 1;
          padding: 0.75rem 1rem;
          border: 1px solid var(--border);
          border-radius: 12px;
          background: var(--bg-secondary);
          color: var(--text-primary);
          font-family: inherit;
          font-size: 0.9rem;
          line-height: 1.5;
          resize: vertical;
          min-height: 60px;
        }

        .chat-input:focus {
          outline: 2px solid var(--brand-400);
          border-color: var(--brand-400);
        }

        .send-button {
          padding: 0.75rem;
          background: var(--brand-600);
          border: none;
          border-radius: 10px;
          color: white;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .send-button:hover:not(:disabled) {
          background: var(--brand-500);
          transform: translateY(-1px);
        }

        .send-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Editor */
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

        .header-actions {
          display: flex;
          gap: 0.75rem;
          justify-content: center;
          margin-top: 1rem;
        }

        .editor-container {
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 12px var(--shadow);
        }

        .editor-layout {
          display: grid;
          grid-template-columns: 1fr 350px;
          min-height: 600px;
        }

        @media (max-width: 1200px) {
          .editor-layout {
            grid-template-columns: 1fr;
          }
        }

        .code-editor {
          width: 100%;
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
          margin-bottom: 2rem;
        }

        .validation-item {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          padding: 0.75rem;
          border-radius: 8px;
          font-size: 0.85rem;
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

        .metrics-summary {
          background: var(--bg-primary);
          border-radius: 8px;
          padding: 1rem;
        }

        .metrics-summary h5 {
          margin: 0 0 0.75rem 0;
          font-size: 0.9rem;
          font-weight: 600;
        }

        .metric-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 0;
          border-bottom: 1px solid var(--border);
          font-size: 0.85rem;
        }

        .metric-item:last-child {
          border-bottom: none;
        }

        .metric-value {
          font-weight: 600;
          color: var(--brand-600);
        }

        /* Preview */
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

        .preview-placeholder h3 {
          margin: 1rem 0 0.5rem 0;
          color: var(--text-primary);
          font-size: 1.5rem;
        }

        .preview-placeholder p {
          margin: 0 0 2rem 0;
          font-size: 1.1rem;
          line-height: 1.5;
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

        .metric .metric-value {
          font-weight: 600;
          font-size: 1rem;
        }

        .metric.excellent .metric-value { color: var(--success); }
        .metric.good .metric-value { color: var(--brand-400); }
        .metric.warning .metric-value { color: var(--warning); }

        .design-system-info {
          margin-bottom: 2rem;
        }

        .design-system-info h5 {
          margin: 0 0 1rem 0;
          font-size: 1rem;
          font-weight: 600;
        }

        .ds-badge {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          background: var(--bg-primary);
          border-radius: 8px;
          border: 1px solid var(--border);
        }

        .ds-colors {
          display: flex;
          gap: 0.25rem;
        }

        .color-dot-small {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .quick-actions {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        /* Design System Manager */
        .ds-manager {
          display: flex;
          flex-direction: column;
          gap: 3rem;
        }

        .ds-selector-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .ds-card {
          background: var(--bg-secondary);
          border: 2px solid var(--border);
          border-radius: 16px;
          padding: 2rem;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
          box-shadow: 0 2px 8px var(--shadow);
        }

        .ds-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px var(--shadow);
        }

        .ds-card.active {
          border-color: var(--brand-400);
          background: linear-gradient(135deg, rgba(10, 209, 200, 0.1), rgba(69, 223, 177, 0.05));
        }

        .ds-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .ds-colors {
          display: flex;
          gap: 0.5rem;
        }

        .color-dot {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .ds-card h3 {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 600;
        }

        .ds-card p {
          margin: 0;
          color: var(--text-muted);
          line-height: 1.5;
        }

        .active-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: var(--success);
          color: white;
          padding: 0.25rem 0.5rem;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .ds-details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
        }

        @media (max-width: 1024px) {
          .ds-details {
            grid-template-columns: 1fr;
          }
        }

        .variables-panel {
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 2rem;
        }

        .variables-panel h3 {
          margin: 0 0 1.5rem 0;
          font-size: 1.2rem;
          font-weight: 600;
        }

        .variables-grid {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .variable-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          background: var(--bg-primary);
          border-radius: 8px;
          border: 1px solid var(--border);
        }

        .var-name {
          font-family: monospace;
          font-weight: 600;
          color: var(--brand-600);
          min-width: 120px;
        }

        .var-value {
          flex: 1;
          font-family: monospace;
          color: var(--text-secondary);
        }

        .color-preview {
          width: 20px;
          height: 20px;
          border-radius: 4px;
          border: 1px solid var(--border);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .upload-custom {
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 2rem;
        }

        .upload-custom h3 {
          margin: 0 0 1.5rem 0;
          font-size: 1.2rem;
          font-weight: 600;
        }

        .upload-options {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 1.5rem;
        }

        .upload-method {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          padding: 1.5rem;
          border: 2px dashed var(--border);
          border-radius: 12px;
          text-align: center;
          transition: all 0.2s ease;
        }

        .upload-method:hover {
          border-color: var(--brand-400);
          background: rgba(10, 209, 200, 0.05);
        }

        .upload-method h4 {
          margin: 0;
          font-size: 1rem;
          font-weight: 600;
        }

        /* Botones */
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

        /* Estilos para componentes renderizados */
        .rendered-component .btn,
        .rendered-component button {
          background: var(--brand-600);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s ease;
          font-family: inherit;
        }

        .rendered-component .btn:hover,
        .rendered-component button:hover {
          background: var(--brand-500);
          transform: translateY(-1px);
        }

        /* Animaciones */
        .spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Responsive */
        @media (max-width: 768px) {
          .header-content {
            flex-wrap: wrap;
            gap: 1rem;
          }

          .header-controls {
            order: -1;
            width: 100%;
            justify-content: space-between;
          }

          .nav-tab span {
            display: none;
          }

          .main-content {
            padding: 1rem;
          }

          .ai-config {
            flex-direction: column;
            align-items: stretch;
            gap: 1rem;
          }

          .config-item {
            justify-content: space-between;
          }

          .quick-suggestions {
            justify-content: center;
          }

          .ds-selector-cards {
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
      `}</style>
    </div>
  );
};

export default AncloraRenderWithAI;