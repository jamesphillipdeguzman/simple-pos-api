import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sku: { type: Number, required: true },
  stock: { type: Number, required: true, default: 0 },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  supplier: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now },
});

export default mongoose.model('Product', productSchema);
