import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    reviewerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, min: 1, max: 5 },
    comment: { type: String, required: true },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Review', default: null },
    status: {
      type: String,
      enum: ['visible', 'reported', 'hidden'],
      default: 'visible',
    },
    isHidden: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    collection: 'reviews',
  }
);

const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);
export default Review;
