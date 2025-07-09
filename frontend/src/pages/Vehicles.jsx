import React, { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Truck, Building2, Users, AlertCircle, Search, Filter } from "lucide-react";

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [formData, setFormData] = useState({
    vehicleNumber: "",
    vehicleType: "",
    capacity: 1,
    companyName: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    fetchVehicles();
    fetchCompanies();
  }, []);

  useEffect(() => {
    filterVehicles();
  }, [vehicles, searchTerm, selectedCompany]);

  const fetchVehicles = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/vehicles", {
        withCredentials: true,
      });
      setVehicles(res.data);
    } catch (err) {
      console.error("Error fetching vehicles:", err);
      setError("Failed to fetch vehicles.");
    }
  };

  const fetchCompanies = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/company", {
        withCredentials: true,
      });
      setCompanies(res.data);
    } catch (err) {
      console.error("Error fetching companies:", err);
      setError("Failed to fetch company list.");
    }
  };

  const filterVehicles = () => {
    let filtered = vehicles;
    
    if (searchTerm) {
      filtered = filtered.filter(vehicle =>
        vehicle.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.vehicleType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (vehicle.companyName && vehicle.companyName.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (selectedCompany) {
      filtered = filtered.filter(vehicle => vehicle.companyName === selectedCompany);
    }
    
    setFilteredVehicles(filtered);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "capacity" ? parseInt(value) : value,
    }));
  };

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        vehicleNumber: formData.vehicleNumber.trim(),
        vehicleType: formData.vehicleType.trim(),
        capacity: parseInt(formData.capacity),
        companyName: formData.companyName,
      };

      const res = await axios.post("http://localhost:5000/api/vehicles", payload, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      console.log("✅ Vehicle added:", res.data);
      setFormData({
        vehicleNumber: "",
        vehicleType: "",
        capacity: 1,
        companyName: "",
      });
      fetchVehicles();
      setError("");
    } catch (err) {
      console.error("Error adding vehicle:", err.response || err.message);
      setError("Failed to add vehicle.");
    }
  };

  const getVehicleIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'truck':
        return <Truck className="w-5 h-5 text-blue-600" />;
      case 'van':
        return <Truck className="w-5 h-5 text-green-600" />;
      case 'bus':
        return <Truck className="w-5 h-5 text-purple-600" />;
      default:
        return <Truck className="w-5 h-5 text-gray-600" />;
    }
  };

  const getCapacityColor = (capacity) => {
    if (capacity >= 30) return 'text-red-600 bg-red-50';
    if (capacity >= 15) return 'text-orange-600 bg-orange-50';
    return 'text-green-600 bg-green-50';
  };

  const displayVehicles = searchTerm || selectedCompany ? filteredVehicles : vehicles;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Truck className="w-8 h-8 text-blue-600" />
                </div>
                Vehicles
              </h1>
              <p className="text-gray-600 mt-2 text-lg">Manage your fleet with ease</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">{vehicles.length}</div>
              <div className="text-sm text-gray-500">Total Vehicles</div>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Vehicle Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
              <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2 mb-6">
                <Plus className="w-6 h-6 text-blue-600" />
                Add New Vehicle
              </h2>
              
              <form onSubmit={handleAddVehicle} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vehicle Number
                  </label>
                  <input
                    type="text"
                    name="vehicleNumber"
                    placeholder="Vehicle Number"
                    value={formData.vehicleNumber}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vehicle Type
                  </label>
                  <input
                    type="text"
                    name="vehicleType"
                    placeholder="Vehicle Type"
                    value={formData.vehicleType}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Capacity
                  </label>
                  <input
                    type="number"
                    name="capacity"
                    placeholder="Capacity"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    required
                    min={1}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company
                  </label>
                  <select
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="">Select Company</option>
                    {companies.map((company) => (
                      <option key={company._id} value={company.name}>
                        {company.name}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-6 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transition-colors"
                >
                  Add Vehicle
                </button>
              </form>
            </div>
          </div>

          {/* Vehicle List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Vehicle Fleet</h2>
                
                <div className="flex gap-4 w-full sm:w-auto">
                  <div className="relative flex-1 sm:flex-none">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search vehicles..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
                    />
                  </div>
                  
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <select
                      value={selectedCompany}
                      onChange={(e) => setSelectedCompany(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                    >
                      <option value="">All Companies</option>
                      {companies.map((company) => (
                        <option key={company._id} value={company.name}>
                          {company.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {displayVehicles.length > 0 ? (
                <div className="space-y-4">
                  {displayVehicles.map((vehicle) => (
                    <div
                      key={vehicle._id}
                      className="bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          {getVehicleIcon(vehicle.vehicleType)}
                          <div>
                            <p className="text-xl font-bold text-gray-800">
                              {vehicle.vehicleNumber}
                            </p>
                            <p className="text-gray-600 text-sm flex items-center gap-1">
                              Type: {vehicle.vehicleType}
                            </p>
                            <p className="text-gray-600 text-sm flex items-center gap-1">
                              Capacity: {vehicle.capacity}
                            </p>
                            {vehicle.companyName && (
                              <p className="text-gray-500 text-sm flex items-center gap-1">
                                <Building2 className="w-4 h-4" />
                                Company: {vehicle.companyName}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex gap-3">
                          <div className="text-center">
                            <div className="text-sm text-gray-500">Type</div>
                            <div className="font-semibold text-gray-700">{vehicle.vehicleType}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm text-gray-500">Capacity</div>
                            <div className={`font-semibold px-2 py-1 rounded-full text-sm ${getCapacityColor(vehicle.capacity)}`}>
                              <Users className="w-4 h-4 inline mr-1" />
                              {vehicle.capacity}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                !error && (
                  <div className="text-center py-12">
                    <Truck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">
                      {searchTerm || selectedCompany ? 'No vehicles match your filters.' : 'No vehicles found.'}
                    </p>
                    {(searchTerm || selectedCompany) && (
                      <button
                        onClick={() => {
                          setSearchTerm("");
                          setSelectedCompany("");
                        }}
                        className="text-blue-600 hover:text-blue-800 mt-2"
                      >
                        Clear filters
                      </button>
                    )}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}