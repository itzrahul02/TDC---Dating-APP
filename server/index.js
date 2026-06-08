import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import profileRoutes from './routes/profiles.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = (
  process.env.CLIENT_URLS ||
  'http://localhost:5173,https://tdc-dating-app.vercel.app'
)
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({ 
  origin: (origin, callback) => {
    // Allow non-browser and same-origin requests without an Origin header.
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api', profileRoutes);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
