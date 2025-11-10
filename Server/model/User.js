import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bio: { type: String },
  linkedin: { type: String },
  twitter: { type: String },
  profile_pic: { type: String },
  role: { type: String, default: 'USER' },
  isVerified: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);

export default User;