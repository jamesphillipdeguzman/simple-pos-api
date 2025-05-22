import { body } from 'express-validator';
// *** Sale Validation ***

// POST request validation: validateSale
export const validateSale = [
  body('productId')
    .isMongoId()
    .withMessage('Product ID must be a valid Mongo ID'),
  body('priceAtSale')
    .toFloat()
    .isFloat({ gte: 0 })
    .withMessage('Price at sale is greater than or equal to 0'),
  body('quantity')
    .toFloat()
    .isFloat({ gte: 0 })
    .withMessage('Quantity is greater than or equal 0'),
  body('totalAmount')
    .toFloat()
    .isFloat({ gte: 0 })
    .withMessage('Total amount is greater than or equal 0'),
  body('cashierName')
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .default('unknown')
    .withMessage('Cashier name cannot be empty if provided'),
  body('paymentMethod')
    .customSanitizer((value) => {
      if (value === undefined || value === null || value === '') {
        return 'cash';
      }
      return value;
    })
    .isIn(['cash', 'credit', 'debit', 'paypal'])
    .withMessage('Payment method options are [cash, credit, debit, paypal]'),
];

// {
//   "_id": "682c95006fd75cb7c058dbe5",
//   "productId": "682c87116fd75cb7c058dbe2",
//   "priceAtSale": 29.99,
//   "quantity": 2,
//   "totalAmount": 59.98,
//   "date": "2025-05-20T14:30:00.000Z",
//   "cashierName": "Alice",
//   "paymentMethod": "cash"
// },

// PUT request validation: validateSaleUpdate
export const validateSaleUpdate = [
  body('priceAtSale')
    .optional()
    .toFloat()
    .isFloat({ gte: 0 })
    .withMessage('Price at sale must be a number greater than or equal to 0'),
  body('quantity')
    .optional()
    .toFloat()
    .isFloat({ gte: 0 })
    .withMessage('Quantity is greater than or equal 0'),
  body('totalAmount')
    .optional()
    .toFloat()
    .isFloat({ gte: 0 })
    .withMessage('Total amount is greater than or equal 0'),
  body('cashierName')
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Cashier name cannot be empty if provided'),
  body('paymentMethod')
    .optional()
    .customSanitizer((value) => {
      if (value === undefined || value === null || value === '') {
        return 'cash';
      }
      return value;
    })
    .isIn(['cash', 'credit', 'debit', 'paypal'])
    .withMessage('Payment method options are [cash, credit, debit, paypal]'),
];

// const salesSchema = new mongoose.Schema({
//   productId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Product',
//     required: true,
//   },
//   priceAtSale: { type: Number, required: true },
//   quantity: { type: Number, required: true, default: 0 },
//   totalAmount: { type: Number, required: true },
//   date: { type: Date, required: true, default: Date.now },
//   cashierName: { type: String, required: true, default: 'unknown' },
//   paymentMethod: { type: String, required: true, default: 'cash' },
// });
