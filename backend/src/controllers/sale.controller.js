import mongoose from 'mongoose';

import {
  findAllSales,
  findSaleById,
  createSale,
} from '../services/sale.service.js';

// GET all sales
export const getSales = async (req, res) => {
  console.log('GET /api/sales was called.');
  try {
    const sales = await findAllSales();
    res.status(200).json(sales);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occured', error: error.message });
  }
};

// GET a sale by Id
export const getSaleById = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the ID is a valid Mongoose ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid sale ID format' });
    }

    const sale = await findSaleById(id);

    if (!sale) {
      return res.status(404).json({ message: 'The sale was not found' });
    }

    res.status(200).json(sale);
    console.log(`GET /api/sales/${id} was called.`);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: 'The sale was not found', error: error.message });
  }
};

// POST a sale
export const postSale = async (req, res) => {
  try {
    const sale = await createSale(req.body);
    if (!sale) {
      res.status(400).json({
        message: 'No sale was created. Please check the request data.',
      });
    }

    console.log('POST /api/sales was called.');
    res.status(201).json(sale);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'The sale was not created',
      error: error.message,
    });
  }
};
