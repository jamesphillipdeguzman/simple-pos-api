import mongoose from 'mongoose';

const salesSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  priceAtSale: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 0 },
  totalAmount: { type: Number, required: true },
  date: { type: Date, required: true, default: Date.now },
  cashierName: { type: String, required: true, default: 'unknown' },
  paymentMethod: { type: String, required: true, default: 'cash' },
});

export default mongoose.model('Sale', salesSchema);
