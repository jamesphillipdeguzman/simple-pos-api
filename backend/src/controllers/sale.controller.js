import mongoose from 'mongoose';

import {
  findAllSales,
  findSaleById,
  createSale,
  updateSaleById,
  deleteSaleById,
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
    res.status(500).json({
      message: 'An error occured while fetching the sale',
      error: error.message,
    });
  }
};

// POST a sale
export const postSale = async (req, res) => {
  try {
    const createdSale = await createSale(req.body);
    if (!createdSale) {
      res.status(400).json({
        message: 'No sale was created. Please check the request data.',
      });
    }

    console.log('POST /api/sales was called.');
    res.status(201).json(createdSale);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'An error occured while creating the sale',
      error: error.message,
    });
  }
};

// PUT or UPDATE a sale
export const updateSale = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    console.log('Updates', updates);

    // Check if the ID is a valid Mongoose ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid Sale ID format' });
    }

    // Update and return the new version of the sale
    const updatedSale = await updateSaleById(id, updates);

    if (!updatedSale) {
      return res.status(404).json({ message: 'Sale not found' });
    }

    console.log(`PUT /api/sales/${id} was called`);
    res.status(200).json(updatedSale);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'An error occured while updating the sale',
      error: error.message,
    });
  }
};

// DELETE a sale
export const deleteSale = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the ID is a valid Mongoose ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid product ID format' });
    }

    const deletedSale = await deleteSaleById(id);

    if (!deletedSale) {
      return res.status(404).json({ message: 'Sale not found' });
    }
    console.log(`DELETE /api/sales/${id} was called`);
    res.status(200).json(deletedSale);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'An error occured while deleting the sale',
      error: error.message,
    });
  }
};
