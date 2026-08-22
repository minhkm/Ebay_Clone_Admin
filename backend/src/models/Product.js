import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    image: { type: String },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isAuction: { type: Boolean, default: false },
    auctionEndTime: { type: Date, default: null },
  },
  {
    timestamps: true,
    collection: 'products',
  }
);

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
export default Product;
