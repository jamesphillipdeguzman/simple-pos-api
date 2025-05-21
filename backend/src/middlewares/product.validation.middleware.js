import { body } from 'express-validator';

export const validateProduct = [
  body('name').notEmpty().withMessage('Product name is required'),
  body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0'),
  body('stock')
    .isInt({ min: 0 })
    .withMessage('Stock is a whole number greater than or equal 0'),
  body('category').notEmpty().withMessage('Category is required'),
  body('description')
    .optional()
    .isString()
    .withMessage('Description must be string'),
];

export const validateProductUpdate = [
  body('name')
    .optional()
    .notEmpty()
    .withMessage('Name, if provided must not be empty'),
  body('price')
    .optional()
    .isFloat({ gt: 0 })
    .withMessage('Price must be greater than 0'),
  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock is a whole number greater than or equal 0'),
  body('category').optional().notEmpty().withMessage('Category is required'),
  body('description')
    .optional()
    .isString()
    .withMessage('Description must be string'),
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
