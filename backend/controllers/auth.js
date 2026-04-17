import mongoose from "mongoose";
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from "bcryptjs";
import { User } from "../models/user.js";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'apex-prop-secret-key';

export const authSignUp = async (req, res) => {
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
}

export const authLogin =  async (req, res) => {
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
    console.log("User entered password : ",password )
    console.log("Stored password : ", user.password )
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
}

export const authMe =  async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.user.uid });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ uid: user.uid, email: user.email, displayName: user.displayName });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
}