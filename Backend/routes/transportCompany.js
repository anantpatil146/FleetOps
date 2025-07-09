import express from "express";
import {
  createCompany,
  getAllCompanies,
  getCompanyByName,
  updateCompanyByName,
  deleteCompanyByName,
  getVehiclesByCompany
} from "../controllers/transportCompanyController.js";
import isAdmin from "../middleware/isAdmin.js";
import Vehicle from '../models/Vehicle.js';

const router = express.Router();

// /api/company
router.post("/", isAdmin, createCompany);
router.get("/", isAdmin, getAllCompanies);
router.get("/:name", isAdmin, getCompanyByName);
router.put("/:name", isAdmin, updateCompanyByName);
router.delete("/:name", isAdmin, deleteCompanyByName);
router.get("/:name/vehicles", isAdmin, getVehiclesByCompany);

export default router;
