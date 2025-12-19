import express from 'express';
import dotenv from 'dotenv';
import clientRoutes from './routes/client.route.js';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import sequelize from './config/db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

dotenv.config();


const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // frontend
    credentials: true,               // allow cookies
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/clients', clientRoutes);
app.use('/users', userRoutes);
app.use('/auth' , authRoutes);


// Start server after DB connection
const PORT = process.env.PORT || 5000;

sequelize.authenticate()
  .then(() => {
    console.log('Database connected successfully');
    return sequelize.sync(); // optionally use { alter: true } in dev
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('Database connection error:', err));
