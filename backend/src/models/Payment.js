import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    method: { type: String },
    status: {
      type: String,
      enum: ['paid', 'pending', 'failed'],
      default: 'pending',
    },
    paidAt: { type: Date },
  },
  {
    timestamps: true,
    collection: 'payments',
  }
);

const Payment = mongoose.models.Payment || mongoose.model('Payment', paymentSchema);
export default Payment;
