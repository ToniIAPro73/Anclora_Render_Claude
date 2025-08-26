# 🚀 Estrategia DevOps y Deployment - Anclora Render

## 📋 Índice DevOps

1. [**Arquitectura de Infraestructura**](#arquitectura-de-infraestructura)
2. [**Entornos y Ambientes**](#entornos-y-ambientes)
3. [**CI/CD Pipeline Completo**](#cicd-pipeline-completo)
4. [**Containerización con Docker**](#containerización-con-docker)
5. [**Orquestación y Escalado**](#orquestación-y-escalado)
6. [**Monitoreo y Observabilidad**](#monitoreo-y-observabilidad)
7. [**Backup y Disaster Recovery**](#backup-y-disaster-recovery)
8. [**Seguridad y Compliance**](#seguridad-y-compliance)
9. [**Performance y Optimización**](#performance-y-optimización)
10. [**Costs y Resource Management**](#costs-y-resource-management)

---

## 🏗️ Arquitectura de Infraestructura

### **Diagrama de Arquitectura Cloud**

```mermaid
graph TB
    subgraph "CDN & Edge"
        CF[CloudFlare CDN]
        EDGE[Edge Functions]
    end
    
    subgraph "Frontend"
        VERCEL[Vercel Frontend]
        STATIC[Static Assets]
    end
    
    subgraph "API Layer"
        LB[Load Balancer]
        API1[API Instance 1]
        API2[API Instance 2]
        API3[API Instance 3]
    end
    
    subgraph "AI Services"
        CLAUDE[Claude API]
        CACHE[Redis Cache]
        QUEUE[Job Queue]
    end
    
    subgraph "Data Layer"
        DB[PostgreSQL Primary]
        DBS[PostgreSQL Replica]
        S3[AWS S3 Storage]
    end
    
    subgraph "Monitoring"
        SENTRY[Sentry Errors]
        DATADOG[DataDog Metrics]
        LOGS[LogDNA Logs]
    end
    
    CF --> VERCEL
    VERCEL --> LB
    LB --> API1
    LB --> API2
    LB --> API3
    API1 --> CLAUDE
    API1 --> CACHE
    API1 --> DB
    API2 --> CLAUDE
    API2 --> CACHE
    API2 --> DBS
    API3 --> CACHE
    API3 --> DB
    API1 --> S3
    API1 --> SENTRY
    API1 --> DATADOG
    API1 --> LOGS
```

### **Stack Tecnológico Cloud**

| **Capa** | **Tecnología** | **Proveedor** | **Justificación** |
|----------|----------------|---------------|-------------------|
| **CDN** | CloudFlare | CloudFlare | Global edge network, DDoS protection |
| **Frontend** | Vercel | Vercel | Optimal Next.js/React performance |
| **API Backend** | Railway/Render | Railway | Easy Node.js deployment, auto-scaling |
| **Database** | Neon/Supabase | Neon | Serverless Postgres, auto-scaling |
| **Cache** | Upstash Redis | Upstash | Serverless Redis, pay-per-request |
| **Storage** | AWS S3 | AWS | Reliable file storage, CDN integration |
| **Monitoring** | Sentry + DataDog | SaaS | Comprehensive error tracking + metrics |
| **CI/CD** | GitHub Actions | GitHub | Native integration, cost-effective |

---

## 🌍 Entornos y Ambientes

### **Estrategia Multi-Environment**

```yaml
# environments.yml
environments:
  development:
    domain: localhost:3000
    database: postgresql://localhost/anclora_dev
    redis: redis://localhost:6379
    ai_provider: claude-dev
    features:
      - debug_mode
      - hot_reload
      - mock_payments
    
  staging:
    domain: staging.anclora.com
    database: ${STAGING_DATABASE_URL}
    redis: ${STAGING_REDIS_URL}
    ai_provider: claude-staging
    features:
      - real_payments
      - analytics_test
      - feature_flags
    
  production:
    domain: render.anclora.com
    database: ${PRODUCTION_DATABASE_URL}
    redis: ${PRODUCTION_REDIS_URL}
    ai_provider: claude-production
    features:
      - real_payments
      - full_analytics
      - performance_monitoring
      - security_headers
```

### **Environment Configuration**

```javascript
// config/environments.js
const environments = {
  development: {
    database: {
      url: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/anclora_dev',
      ssl: false,
      pool: { min: 2, max: 10 }
    },
    redis: {
      url: process.env.REDIS_URL || 'redis://localhost:6379',
      retryDelayOnFailover: 100,
      maxRetriesPerRequest: 3
    },
    ai: {
      provider: 'anthropic',
      apiKey: process.env.ANTHROPIC_API_KEY_DEV,
      model: 'claude-3-sonnet-20240229',
      maxTokens: 2000,
      timeout: 30000
    },
    monitoring: {
      sentry: { enabled: false },
      datadog: { enabled: false },
      logging: { level: 'debug', console: true }
    }
  },
  
  staging: {
    database: {
      url: process.env.STAGING_DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      pool: { min: 5, max: 20 }
    },
    redis: {
      url: process.env.STAGING_REDIS_URL,
      retryDelayOnFailover: 100,
      maxRetriesPerRequest: 3,
      connectTimeout: 60000
    },
    ai: {
      provider: 'anthropic',
      apiKey: process.env.ANTHROPIC_API_KEY_STAGING,
      model: 'claude-3-sonnet-20240229',
      maxTokens: 2000,
      timeout: 45000,
      retries: 3
    },
    monitoring: {
      sentry: { 
        enabled: true,
        dsn: process.env.SENTRY_DSN_STAGING,
        environment: 'staging'
      },
      datadog: {
        enabled: true,
        apiKey: process.env.DATADOG_API_KEY,
        service: 'anclora-render-staging'
      },
      logging: { level: 'info', console: false }
    }
  },
  
  production: {
    database: {
      url: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      pool: { min: 10, max: 50 },
      acquireConnectionTimeout: 60000,
      connectionTimeoutMillis: 30000
    },
    redis: {
      url: process.env.REDIS_URL,
      retryDelayOnFailover: 500,
      maxRetriesPerRequest: 5,
      connectTimeout: 60000,
      lazyConnect: true
    },
    ai: {
      provider: 'anthropic',
      apiKey: process.env.ANTHROPIC_API_KEY,
      model: 'claude-3-sonnet-20240229',
      maxTokens: 2000,
      timeout: 60000,
      retries: 5,
      rateLimiting: {
        requests: 100,
        window: 60000
      }
    },
    monitoring: {
      sentry: {
        enabled: true,
        dsn: process.env.SENTRY_DSN,
        environment: 'production',
        tracesSampleRate: 0.1,
        release: process.env.VERCEL_GIT_COMMIT_SHA
      },
      datadog: {
        enabled: true,
        apiKey: process.env.DATADOG_API_KEY,
        service: 'anclora-render',
        env: 'production'
      },
      logging: { 
        level: 'warn', 
        console: false,
        file: true,
        maxFiles: 10,
        maxSize: '20m'
      }
    },
    security: {
      helmet: {
        contentSecurityPolicy: {
          directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://js.stripe.com", "https://challenges.cloudflare.com"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'", "https://api.anthropic.com", "https://api.stripe.com"]
          }
        },
        hsts: {
          maxAge: 31536000,
          includeSubDomains: true,
          preload: true
        }
      },
      cors: {
        origin: ["https://render.anclora.com", "https://anclora.com"],
        credentials: true
      },
      rateLimiting: {
        windowMs: 15 * 60 * 1000,
        max: 1000,
        standardHeaders: true,
        legacyHeaders: false
      }
    }
  }
};

module.exports = environments[process.env.NODE_ENV || 'development'];
```

---

## 🔄 CI/CD Pipeline Completo

### **GitHub Actions Workflow Avanzado**

```yaml
# .github/workflows/main.yml
name: Anclora Render CI/CD

on:
  push:
    branches: [main, develop]
    paths-ignore: ['docs/**', '*.md']
  pull_request:
    branches: [main]
    types: [opened, synchronize, reopened]

env:
  NODE_VERSION: '18'
  CACHE_VERSION: v1

jobs:
  # ===============================================
  # JOB 1: CODE QUALITY & SECURITY
  # ===============================================
  quality:
    name: Code Quality & Security
    runs-on: ubuntu-latest
    timeout-minutes: 10
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      with:
        fetch-depth: 0  # Needed for SonarCloud
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: ${{ env.NODE_VERSION }}
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: ESLint Check
      run: npm run lint:check
    
    - name: Prettier Check
      run: npm run format:check
    
    - name: TypeScript Check
      run: npm run type-check
    
    - name: Security Audit
      run: |
        npm audit --audit-level=high
        npx audit-ci --high
    
    - name: Dependency License Check
      run: npx license-checker --onlyAllow 'MIT;Apache-2.0;BSD;ISC'
    
    - name: SonarCloud Scan
      uses: SonarSource/sonarcloud-github-action@master
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}

  # ===============================================
  # JOB 2: COMPREHENSIVE TESTING
  # ===============================================
  test:
    name: Test Suite
    runs-on: ubuntu-latest
    timeout-minutes: 30
    needs: quality
    
    strategy:
      matrix:
        test-group: [unit, integration, e2e]
    
    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: anclora_test
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 10
      
      redis:
        image: redis:7
        ports:
          - 6379:6379
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
    - name: Checkout code
      uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: ${{ env.NODE_VERSION }}
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Setup test database
      run: |
        npm run db:migrate:test
        npm run db:seed:test
      env:
        DATABASE_URL: postgresql://postgres:postgres@localhost:5432/anclora_test
    
    - name: Run Unit Tests
      if: matrix.test-group == 'unit'
      run: npm run test:unit -- --coverage --maxWorkers=4
      env:
        NODE_ENV: test
        DATABASE_URL: postgresql://postgres:postgres@localhost:5432/anclora_test
        REDIS_URL: redis://localhost:6379
    
    - name: Run Integration Tests
      if: matrix.test-group == 'integration'
      run: npm run test:integration -- --maxWorkers=2
      env:
        NODE_ENV: test
        DATABASE_URL: postgresql://postgres:postgres@localhost:5432/anclora_test
        REDIS_URL: redis://localhost:6379
        ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY_TEST }}
    
    - name: Run E2E Tests
      if: matrix.test-group == 'e2e'
      run: |
        npm run build
        npm run start:test &
        sleep 30
        npm run test:e2e
      env:
        NODE_ENV: test
        DATABASE_URL: postgresql://postgres:postgres@localhost:5432/anclora_test
        REDIS_URL: redis://localhost:6379
    
    - name: Upload Coverage
      if: matrix.test-group == 'unit'
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage/lcov.info
        flags: unittests
        name: codecov-umbrella
        fail_ci_if_error: true

  # ===============================================
  # JOB 3: PERFORMANCE & LIGHTHOUSE
  # ===============================================
  performance:
    name: Performance Testing
    runs-on: ubuntu-latest
    timeout-minutes: 15
    needs: test
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: ${{ env.NODE_VERSION }}
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build application
      run: npm run build
    
    - name: Start application
      run: |
        npm run start &
        sleep 30
      env:
        NODE_ENV: production
        DATABASE_URL: ${{ secrets.TEST_DATABASE_URL }}
    
    - name: Lighthouse CI
      uses: treosh/lighthouse-ci-action@v10
      with:
        configPath: '.lighthouserc.json'
        uploadArtifacts: true
        temporaryPublicStorage: true
    
    - name: Bundle Size Check
      run: |
        npm run analyze
        node scripts/check-bundle-size.js
    
    - name: Load Testing
      run: |
        npm install -g k6
        k6 run tests/load/basic-load-test.js

  # ===============================================
  # JOB 4: SECURITY SCANNING
  # ===============================================
  security:
    name: Security Scanning
    runs-on: ubuntu-latest
    timeout-minutes: 10
    needs: quality
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
    
    - name: Run Snyk Security Scan
      uses: snyk/actions/node@master
      env:
        SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
      with:
        args: --severity-threshold=high
    
    - name: OWASP ZAP Baseline Scan
      uses: zaproxy/action-baseline@v0.7.0
      with:
        target: 'https://staging.anclora.com'
        rules_file_name: '.zap/rules.tsv'
        cmd_options: '-a'

  # ===============================================
  # JOB 5: BUILD & DEPLOY
  # ===============================================
  build:
    name: Build Application
    runs-on: ubuntu-latest
    timeout-minutes: 15
    needs: [test, performance, security]
    
    outputs:
      image-digest: ${{ steps.build.outputs.digest }}
      deployment-url: ${{ steps.deploy.outputs.url }}
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: ${{ env.NODE_VERSION }}
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Generate build info
      run: |
        echo "BUILD_TIME=$(date -u +%Y-%m-%dT%H:%M:%SZ)" >> $GITHUB_ENV
        echo "BUILD_SHA=${GITHUB_SHA:0:8}" >> $GITHUB_ENV
        echo "BUILD_REF=${GITHUB_REF#refs/heads/}" >> $GITHUB_ENV
    
    - name: Build application
      run: npm run build
      env:
        NODE_ENV: production
        NEXT_PUBLIC_BUILD_TIME: ${{ env.BUILD_TIME }}
        NEXT_PUBLIC_BUILD_SHA: ${{ env.BUILD_SHA }}
        NEXT_PUBLIC_BUILD_REF: ${{ env.BUILD_REF }}
    
    - name: Upload build artifacts
      uses: actions/upload-artifact@v3
      with:
        name: build-artifacts
        path: |
          dist/
          .next/
        retention-days: 7

  # ===============================================
  # JOB 6: DEPLOY TO STAGING
  # ===============================================
  deploy-staging:
    name: Deploy to Staging
    runs-on: ubuntu-latest
    timeout-minutes: 10
    needs: build
    if: github.ref == 'refs/heads/develop'
    environment: staging
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
    
    - name: Download build artifacts
      uses: actions/download-artifact@v3
      with:
        name: build-artifacts
    
    - name: Deploy to Vercel (Staging)
      id: deploy
      uses: amondnet/vercel-action@v25
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
        vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
        working-directory: ./
        alias-domains: staging.anclora.com
    
    - name: Update staging environment
      run: |
        curl -X POST "${{ secrets.RAILWAY_WEBHOOK_STAGING }}" \
          -H "Authorization: Bearer ${{ secrets.RAILWAY_TOKEN }}" \
          -H "Content-Type: application/json" \
          -d '{"branch": "develop", "commit": "${{ github.sha }}"}'
    
    - name: Run smoke tests
      run: |
        sleep 60  # Wait for deployment
        curl -f https://staging.anclora.com/api/health || exit 1
        npm run test:smoke -- --baseUrl=https://staging.anclora.com

  # ===============================================
  # JOB 7: DEPLOY TO PRODUCTION
  # ===============================================
  deploy-production:
    name: Deploy to Production
    runs-on: ubuntu-latest
    timeout-minutes: 15
    needs: build
    if: github.ref == 'refs/heads/main'
    environment: production
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
    
    - name: Download build artifacts
      uses: actions/download-artifact@v3
      with:
        name: build-artifacts
    
    - name: Deploy to Vercel (Production)
      id: deploy
      uses: amondnet/vercel-action@v25
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
        vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
        vercel-args: '--prod'
        working-directory: ./
    
    - name: Update production environment
      run: |
        curl -X POST "${{ secrets.RAILWAY_WEBHOOK_PRODUCTION }}" \
          -H "Authorization: Bearer ${{ secrets.RAILWAY_TOKEN }}" \
          -H "Content-Type: application/json" \
          -d '{"branch": "main", "commit": "${{ github.sha }}"}'
    
    - name: Database migrations
      run: |
        npm run db:migrate:production
      env:
        DATABASE_URL: ${{ secrets.DATABASE_URL }}
    
    - name: Warm up application
      run: |
        sleep 120  # Wait for deployment
        curl -f https://render.anclora.com/api/health || exit 1
        curl -f https://render.anclora.com/ || exit 1
    
    - name: Run production smoke tests
      run: |
        npm run test:smoke -- --baseUrl=https://render.anclora.com
    
    - name: Update monitoring
      run: |
        curl -X POST "https://api.datadoghq.com/api/v1/events" \
          -H "DD-API-KEY: ${{ secrets.DATADOG_API_KEY }}" \
          -H "Content-Type: application/json" \
          -d '{
            "title": "Anclora Render Deployment",
            "text": "Successfully deployed version ${{ github.sha }} to production",
            "tags": ["environment:production", "service:anclora-render"],
            "alert_type": "success"
          }'
    
    - name: Notify team
      uses: 8398a7/action-slack@v3
      with:
        status: ${{ job.status }}
        channel: '#deployments'
        webhook_url: ${{ secrets.SLACK_WEBHOOK }}
      if: always()

  # ===============================================
  # JOB 8: POST-DEPLOYMENT VALIDATION
  # ===============================================
  validate:
    name: Post-Deployment Validation
    runs-on: ubuntu-latest
    timeout-minutes: 20
    needs: [deploy-staging, deploy-production]
    if: always() && (needs.deploy-staging.result == 'success' || needs.deploy-production.result == 'success')
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: ${{ env.NODE_VERSION }}
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Determine target environment
      run: |
        if [[ "${{ github.ref }}" == "refs/heads/main" ]]; then
          echo "TARGET_URL=https://render.anclora.com" >> $GITHUB_ENV
          echo "ENVIRONMENT=production" >> $GITHUB_ENV
        else
          echo "TARGET_URL=https://staging.anclora.com" >> $GITHUB_ENV
          echo "ENVIRONMENT=staging" >> $GITHUB_ENV
        fi
    
    - name: Health check validation
      run: |
        response=$(curl -s -o /dev/null -w "%{http_code}" ${{ env.TARGET_URL }}/api/health)
        if [ "$response" != "200" ]; then
          echo "Health check failed with status: $response"
          exit 1
        fi
    
    - name: API functionality validation
      run: |
        npm run test:api-validation -- --baseUrl=${{ env.TARGET_URL }}
      env:
        TEST_USER_EMAIL: ${{ secrets.TEST_USER_EMAIL }}
        TEST_USER_PASSWORD: ${{ secrets.TEST_USER_PASSWORD }}
    
    - name: Performance validation
      run: |
        npm install -g lighthouse
        lighthouse ${{ env.TARGET_URL }} \
          --chrome-flags="--headless" \
          --output json \
          --output-path ./lighthouse-results.json
        
        node scripts/validate-performance.js ./lighthouse-results.json
    
    - name: Security headers validation
      run: |
        npm run test:security-headers -- --url=${{ env.TARGET_URL }}
    
    - name: Create deployment report
      run: |
        node scripts/generate-deployment-report.js \
          --environment=${{ env.ENVIRONMENT }} \
          --commit=${{ github.sha }} \
          --url=${{ env.TARGET_URL }}
    
    - name: Upload deployment report
      uses: actions/upload-artifact@v3
      with:
        name: deployment-report-${{ env.ENVIRONMENT }}
        path: deployment-report.json
```

---

## 🐳 Containerización con Docker

### **Dockerfile Multi-stage**

```dockerfile
# Dockerfile
# ============================================
# STAGE 1: Base Dependencies
# ============================================
FROM node:18-alpine AS base
LABEL maintainer="Anclora Team <dev@anclora.com>"

# Install system dependencies
RUN apk add --no-cache \
    libc6-compat \
    python3 \
    make \
    g++ \
    && rm -rf /var/cache/apk/*

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# ============================================
# STAGE 2: Dependencies Installation
# ============================================
FROM base AS deps

# Install dependencies
RUN npm ci --only=production --ignore-scripts
RUN npx prisma generate

# ============================================
# STAGE 3: Development Dependencies
# ============================================
FROM base AS dev-deps

# Install all dependencies (including dev)
RUN npm ci --ignore-scripts
RUN npx prisma generate

# ============================================
# STAGE 4: Build Stage
# ============================================
FROM dev-deps AS builder

# Copy source code
COPY . .

# Build application
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build
RUN npm run build:api

# ============================================
# STAGE 5: Production Frontend
# ============================================
FROM node:18-alpine AS frontend
LABEL service="anclora-render-frontend"

WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Set proper permissions
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js

CMD ["node", "server.js"]

# ============================================
# STAGE 6: Production API
# ============================================
FROM node:18-alpine AS api
LABEL service="anclora-render-api"

WORKDIR /app

# Install runtime dependencies
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup --system --gid 1001 api
RUN adduser --system --uid 1001 api

# Copy production dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY package*.json ./

# Copy entrypoint script
COPY scripts/docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Set proper permissions
RUN chown -R api:api /app

USER api

EXPOSE 5000
ENV PORT=5000
ENV NODE_ENV=production

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD node dist/healthcheck.js

ENTRYPOINT ["dumb-init", "docker-entrypoint.sh"]
CMD ["node", "dist/server.js"]
```

### **Docker Compose Development**

```yaml
# docker-compose.yml
version: '3.8'

services:
  # ============================================
  # Database Service
  # ============================================
  postgres:
    image: postgres:15-alpine
    container_name: anclora-db
    restart: unless-stopped
    environment:
      POSTGRES_DB: anclora_dev
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init-scripts:/docker-entrypoint-initdb.d
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - anclora-network

  # ============================================
  # Redis Cache Service
  # ============================================
  redis:
    image: redis:7-alpine
    container_name: anclora-cache
    restart: unless-stopped
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
      - ./redis.conf:/usr/local/etc/redis/redis.conf
    command: redis-server /usr/local/etc/redis/redis.conf
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 5
    networks:
      - anclora-network

  # ============================================
  # API Backend Service
  # ============================================
  api:
    build:
      context: .
      dockerfile: Dockerfile
      target: api
    container_name: anclora-api
    restart: unless-stopped
    ports:
      - "5000:5000"
    environment:
      NODE_ENV: development
      PORT: 5000
      DATABASE_URL: postgresql://postgres:postgres@postgres:5432/anclora_dev
      REDIS_URL: redis://redis:6379
      JWT_SECRET: dev-jwt-secret
      ANTHROPIC_API_KEY: ${ANTHROPIC_API_KEY}
    volumes:
      - .:/app
      - /app/node_modules
      - api_logs:/app/logs
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 60s
    networks:
      - anclora-network

  # ============================================
  # Frontend Service
  # ============================================
  frontend:
    build:
      context: .
      dockerfile: Dockerfile
      target: frontend
    container_name: anclora-frontend
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: development
      PORT: 3000
      NEXT_PUBLIC_API_URL: http://localhost:5000/api
    volumes:
      - .:/app
      - /app/node_modules
      - /app/.next
    depends_on:
      - api
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000"]
      interval: 30s
      timeout: 5s
      retries: 3
    networks:
      - anclora-network

  # ============================================
  # Monitoring Services
  # ============================================
  prometheus:
    image: prom/prometheus:latest
    container_name: anclora-prometheus
    restart: unless-stopped
    ports:
      - "9090:9090"
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--web.console.libraries=/etc/prometheus/console_libraries'
      - '--web.console.templates=/etc/prometheus/consoles'
      - '--storage.tsdb.retention.time=200h'
      - '--web.enable-lifecycle'
    networks:
      - anclora-network

  grafana:
    image: grafana/grafana:latest
    container_name: anclora-grafana
    restart: unless-stopped
    ports:
      - "3001:3000"
    environment:
      GF_SECURITY_ADMIN_USER: admin
      GF_SECURITY_ADMIN_PASSWORD: admin123
    volumes:
      - grafana_data:/var/lib/grafana
      - ./monitoring/grafana/provisioning:/etc/grafana/provisioning
    depends_on:
      - prometheus
    networks:
      - anclora-network

  # ============================================
  # Load Testing Service
  # ============================================
  k6:
    image: grafana/k6:latest
    container_name: anclora-k6
    volumes:
      - ./tests/load:/scripts
    networks:
      - anclora-network
    profiles:
      - testing

volumes:
  postgres_data:
    driver: local
  redis_data:
    driver: local
  api_logs:
    driver: local
  prometheus_data:
    driver: local
  grafana_data:
    driver: local

networks:
  anclora-network:
    driver: bridge
    ipam:
      config:
        - subnet: 172.20.0.0/16
```

### **Production Docker Compose**

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  # ============================================
  # API Service with Auto-scaling
  # ============================================
  api:
    image: anclora/render-api:${VERSION:-latest}
    restart: unless-stopped
    deploy:
      replicas: 3
      update_config:
        parallelism: 1
        delay: 30s
        failure_action: rollback
      restart_policy:
        condition: on-failure
        delay: 5s
        max_attempts: 3
      resources:
        limits:
          cpus: '1.0'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M
    environment:
      NODE_ENV: production
      PORT: 5000
      DATABASE_URL: ${DATABASE_URL}
      REDIS_URL: ${REDIS_URL}
      JWT_SECRET: ${JWT_SECRET}
      ANTHROPIC_API_KEY: ${ANTHROPIC_API_KEY}
      SENTRY_DSN: ${SENTRY_DSN}
      DATADOG_API_KEY: ${DATADOG_API_KEY}
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.api.rule=Host(`api.anclora.com`)"
      - "traefik.http.routers.api.tls=true"
      - "traefik.http.routers.api.tls.certresolver=letsencrypt"
      - "traefik.http.services.api.loadbalancer.server.port=5000"
      - "traefik.http.middlewares.api-ratelimit.ratelimit.average=100"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 60s
    networks:
      - traefik-public
      - internal

  # ============================================
  # Reverse Proxy & Load Balancer
  # ============================================
  traefik:
    image: traefik:v2.10
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
      - "8080:8080"  # Dashboard
    environment:
      - TRAEFIK_API_DASHBOARD=true
      - TRAEFIK_CERTIFICATESRESOLVERS_LETSENCRYPT_ACME_TLSCHALLENGE=true
      - TRAEFIK_CERTIFICATESRESOLVERS_LETSENCRYPT_ACME_EMAIL=${ACME_EMAIL}
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - traefik_data:/data
      - ./traefik/traefik.yml:/etc/traefik/traefik.yml:ro
      - ./traefik/dynamic:/etc/traefik/dynamic:ro
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.dashboard.rule=Host(`traefik.anclora.com`)"
      - "traefik.http.routers.dashboard.tls=true"
      - "traefik.http.routers.dashboard.service=api@internal"
    networks:
      - traefik-public

volumes:
  traefik_data:
    external: true

networks:
  traefik-public:
    external: true
  internal:
    external: false
```

---

## 🎯 Monitoreo y Observabilidad

### **Configuración de Monitoring Stack**

```javascript
// monitoring/metrics.js
const prometheus = require('prom-client');
const logger = require('../utils/logger');

// Create a Registry to register the metrics
const register = new prometheus.Registry();

// Add default metrics
prometheus.collectDefaultMetrics({ register });

// Custom metrics
const httpRequestDuration = new prometheus.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10]
});

const aiGenerationDuration = new prometheus.Histogram({
  name: 'ai_generation_duration_seconds',
  help: 'Duration of AI component generation in seconds',
  labelNames: ['model', 'framework', 'status'],
  buckets: [1, 5, 10, 15, 30, 60, 120]
});

const aiGenerationTotal = new prometheus.Counter({
  name: 'ai_generation_total',
  help: 'Total number of AI generations',
  labelNames: ['model', 'framework', 'status']
});

const activeUsers = new prometheus.Gauge({
  name: 'active_users_total',
  help: 'Number of currently active users',
  labelNames: ['plan']
});

const databaseConnections = new prometheus.Gauge({
  name: 'database_connections_active',
  help: 'Number of active database connections'
});

const redisConnections = new prometheus.Gauge({
  name: 'redis_connections_active',
  help: 'Number of active Redis connections'
});

const componentGenerationsPerMinute = new prometheus.Gauge({
  name: 'components_generated_per_minute',
  help: 'Components generated in the last minute'
});

// Register metrics
register.registerMetric(httpRequestDuration);
register.registerMetric(aiGenerationDuration);
register.registerMetric(aiGenerationTotal);
register.registerMetric(activeUsers);
register.registerMetric(databaseConnections);
register.registerMetric(redisConnections);
register.registerMetric(componentGenerationsPerMinute);

// Middleware for HTTP metrics
const httpMetricsMiddleware = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    const route = req.route ? req.route.path : req.path;
    
    httpRequestDuration
      .labels(req.method, route, res.statusCode)
      .observe(duration);
  });
  
  next();
};

// Track AI generation metrics
const trackAIGeneration = async (model, framework, duration, status) => {
  aiGenerationDuration
    .labels(model, framework, status)
    .observe(duration);
    
  aiGenerationTotal
    .labels(model, framework, status)
    .inc();
    
  logger.info('AI generation tracked', {
    model,
    framework,
    duration,
    status
  });
};

// Update active users periodically
const updateActiveUsers = async () => {
  try {
    const counts = await prisma.user.groupBy({
      by: ['plan'],
      where: {
        lastActiveAt: {
          gte: new Date(Date.now() - 15 * 60 * 1000) // Last 15 minutes
        }
      },
      _count: true
    });
    
    counts.forEach(({ plan, _count }) => {
      activeUsers.labels(plan).set(_count);
    });
  } catch (error) {
    logger.error('Failed to update active users metric', error);
  }
};

// Update database connections
const updateDatabaseMetrics = async () => {
  try {
    const poolStats = prisma.$pool?.totalCount || 0;
    databaseConnections.set(poolStats);
  } catch (error) {
    logger.error('Failed to update database metrics', error);
  }
};

// Start metric collection
const startMetricsCollection = () => {
  // Update metrics every 30 seconds
  setInterval(updateActiveUsers, 30000);
  setInterval(updateDatabaseMetrics, 30000);
  
  logger.info('Metrics collection started');
};

module.exports = {
  register,
  httpMetricsMiddleware,
  trackAIGeneration,
  startMetricsCollection
};
```

### **Alerting Configuration**

```yaml
# monitoring/alerts.yml
groups:
  - name: anclora-render-alerts
    rules:
      # =============================================
      # Application Health Alerts
      # =============================================
      - alert: ServiceDown
        expr: up{job="anclora-render"} == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Anclora Render service is down"
          description: "Service {{ $labels.instance }} has been down for more than 1 minute"
      
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.1
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"
          description: "Error rate is {{ $value | humanizePercentage }} over the last 5 minutes"
      
      - alert: HighResponseTime
        expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 2
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High response time"
          description: "95th percentile response time is {{ $value }}s"

      # =============================================
      # AI Service Alerts
      # =============================================
      - alert: AIGenerationFailures
        expr: rate(ai_generation_total{status="error"}[5m]) > 0.05
        for: 2m
        labels:
          severity: warning
        annotations:
          summary: "High AI generation failure rate"
          description: "AI generation failure rate is {{ $value | humanizePercentage }}"
      
      - alert: AIGenerationLatency
        expr: histogram_quantile(0.95, rate(ai_generation_duration_seconds_bucket[10m])) > 30
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High AI generation latency"
          description: "95th percentile AI generation time is {{ $value }}s"

      # =============================================
      # Infrastructure Alerts
      # =============================================
      - alert: HighCPUUsage
        expr: 100 - (avg by(instance) (irate(node_cpu_seconds_total{mode="idle"}[5m])) * 100) > 80
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High CPU usage"
          description: "CPU usage is {{ $value }}% on {{ $labels.instance }}"
      
      - alert: HighMemoryUsage
        expr: (1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100 > 85
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High memory usage"
          description: "Memory usage is {{ $value }}% on {{ $labels.instance }}"
      
      - alert: DatabaseConnectionsHigh
        expr: database_connections_active > 40
        for: 2m
        labels:
          severity: warning
        annotations:
          summary: "High database connection count"
          description: "Database has {{ $value }} active connections"
      
      - alert: RedisConnectionLoss
        expr: redis_connections_active == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Redis connection lost"
          description: "No active Redis connections detected"

      # =============================================
      # Business Metrics Alerts
      # =============================================
      - alert: LowComponentGeneration
        expr: rate(ai_generation_total[1h]) < 0.1
        for: 10m
        labels:
          severity: info
        annotations:
          summary: "Low component generation rate"
          description: "Component generation rate is {{ $value }} per second"
      
      - alert: UserActivityDrop
        expr: sum(active_users_total) < 10
        for: 15m
        labels:
          severity: info
        annotations:
          summary: "Low user activity"
          description: "Only {{ $value }} active users in the last 15 minutes"

# Notification channels
alertmanager_config: |
  global:
    smtp_smarthost: 'smtp.gmail.com:587'
    smtp_from: 'alerts@anclora.com'
    smtp_auth_username: '{{ SMTP_USER }}'
    smtp_auth_password: '{{ SMTP_PASSWORD }}'
  
  route:
    group_by: ['alertname']
    group_wait: 10s
    group_interval: 10s
    repeat_interval: 1h
    receiver: 'default'
    routes:
      - match:
          severity: critical
        receiver: 'critical-alerts'
      - match:
          severity: warning
        receiver: 'warning-alerts'
  
  receivers:
    - name: 'default'
      email_configs:
        - to: 'dev-team@anclora.com'
          subject: 'Anclora Render Alert: {{ .GroupLabels.alertname }}'
          body: |
            {{ range .Alerts }}
            Alert: {{ .Annotations.summary }}
            Description: {{ .Annotations.description }}
            {{ end }}
    
    - name: 'critical-alerts'
      email_configs:
        - to: 'critical-alerts@anclora.com'
          subject: '🚨 CRITICAL: {{ .GroupLabels.alertname }}'
      slack_configs:
        - api_url: '{{ SLACK_WEBHOOK_URL }}'
          channel: '#critical-alerts'
          title: '🚨 Critical Alert: {{ .GroupLabels.alertname }}'
    
    - name: 'warning-alerts'
      slack_configs:
        - api_url: '{{ SLACK_WEBHOOK_URL }}'
          channel: '#alerts'
          title: '⚠️ Warning: {{ .GroupLabels.alertname }}'
```

---

## 💾 Backup y Disaster Recovery

### **Estrategia de Backup**

```bash
#!/bin/bash
# scripts/backup.sh

set -euo pipefail

# Configuration
BACKUP_DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"
S3_BUCKET="anclora-backups"
RETENTION_DAYS=30

# Database backup
echo "Starting database backup..."
pg_dump $DATABASE_URL | gzip > "$BACKUP_DIR/db_backup_$BACKUP_DATE.sql.gz"

# Redis backup
echo "Starting Redis backup..."
redis-cli --rdb "$BACKUP_DIR/redis_backup_$BACKUP_DATE.rdb"

# File uploads backup (if any)
if [ -d "/app/uploads" ]; then
    echo "Starting file uploads backup..."
    tar -czf "$BACKUP_DIR/uploads_backup_$BACKUP_DATE.tar.gz" /app/uploads/
fi

# Upload to S3
echo "Uploading backups to S3..."
aws s3 sync "$BACKUP_DIR" "s3://$S3_BUCKET/daily/" \
    --exclude "*" \
    --include "*$BACKUP_DATE*"

# Cleanup old backups
echo "Cleaning up old backups..."
find "$BACKUP_DIR" -name "*.gz" -mtime +$RETENTION_DAYS -delete
find "$BACKUP_DIR" -name "*.rdb" -mtime +$RETENTION_DAYS -delete

# Verify backup integrity
echo "Verifying backup integrity..."
gzip -t "$BACKUP_DIR/db_backup_$BACKUP_DATE.sql.gz"

echo "Backup completed successfully: $BACKUP_DATE"

# Send notification
curl -X POST "$SLACK_WEBHOOK_URL" \
    -H 'Content-type: application/json' \
    --data "{\"text\":\"✅ Backup completed successfully: $BACKUP_DATE\"}"
```

### **Disaster Recovery Plan**

```yaml
# disaster-recovery.yml
disaster_recovery:
  rto: "< 30 minutes"  # Recovery Time Objective
  rpo: "< 1 hour"      # Recovery Point Objective
  
  scenarios:
    database_failure:
      detection:
        - health_check_failures
        - connection_errors
        - data_corruption_alerts
      
      recovery_steps:
        - activate_database_replica
        - update_connection_strings
        - verify_data_integrity
        - resume_traffic
      
      estimated_time: "15 minutes"
    
    complete_service_failure:
      detection:
        - multiple_service_health_failures
        - infrastructure_alerts
        - user_reports
      
      recovery_steps:
        - deploy_to_backup_region
        - restore_latest_database_backup
        - update_dns_routing
        - verify_all_functionality
      
      estimated_time: "45 minutes"
    
    data_corruption:
      detection:
        - data_validation_errors
        - user_reports
        - automated_integrity_checks
      
      recovery_steps:
        - stop_write_operations
        - identify_corruption_scope
        - restore_from_point_in_time
        - validate_data_integrity
        - resume_operations
      
      estimated_time: "60 minutes"

  automated_failover:
    database:
      enabled: true
      replica_lag_threshold: "10 seconds"
      health_check_failures: 3
    
    application:
      enabled: true
      health_check_interval: "30 seconds"
      failure_threshold: 5
      
  backup_verification:
    frequency: "daily"
    automated_restore_test: "weekly"
    full_dr_test: "monthly"
```

---

## 🎯 Checklist de Pre-Producción

### **Final DevOps Readiness**

```markdown
# 🚀 DevOps Readiness Checklist

## ✅ Infrastructure
- [ ] Production environments configured
- [ ] Database setup with backups
- [ ] Redis cache configured
- [ ] CDN setup (CloudFlare)
- [ ] Load balancer configured
- [ ] SSL certificates installed
- [ ] Domain names configured

## ✅ Security
- [ ] Security headers implemented
- [ ] Rate limiting configured
- [ ] Input validation in place
- [ ] Authentication secured
- [ ] API keys properly managed
- [ ] OWASP security scan passed
- [ ] Vulnerability assessment complete

## ✅ Monitoring
- [ ] Application metrics collecting
- [ ] Error tracking (Sentry) configured
- [ ] Performance monitoring active
- [ ] Alerting rules configured
- [ ] Log aggregation working
- [ ] Health checks implemented
- [ ] Uptime monitoring active

## ✅ CI/CD
- [ ] Automated testing pipeline
- [ ] Code quality checks
- [ ] Security scanning
- [ ] Automated deployments
- [ ] Rollback procedures tested
- [ ] Blue-green deployment ready
- [ ] Feature flags implemented

## ✅ Performance
- [ ] Load testing completed
- [ ] CDN optimization verified
- [ ] Database queries optimized
- [ ] Caching strategy implemented
- [ ] Bundle size optimized
- [ ] Core Web Vitals passing

## ✅ Disaster Recovery
- [ ] Backup procedures automated
- [ ] Recovery procedures documented
- [ ] Failover mechanisms tested
- [ ] Data integrity verification
- [ ] Business continuity plan ready

## ✅ Documentation
- [ ] API documentation complete
- [ ] Runbook created
- [ ] Incident response procedures
- [ ] Architecture documentation
- [ ] Deployment guides
- [ ] Monitoring guides

---
**Status**: ✅ PRODUCTION READY
**DevOps Lead**: [Name]
**Date**: [Date]
**Final Review**: APPROVED
```

---

**Con esta estrategia DevOps completa, Anclora Render está preparado para un lanzamiento de producción robusto, escalable y confiable. La combinación de automatización, monitoreo y procedimientos de recuperación garantiza una operación fluida desde el día 1.**