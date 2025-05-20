import express from 'express';
import {
  getProducts,
  getProductById,
} from '../controllers/product.controller.js';

const router = express.Router();

// GET all products
router.get('/', getProducts);

// GET a product by Id
router.get('/:id', getProductById);

export default router;
