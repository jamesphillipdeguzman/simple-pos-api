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

// PUT or UPDATE a product
export const updateProductById = (id, updates) => {
  return Product.findByIdAndUpdate(id, updates, {
    new: true, // Return the updated document; default is false (returns original before update)
    runValidators: true, // Run schema validators on update (not enabled by default)
    upsert: true, // Create document if not found, using the same _id (update if exists, insert if not)
  });
};

// DELETE a product
export const deleteProductById = (id) => {
  return Product.findByIdAndDelete(id);
};
