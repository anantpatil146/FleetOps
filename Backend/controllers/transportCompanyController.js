import TransportCompany from "../models/TransportCompany.js";
import express from 'express';
import Vehicle from '../models/Vehicle.js';

// Create company
// controllers/companyController.js or wherever you defined it

export const createCompany = async (req, res) => {
  try {
    const { name, address, contactNumber } = req.body;

    if (!name || !address || !contactNumber) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existing = await TransportCompany.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: "Company already exists" });
    }

    const company = new TransportCompany({ name, address, contactNumber });
    await company.save();

    res.status(201).json(company);
  } catch (err) {
    console.error("Error creating company:", err);
    res.status(500).json({ message: err.message });
  }
};


// Get all companies
export const getAllCompanies = async (req, res) => {
  try {
    const companies = await TransportCompany.find();
    res.json(companies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single company by name
export const getCompanyByName = async (req, res) => {
  try {
    const company = await TransportCompany.findOne({ name: req.params.name });
    if (!company) return res.status(404).json({ message: "Company not found" });
    res.json(company);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update company by name
export const updateCompanyByName = async (req, res) => {
  try {
    const company = await TransportCompany.findOneAndUpdate(
      { name: req.params.name },
      { name: req.body.name },
      { new: true }
    );
    if (!company) return res.status(404).json({ message: "Company not found" });
    res.json(company);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete company by name
export const deleteCompanyByName = async (req, res) => {
  try {
    const company = await TransportCompany.findOneAndDelete({ name: req.params.name });
    if (!company) return res.status(404).json({ message: "Company not found" });
    res.json({ message: "Company deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getVehiclesByCompany = async (req, res) => {
  try {
    const { name } = req.params;

    const vehicles = await Vehicle.find({ companyName: name });

    if (vehicles.length === 0) {
      return res.status(404).json({ message: "No vehicles found for this company" });
    }

    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
