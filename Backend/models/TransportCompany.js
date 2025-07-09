// models/TransportCompany.js
import mongoose from "mongoose";

const transportCompanySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  address: String,
  contactNumber: String,
});

export default mongoose.model("TransportCompany", transportCompanySchema);
