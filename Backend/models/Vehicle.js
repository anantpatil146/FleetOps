// models/Vehicle.js
import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({
  vehicleNumber: { type: String, required: true, unique: true },
  vehicleType: { type: String, required: true },
  capacity: { type: Number, required: true },
  companyName: { type: String, required: true }, // Add this line
});

export default mongoose.model('Vehicle', vehicleSchema);
