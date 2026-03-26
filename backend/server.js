import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, Account, Trade, Withdrawal } from './models/models.js';

dotenv.config();

const app = express();
const PORT = 5000;
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

// Auth Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access denied' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

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
app.post('/api/auth/signup', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database not connected. Please check your MONGODB_URI in settings.' });
    }
    const { email, password, displayName } = req.body;
    console.log('Signup attempt:', { email, displayName });

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      console.log('Signup failed: User already exists', normalizedEmail);
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const uid = new mongoose.Types.ObjectId().toString();
    
    const user = new User({
      uid,
      email: normalizedEmail,
      password: hashedPassword,
      displayName,
    });

    await user.save();
    console.log('User created successfully:', normalizedEmail);
    
    const token = jwt.sign({ uid: user.uid, email: user.email }, JWT_SECRET);
    res.json({ token, user: { uid: user.uid, email: user.email, displayName: user.displayName } });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Signup failed', details: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database not connected. Please check your MONGODB_URI in settings.' });
    }
    const { email, password } = req.body;
    console.log('Login attempt:', { email });

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      console.log('Login failed: User not found', normalizedEmail);
      return res.status(400).json({ error: 'User not found' });
    }

    if (!user.password) {
      console.log('Login failed: No password set for user', normalizedEmail);
      return res.status(400).json({ error: 'This account was created without a password. Please use the original login method.' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      console.log('Login failed: Invalid password for user', normalizedEmail);
      return res.status(400).json({ error: 'Invalid password' });
    }

    const token = jwt.sign({ uid: user.uid, email: user.email }, JWT_SECRET);
    res.json({ token, user: { uid: user.uid, email: user.email, displayName: user.displayName } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed', details: error.message });
  }
});

app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.user.uid });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ uid: user.uid, email: user.email, displayName: user.displayName });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Account Routes
app.get('/api/accounts/:userId', authenticateToken, async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database not connected. Please check your MONGODB_URI in settings.' });
    }
    const accounts = await Account.find({ userId: req.params.userId });
    res.json(accounts);
  } catch (error) {
    console.error('Fetch accounts error:', error);
    res.status(500).json({ error: 'Failed to fetch accounts', details: error.message });
  }
});

app.post('/api/accounts', authenticateToken, async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database not connected' });
    }
    const account = new Account(req.body);
    await account.save();
    res.json(account);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create account', details: error.message });
  }
});

app.patch('/api/accounts/:id', authenticateToken, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid account ID format' });
    }
    const account = await Account.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(account);
  } catch (error) {
    console.error('Update account error:', error);
    res.status(500).json({ error: 'Failed to update account', details: error.message });
  }
});

// Trade Routes
app.get('/api/trades/:accountId', authenticateToken, async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database not connected' });
    }
    
    if (!mongoose.Types.ObjectId.isValid(req.params.accountId)) {
      return res.status(400).json({ error: 'Invalid account ID format' });
    }

    const trades = await Trade.find({ accountId: req.params.accountId }).sort({ openedAt: -1 });
    res.json(trades);
  } catch (error) {
    console.error('Fetch trades error:', error);
    res.status(500).json({ error: 'Failed to fetch trades', details: error.message });
  }
});

app.post('/api/trades', authenticateToken, async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database not connected' });
    }
    
    if (!mongoose.Types.ObjectId.isValid(req.body.accountId)) {
      return res.status(400).json({ error: 'Invalid account ID format' });
    }

    const trade = new Trade(req.body);
    await trade.save();
    res.json(trade);
  } catch (error) {
    console.error('Create trade error:', error);
    res.status(500).json({ error: 'Failed to create trade', details: error.message });
  }
});

app.patch('/api/trades/:id', authenticateToken, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid trade ID format' });
    }
    const trade = await Trade.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(trade);
  } catch (error) {
    console.error('Update trade error:', error);
    res.status(500).json({ error: 'Failed to update trade', details: error.message });
  }
});

// Withdrawal Routes
app.get('/api/withdrawals/:userId', authenticateToken, async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database not connected' });
    }
    const withdrawals = await Withdrawal.find({ userId: req.params.userId });
    res.json(withdrawals);
  } catch (error) {
    console.error('Fetch withdrawals error:', error);
    res.status(500).json({ error: 'Failed to fetch withdrawals', details: error.message });
  }
});

app.post('/api/withdrawals', authenticateToken, async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database not connected' });
    }

    if (!mongoose.Types.ObjectId.isValid(req.body.accountId)) {
      return res.status(400).json({ error: 'Invalid account ID format' });
    }

    const withdrawal = new Withdrawal(req.body);
    await withdrawal.save();
    res.json(withdrawal);
  } catch (error) {
    console.error('Create withdrawal error:', error);
    res.status(500).json({ error: 'Failed to create withdrawal', details: error.message });
  }
});




app.listen(PORT,(req)=>{
   console.log(`Server running on http://localhost:${PORT}`);
})

