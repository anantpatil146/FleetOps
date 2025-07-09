import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,      // ✅ remove whitespace
    lowercase: true  // ✅ normalize email
  },
  password: {
    type: String,
    required: true
  }
});

export default mongoose.model('Admin', adminSchema);
