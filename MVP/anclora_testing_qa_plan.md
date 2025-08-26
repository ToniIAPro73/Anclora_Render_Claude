# 🧪 Plan de Testing y QA - Anclora Render

## 📋 Índice de Testing

1. [**Estrategia General de Testing**](#estrategia-general-de-testing)
2. [**Testing Frontend (React)**](#testing-frontend-react)
3. [**Testing Backend (API)**](#testing-backend-api)
4. [**Testing de Integración IA**](#testing-de-integración-ia)
5. [**Testing de Performance**](#testing-de-performance)
6. [**Testing de Seguridad**](#testing-de-seguridad)
7. [**Testing de Accesibilidad**](#testing-de-accesibilidad)
8. [**Testing Cross-Browser**](#testing-cross-browser)
9. [**Testing Mobile/Responsive**](#testing-mobileresponsive)
10. [**Testing de Carga y Estrés**](#testing-de-carga-y-estrés)
11. [**User Acceptance Testing (UAT)**](#user-acceptance-testing-uat)
12. [**Deployment y CI/CD Testing**](#deployment-y-cicd-testing)

---

## 🎯 Estrategia General de Testing

### **Pirámide de Testing**

```
                    🔺 E2E Tests (10%)
                   /                 \
                  /   Integration     \
                 /    Tests (20%)      \
                /                       \
               /________________________\
              Unit Tests (70%)
```

### **Cobertura de Testing Target**

| **Tipo** | **Cobertura Mínima** | **Herramientas** |
|----------|---------------------|------------------|
| **Unit Tests** | 85% | Jest, React Testing Library |
| **Integration Tests** | 75% | Jest, Supertest |
| **E2E Tests** | 60% critical paths | Playwright, Cypress |
| **API Tests** | 90% | Jest, Supertest |
| **Performance** | Core Web Vitals | Lighthouse, k6 |
| **Security** | OWASP Top 10 | OWASP ZAP, Snyk |
| **Accessibility** | WCAG 2.2 AA | axe-core, Pa11y |

### **Testing Environments**

```mermaid
graph LR
    A[Development] --> B[Staging]
    B --> C[Pre-Production]
    C --> D[Production]
    
    A --> E[Unit Tests]
    B --> F[Integration Tests]
    C --> G[E2E Tests]
    D --> H[Monitoring]
```

---

## ⚛️ Testing Frontend (React)

### **1. Unit Tests - Componentes React**

```javascript
// tests/components/AIAssistant.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import AIAssistant from '../../src/components/AIAssistant';

// Mock Claude API
const mockClaudeAPI = vi.fn();

describe('AIAssistant Component', () => {
  beforeEach(() => {
    mockClaudeAPI.mockReset();
  });

  test('renders AI chat interface correctly', () => {
    render(<AIAssistant />);
    
    expect(screen.getByText('Asistente IA')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/describe el componente/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /generar/i })).toBeInTheDocument();
  });

  test('validates input before sending to AI', async () => {
    const user = userEvent.setup();
    render(<AIAssistant />);
    
    const input = screen.getByPlaceholderText(/describe el componente/i);
    const submitBtn = screen.getByRole('button', { name: /generar/i });
    
    // Test empty input
    await user.click(submitBtn);
    expect(screen.getByText(/describe qué componente necesitas/i)).toBeInTheDocument();
    
    // Test too short input
    await user.type(input, 'btn');
    await user.click(submitBtn);
    expect(screen.getByText(/descripción muy corta/i)).toBeInTheDocument();
  });

  test('generates component successfully', async () => {
    const user = userEvent.setup();
    mockClaudeAPI.mockResolvedValue({
      content: [{ text: '<button class="btn">Test Button</button>' }]
    });
    
    render(<AIAssistant onCodeGenerated={vi.fn()} />);
    
    const input = screen.getByPlaceholderText(/describe el componente/i);
    await user.type(input, 'Create a primary button with hover effects');
    
    const submitBtn = screen.getByRole('button', { name: /generar/i });
    await user.click(submitBtn);
    
    // Should show loading state
    expect(screen.getByText(/generando/i)).toBeInTheDocument();
    
    // Wait for generation to complete
    await waitFor(() => {
      expect(screen.getByText(/componente generado/i)).toBeInTheDocument();
    });
  });

  test('handles API errors gracefully', async () => {
    const user = userEvent.setup();
    mockClaudeAPI.mockRejectedValue(new Error('API Error'));
    
    render(<AIAssistant />);
    
    const input = screen.getByPlaceholderText(/describe el componente/i);
    await user.type(input, 'Create a button component');
    
    const submitBtn = screen.getByRole('button', { name: /generar/i });
    await user.click(submitBtn);
    
    await waitFor(() => {
      expect(screen.getByText(/error al generar/i)).toBeInTheDocument();
    });
  });

  test('respects rate limiting', async () => {
    const user = userEvent.setup();
    render(<AIAssistant />);
    
    // Simulate rapid requests
    const input = screen.getByPlaceholderText(/describe el componente/i);
    const submitBtn = screen.getByRole('button', { name: /generar/i });
    
    await user.type(input, 'Button 1');
    await user.click(submitBtn);
    
    await user.clear(input);
    await user.type(input, 'Button 2');
    await user.click(submitBtn);
    
    // Should show rate limit message
    await waitFor(() => {
      expect(screen.getByText(/demasiadas solicitudes/i)).toBeInTheDocument();
    });
  });
});
```

### **2. Component Integration Tests**

```javascript
// tests/integration/ComponentWorkflow.test.jsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../../src/App';
import { TestProviders } from '../utils/TestProviders';

describe('Component Generation Workflow', () => {
  test('complete workflow: generate -> preview -> export', async () => {
    const user = userEvent.setup();
    
    render(
      <TestProviders>
        <App />
      </TestProviders>
    );

    // 1. Navigate to AI Assistant
    await user.click(screen.getByRole('tab', { name: /asistente ia/i }));
    
    // 2. Generate component
    const input = screen.getByPlaceholderText(/describe el componente/i);
    await user.type(input, 'Create a responsive card with image and button');
    
    await user.click(screen.getByRole('button', { name: /generar/i }));
    
    // 3. Wait for generation
    await waitFor(() => {
      expect(screen.getByText(/componente generado/i)).toBeInTheDocument();
    }, { timeout: 10000 });
    
    // 4. Check preview
    await user.click(screen.getByRole('tab', { name: /preview/i }));
    expect(screen.getByTestId('component-preview')).toBeInTheDocument();
    
    // 5. Test export functionality
    await user.click(screen.getByRole('button', { name: /exportar/i }));
    // Should trigger download or show export options
  });

  test('design system integration works correctly', async () => {
    const user = userEvent.setup();
    
    render(
      <TestProviders>
        <App />
      </TestProviders>
    );

    // 1. Select design system
    await user.click(screen.getByRole('tab', { name: /sistema/i }));
    await user.click(screen.getByText('Material Design 3'));
    
    // 2. Generate component with design system
    await user.click(screen.getByRole('tab', { name: /asistente ia/i }));
    
    const input = screen.getByPlaceholderText(/describe el componente/i);
    await user.type(input, 'Create a Material Design button');
    
    await user.click(screen.getByRole('button', { name: /generar/i }));
    
    // 3. Verify design system is applied
    await waitFor(() => {
      const preview = screen.getByTestId('component-preview');
      expect(preview).toHaveStyle(/--primary.*#1976D2/);
    });
  });
});
```

### **3. Custom Hooks Testing**

```javascript
// tests/hooks/useAIGeneration.test.js
import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { useAIGeneration } from '../../src/hooks/useAIGeneration';

describe('useAIGeneration Hook', () => {
  test('handles successful generation', async () => {
    const mockAPI = vi.fn().mockResolvedValue({
      component: { htmlCode: '<button>Test</button>' }
    });

    const { result } = renderHook(() => useAIGeneration(mockAPI));

    await waitFor(async () => {
      const generate = result.current.generate;
      await generate('Create a button');
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.generatedComponent).toEqual({
      htmlCode: '<button>Test</button>'
    });
  });

  test('handles API errors', async () => {
    const mockAPI = vi.fn().mockRejectedValue(new Error('API Error'));

    const { result } = renderHook(() => useAIGeneration(mockAPI));

    await waitFor(async () => {
      const generate = result.current.generate;
      await generate('Create a button');
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe('API Error');
    expect(result.current.generatedComponent).toBe(null);
  });
});
```

---

## 🖥️ Testing Backend (API)

### **1. API Unit Tests**

```javascript
// tests/api/auth.test.js
const request = require('supertest');
const app = require('../../server');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

describe('/api/auth', () => {
  beforeEach(async () => {
    await prisma.user.deleteMany({});
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /api/auth/register', () => {
    test('creates new user successfully', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.user.email).toBe(userData.email);
      expect(response.body.user.plan).toBe('FREE');
      expect(response.body.user.credits).toBe(50);
      expect(response.body.token).toBeDefined();
    });

    test('prevents duplicate email registration', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123'
      };

      // First registration
      await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      // Second registration should fail
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(409);

      expect(response.body.error).toBe('User already exists');
    });

    test('validates input data', async () => {
      const invalidData = {
        email: 'invalid-email',
        password: '123' // too short
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(invalidData)
        .expect(400);

      expect(response.body.error).toContain('validation');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create test user
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User'
        });
    });

    test('logs in user with correct credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        })
        .expect(200);

      expect(response.body.user.email).toBe('test@example.com');
      expect(response.body.token).toBeDefined();
    });

    test('rejects invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        })
        .expect(401);

      expect(response.body.error).toBe('Invalid credentials');
    });
  });
});
```

### **2. AI Generation API Tests**

```javascript
// tests/api/ai.test.js
const request = require('supertest');
const app = require('../../server');
const { createTestUser, getAuthToken } = require('../utils/testHelpers');

describe('/api/ai', () => {
  let authToken;
  let testUser;

  beforeEach(async () => {
    testUser = await createTestUser();
    authToken = await getAuthToken(testUser.id);
  });

  describe('POST /api/ai/generate', () => {
    test('generates component successfully', async () => {
      const prompt = 'Create a responsive button with hover effects';

      const response = await request(app)
        .post('/api/ai/generate')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          prompt,
          framework: 'REACT',
          viewport: 'mobile'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.component.htmlCode).toBeDefined();
      expect(response.body.componentId).toBeDefined();
      
      // Should deduct credits for free users
      if (testUser.plan === 'FREE') {
        expect(response.body.creditsRemaining).toBe(testUser.credits - 1);
      }
    });

    test('validates prompt length', async () => {
      const response = await request(app)
        .post('/api/ai/generate')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          prompt: 'btn', // too short
          framework: 'REACT'
        })
        .expect(400);

      expect(response.body.error).toContain('prompt');
    });

    test('respects credit limits for free users', async () => {
      // Exhaust user credits
      await prisma.user.update({
        where: { id: testUser.id },
        data: { credits: 0 }
      });

      const response = await request(app)
        .post('/api/ai/generate')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          prompt: 'Create a button component',
          framework: 'REACT'
        })
        .expect(429);

      expect(response.body.error).toContain('Credit limit');
    });

    test('handles AI API failures gracefully', async () => {
      // Mock AI API to fail
      jest.spyOn(require('../../services/aiService'), 'generateComponent')
        .mockRejectedValue(new Error('AI API Error'));

      const response = await request(app)
        .post('/api/ai/generate')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          prompt: 'Create a button component',
          framework: 'REACT'
        })
        .expect(500);

      expect(response.body.error).toBeDefined();
    });
  });

  describe('GET /api/ai/history', () => {
    test('returns user generation history', async () => {
      // Create some test components
      await prisma.component.createMany({
        data: [
          {
            name: 'Test Button',
            prompt: 'Create a button',
            htmlCode: '<button>Test</button>',
            userId: testUser.id,
            framework: 'REACT'
          },
          {
            name: 'Test Card',
            prompt: 'Create a card',
            htmlCode: '<div>Card</div>',
            userId: testUser.id,
            framework: 'REACT'
          }
        ]
      });

      const response = await request(app)
        .get('/api/ai/history')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.components).toHaveLength(2);
      expect(response.body.pagination.total).toBe(2);
    });
  });
});
```

---

## 🤖 Testing de Integración IA

### **1. Claude API Integration Tests**

```javascript
// tests/integration/claudeAPI.test.js
const { ClaudeAPIService } = require('../../services/ClaudeAPIService');

describe('Claude API Integration', () => {
  let claudeService;

  beforeAll(() => {
    claudeService = new ClaudeAPIService(process.env.ANTHROPIC_API_KEY_TEST);
  });

  test('generates valid HTML component', async () => {
    const prompt = 'Create a responsive button with primary styling';
    const designSystem = {
      name: 'Anclora',
      config: { primary: '#0B6477', secondary: '#45DFB1' }
    };

    const result = await claudeService.generateComponent({
      prompt,
      designSystem,
      framework: 'VANILLA',
      viewport: 'mobile'
    });

    expect(result.htmlCode).toBeDefined();
    expect(result.htmlCode).toContain('button');
    expect(result.htmlCode).toContain('#0B6477'); // Should use design system colors
    
    // Validate HTML structure
    const dom = parseHTML(result.htmlCode);
    expect(dom.querySelector('button')).toBeTruthy();
  });

  test('handles different frameworks correctly', async () => {
    const prompt = 'Create a card component';
    
    const reactResult = await claudeService.generateComponent({
      prompt,
      framework: 'REACT'
    });
    
    const vueResult = await claudeService.generateComponent({
      prompt,
      framework: 'VUE'
    });

    expect(reactResult.htmlCode).toContain('className');
    expect(vueResult.htmlCode).toContain('v-');
  });

  test('respects token limits', async () => {
    const longPrompt = 'Create a component '.repeat(200); // Very long prompt
    
    const result = await claudeService.generateComponent({
      prompt: longPrompt,
      framework: 'REACT'
    });

    expect(result.htmlCode).toBeDefined();
    // Should still generate valid output despite long prompt
  });

  test('handles API rate limiting', async () => {
    const promises = Array(25).fill().map(() => 
      claudeService.generateComponent({
        prompt: 'Create a button',
        framework: 'REACT'
      })
    );

    const results = await Promise.allSettled(promises);
    
    // Some may fail due to rate limiting, but shouldn't crash
    const successful = results.filter(r => r.status === 'fulfilled');
    expect(successful.length).toBeGreaterThan(0);
  });
});
```

### **2. AI Quality Assurance Tests**

```javascript
// tests/ai/qualityAssurance.test.js
describe('AI Generated Code Quality', () => {
  test('generated components are accessible', async () => {
    const result = await generateTestComponent('Create a form with inputs and submit button');
    
    const dom = parseHTML(result.htmlCode);
    
    // Check for proper labels
    const inputs = dom.querySelectorAll('input');
    inputs.forEach(input => {
      const label = dom.querySelector(`label[for="${input.id}"]`) ||
                   dom.querySelector('label').contains(input);
      expect(label).toBeTruthy();
    });

    // Check for proper button roles
    const buttons = dom.querySelectorAll('button');
    buttons.forEach(button => {
      expect(button.hasAttribute('type') || button.hasAttribute('role')).toBe(true);
    });
  });

  test('generated CSS follows design system', async () => {
    const designSystem = {
      config: {
        primary: '#0B6477',
        'border-radius': '8px',
        'font-family': 'Inter'
      }
    };

    const result = await generateTestComponent(
      'Create a button component',
      { designSystem }
    );

    expect(result.htmlCode).toContain('--primary');
    expect(result.htmlCode).toContain('border-radius: var(--border-radius)');
  });

  test('generated components are responsive', async () => {
    const result = await generateTestComponent(
      'Create a responsive grid layout',
      { viewport: 'mobile' }
    );

    const hasMediaQueries = /@media.*screen/.test(result.htmlCode);
    const hasFlexOrGrid = /(display:\s*(flex|grid)|grid-template)/.test(result.htmlCode);
    
    expect(hasMediaQueries || hasFlexOrGrid).toBe(true);
  });

  test('code validation passes', async () => {
    const result = await generateTestComponent('Create a complex dashboard widget');
    
    // HTML validation
    const htmlErrors = validateHTML(result.htmlCode);
    expect(htmlErrors).toHaveLength(0);
    
    // CSS validation
    const cssErrors = validateCSS(extractCSS(result.htmlCode));
    expect(cssErrors.filter(e => e.type === 'error')).toHaveLength(0);
  });
});
```

---

## ⚡ Testing de Performance

### **1. Frontend Performance Tests**

```javascript
// tests/performance/frontend.test.js
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

describe('Frontend Performance', () => {
  let chrome;
  let port;

  beforeAll(async () => {
    chrome = await chromeLauncher.launch({chromeFlags: ['--headless']});
    port = chrome.port;
  });

  afterAll(async () => {
    await chrome.kill();
  });

  test('Core Web Vitals meet thresholds', async () => {
    const options = {
      logLevel: 'info',
      output: 'json',
      onlyCategories: ['performance'],
      port: port,
    };

    const runnerResult = await lighthouse('http://localhost:3000', options);
    const { lhr } = runnerResult;

    // Core Web Vitals thresholds
    expect(lhr.audits['largest-contentful-paint'].numericValue).toBeLessThan(2500);
    expect(lhr.audits['first-input-delay'].numericValue).toBeLessThan(100);
    expect(lhr.audits['cumulative-layout-shift'].numericValue).toBeLessThan(0.1);
  });

  test('bundle size is within limits', async () => {
    const bundleAnalysis = await analyzeBundleSize();
    
    expect(bundleAnalysis.totalSize).toBeLessThan(1024 * 1024); // 1MB
    expect(bundleAnalysis.gzippedSize).toBeLessThan(300 * 1024); // 300KB
  });

  test('component rendering performance', async () => {
    const renderTimes = [];
    
    for (let i = 0; i < 10; i++) {
      const startTime = performance.now();
      await renderLargeComponentTree();
      const endTime = performance.now();
      renderTimes.push(endTime - startTime);
    }

    const averageTime = renderTimes.reduce((a, b) => a + b) / renderTimes.length;
    expect(averageTime).toBeLessThan(16); // 60fps threshold
  });
});
```

### **2. API Performance Tests**

```javascript
// tests/performance/api.test.js
const k6 = require('k6');

describe('API Performance', () => {
  test('handles concurrent AI generations', async () => {
    const script = `
      import http from 'k6/http';
      import { check, sleep } from 'k6';

      export let options = {
        stages: [
          { duration: '30s', target: 10 },
          { duration: '1m', target: 50 },
          { duration: '30s', target: 0 },
        ],
      };

      export default function() {
        const payload = JSON.stringify({
          prompt: 'Create a button component',
          framework: 'REACT'
        });

        const params = {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + __ENV.AUTH_TOKEN,
          },
        };

        let response = http.post('http://localhost:5000/api/ai/generate', payload, params);
        
        check(response, {
          'status is 200': (r) => r.status === 200,
          'response time < 10s': (r) => r.timings.duration < 10000,
        });
        
        sleep(1);
      }
    `;

    const results = await runK6Test(script);
    
    expect(results.checks.rate).toBeGreaterThan(0.95); // 95% success rate
    expect(results.http_req_duration.avg).toBeLessThan(5000); // 5s average
  });
});
```

---

## 🔒 Testing de Seguridad

### **1. Authentication & Authorization Tests**

```javascript
// tests/security/auth.test.js
describe('Security Tests', () => {
  test('prevents unauthorized access to protected routes', async () => {
    const response = await request(app)
      .get('/api/users/profile')
      .expect(401);

    expect(response.body.error).toBe('Authentication required');
  });

  test('validates JWT tokens properly', async () => {
    const invalidToken = 'invalid.jwt.token';
    
    const response = await request(app)
      .get('/api/users/profile')
      .set('Authorization', `Bearer ${invalidToken}`)
      .expect(401);

    expect(response.body.error).toBe('Invalid token');
  });

  test('prevents SQL injection attempts', async () => {
    const maliciousInput = "'; DROP TABLE users; --";
    
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: maliciousInput,
        password: 'password'
      })
      .expect(400);

    // Should be caught by validation, not executed
  });

  test('rate limiting works correctly', async () => {
    const requests = Array(15).fill().map(() =>
      request(app).post('/api/auth/login').send({
        email: 'test@example.com',
        password: 'wrongpassword'
      })
    );

    const responses = await Promise.all(requests);
    const rateLimited = responses.filter(r => r.status === 429);
    
    expect(rateLimited.length).toBeGreaterThan(0);
  });

  test('password hashing is secure', async () => {
    const password = 'testpassword123';
    
    await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password,
        name: 'Test User'
      });

    const user = await prisma.user.findUnique({
      where: { email: 'test@example.com' }
    });

    expect(user.password).not.toBe(password);
    expect(user.password).toMatch(/^\$2[aby]\$\d+\$/); // bcrypt format
  });
});
```

### **2. Input Validation & Sanitization**

```javascript
// tests/security/validation.test.js
describe('Input Validation', () => {
  test('sanitizes AI prompts to prevent injection', async () => {
    const maliciousPrompt = '<script>alert("xss")</script>Create a button';
    
    const response = await request(app)
      .post('/api/ai/generate')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        prompt: maliciousPrompt,
        framework: 'REACT'
      })
      .expect(200);

    // Generated code should not contain script tags
    expect(response.body.component.htmlCode).not.toContain('<script>');
  });

  test('validates file upload restrictions', async () => {
    const maliciousFile = Buffer.from('<?php system($_GET["cmd"]); ?>');
    
    const response = await request(app)
      .post('/api/design-systems/upload')
      .set('Authorization', `Bearer ${authToken}`)
      .attach('file', maliciousFile, 'malicious.php')
      .expect(400);

    expect(response.body.error).toContain('file type');
  });
});
```

---

## ♿ Testing de Accesibilidad

### **1. Automated Accessibility Testing**

```javascript
// tests/accessibility/axe.test.js
const { AxePuppeteer } = require('@axe-core/puppeteer');
const puppeteer = require('puppeteer');

describe('Accessibility Tests', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({ headless: true });
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  test('main application passes WCAG 2.2 AA', async () => {
    await page.goto('http://localhost:3000');
    
    const results = await new AxePuppeteer(page)
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();

    expect(results.violations).toHaveLength(0);
  });

  test('AI assistant interface is accessible', async () => {
    await page.goto('http://localhost:3000');
    await page.click('[role="tab"][aria-label*="Asistente"]');
    
    const results = await new AxePuppeteer(page)
      .include('#ai-assistant')
      .analyze();

    expect(results.violations).toHaveLength(0);
  });

  test('keyboard navigation works throughout app', async () => {
    await page.goto('http://localhost:3000');
    
    // Test tab navigation
    const tabbableElements = await page.$$eval('[tabindex]:not([tabindex="-1"]), button, input, select, textarea, a[href]', 
      elements => elements.length
    );
    
    expect(tabbableElements).toBeGreaterThan(0);
    
    // Test that all interactive elements are reachable
    for (let i = 0; i < Math.min(tabbableElements, 20); i++) {
      await page.keyboard.press('Tab');
      const focusedElement = await page.evaluate(() => document.activeElement.tagName);
      expect(['BUTTON', 'INPUT', 'SELECT', 'TEXTAREA', 'A']).toContain(focusedElement);
    }
  });

  test('color contrast meets requirements', async () => {
    await page.goto('http://localhost:3000');
    
    const results = await new AxePuppeteer(page)
      .withTags(['color-contrast'])
      .analyze();

    expect(results.violations).toHaveLength(0);
  });

  test('screen reader announcements work', async () => {
    await page.goto('http://localhost:3000');
    
    // Check for proper ARIA labels and live regions
    const ariaLabels = await page.$$eval('[aria-label]', els => els.length);
    const liveRegions = await page.$$eval('[aria-live]', els => els.length);
    
    expect(ariaLabels).toBeGreaterThan(0);
    expect(liveRegions).toBeGreaterThan(0);
  });
});
```

---

## 🌐 Testing Cross-Browser

### **1. Browser Compatibility Tests**

```javascript
// tests/browser/compatibility.test.js
const { chromium, firefox, webkit } = require('playwright');

describe('Cross-Browser Compatibility', () => {
  const browsers = [
    { name: 'Chromium', launch: chromium.launch },
    { name: 'Firefox', launch: firefox.launch },
    { name: 'WebKit', launch: webkit.launch }
  ];

  browsers.forEach(({ name, launch }) => {
    describe(`${name} Browser`, () => {
      let browser;
      let page;

      beforeAll(async () => {
        browser = await launch();
        page = await browser.newPage();
      });

      afterAll(async () => {
        await browser.close();
      });

      test('app loads and renders correctly', async () => {
        await page.goto('http://localhost:3000');
        
        const title = await page.textContent('h1');
        expect(title).toContain('Anclora Render');
        
        // Check critical elements
        await expect(page.locator('[data-testid="ai-assistant"]')).toBeVisible();
        await expect(page.locator('[data-testid="navigation"]')).toBeVisible();
      });

      test('AI generation works', async () => {
        await page.goto('http://localhost:3000');
        
        // Navigate to AI tab
        await page.click('[role="tab"]:has-text("Asistente")');
        
        // Fill prompt
        await page.fill('[placeholder*="describe"]', 'Create a test button');
        
        // Click generate (with longer timeout for AI)
        await page.click('button:has-text("Generar")');
        
        // Wait for result
        await expect(page.locator(':has-text("Componente generado")')).toBeVisible({ timeout: 15000 });
      });

      test('responsive design works at different viewports', async () => {
        const viewports = [
          { width: 375, height: 667 },   // Mobile
          { width: 768, height: 1024 },  // Tablet
          { width: 1200, height: 800 }   // Desktop
        ];

        for (const viewport of viewports) {
          await page.setViewportSize(viewport);
          await page.goto('http://localhost:3000');
          
          // Check layout doesn't break
          const isVisible = await page.locator('body').isVisible();
          expect(isVisible).toBe(true);
          
          // Check no horizontal scrollbar at mobile
          if (viewport.width <= 768) {
            const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
            expect(scrollWidth).toBeLessThanOrEqual(viewport.width + 20); // 20px tolerance
          }
        }
      });
    });
  });
});
```

---

## 📱 Testing Mobile/Responsive

### **1. Mobile Device Testing**

```javascript
// tests/mobile/devices.test.js
const { devices } = require('playwright');

describe('Mobile Device Testing', () => {
  const mobileDevices = [
    devices['iPhone 12'],
    devices['iPhone 12 Pro'],
    devices['Pixel 5'],
    devices['Samsung Galaxy S21']
  ];

  mobileDevices.forEach((device) => {
    test(`works on ${device.name}`, async () => {
      const browser = await chromium.launch();
      const context = await browser.newContext({
        ...device
      });
      const page = await context.newPage();

      await page.goto('http://localhost:3000');
      
      // Test touch interactions
      await page.tap('[role="tab"]:has-text("Asistente")');
      
      // Test mobile-specific UI
      const hamburgerMenu = await page.$('[aria-label="Mobile menu"]');
      if (hamburgerMenu) {
        await page.tap('[aria-label="Mobile menu"]');
        await expect(page.locator('[data-testid="mobile-nav"]')).toBeVisible();
      }

      // Test AI generation on mobile
      await page.fill('[placeholder*="describe"]', 'Create a mobile button');
      await page.tap('button:has-text("Generar")');
      
      await expect(page.locator(':has-text("Generando")')).toBeVisible();

      await browser.close();
    });
  });

  test('touch gestures work correctly', async () => {
    const browser = await chromium.launch();
    const context = await browser.newContext(devices['iPhone 12']);
    const page = await context.newPage();

    await page.goto('http://localhost:3000');
    
    // Test swipe navigation if implemented
    const tabs = await page.$$('[role="tab"]');
    if (tabs.length > 1) {
      await page.touchscreen.tap(tabs[0]);
      await page.waitForTimeout(500);
      
      // Swipe to next tab
      await page.touchscreen.swipe(400, 300, 100, 300);
      await page.waitForTimeout(500);
    }

    await browser.close();
  });
});
```

---

## 🏋️ Testing de Carga y Estrés

### **1. Load Testing con k6**

```javascript
// tests/load/k6-load-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

const errorRate = new Rate('errors');

export let options = {
  stages: [
    // Warm up
    { duration: '2m', target: 10 },
    // Ramp up
    { duration: '5m', target: 50 },
    // Peak load
    { duration: '10m', target: 100 },
    // Ramp down
    { duration: '5m', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(99)<10000'], // 99% of requests under 10s
    http_req_failed: ['rate<0.1'],      // Error rate under 10%
    errors: ['rate<0.1'],
  },
};

const BASE_URL = 'http://localhost:5000';
const AUTH_TOKEN = 'your-test-token';

export default function() {
  // Test different endpoints
  const endpoints = [
    { method: 'GET', url: `${BASE_URL}/api/health` },
    { method: 'GET', url: `${BASE_URL}/api/users/profile`, auth: true },
    { method: 'POST', url: `${BASE_URL}/api/ai/generate`, auth: true, 
      payload: { prompt: 'Create a button', framework: 'REACT' }
    }
  ];

  const endpoint = endpoints[Math.floor(Math.random() * endpoints.length)];
  
  const params = {
    headers: {
      'Content-Type': 'application/json',
      ...(endpoint.auth && { 'Authorization': `Bearer ${AUTH_TOKEN}` })
    }
  };

  let response;
  if (endpoint.method === 'POST') {
    response = http.post(endpoint.url, JSON.stringify(endpoint.payload), params);
  } else {
    response = http.get(endpoint.url, params);
  }

  const success = check(response, {
    'status is 200': (r) => r.status === 200,
    'response time OK': (r) => r.timings.duration < 5000,
  });

  errorRate.add(!success);
  sleep(1);
}

export function handleSummary(data) {
  return {
    'load-test-results.json': JSON.stringify(data, null, 2),
  };
}
```

---

## 👥 User Acceptance Testing (UAT)

### **1. UAT Test Scenarios**

```markdown
# User Acceptance Testing Scenarios

## Scenario 1: First-Time User Onboarding
**Given**: New user visits Anclora Render
**When**: User tries to generate their first component
**Then**: Process should be intuitive and complete in under 2 minutes

### Test Steps:
1. Navigate to https://render.anclora.com
2. Click "Start Free" without signing up
3. Describe a simple component: "Create a blue button"
4. Verify component generates successfully
5. Check if component preview works
6. Attempt to export component
7. Verify signup prompt appears appropriately

### Acceptance Criteria:
- [ ] Landing page loads in <3 seconds
- [ ] AI generation completes in <10 seconds
- [ ] Generated component matches description
- [ ] Preview shows component correctly
- [ ] Export/signup flow is clear
- [ ] No errors or crashes occur

## Scenario 2: Professional User Workflow
**Given**: Pro user with design system requirements
**When**: User generates components following brand guidelines
**Then**: All components should maintain design consistency

### Test Steps:
1. Login to pro account
2. Import/select design system (e.g., Material Design)
3. Generate 3 different components:
   - "Primary button with loading state"
   - "User profile card with avatar"
   - "Navigation bar with dropdown"
4. Verify design system consistency
5. Test different viewports (mobile, tablet, desktop)
6. Export components to different formats

### Acceptance Criteria:
- [ ] Design system applied consistently
- [ ] All components work across viewports
- [ ] Export functionality works for all formats
- [ ] Components are accessible (WCAG AA)
- [ ] Performance remains good with complex components

## Scenario 3: Team Collaboration
**Given**: Multiple users working on same project
**When**: Team members share and iterate on components
**Then**: Collaboration should be seamless

### Test Steps:
1. User A generates initial component
2. User A shares component with User B
3. User B views and suggests modifications
4. User A modifies component based on feedback
5. Both users verify final component meets requirements

### Acceptance Criteria:
- [ ] Sharing mechanism works reliably
- [ ] Version history is maintained
- [ ] Comments/feedback system works
- [ ] Real-time updates (if implemented)
- [ ] No permission/access issues

## Scenario 4: Edge Cases & Error Handling
**Given**: Various edge cases and error conditions
**When**: User encounters errors or limits
**Then**: System should handle gracefully with helpful feedback

### Test Steps:
1. Test with very long prompts (500+ characters)
2. Test with ambiguous prompts ("make something nice")
3. Test with invalid inputs (special characters, code injection)
4. Exceed rate limits
5. Test with network interruptions
6. Test with invalid design system files

### Acceptance Criteria:
- [ ] Long prompts are handled or properly truncated
- [ ] Ambiguous prompts receive helpful guidance
- [ ] Invalid inputs are sanitized safely
- [ ] Rate limiting shows clear messages
- [ ] Network errors have retry mechanisms
- [ ] File validation prevents malicious uploads
```

### **2. UAT Feedback Collection**

```javascript
// UAT feedback collection system
const uatFeedback = {
  scenarios: [
    {
      id: 'onboarding',
      name: 'First-Time User Onboarding',
      status: 'pending', // pending, passed, failed
      feedback: [],
      tester: null,
      completedAt: null
    },
    {
      id: 'professional',
      name: 'Professional User Workflow',
      status: 'pending',
      feedback: [],
      tester: null,
      completedAt: null
    }
  ],
  
  collectFeedback: function(scenarioId, feedback) {
    const scenario = this.scenarios.find(s => s.id === scenarioId);
    if (scenario) {
      scenario.feedback.push({
        timestamp: new Date(),
        ...feedback
      });
    }
  },
  
  markComplete: function(scenarioId, status, tester) {
    const scenario = this.scenarios.find(s => s.id === scenarioId);
    if (scenario) {
      scenario.status = status;
      scenario.tester = tester;
      scenario.completedAt = new Date();
    }
  },
  
  generateReport: function() {
    return {
      totalScenarios: this.scenarios.length,
      passed: this.scenarios.filter(s => s.status === 'passed').length,
      failed: this.scenarios.filter(s => s.status === 'failed').length,
      pending: this.scenarios.filter(s => s.status === 'pending').length,
      allFeedback: this.scenarios.flatMap(s => s.feedback)
    };
  }
};
```

---

## 🚀 Deployment y CI/CD Testing

### **1. CI/CD Pipeline Configuration**

```yaml
# .github/workflows/ci-cd.yml
name: Anclora Render CI/CD

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: anclora_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
      
      redis:
        image: redis:6
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run linting
      run: npm run lint
    
    - name: Run type checking
      run: npm run type-check
    
    - name: Run unit tests
      run: npm run test:unit
      env:
        DATABASE_URL: postgresql://postgres:postgres@localhost/anclora_test
        REDIS_URL: redis://localhost:6379
    
    - name: Run integration tests
      run: npm run test:integration
      env:
        DATABASE_URL: postgresql://postgres:postgres@localhost/anclora_test
        REDIS_URL: redis://localhost:6379
        ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY_TEST }}
    
    - name: Run E2E tests
      run: npm run test:e2e
      env:
        CI: true
    
    - name: Upload coverage reports
      uses: codecov/codecov-action@v3
    
    - name: Security audit
      run: npm audit --audit-level high

  lighthouse:
    runs-on: ubuntu-latest
    needs: test
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Build application
      run: |
        npm ci
        npm run build
        npm run start &
        sleep 30
    
    - name: Run Lighthouse CI
      uses: treosh/lighthouse-ci-action@v9
      with:
        configPath: './lighthouserc.json'
        uploadArtifacts: true
        temporaryPublicStorage: true

  deploy:
    runs-on: ubuntu-latest
    needs: [test, lighthouse]
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        vercel-args: '--prod'
```

### **2. Deployment Verification Tests**

```javascript
// tests/deployment/verification.test.js
describe('Deployment Verification', () => {
  const PROD_URL = 'https://render.anclora.com';
  
  test('production site is accessible', async () => {
    const response = await fetch(PROD_URL);
    expect(response.status).toBe(200);
    
    const html = await response.text();
    expect(html).toContain('Anclora Render');
  });

  test('API health check passes', async () => {
    const response = await fetch(`${PROD_URL}/api/health`);
    expect(response.status).toBe(200);
    
    const data = await response.json();
    expect(data.status).toBe('healthy');
  });

  test('database connectivity works', async () => {
    const response = await fetch(`${PROD_URL}/api/health`);
    const data = await response.json();
    
    expect(data.database).toBe('connected');
  });

  test('AI service is operational', async () => {
    // Use test account to verify AI generation
    const authResponse = await fetch(`${PROD_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: process.env.TEST_USER_EMAIL,
        password: process.env.TEST_USER_PASSWORD
      })
    });
    
    const { token } = await authResponse.json();
    
    const genResponse = await fetch(`${PROD_URL}/api/ai/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        prompt: 'Create a test button',
        framework: 'REACT'
      })
    });
    
    expect(genResponse.status).toBe(200);
    
    const result = await genResponse.json();
    expect(result.success).toBe(true);
  });
});
```

---

## 📊 Testing Metrics & Reporting

### **1. Testing Dashboard**

```javascript
// Quality metrics collection
const testingMetrics = {
  unitTests: {
    total: 157,
    passed: 155,
    failed: 2,
    coverage: 87.3,
    performance: '2.1s average'
  },
  integrationTests: {
    total: 43,
    passed: 41,
    failed: 2,
    coverage: 75.8,
    performance: '15.7s average'
  },
  e2eTests: {
    total: 28,
    passed: 26,
    failed: 2,
    coverage: 62.1,
    performance: '3.2m average'
  },
  performance: {
    lighthouse: 94,
    coreWebVitals: 'PASS',
    loadTime: '1.8s',
    bundleSize: '847KB'
  },
  security: {
    vulnerabilities: 0,
    owasp: 'PASS',
    dependencies: 'UP_TO_DATE'
  },
  accessibility: {
    wcag: 'AA',
    violations: 0,
    score: 98
  }
};

// Generate testing report
function generateTestReport() {
  return `
# 📋 Testing Report - ${new Date().toISOString().split('T')[0]}

## ✅ Test Results Summary

- **Overall Status**: ${calculateOverallStatus()}
- **Total Tests**: ${calculateTotalTests()}
- **Success Rate**: ${calculateSuccessRate()}%
- **Coverage**: ${calculateAverageCoverage()}%

## 🧪 Test Breakdown

### Unit Tests
- ✅ **${testingMetrics.unitTests.passed}** passed
- ❌ **${testingMetrics.unitTests.failed}** failed
- 📊 **${testingMetrics.unitTests.coverage}%** coverage

### Integration Tests  
- ✅ **${testingMetrics.integrationTests.passed}** passed
- ❌ **${testingMetrics.integrationTests.failed}** failed
- 📊 **${testingMetrics.integrationTests.coverage}%** coverage

### E2E Tests
- ✅ **${testingMetrics.e2eTests.passed}** passed
- ❌ **${testingMetrics.e2eTests.failed}** failed
- 📊 **${testingMetrics.e2eTests.coverage}%** coverage

## ⚡ Performance
- **Lighthouse Score**: ${testingMetrics.performance.lighthouse}/100
- **Core Web Vitals**: ${testingMetrics.performance.coreWebVitals}
- **Load Time**: ${testingMetrics.performance.loadTime}
- **Bundle Size**: ${testingMetrics.performance.bundleSize}

## 🔒 Security
- **Vulnerabilities**: ${testingMetrics.security.vulnerabilities}
- **OWASP**: ${testingMetrics.security.owasp}
- **Dependencies**: ${testingMetrics.security.dependencies}

## ♿ Accessibility
- **WCAG Level**: ${testingMetrics.accessibility.wcag}
- **Violations**: ${testingMetrics.accessibility.violations}
- **Accessibility Score**: ${testingMetrics.accessibility.score}/100

## 🎯 Recommendations

${generateRecommendations()}
  `;
}
```

---

## ✅ Testing Checklist Pre-Launch

### **Final Quality Gate**

```markdown
# 🚀 Pre-Launch Testing Checklist

## ✅ Functional Testing
- [ ] All core features work correctly
- [ ] AI generation produces valid components
- [ ] Design system integration works
- [ ] User authentication/authorization works
- [ ] Payment/subscription flow works
- [ ] Export functionality works

## ✅ Performance Testing
- [ ] Lighthouse score > 90
- [ ] Core Web Vitals pass
- [ ] Bundle size < 1MB
- [ ] API response times < 2s
- [ ] Load testing passes (100 concurrent users)

## ✅ Security Testing
- [ ] No critical vulnerabilities
- [ ] OWASP Top 10 covered
- [ ] Authentication secure
- [ ] Input validation works
- [ ] Rate limiting effective

## ✅ Accessibility Testing
- [ ] WCAG 2.2 AA compliance
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Color contrast meets standards
- [ ] Focus indicators visible

## ✅ Browser/Device Testing
- [ ] Chrome/Chromium works
- [ ] Firefox works
- [ ] Safari/WebKit works
- [ ] Mobile devices work
- [ ] Tablet layouts work
- [ ] Responsive design works

## ✅ User Experience Testing
- [ ] UAT scenarios pass
- [ ] First-time user onboarding smooth
- [ ] Professional workflow efficient
- [ ] Error handling helpful
- [ ] Loading states clear

## ✅ Integration Testing
- [ ] Claude API integration stable
- [ ] Database operations work
- [ ] External services work
- [ ] Payment processing works
- [ ] Email notifications work

## ✅ Deployment Testing
- [ ] CI/CD pipeline works
- [ ] Production deployment successful
- [ ] Environment variables set
- [ ] Database migrations applied
- [ ] Health checks pass

## 🎯 Launch Criteria Met
- [ ] **95%+ test pass rate**
- [ ] **90%+ user satisfaction** (UAT)
- [ ] **Zero critical bugs**
- [ ] **Performance targets met**
- [ ] **Security audit passed**
- [ ] **Accessibility certified**

---

**Status**: ✅ READY FOR LAUNCH
**Sign-off**: QA Team Lead
**Date**: [Launch Date]
```

---

**Este plan de testing garantiza que Anclora Render cumpla con los más altos estándares de calidad antes del lanzamiento. La combinación de testing automatizado, manual y de usuario asegura una experiencia excepcional desde el día 1.**