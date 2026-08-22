import mongoose from 'mongoose';

const storeSchema = new mongoose.Schema(
  {
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    storeName: { type: String, required: true },
    description: { type: String },
    bannerImageURL: { type: String },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'suspended'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
    collection: 'stores',
  }
);

const Store = mongoose.models.Store || mongoose.model('Store', storeSchema);
export default Store;
