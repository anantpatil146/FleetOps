// models/Trip.js
import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema({
  source: { type: String, required: true },
  destination: { type: String, required: true },
  price: { type: Number, required: true },
  transportCompanyName: { type: String, required: true },
  vehicleNumber: { type: String, required: true },
  tripDateTime: { type: Date, required: true }, // New field
   status: {
    type: String,
    enum: ['paid', 'notpaid'],
    default: 'notpaid' // ✅ Default value
  }
});

export default mongoose.model("Trip", tripSchema);
