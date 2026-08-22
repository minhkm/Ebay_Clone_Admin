import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['buyer', 'seller', 'admin'], default: 'buyer' },
    avatarURL: { type: String },
    action: { type: String, default: 'unlock' },
  },
  {
    timestamps: true,
    collection: 'users',
  }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
