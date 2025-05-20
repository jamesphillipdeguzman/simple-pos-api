import express from 'express';
import cors from 'cors';
import productRoutes from './src/routes/product.route.js';
import saleRoutes from './src/routes/sale.route.js';

// Initialize an express app
const app = express();

// CORS middleware
app.use(cors());

// Parse JSON payloads
app.use(express.json());

// Parse form payloads
app.use(express.urlencoded({ extended: true }));

// Greet the user
app.get('/', (req, res) => {
  res.send('Welcome to Simple-POS-API by James De Guzman!');
});

// Mount routes at /api/products and /api/sales
app.use('/api/products', productRoutes);
app.use('/api/sales', saleRoutes);

export { app };
