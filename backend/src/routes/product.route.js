import express from 'express';
import {
  getProducts,
  getProductById,
  postProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/product.controller.js';

import { validateProduct } from '../middlewares/product.validation.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';

const router = express.Router();



// GET all products
router.get('/', getProducts);

// GET a product by Id
router.get('/:id', getProductById);

// POST a product
router.post('/', validateProduct, validate, postProduct);

// PUT or UPDATE a product
router.put('/:id', validateProduct, validate, updateProduct);

// DELETE a product
router.delete('/:id', deleteProduct);

export default router;
