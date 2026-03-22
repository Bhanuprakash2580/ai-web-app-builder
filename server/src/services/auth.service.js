import bcrypt from 'bcryptjs';
import User from '../models/User.model.js';
import { generateToken } from '../utils/jwt.utils.js';

const MOCK_USER = {
  _id: 'mock_user_123',
  id: 'mock_user_123',
  name: 'Demo User',
  email: 'demo@example.com',
  password: 'hashed_password',
  createdAt: new Date(),
  lastLogin: new Date(),
};

export const register = async (name, email, password) => {
  if (process.env.MOCK_DB === 'true') {
    const token = generateToken({ ...MOCK_USER, name: name || 'Demo User', email: email || 'demo@example.com' });
    return { token, user: { id: MOCK_USER.id, email: email || 'demo@example.com', name: name || 'Demo User' } };
  }

  const existing = await User.findOne({ email });
  if (existing) {
    const error = new Error('Email already registered.');
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({ name, email, password: hashedPassword });

  const token = generateToken(user);

  return {
    token,
    user: { id: user._id, email: user.email, name: user.name },
  };
};

export const emailLogin = async (email, password) => {
  if (process.env.MOCK_DB === 'true') {
    const token = generateToken({ ...MOCK_USER, name: name || 'Demo User', email: email || 'demo@example.com' });
    return { token, user: { id: MOCK_USER.id, email: email || 'demo@example.com', name: name || 'Demo User' } };
  }

  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error('Invalid email or password.');
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error('Invalid email or password.');
    error.statusCode = 401;
    throw error;
  }

  user.lastLogin = new Date();
  await user.save();

  const token = generateToken(user);

  return {
    token,
    user: { id: user._id, email: user.email, name: user.name },
  };
};

export const getUserProfile = async (userId) => {
  if (process.env.MOCK_DB === 'true') {
    return {
      id: MOCK_USER.id,
      email: MOCK_USER.email,
      name: 'Demo User', // In mock profile, we use default
      createdAt: MOCK_USER.createdAt,
      lastLogin: MOCK_USER.lastLogin,
    };
  }

  const user = await User.findById(userId);

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  return {
    id: user._id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt,
    lastLogin: user.lastLogin,
  };
};