import dotenv from 'dotenv';
// Load environment variables first
dotenv.config();
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import productRoutes from './src/routes/product.route.js';
import saleRoutes from './src/routes/sale.route.js';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './src/docs/swagger.js';
import session from 'express-session';
import passport from './src/config/passport.config.js';
import authRoutes from './src/routes/auth.route.js';

console.log('ENV:', {
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN,
  SESSION_SECRET: !!process.env.SESSION_SECRET,
  NODE_ENV: process.env.NODE_ENV,
});
console.log('Secure cookie:', process.env.NODE_ENV === 'production');

// Initialize an express app
const app = express();

// Apply helmet with custom config
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        // Allow frontend to use Skypack, Google APIs, etc.
        'script-src': [
          "'self'",
          'https://cdn.skypack.dev',
          'https://accounts.google.com',
          'https://apis.google.com',
        ],
        'frame-src': ["'self'", 'https://accounts.google.com'], // allow popup to load Google
        'img-src': ["'self'", 'data:', 'https://*.googleusercontent.com'],
        'connect-src': [
          "'self'",
          'https://simple-pos-api.onrender.com',
          'https://simple-pos-api.netlify.app',
        ],
      },
    },
    crossOriginEmbedderPolicy: false, // Disable COEP to avoid SharedArrayBuffer requirement
    crossOriginOpenerPolicy: false, // Disable COOP to support popup/OAuth
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    frameguard: { action: 'sameorigin' }, // Prevent clickjacking
  }),
);

// CORS middleware
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://127.0.0.1:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

// Parse JSON payloads
app.use(express.json());

// Parse form payloads
app.use(express.urlencoded({ extended: true }));

// Without this, req.cookies will always be undefined
app.use(cookieParser());

app.set('trust proxy', 1); // Render uses a reverse proxy, and you must explicitly trust the proxy for the secure flag to work. Otherwise, Express won't mark the cookie as secure and won't send it.

// Create Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false, // Avoids resaving unchanged sessions
    saveUninitialized: false, //  Prevents creating a new session cookie unless something is stored in the session.
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Required for HTTPS. Evaluates to true for production; sets cookie secure flag only in production
      sameSite: 'none', // Required for cross-origin
      maxAge: 1000 * 60 * 60, // 1 hour; sets session expiration
    },
    proxy: true, // Required for secure cookies behind a proxy
  }),
);

// Add debug logging
app.use((req, res, next) => {
  console.log('Request Origin:', req.headers.origin);
  console.log('Session:', req.session);
  console.log('Session ID:', req.sessionID);
  console.log('Cookies:', req.cookies);
  console.log('Cookie names:', Object.keys(req.cookies));

  next();
});

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Server Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Greet the user
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <!-- Load Roboto from Google Fonts -->
        <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet">
        <style>
          body {
            font-family: 'Roboto', 'Segoe UI', sans-serif;
            font-size: 16px;
            line-height: 1.6;
            padding: 2rem;
            color: #333;
          }
          h1 {
            font-size: 2rem;
            margin-bottom: 1rem;
          }
          a {
            color: #007BFF;
            text-decoration: none;
          }
          a:hover {
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <h1>Welcome to Simple-POS-API by James De Guzman!</h1>
        <p>
          Please login at 
          <a href="https://simple-pos-api.netlify.app/" target="_blank">
            https://simple-pos-api.netlify.app
          </a>
        </p>
      </body>
    </html>
  `);
});

// Mount routes at /auth, /api/products, and /api/sales
app.use('/', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/sales', saleRoutes);

export { app };
