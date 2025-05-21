import Product from '../models/product.model.js';

// GET all products
export const findAllProducts = () => {
  return Product.find();
};

// GET a product by Id
export const findProductById = (id) => {
  return Product.findById(id);
};

// POST a product
export const createProduct = (data) => {
  return Product.create(data);
};
