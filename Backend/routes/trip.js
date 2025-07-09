// routes/trip.js
import express from 'express';
import { createTrip, getAllTrips, updateTripStatus} from '../controllers/tripController.js';
import isAdmin from '../middleware/isAdmin.js';

const router = express.Router();

router.post('/', isAdmin, createTrip);
router.get('/', isAdmin, getAllTrips);
router.post("/:id/status", updateTripStatus);

export default router;
