import Product from '../models/product.model.js';

export const findAllProducts = () => {
  return Product.find();
};
