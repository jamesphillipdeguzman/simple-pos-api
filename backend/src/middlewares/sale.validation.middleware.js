import { body } from 'express-validator';

export const validateSale = [
  body('productId')
    .isMongoId()
    .notEmpty()
    .withMessage('Product ID is a valid Mongo ID'),
  body('priceAtSale')
    .toFloat()
    .isFloat({ gte: 0 })
    .notEmpty()
    .withMessage('Price at sale is greater than or equal to 0'),
  body('quantity')
    .toFloat()
    .isFloat({ gte: 0 })
    .notEmpty()
    .withMessage('Quantity is greater than or equal 0'),
  body('totalAmount')
    .toFloat()
    .isFloat({ gte: 0 })
    .notEmpty()
    .withMessage('Total amount is greater than or equal 0'),
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
