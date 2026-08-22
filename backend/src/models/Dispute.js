import mongoose from 'mongoose';

const disputeSchema = new mongoose.Schema(
  {
    orderItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'OrderItem' },
    raisedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ['open', 'under_review', 'resolved', 'closed', 'new', 'processing'],
      default: 'open',
    },
    resolution: { type: String, default: null },
  },
  {
    timestamps: true,
    collection: 'disputes',
  }
);

const Dispute = mongoose.models.Dispute || mongoose.model('Dispute', disputeSchema);
export default Dispute;
