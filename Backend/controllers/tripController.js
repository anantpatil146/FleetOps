// controllers/tripController.js
import Trip from "../models/Trip.js";
import Vehicle from "../models/Vehicle.js";


export const createTrip = async (req, res) => {
  try {
    const {
      source,
      destination,
      price,
      transportCompanyName,
      vehicleNumber,
      tripDateTime,
      status // Optional
    } = req.body;

    const trip = new Trip({
      source,
      destination,
      price,
      transportCompanyName,
      vehicleNumber,
      tripDateTime: tripDateTime || new Date(),
      status: status || 'notpaid' // ✅ Default fallback
    });

    await trip.save();
    res.status(201).json(trip);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllTrips = async (req, res) => {
  try {
    const trips = await Trip.find();
    res.json(trips);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const updateTripStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["paid", "notpaid"].includes(status)) {
      return res.status(400).json({ message: "Invalid status. Must be 'paid' or 'notpaid'." });
    }

    const updatedTrip = await Trip.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedTrip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    res.json(updatedTrip);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};