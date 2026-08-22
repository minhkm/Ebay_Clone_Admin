import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    addressId: { type: mongoose.Schema.Types.ObjectId, ref: 'Address' },
    orderDate: { type: Date, default: Date.now },
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipping', 'shipped', 'cancelled', 'completed', 'returned'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
    collection: 'orders',
  }
);

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
export default Order;
