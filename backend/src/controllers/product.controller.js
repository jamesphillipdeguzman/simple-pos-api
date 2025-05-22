import mongoose from 'mongoose';

import {
  findAllProducts,
  findProductById,
  createProduct,
  updateProductById,
  deleteProductById,
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
    const createdProduct = await createProduct(req.body);

    if (!createdProduct) {
      res.status(400).json({
        message: 'No product was created. Please check the request data.',
      });
    }
    console.log('POST /api/products was called.');
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'The product was not created',
      error: error.message,
    });
  }
};

// PUT or Update a product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    console.log('Updates', updates);

    // Check if the ID is a valid Mongoose ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid product ID format' });
    }

    // Update and return the new version of the product
    const updatedProduct = await updateProductById(id, updates);

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    console.log(`PUT /api/products/${id} was called.`);
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: 'The product was not found', error: error.message });
  }
};

// DELETE a product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the ID is a valid Mongoose ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid product ID format' });
    }

    const deletedProduct = await deleteProductById(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    console.log(`DELETE /api/products/${id} was called`);
    res.status(200).json(deletedProduct);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: 'The product was not found', error: error.message });
  }
};
