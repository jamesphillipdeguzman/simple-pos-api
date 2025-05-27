import express from 'express';
import cors from 'cors';
import productRoutes from './src/routes/product.route.js';
import saleRoutes from './src/routes/sale.route.js';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './src/docs/swagger.js';
import session from 'express-session';
import passport from './src/config/passport.config.js';
import authRoutes from './src/routes/auth.route.js';

// Initialize an express app
const app = express();

// CORS middleware
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://127.0.0.1:3000',
    credentials: true,
  }),
);

// Parse JSON payloads
app.use(express.json());

// Parse form payloads
app.use(express.urlencoded({ extended: true }));

// Create Session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // True in production
      sameSite: 'none', // IMPORTANT: add this for cross-origin cookies, since my backend API is hosted by Render and frontend is hosted by Netlify
      maxAge: 1000 * 60 * 60, // 1 hour
    },
  }),
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Server Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Greet the user
app.get('/', (req, res) => {
  res.send('Welcome to Simple-POS-API by James De Guzman!');
});

// Mount routes at /auth, /api/products, and /api/sales
app.use('/', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/sales', saleRoutes);

export { app };
