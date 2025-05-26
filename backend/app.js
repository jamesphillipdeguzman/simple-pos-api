import express from 'express';
import cors from 'cors';
import productRoutes from './src/routes/product.route.js';
import saleRoutes from './src/routes/sale.route.js';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './src/docs/swagger.js';
import session from 'express-session';
import passport from './src/config/passport.config.js';

// Initialize an express app
const app = express();

// CORS middleware
app.use(
  cors({
    origin: 'http://127.0.0.1:3000',
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
      secure: false,
      maxAge: 1000 * 60 * 60,
    },
  }),
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

//Serialize/Deserialize
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Redirect user to Google for login
app.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }),
);

app.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // Successful login
    // res.redirect('/protected-or-dashboard');
    // req.user contain Google profile
    res.json({ message: 'Login successful', user: req.user.displayName });
  },
);

app.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

// Server Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Greet the user
app.get('/', (req, res) => {
  res.send('Welcome to Simple-POS-API by James De Guzman!');
});

// Mount routes at /api/products and /api/sales
app.use('/api/products', productRoutes);
app.use('/api/sales', saleRoutes);

export { app };
