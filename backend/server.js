import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// import bcrypt from 'bcryptjs';   used in only auth routes
import jwt from 'jsonwebtoken';

// controllers
import { authLogin, authMe, authSignUp } from './controllers/auth.js';
import { getAccounts, newAccount, updateAccount } from './controllers/account.js';
import { getTrades, newTrade, updateTrade } from './controllers/trade.js';
import { getWithdrawal, saveWithdrawal } from './controllers/withdrawal.js';
import { authenticateToken } from './middlewares.js';
dotenv.config();

const app = express();
const PORT = 5000;

// moved to middlewares.js
const JWT_SECRET = process.env.JWT_SECRET || 'apex-prop-secret-key';

// app.use(cors());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/ApesProp";

if (MONGODB_URI) {
  mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB local'))
    .catch(err => console.error('MongoDB connection error:', err));
} else {
  console.warn('MONGODB_URI not found in environment variables. Database features will not work.');
}

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    env: {
      hasMongoUri: !!process.env.MONGODB_URI,
      hasJwtSecret: !!process.env.JWT_SECRET
    }
  });
});

// Auth Routes
app.post('/api/auth/signup', authSignUp );

app.post('/api/auth/login', authLogin );

app.get('/api/auth/me', authenticateToken, authMe );

// Account Routes
app.get('/api/accounts/:userId', authenticateToken, getAccounts );

app.post('/api/accounts', authenticateToken, newAccount );

app.patch('/api/accounts/:id', authenticateToken, updateAccount );

// Trade Routes
app.get('/api/trades/:accountId', authenticateToken, getTrades);

app.post('/api/trades', authenticateToken, newTrade );

app.patch('/api/trades/:id', authenticateToken, updateTrade );

// Withdrawal Routes
app.get('/api/withdrawals/:userId', authenticateToken, getWithdrawal);

app.post('/api/withdrawals', authenticateToken, saveWithdrawal );



app.listen(PORT,(req)=>{
   console.log(`Server running on http://localhost:${PORT}`);
})

