import mongoose from 'mongoose';

const salesSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  priceAtSale: {
    type: Number,
    required: true,
    min: [0, 'Price must be a non-negative number'],
  },
  quantity: {
    type: Number,
    required: true,
    default: 0,
    min: [0, 'Quantity must be a non-negative number'],
  },
  totalAmount: {
    type: Number,
    required: true,
    min: [0, 'Total amount must be a non-negative number'],
  },

  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  cashierName: {
    type: String,
    required: true,
    default: 'unknown',
  },
  paymentMethod: {
    type: String,
    required: true,
    default: 'cash',
    enum: ['cash', 'credit', 'debit', 'paypal'],
  },
});

export default mongoose.model('Sale', salesSchema);
