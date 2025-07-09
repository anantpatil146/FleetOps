// controllers/vehicleController.js
import Vehicle from "../models/Vehicle.js";

export const createVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.create(req.body);
    res.status(201).json(vehicle);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch vehicles" });
  }
};

export const getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findOne({ vehicleNumber: req.params.id});
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });
    res.json(vehicle);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateVehicle = async (req, res) => {
  try {
    const updated = await Vehicle.findOneAndUpdate(
      { vehicleNumber: req.params.id },
      req.body,
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteVehicle = async (req, res) => {
 try {
    const deleted = await Vehicle.findOneAndDelete({
      vehicleNumber: req.params.id,
    });

    if (!deleted) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    res.json({ message: 'Vehicle deleted successfully', vehicle: deleted });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};