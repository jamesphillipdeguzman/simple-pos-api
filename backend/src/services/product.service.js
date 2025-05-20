import Product from '../models/product.model.js';

// GET
export const findAllProducts = () => {
  return Product.find();
};
