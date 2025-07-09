import express from 'express';
import isAdmin from '../middleware/isAdmin.js';
import {
  createVehicle,
  getVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle
} from '../controllers/vehicleController.js';
import { getVehiclesByCompany } from "../controllers/transportCompanyController.js";

const router = express.Router();

router.post('/', isAdmin, createVehicle);
router.get('/', isAdmin, getVehicles);
router.get('/:id', isAdmin, getVehicleById);
router.put('/:id', isAdmin, updateVehicle);
router.delete('/:id', isAdmin, deleteVehicle);
router.get("/:name/vehicles", isAdmin, getVehiclesByCompany);

export default router;