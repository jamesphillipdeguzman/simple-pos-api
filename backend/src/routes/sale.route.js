import express from 'express';
import { getSales, getSaleById } from '../controllers/sale.controller.js';

const router = express.Router();

// GET all sales
router.get('/', getSales);

// GET a sale by Id
router.get('/:id', getSaleById);

export default router;
