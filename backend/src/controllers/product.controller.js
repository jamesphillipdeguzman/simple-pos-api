import mongoose from 'mongoose';

import {
  findAllProducts,
  findProductById,
  createProduct,
} from '../services/product.service.js';

// GET all products
export const getProducts = async (req, res) => {
  try {
    const products = await findAllProducts();
    console.log('GET /api/products was called.');
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occured', error: error.message });
  }
};

// GET a product by Id
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if the ID is a valid Mongoose ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid product ID format' });
    }

    const product = await findProductById(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    console.log(`GET /api/products/${id} was called.`);
    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: 'The product was not found', error: error.message });
  }
};

// POST a product
export const postProduct = async (req, res) => {
  try {
    const product = await createProduct(req.body);

    if (!product) {
      res.status(400).json({
        message: 'No product was created. Please check the request data.',
      });
    }
    console.log('POST /api/products was called.');
    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'The product was not created',
      error: error.message,
    });
  }
};
