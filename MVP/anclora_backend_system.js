// =============================================================================
// ANCLORA RENDER - BACKEND SYSTEM COMPLETO
// Arquitectura: Node.js + Express + PostgreSQL + Redis
// =============================================================================

// package.json
const packageJson = {
  "name": "anclora-render-backend",
  "version": "1.0.0",
  "description": "Backend API for Anclora Render - AI-powered component generator",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "migrate": "npx prisma migrate dev",
    "generate": "npx prisma generate",
    "test": "jest",
    "deploy": "vercel --prod"
  },
  "dependencies": {
    "express": "^4.18.2",
    "prisma": "^5.6.0",
    "@prisma/client": "^5.6.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "joi": "^17.11.0",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "rate-limiter-flexible": "^3.0.8",
    "redis": "^4.6.10",
    "stripe": "^14.5.0",
    "nodemailer": "^6.9.7",
    "winston": "^3.11.0",
    "anthropic": "^0.10.0",
    "uuid": "^9.0.1",
    "dotenv": "^16.3.1",
    "compression": "^1.7.4"
  },
  "devDependencies": {
    "nodemon": "^3.0.1",
    "jest": "^29.7.0",
    "supertest": "^6.3.3",
    "@types/node": "^20.9.0"
  }
};

// =============================================================================
// 1. DATABASE SCHEMA (Prisma)
// =============================================================================

// prisma/schema.prisma
const prismaSchema = `
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id              String   @id @default(cuid())
  email           String   @unique
  password        String?  // Null for OAuth users
  name            String?
  avatar          String?
  plan            Plan     @default(FREE)
  credits         Int      @default(50)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  lastActiveAt    DateTime @default(now())
  
  // OAuth fields
  githubId        String?  @unique
  googleId        String?  @unique
  
  // Subscription
  stripeCustomerId     String?  @unique
  stripeSubscriptionId String?  @unique
  subscriptionStatus   SubscriptionStatus @default(INACTIVE)
  subscriptionEndDate  DateTime?
  
  // Relations
  components      Component[]
  designSystems   DesignSystem[]
  analytics       Analytics[]
  sessions        Session[]
  
  @@map("users")
}

model Component {
  id              String   @id @default(cuid())
  name            String
  description     String?
  prompt          String   // Original AI prompt
  htmlCode        String   // Generated HTML
  cssCode         String?  // Generated CSS
  jsCode          String?  // Generated JavaScript
  framework       Framework @default(VANILLA)
  designSystemId  String?
  isPublic        Boolean  @default(false)
  viewCount       Int      @default(0)
  likeCount       Int      @default(0)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  // Relations
  userId          String
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  designSystem    DesignSystem? @relation(fields: [designSystemId], references: [id])
  versions        ComponentVersion[]
  
  @@map("components")
}

model ComponentVersion {
  id            String    @id @default(cuid())
  version       Int
  htmlCode      String
  cssCode       String?
  jsCode        String?
  changelog     String?
  createdAt     DateTime  @default(now())
  
  componentId   String
  component     Component @relation(fields: [componentId], references: [id], onDelete: Cascade)
  
  @@unique([componentId, version])
  @@map("component_versions")
}

model DesignSystem {
  id            String   @id @default(cuid())
  name          String
  description   String?
  config        Json     // CSS variables, tokens, etc.
  isDefault     Boolean  @default(false)
  isPublic      Boolean  @default(false)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  // Relations
  userId        String?  // Null for default systems
  user          User?    @relation(fields: [userId], references: [id], onDelete: Cascade)
  components    Component[]
  
  @@map("design_systems")
}

model Analytics {
  id               String   @id @default(cuid())
  event            String   // component_generated, component_viewed, etc.
  data             Json?    // Event metadata
  timestamp        DateTime @default(now())
  sessionId        String?
  ipAddress        String?
  userAgent        String?
  
  // Relations
  userId           String?
  user             User?    @relation(fields: [userId], references: [id])
  
  @@map("analytics")
}

model Session {
  id            String   @id @default(cuid())
  token         String   @unique
  expiresAt     DateTime
  createdAt     DateTime @default(now())
  
  userId        String
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@map("sessions")
}

enum Plan {
  FREE
  PRO
  ENTERPRISE
}

enum SubscriptionStatus {
  INACTIVE
  ACTIVE
  CANCELLED
  PAST_DUE
}

enum Framework {
  VANILLA
  REACT
  VUE
  ANGULAR
  SVELTE
}
`;

// =============================================================================
// 2. MAIN SERVER SETUP
// =============================================================================

// server.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { PrismaClient } = require('@prisma/client');
const redis = require('./config/redis');
const logger = require('./utils/logger');

// Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const componentRoutes = require('./routes/components');
const designSystemRoutes = require('./routes/designSystems');
const aiRoutes = require('./routes/ai');
const analyticsRoutes = require('./routes/analytics');
const subscriptionRoutes = require('./routes/subscriptions');

// Middleware
const authMiddleware = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');
const analyticsMiddleware = require('./middleware/analytics');

const app = express();
const prisma = new PrismaClient();

// =============================================================================
// MIDDLEWARE SETUP
// =============================================================================

// Security & Performance
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://js.stripe.com"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.anthropic.com"],
    },
  },
}));

app.use(compression());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://render.anclora.com', 'https://anclora.com']
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));

// Rate limiting
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  message: { error: 'Too many requests, please try again later' }
});

const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // 20 AI requests per minute
  keyGenerator: (req) => req.user?.id || req.ip,
  message: { error: 'AI rate limit exceeded. Please upgrade your plan for higher limits.' }
});

app.use('/api/', globalLimiter);
app.use('/api/ai/', aiLimiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Analytics tracking
app.use(analyticsMiddleware);

// =============================================================================
// ROUTES
// =============================================================================

app.use('/api/auth', authRoutes);
app.use('/api/users', authMiddleware, userRoutes);
app.use('/api/components', componentRoutes);
app.use('/api/design-systems', designSystemRoutes);
app.use('/api/ai', authMiddleware, aiRoutes);
app.use('/api/analytics', authMiddleware, analyticsRoutes);
app.use('/api/subscriptions', authMiddleware, subscriptionRoutes);

// Health check
app.get('/api/health', async (req, res) => {
  try {
    await prisma.$queryRaw\`SELECT 1\`;
    await redis.ping();
    
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0'
    });
  } catch (error) {
    logger.error('Health check failed:', error);
    res.status(503).json({
      status: 'unhealthy',
      error: error.message
    });
  }
});

// Error handling
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// =============================================================================
// SERVER STARTUP
// =============================================================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  logger.info(\`🚀 Anclora Render API running on port \${PORT}\`);
  
  try {
    await prisma.$connect();
    logger.info('📊 Database connected successfully');
    
    await redis.ping();
    logger.info('📦 Redis connected successfully');
    
    // Create default design systems
    await createDefaultDesignSystems();
    
  } catch (error) {
    logger.error('❌ Startup error:', error);
    process.exit(1);
  }
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  await prisma.$disconnect();
  await redis.quit();
  process.exit(0);
});

// =============================================================================
// 3. AUTHENTICATION SYSTEM
// =============================================================================

// routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const { PrismaClient } = require('@prisma/client');
const rateLimit = require('express-rate-limit');

const router = express.Router();
const prisma = new PrismaClient();

// Rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  skipSuccessfulRequests: true
});

// Validation schemas
const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  name: Joi.string().min(2).max(50).optional()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// Helper functions
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

const hashPassword = async (password) => {
  return await bcrypt.hash(password, 12);
};

// =============================================================================
// AUTH ROUTES
// =============================================================================

// Register
router.post('/register', authLimiter, async (req, res, next) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { email, password, name } = value;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Create user
    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        credits: 50 // Free tier credits
      },
      select: {
        id: true,
        email: true,
        name: true,
        plan: true,
        credits: true,
        createdAt: true
      }
    });

    // Generate token
    const token = generateToken(user.id);

    // Create session
    await prisma.session.create({
      data: {
        token,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      }
    });

    res.status(201).json({
      message: 'User created successfully',
      user,
      token
    });

  } catch (error) {
    next(error);
  }
});

// Login
router.post('/login', authLimiter, async (req, res, next) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { email, password } = value;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        name: true,
        plan: true,
        credits: true,
        subscriptionStatus: true
      }
    });

    if (!user || !user.password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last active
    await prisma.user.update({
      where: { id: user.id },
      data: { lastActiveAt: new Date() }
    });

    // Generate token
    const token = generateToken(user.id);

    // Create session
    await prisma.session.create({
      data: {
        token,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    });

    // Remove password from response
    delete user.password;

    res.json({
      message: 'Login successful',
      user,
      token
    });

  } catch (error) {
    next(error);
  }
});

// Logout
router.post('/logout', async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (token) {
      await prisma.session.deleteMany({
        where: { token }
      });
    }

    res.json({ message: 'Logout successful' });
  } catch (error) {
    next(error);
  }
});

// Verify token
router.get('/verify', async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if session exists
    const session = await prisma.session.findUnique({
      where: { token },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            plan: true,
            credits: true,
            subscriptionStatus: true,
            lastActiveAt: true
          }
        }
      }
    });

    if (!session || session.expiresAt < new Date()) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    res.json({
      valid: true,
      user: session.user
    });

  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

module.exports = router;

// =============================================================================
// 4. AI COMPONENT GENERATION SERVICE
// =============================================================================

// routes/ai.js
const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');
const Joi = require('joi');
const { PrismaClient } = require('@prisma/client');
const redis = require('../config/redis');
const logger = require('../utils/logger');

const router = express.Router();
const prisma = new PrismaClient();

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Validation schema
const generateSchema = Joi.object({
  prompt: Joi.string().min(10).max(1000).required(),
  designSystemId: Joi.string().optional(),
  framework: Joi.string().valid('VANILLA', 'REACT', 'VUE', 'ANGULAR', 'SVELTE').default('VANILLA'),
  viewport: Joi.string().valid('mobile', 'tablet', 'desktop').default('mobile')
});

// =============================================================================
// AI GENERATION LOGIC
// =============================================================================

const buildSystemPrompt = (designSystem, framework, viewport) => {
  const frameworkInstructions = {
    VANILLA: 'Generate clean HTML with inline CSS using CSS custom properties',
    REACT: 'Generate JSX components with CSS-in-JS or CSS modules',
    VUE: 'Generate Vue.js single file component with <template>, <script>, and <style>',
    ANGULAR: 'Generate Angular component with TypeScript and SCSS',
    SVELTE: 'Generate Svelte component with reactive statements'
  };

  return \`You are an expert frontend developer specializing in creating accessible, responsive UI components.

DESIGN SYSTEM CONTEXT:
\${designSystem ? \`
- Name: \${designSystem.name}
- Config: \${JSON.stringify(designSystem.config, null, 2)}
\` : 'Use semantic HTML with clean, modern styling'}

TECHNICAL REQUIREMENTS:
- Framework: \${framework}
- Target Viewport: \${viewport} (mobile-first approach)
- \${frameworkInstructions[framework]}

QUALITY STANDARDS:
1. Semantic HTML structure
2. WCAG 2.2 AA compliance (proper contrast, ARIA labels, keyboard navigation)
3. Mobile-first responsive design
4. Performance optimized
5. Modern CSS practices (Grid/Flexbox, custom properties)
6. Interactive states (hover, focus, active, disabled)
7. Loading states where applicable

OUTPUT FORMAT:
- Provide clean, production-ready code
- Include brief comments for complex logic
- Ensure code is self-contained and functional
- Use the design system variables when provided

Generate the component based on this prompt:\`;
};

// Check user credits and limits
const checkUserLimits = async (userId, plan) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { credits: true, plan: true }
  });

  if (!user) throw new Error('User not found');

  // Free tier: 50 components/month
  // Pro tier: Unlimited
  // Enterprise: Unlimited
  if (user.plan === 'FREE' && user.credits <= 0) {
    throw new Error('Credit limit exceeded. Please upgrade your plan.');
  }

  return user;
};

// Cache frequently generated components
const getCachedComponent = async (promptHash) => {
  try {
    const cached = await redis.get(\`component:\${promptHash}\`);
    return cached ? JSON.parse(cached) : null;
  } catch (error) {
    logger.error('Redis cache error:', error);
    return null;
  }
};

const setCachedComponent = async (promptHash, component) => {
  try {
    await redis.setex(\`component:\${promptHash}\`, 3600, JSON.stringify(component)); // 1 hour cache
  } catch (error) {
    logger.error('Redis cache error:', error);
  }
};

// =============================================================================
// AI ROUTES
// =============================================================================

// Generate component
router.post('/generate', async (req, res, next) => {
  try {
    const { error, value } = generateSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { prompt, designSystemId, framework, viewport } = value;
    const userId = req.user.id;

    // Check user limits
    const user = await checkUserLimits(userId, req.user.plan);

    // Get design system if specified
    let designSystem = null;
    if (designSystemId) {
      designSystem = await prisma.designSystem.findFirst({
        where: {
          id: designSystemId,
          OR: [
            { userId: userId },
            { isPublic: true }
          ]
        }
      });
    }

    // Check cache
    const promptHash = require('crypto')
      .createHash('md5')
      .update(\`\${prompt}-\${designSystemId}-\${framework}-\${viewport}\`)
      .digest('hex');
    
    const cached = await getCachedComponent(promptHash);
    if (cached) {
      logger.info(\`Cache hit for prompt hash: \${promptHash}\`);
      return res.json({
        success: true,
        component: cached,
        fromCache: true
      });
    }

    // Build system prompt
    const systemPrompt = buildSystemPrompt(designSystem, framework, viewport);

    // Generate with Claude
    const response = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: \`\${systemPrompt}

USER REQUEST: "\${prompt}"\`
        }
      ]
    });

    const generatedCode = response.content[0].text;

    // Parse generated code (extract HTML/CSS/JS if needed)
    const component = {
      htmlCode: generatedCode,
      cssCode: null, // Extract if separate CSS provided
      jsCode: null,  // Extract if separate JS provided
      framework,
      designSystemId,
      generatedAt: new Date().toISOString()
    };

    // Save component to database
    const savedComponent = await prisma.component.create({
      data: {
        name: prompt.substring(0, 50) + (prompt.length > 50 ? '...' : ''),
        description: \`Generated from: "\${prompt}"\`,
        prompt,
        htmlCode: component.htmlCode,
        cssCode: component.cssCode,
        jsCode: component.jsCode,
        framework,
        designSystemId,
        userId
      }
    });

    // Deduct credits for free tier users
    if (user.plan === 'FREE') {
      await prisma.user.update({
        where: { id: userId },
        data: { credits: { decrement: 1 } }
      });
    }

    // Cache the result
    await setCachedComponent(promptHash, component);

    // Track analytics
    await prisma.analytics.create({
      data: {
        event: 'component_generated',
        data: {
          componentId: savedComponent.id,
          framework,
          designSystemId,
          promptLength: prompt.length
        },
        userId
      }
    });

    logger.info(\`Component generated for user \${userId}: \${savedComponent.id}\`);

    res.json({
      success: true,
      component,
      componentId: savedComponent.id,
      creditsRemaining: user.plan === 'FREE' ? user.credits - 1 : null
    });

  } catch (error) {
    logger.error('AI generation error:', error);
    
    if (error.message.includes('Credit limit')) {
      return res.status(429).json({ error: error.message });
    }
    
    next(error);
  }
});

// Get generation history
router.get('/history', async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const userId = req.user.id;

    const components = await prisma.component.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
        description: true,
        prompt: true,
        framework: true,
        createdAt: true,
        designSystem: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: parseInt(limit)
    });

    const total = await prisma.component.count({
      where: { userId }
    });

    res.json({
      components,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    next(error);
  }
});

module.exports = router;

// =============================================================================
// 5. SUBSCRIPTION & BILLING SYSTEM
// =============================================================================

// routes/subscriptions.js
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { PrismaClient } = require('@prisma/client');
const logger = require('../utils/logger');

const router = express.Router();
const prisma = new PrismaClient();

// Pricing configuration
const PRICING_CONFIG = {
  PRO: {
    priceId: process.env.STRIPE_PRO_PRICE_ID,
    credits: null, // unlimited
    features: ['unlimited_components', 'figma_plugin', 'priority_support']
  },
  ENTERPRISE: {
    priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID,
    credits: null, // unlimited
    features: ['everything_pro', 'white_label', 'sso', 'dedicated_support']
  }
};

// =============================================================================
// SUBSCRIPTION ROUTES
// =============================================================================

// Create checkout session
router.post('/checkout', async (req, res, next) => {
  try {
    const { plan } = req.body;
    const userId = req.user.id;

    if (!['PRO', 'ENTERPRISE'].includes(plan)) {
      return res.status(400).json({ error: 'Invalid plan' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create or get Stripe customer
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: {
          userId: user.id
        }
      });
      customerId = customer.id;
      
      await prisma.user.update({
        where: { id: userId },
        data: { stripeCustomerId: customerId }
      });
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: PRICING_CONFIG[plan].priceId,
          quantity: 1
        }
      ],
      mode: 'subscription',
      success_url: \`\${process.env.FRONTEND_URL}/dashboard?success=true\`,
      cancel_url: \`\${process.env.FRONTEND_URL}/pricing?cancelled=true\`,
      metadata: {
        userId: user.id,
        plan
      }
    });

    res.json({
      sessionId: session.id,
      url: session.url
    });

  } catch (error) {
    logger.error('Checkout error:', error);
    next(error);
  }
});

// Get current subscription
router.get('/current', async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        plan: true,
        credits: true,
        subscriptionStatus: true,
        subscriptionEndDate: true,
        stripeCustomerId: true,
        stripeSubscriptionId: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    let subscription = null;
    if (user.stripeSubscriptionId) {
      try {
        subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
      } catch (error) {
        logger.error('Error fetching Stripe subscription:', error);
      }
    }

    res.json({
      plan: user.plan,
      credits: user.credits,
      status: user.subscriptionStatus,
      endDate: user.subscriptionEndDate,
      subscription
    });

  } catch (error) {
    next(error);
  }
});

// Cancel subscription
router.post('/cancel', async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { stripeSubscriptionId: true }
    });

    if (!user?.stripeSubscriptionId) {
      return res.status(404).json({ error: 'No active subscription found' });
    }

    // Cancel at period end
    await stripe.subscriptions.update(user.stripeSubscriptionId, {
      cancel_at_period_end: true
    });

    await prisma.user.update({
      where: { id: userId },
      data: { subscriptionStatus: 'CANCELLED' }
    });

    res.json({ message: 'Subscription cancelled successfully' });

  } catch (error) {
    logger.error('Subscription cancellation error:', error);
    next(error);
  }
});

// Webhook handler for Stripe events
router.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];

  try {
    const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpdate(event.data.object);
        break;
      
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;
      
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;

      default:
        logger.info(\`Unhandled event type: \${event.type}\`);
    }

    res.json({received: true});

  } catch (error) {
    logger.error('Webhook error:', error);
    res.status(400).send(\`Webhook Error: \${error.message}\`);
  }
});

// Helper functions for webhook handling
const handleSubscriptionUpdate = async (subscription) => {
  try {
    const user = await prisma.user.findUnique({
      where: { stripeCustomerId: subscription.customer }
    });

    if (!user) {
      logger.error('User not found for subscription update:', subscription.customer);
      return;
    }

    const plan = subscription.items.data[0].price.id === PRICING_CONFIG.PRO.priceId ? 'PRO' : 'ENTERPRISE';
    
    await prisma.user.update({
      where: { id: user.id },
      data: {
        plan,
        subscriptionStatus: subscription.status.toUpperCase(),
        stripeSubscriptionId: subscription.id,
        subscriptionEndDate: new Date(subscription.current_period_end * 1000),
        credits: null // unlimited for paid plans
      }
    });

    logger.info(\`Updated subscription for user \${user.id}: \${plan}\`);

  } catch (error) {
    logger.error('Error handling subscription update:', error);
  }
};

const handleSubscriptionDeleted = async (subscription) => {
  try {
    const user = await prisma.user.findUnique({
      where: { stripeCustomerId: subscription.customer }
    });

    if (!user) return;

    await prisma.user.update({
      where: { id: user.id },
      data: {
        plan: 'FREE',
        subscriptionStatus: 'INACTIVE',
        stripeSubscriptionId: null,
        subscriptionEndDate: null,
        credits: 50 // reset to free tier credits
      }
    });

    logger.info(\`Subscription deleted for user \${user.id}\`);

  } catch (error) {
    logger.error('Error handling subscription deletion:', error);
  }
};

const handlePaymentFailed = async (invoice) => {
  try {
    const user = await prisma.user.findUnique({
      where: { stripeCustomerId: invoice.customer }
    });

    if (!user) return;

    await prisma.user.update({
      where: { id: user.id },
      data: { subscriptionStatus: 'PAST_DUE' }
    });

    // TODO: Send payment failed email

    logger.info(\`Payment failed for user \${user.id}\`);

  } catch (error) {
    logger.error('Error handling payment failure:', error);
  }
};

module.exports = router;

// =============================================================================
// 6. UTILITY FUNCTIONS & MIDDLEWARE
// =============================================================================

// middleware/auth.js
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const session = await prisma.session.findUnique({
      where: { token },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            plan: true,
            credits: true,
            subscriptionStatus: true
          }
        }
      }
    });

    if (!session || session.expiresAt < new Date()) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    req.user = session.user;
    next();

  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = authMiddleware;

// utils/logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'anclora-render-api' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

module.exports = logger;

// =============================================================================
// 7. ENVIRONMENT CONFIGURATION
// =============================================================================

// .env.example
const envExample = \`
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/anclora_render"

# Redis
REDIS_URL="redis://localhost:6379"

# JWT
JWT_SECRET="your-super-secret-jwt-key-here"

# Anthropic AI
ANTHROPIC_API_KEY="your-anthropic-api-key"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_PRO_PRICE_ID="price_..."
STRIPE_ENTERPRISE_PRICE_ID="price_..."

# Frontend URL
FRONTEND_URL="http://localhost:3000"

# Email (optional)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# Node Environment
NODE_ENV="development"
PORT="5000"
\`;

// =============================================================================
// 8. DEPLOYMENT CONFIGURATION
// =============================================================================

// vercel.json
const vercelConfig = {
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/server.js"
    }
  ],
  "env": {
    "DATABASE_URL": "@database-url",
    "REDIS_URL": "@redis-url",
    "JWT_SECRET": "@jwt-secret",
    "ANTHROPIC_API_KEY": "@anthropic-api-key",
    "STRIPE_SECRET_KEY": "@stripe-secret-key"
  }
};

// Default design systems creation
const createDefaultDesignSystems = async () => {
  const defaultSystems = [
    {
      name: 'Anclora Ocean',
      description: 'Official Anclora design system with ocean gradients',
      isDefault: true,
      isPublic: true,
      config: {
        colors: {
          primary: '#0B6477',
          'primary-light': '#0AD1C8',
          accent: '#45DFB1',
          success: '#80ED99',
          text: '#0F172A',
          'text-muted': '#64748B',
          bg: '#FFFFFF',
          'bg-secondary': '#F8FAFC',
          border: '#E2E8F0'
        },
        spacing: {
          sm: '0.5rem',
          md: '1rem',
          lg: '1.5rem',
          xl: '2rem'
        },
        borderRadius: {
          sm: '4px',
          md: '8px',
          lg: '12px',
          xl: '16px'
        }
      }
    }
  ];

  for (const system of defaultSystems) {
    await prisma.designSystem.upsert({
      where: { name: system.name },
      update: system,
      create: system
    });
  }
};

console.log('🚀 Anclora Render Backend System - Ready for deployment!');
console.log('📋 Setup checklist:');
console.log('✅ Database schema (Prisma)');
console.log('✅ Authentication system');
console.log('✅ AI component generation');
console.log('✅ Subscription & billing');
console.log('✅ Analytics & monitoring');
console.log('✅ Error handling & logging');
console.log('✅ Rate limiting & security');
console.log('✅ Deployment configuration');
