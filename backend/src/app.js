import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import sequelize from './config/db.config.js';
// 👇 No SMTP transporter needed anymore
// import { transporter } from './config/nodemailer.config.js';

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

    // 2️⃣ Verify Mailgun API credentials (optional test)
    if (!process.env.MAILGUN_API_KEY || !process.env.MAILGUN_DOMAIN || !process.env.MAILGUN_FROM) {
      throw new Error('Mailgun credentials are missing in .env');
    }
    console.log('✅ Mailgun credentials are set');

    // 3️⃣ Sync DB models
    await sequelize.sync({ force: false, alter: false });

    // 4️⃣ Start HTTP server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error('❌ Startup failed:', error);
    process.exit(1); // Important for deployment platforms like Render
  }
}

startServer();
