// src/pages/Transports.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Transports() {
  const [companies, setCompanies] = useState([]);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    contactNumber: "",
  });
  const [vehicles, setVehicles] = useState({});
  const [loadingVehicles, setLoadingVehicles] = useState("");

  // Fetch companies on load
  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/company", {
        withCredentials: true,
      });
      setCompanies(res.data);
      setError("");
    } catch (err) {
      console.error("Error fetching companies:", err);
      setError("Failed to fetch companies.");
    }
  };

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

 const handleAddCompany = async (e) => {
  e.preventDefault();
  try {
    const payload = {
      name: formData.name.trim(),
      address: formData.address.trim(),
      contactNumber: String(formData.contactNumber).trim(),
    };

    console.log("📦 Sending to backend:", payload);
    console.log("Form data:", formData);

    const res = await axios.post("http://localhost:5000/api/company", payload, {
      headers: {
        "Content-Type": "application/json",
      },withCredentials: true,
    });

    console.log("✅ Added company:", res.data);

    setFormData({ name: "", address: "", contactNumber: "" });
    fetchCompanies();
    setError("");
  } catch (err) {
    if (err.response) {
      console.error("📛 Server error:", err.response.data);
      setError(err.response.data?.error || "Server returned an error.");
    } else if (err.request) {
      console.error("⚠️ No response from server:", err.request);
      setError("No response from server. Is backend running?");
    } else {
      console.error("🧨 Error:", err.message);
      setError("Error: " + err.message);
    }
  }
};



 const handleViewVehicles = async (companyName) => {
  try {
    setLoadingVehicles(companyName);
    const res = await axios.get(
  `http://localhost:5000/api/company/${encodeURIComponent(companyName)}/vehicles`,
  { withCredentials: true } // ⬅️ This is required for session-based auth
);

    setVehicles((prev) => ({
      ...prev,
      [companyName]: res.data,
    }));
  } catch (err) {
    console.error("Error fetching vehicles:", err);
    setError("Failed to fetch vehicles.");
  } finally {
    setLoadingVehicles("");
  }
};


  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
        🚛 Transport Companies
      </h1>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {/* Add Company Form */}
      <form
        onSubmit={handleAddCompany}
        className="mt-6 bg-white p-4 shadow rounded-lg space-y-4"
      >
        <h2 className="text-xl font-semibold">Add New Company</h2>
        <input
          type="text"
          name="name"
          placeholder="Company Name"
          value={formData.name}
          onChange={handleInputChange}
          required
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleInputChange}
          required
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="number"
          name="contactNumber"
          placeholder="Contact Number"
          value={formData.contactNumber}
          onChange={handleInputChange}
          required
          className="w-full border px-3 py-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Company
        </button>
      </form>

      {/* Company List */}
      {companies.length > 0 ? (
        <ul className="mt-6 space-y-4">
          {companies.map((company) => (
            <li
              key={company._id}
              className="bg-white shadow-md p-4 rounded-lg border border-gray-200"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-lg font-medium text-gray-700">
                    {company.name}
                  </p>
                  <p className="text-gray-500 text-sm">{company.address}</p>
                  <p className="text-gray-500 text-sm">
                    📞 {company.contactNumber}
                  </p>
                </div>
                <button
                  onClick={() => handleViewVehicles(company.name)}
                  className="text-sm text-blue-600 underline hover:text-blue-800"
                >
                  {loadingVehicles === company.name ? "Loading..." : "View Vehicles"}
                </button>
              </div>

              {/* Vehicles Display */}
              {vehicles[company.name] && (
  <ul className="mt-2 pl-4 list-disc text-sm text-gray-600">
    {vehicles[company.name].length > 0 ? (
      vehicles[company.name].map((vehicle) => (
        <li key={vehicle._id}>
          {vehicle.vehicleNumber} ({vehicle.vehicleType}, capacity: {vehicle.capacity})
        </li>
      ))
    ) : (
      <li>No vehicles found.</li>
    )}
  </ul>
)}

            </li>
          ))}
        </ul>
      ) : (
        !error && <p className="mt-4 text-gray-500">No companies found.</p>
      )}
    </div>
  );
}
