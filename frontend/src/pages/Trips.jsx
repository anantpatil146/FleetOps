import React, { useEffect, useState } from "react";
import axios from "axios";

const Trips = () => {
  const [companies, setCompanies] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [trips, setTrips] = useState([]);
  const [formData, setFormData] = useState({
    source: "",
    destination: "",
    price: "",
    transportCompanyName: "",
    vehicleNumber: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchCompanies();
    fetchTrips();
  }, []);

  const fetchCompanies = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/company", {
        withCredentials: true,
      });
      setCompanies(res.data);
    } catch (err) {
      console.error("Failed to load companies", err);
      setError("Unable to load transport companies.");
    }
  };

  const fetchCompanyVehicles = async (companyName) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/company/${encodeURIComponent(companyName)}/vehicles`,
        { withCredentials: true }
      );
      setVehicles(res.data);
    } catch (err) {
      console.error("Failed to load vehicles", err);
      setVehicles([]);
      setError("Unable to load vehicles for this company.");
    }
  };

  const fetchTrips = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/trips", {
        withCredentials: true,
      });

      // Sort trips by date descending
      const sorted = res.data.sort(
        (a, b) => new Date(b.tripDateTime) - new Date(a.tripDateTime)
      );

      setTrips(sorted);
    } catch (err) {
      console.error("Failed to load trips", err);
      setError("Unable to load trips.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) : value,
    }));

    if (name === "transportCompanyName") {
      fetchCompanyVehicles(value);
      setFormData((prev) => ({ ...prev, vehicleNumber: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await axios.post("http://localhost:5000/api/trips", formData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      setSuccess("✅ Trip created successfully.");
      setFormData({
        source: "",
        destination: "",
        price: "",
        transportCompanyName: "",
        vehicleNumber: "",
      });
      setVehicles([]);
      fetchTrips();
    } catch (err) {
      console.error("Error creating trip", err);
      setError("❌ Failed to create trip.");
    }
  };

  const toggleStatus = async (trip) => {
    const newStatus = trip.status === "paid" ? "notpaid" : "paid";
    try {
      await axios.post(
        `http://localhost:5000/api/trips/${trip._id}/status`,
        { status: newStatus },
        { withCredentials: true }
      );
      fetchTrips();
    } catch (err) {
      console.error("Failed to update status", err);
      setError("Unable to change trip status.");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">🧭 Create New Trip</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-600 mb-4">{success}</p>}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 shadow rounded-lg space-y-4 mb-8"
      >
        <input
          type="text"
          name="source"
          value={formData.source}
          onChange={handleChange}
          placeholder="Source"
          required
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="text"
          name="destination"
          value={formData.destination}
          onChange={handleChange}
          placeholder="Destination"
          required
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Price"
          required
          className="w-full border px-3 py-2 rounded"
        />
        <select
          name="transportCompanyName"
          value={formData.transportCompanyName}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">Select Company</option>
          {companies.map((company) => (
            <option key={company._id} value={company.name}>
              {company.name}
            </option>
          ))}
        </select>
        <select
          name="vehicleNumber"
          value={formData.vehicleNumber}
          onChange={handleChange}
          required
          disabled={!vehicles.length}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">Select Vehicle</option>
          {vehicles.map((v) => (
            <option key={v._id} value={v.vehicleNumber}>
              {v.vehicleNumber} ({v.vehicleType})
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit Trip
        </button>
      </form>

      {/* Trips */}
      <h2 className="text-xl font-semibold mb-3">📋 All Trips (Latest First)</h2>
      {trips.length > 0 ? (
        <ul className="space-y-3">
          {trips.map((trip) => (
            <li
              key={trip._id}
              className="bg-gray-50 border p-4 rounded shadow-sm"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-800 font-medium">
                    {trip.source} ➡ {trip.destination}
                  </p>
                  <p className="text-sm text-gray-600">
                    ₹{trip.price} • {trip.transportCompanyName} • {trip.vehicleNumber}
                  </p>
                  <p className="text-sm text-gray-500">
                    🕒 {new Date(trip.tripDateTime).toLocaleString()}
                  </p>
                </div>
                <div className="text-right space-y-1">
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded block ${
                      trip.status === "paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {trip.status}
                  </span>
                  <button
  onClick={() => toggleStatus(trip)}
  className={`text-xs px-3 py-1 rounded font-medium shadow-sm transition duration-150 ${
    trip.status === "paid"
      ? "bg-yellow-500 text-white hover:bg-yellow-600"
      : "bg-green-500 text-white hover:bg-green-600"
  }`}
>
  Mark as {trip.status === "paid" ? "Not Paid" : "Paid"}
</button>

                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No trips found.</p>
      )}
    </div>
  );
};

export default Trips;
