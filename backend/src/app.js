import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import sequelize from './config/db.config.js';
import authRoutes from './modules/auth/auth.route.js';
import dataRoutes from './modules/dashboard/data.route.js';
import inquiryRoutes from './modules/inquiry/inquiry.route.js';

dotenv.config();

const app = express();

/* =========================
   Middleware
========================= */

app.use(
  cors({
    origin: true,            // allow all origins for now (safe for backend deploy)
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.use(express.json());
app.use(cookieParser());

/* =========================
   Routes
========================= */

app.use('/api/auth', authRoutes);
app.use('/api', dataRoutes);              // CSV upload & dashboard data
app.use('/api/inquiry', inquiryRoutes);

/* =========================
   Health Check (IMPORTANT)
========================= */
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

/* =========================
   Server Bootstrap
========================= */

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    console.log('Starting server...');

    // Verify DB connection
    await sequelize.authenticate();
    console.log('Database connected successfully');

    // Sync models (safe for now; remove or lock later)
    await sequelize.sync();

    // Start HTTP server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error('Startup failed:', error);
    process.exit(1); // REQUIRED for Render to show real error
  }
}

startServer();