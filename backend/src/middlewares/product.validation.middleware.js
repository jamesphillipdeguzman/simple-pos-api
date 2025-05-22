import { body } from 'express-validator';
// *** Product Validation ***

// POST request validation: validateProduct
export const validateProduct = [
  body('name').notEmpty().withMessage('Product name is required'),
  body('stock')
    .isInt({ min: 0 })
    .withMessage('Stock is a whole number greater than or equal 0'),
  body('description')
    .optional()
    .isString()
    .withMessage('Description must be string'),
  body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0'),
  body('category').notEmpty().withMessage('Category is required'),
  body('supplier')
    .optional()
    .isString()
    .withMessage('Supplier must be a string'),
];

// "name": "",
//   "sku": null,
//   "stock": -1,
//   "description": "",
//   "price": -1,
//   "category": "",
//   "supplier": 3

// PUT request validation: validateProductUpdate
export const validateProductUpdate = [
  body('name')
    .optional()
    .notEmpty()
    .withMessage('Name, if provided must not be empty'),
  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock is a whole number greater than or equal 0'),
  body('description')
    .optional()
    .isString()
    .withMessage('Description must be string'),
  body('price')
    .optional()
    .isFloat({ gt: 0 })
    .withMessage('Price must be greater than 0'),
  body('category').optional().notEmpty().withMessage('Category is required'),
  body('supplier')
    .optional()
    .isString()
    .withMessage('Supplier must be a string'),
];

// const productSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   sku: { type: Number, required: true },
//   stock: { type: Number, required: true, default: 0 },
//   description: { type: String, required: false },
//   price: { type: Number, required: true },
//   category: { type: String, required: true },
//   supplier: { type: String, required: true },
//   createdAt: { type: Date, required: true, default: Date.now },
// });
