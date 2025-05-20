import { findAllProducts } from '../services/product.service.js';

export const getProducts = async (req, res) => {
  console.log('GET /api/products was called.');
  try {
    const products = await findAllProducts();
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occured', error: error.message });
  }
};
