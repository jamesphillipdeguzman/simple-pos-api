import express from 'express';
import {
  getSales,
  getSaleById,
  postSale,
} from '../controllers/sale.controller.js';

const router = express.Router();

// GET all sales
router.get('/', getSales);

// GET a sale by Id
router.get('/:id', getSaleById);

// POST a sale
router.post('/', postSale);

export default router;
