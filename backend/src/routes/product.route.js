import express from 'express';
import {
  getProducts,
  getProductById,
  postProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/product.controller.js';

import { validateProduct } from '../middlewares/product.validation.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';

const router = express.Router();

// GET all products
/**
 * @swagger
 * /api/products:
 *  get:
 *    summary: Get all products
 *    responses:
 *      200:
 *        description: A list of all products
 *      500:
 *        description: An error occured while fetching products
 */
router.get('/', getProducts);

// GET a product by Id
/**
 * @swagger
 * /api/products/{id}:
 *  get:
 *    summary: Get a product by ID
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: The unique ID of the product
 *    responses:
 *      200:
 *        description: The product with the specified ID
 *      400:
 *        description: Invalid product ID format
 *      404:
 *        description: Product not found
 *      500:
 *        description: An error occured while fetching the product
 *
 */
router.get('/:id', getProductById);

// POST a product
/**
 * @swagger
 * /api/products:
 *  post:
 *    summary: Create a new product
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Product'
 *    responses:
 *      201:
 *        description: Product created
 *      400:
 *        description: No product was created. Please check the request data
 *      500:
 *        description: An error occured while creating the product
 *
 */
router.post('/', validateProduct, validate, postProduct);

// PUT or UPDATE a product
/**
 * @swagger
 * /api/products/{id}:
 *  put:
 *    summary: Update a product by ID
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          $ref: '#/components/schemas/Sale'
 *        description: The unique ID of the product
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *           $ref: '#/components/schemas/Sale'
 *    responses:
 *      200:
 *        description: Product updated
 *      400:
 *        description: 'Invalid product ID format'
 *      404:
 *        description: Product not found
 *      500:
 *        description: An error occured while updating the product
 *
 */
router.put('/:id', validateProduct, validate, updateProduct);

// DELETE a product
/**
 * @swagger
 * /api/products/{id}:
 *  delete:
 *    summary: Delete a product by ID
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: The unique ID of the product
 *    responses:
 *      200:
 *        description: Product deleted successfully
 *      400:
 *        description: Invalid product ID format
 *      404:
 *        description: Product not found
 *      500:
 *        description: An error occured while deleting the product
 *
 */
router.delete('/:id', deleteProduct);

export default router;
