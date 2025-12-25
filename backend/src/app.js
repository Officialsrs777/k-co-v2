import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import sequelize from './config/db.config.js';
import { transporter } from './config/nodemailer.config.js'; // 👈 ADD THIS

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
    origin: true,
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
app.use('/api', dataRoutes);
app.use('/api/inquiry', inquiryRoutes);

/* =========================
   Health Check
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

    // 1️⃣ Verify database
    await sequelize.authenticate();
    console.log('✅ Database connected');

    // 2️⃣ Verify SMTP (ONCE)
    try {
      await transporter.verify();
      console.log('✅ SMTP server is ready');
    } catch (smtpError) {
      console.error('❌ SMTP verification failed:', smtpError.message);
      throw smtpError; // fail startup if email is critical
    }

    // 3️⃣ Sync DB models
    await sequelize.sync();

    // 4️⃣ Start HTTP server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error('❌ Startup failed:', error);
    process.exit(1); // IMPORTANT for Render
  }
}

startServer();
