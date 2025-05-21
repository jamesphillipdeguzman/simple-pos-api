import {
  findAllProducts,
  findProductById,
  createProduct,
} from '../services/product.service.js';

// GET all products
export const getProducts = async (req, res) => {
  try {
    const products = await findAllProducts();
    res.status(200).json(products);
    console.log('GET /api/products was called.');
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occured', error: error.message });
  }
};

// GET a product by Id
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await findProductById(id);
    res.status(200).json(product);
    console.log(`GET /api/products/${id} was called.`);
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
    res.status(201).json(product);
    console.log('POST /api/products was called.');
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: 'The product was not created', error: error.message });
  }
};
