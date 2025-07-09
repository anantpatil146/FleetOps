// backend/server.js
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import vehicleRoutes from './routes/vehicle.js';
//import routeRoutes from './routes/route.js';
//import tripRoutes from './routes/trip.js';
import cookieParser from 'cookie-parser';
import transportCompanyRoutes from './routes/transportCompany.js';
import tripRoutes from './routes/trip.js';



dotenv.config();
const app = express();

// Middleware
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173',  // your React frontend
  credentials: true                 // very important for cookies
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/company',transportCompanyRoutes);
app.use('/api/trips', tripRoutes);
//app.use('/api/routes', routeRoutes);
//app.use('/api/trips', tripRoutes);

// DB Connection
mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('MongoDB Connected');
  app.listen(process.env.PORT || 5000, () => {
    console.log(`Server running on port ${process.env.PORT || 5000}`);
  });
}).catch((err) => console.error('DB Error:', err));
