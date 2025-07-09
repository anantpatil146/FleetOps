import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";

const Dashboard = () => {
  const [companies, setCompanies] = useState([]);
  const [allTrips, setAllTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [filters, setFilters] = useState({
    companyName: "",
    vehicleNumber: "",
    status: "",
    source: "",
    destination: "",
  });

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
      console.error("Error loading companies", err);
    }
  };

  const fetchTrips = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/trips", {
        withCredentials: true,
      });
      setAllTrips(res.data);
      setFilteredTrips(res.data);
    } catch (err) {
      console.error("Error loading trips", err);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...filters, [name]: value };
    setFilters(updated);

    const results = allTrips.filter((trip) => {
      return (
        (updated.companyName ? trip.transportCompanyName === updated.companyName : true) &&
        (updated.vehicleNumber ? trip.vehicleNumber === updated.vehicleNumber : true) &&
        (updated.status ? trip.status === updated.status : true) &&
        (updated.source ? trip.source.toLowerCase().includes(updated.source.toLowerCase()) : true) &&
        (updated.destination ? trip.destination.toLowerCase().includes(updated.destination.toLowerCase()) : true)
      );
    });

    setFilteredTrips(results);
  };

  const groupTripsByDate = (trips) => {
    const grouped = {};
    trips.forEach((trip) => {
      const dateKey = dayjs(trip.tripDateTime).format("YYYY-MM-DD");
      if (!grouped[dateKey]) grouped[dateKey] = [];
      grouped[dateKey].push(trip);
    });
    return grouped;
  };

  const groupedTrips = groupTripsByDate(
    [...filteredTrips].sort((a, b) => new Date(b.tripDateTime) - new Date(a.tripDateTime))
  );

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">📊 Filter Trips Dashboard</h1>

      {/* Filters */}
      <div className="bg-white rounded-lg p-6 shadow grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <select
          name="companyName"
          value={filters.companyName}
          onChange={handleFilterChange}
          className="border px-3 py-2 rounded"
        >
          <option value="">All Companies</option>
          {companies.map((c) => (
            <option key={c._id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>

        <input
          name="vehicleNumber"
          placeholder="Vehicle Number"
          value={filters.vehicleNumber}
          onChange={handleFilterChange}
          className="border px-3 py-2 rounded"
        />

        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
          className="border px-3 py-2 rounded"
        >
          <option value="">All Status</option>
          <option value="paid">Paid</option>
          <option value="notpaid">Not Paid</option>
        </select>

        <input
          name="source"
          placeholder="Source"
          value={filters.source}
          onChange={handleFilterChange}
          className="border px-3 py-2 rounded"
        />

        <input
          name="destination"
          placeholder="Destination"
          value={filters.destination}
          onChange={handleFilterChange}
          className="border px-3 py-2 rounded"
        />
      </div>

      {/* Trip Results */}
      <div className="space-y-6">
        {Object.keys(groupedTrips).length === 0 ? (
          <p className="text-gray-500">No trips match your filters.</p>
        ) : (
          Object.entries(groupedTrips).map(([date, trips]) => (
            <div key={date}>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                📅 {dayjs(date).format("DD MMMM YYYY")}
              </h2>
              <div className="space-y-3">
                {trips.map((trip) => (
                  <div
                    key={trip._id}
                    className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
                  >
                    <div>
                      <p className="font-semibold text-lg">
                        {trip.source} → {trip.destination}
                      </p>
                      <p className="text-sm text-gray-600">
                        ₹{trip.price} | {trip.transportCompanyName} | {trip.vehicleNumber}
                      </p>
                      <p className="text-sm text-gray-400">
                        🕒 {dayjs(trip.tripDateTime).format("hh:mm A")}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded text-sm font-medium ${
                        trip.status === "paid"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {trip.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
