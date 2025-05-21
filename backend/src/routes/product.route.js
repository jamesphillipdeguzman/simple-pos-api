import express from 'express';
import {
  getProducts,
  getProductById,
  postProduct,
} from '../controllers/product.controller.js';

const router = express.Router();

// GET all products
router.get('/', getProducts);

// GET a product by Id
router.get('/:id', getProductById);

// POST a product
router.post('/', postProduct);

export default router;
