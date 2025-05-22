import express from 'express';
import {
  getSales,
  getSaleById,
  postSale,
  updateSale,
} from '../controllers/sale.controller.js';

import { validateSale } from '../middlewares/sale.validation.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';

const router = express.Router();

// GET all sales
router.get('/', getSales);

// GET a sale by Id
router.get('/:id', getSaleById);

// POST a sale
router.post('/', validateSale, validate, postSale);

// PUT or UPDATE a sale
router.put('/:id', validateSale, validate, updateSale);

export default router;
