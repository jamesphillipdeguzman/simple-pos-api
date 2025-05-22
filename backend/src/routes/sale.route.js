import express from 'express';
import {
  getSales,
  getSaleById,
  postSale,
  updateSale,
  deleteSale,
} from '../controllers/sale.controller.js';

import { validateSale } from '../middlewares/sale.validation.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';

const router = express.Router();

// GET all sales
/**
 * @swagger
 * /api/sales:
 *  get:
 *    summary: Get all sales
 *    responses:
 *      200:
 *        description: A list of all sales
 *      500:
 *        description: An error occured while fetching sales
 */
router.get('/', getSales);

// GET a sale by Id
/**
 * @swagger
 * /api/sales/{id}:
 *  get:
 *    summary: Get a sale by ID
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: The unique ID of the sale
 *    responses:
 *      200:
 *        description: The sale with the specified ID
 *      400:
 *        description: Invalid sale ID format
 *      404:
 *        description: Sale not found
 *      500:
 *        description: An error occured while fetching the sale
 *
 */
router.get('/:id', getSaleById);

// POST a sale
/**
 * @swagger
 * /api/sales:
 *  post:
 *    summary: Create a new sale
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *           $ref: '#/components/schemas/Sale'
 *    responses:
 *      201:
 *        description: Sale created
 *      400:
 *        description: No sale was created. Please check the request data
 *      500:
 *        description: An error occured while creating the sale
 *
 */
router.post('/', validateSale, validate, postSale);

// PUT or UPDATE a sale
/**
 * @swagger
 * /api/sales/{id}:
 *  put:
 *    summary: Update a sale by ID
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: The unique ID of the sale
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Sale'
 *    responses:
 *      200:
 *        description: Sale updated
 *      400:
 *        description: 'Invalid sale ID format'
 *      404:
 *        description: Sale not found
 *      500:
 *        description: An error occured while updating the sale
 *
 */
router.put('/:id', validateSale, validate, updateSale);

// DELETE a sale
/**
 * @swagger
 * /api/sales/{id}:
 *  delete:
 *    summary: Delete a sale
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: The unique ID of the sale
 *    responses:
 *      200:
 *        description: Sale deleted successfully
 *      400:
 *        description: Invalid sale ID format
 *      404:
 *        description: Sale not found
 *      500:
 *        description: An error occured while deleting the sale
 *
 */
router.delete('/:id', deleteSale);

export default router;
