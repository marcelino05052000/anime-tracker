import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { env } from '../config/env.js';
import type { AuthRequest } from '../types/index.js';

const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

function signAccessToken(userId: string): string {
  return jwt.sign({ userId }, env.JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
}

function signRefreshToken(userId: string): string {
  return jwt.sign({ userId }, env.JWT_REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });
}

function setTokenCookies(res: Response, userId: string): void {
  const isProduction = env.NODE_ENV === 'production';

  res.cookie('accessToken', signAccessToken(userId), {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'strict',
    maxAge: 15 * 60 * 1000, // 15min
  });

  res.cookie('refreshToken', signRefreshToken(userId), {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'strict',
    path: '/api/auth/refresh',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
  });
}

function clearTokenCookies(res: Response): void {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken', { path: '/api/auth/refresh' });
}

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      const field = existingUser.email === email ? 'email' : 'username';
      res.status(409).json({ message: `This ${field} is already in use` });
      return;
    }

    const user = await User.create({ username, email, password });

    setTokenCookies(res, String(user._id));

    res.status(201).json({
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (error) {
    console.error('[Register Error]', error);
    res.status(500).json({ message: 'Failed to create account' });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    setTokenCookies(res, String(user._id));

    res.json({
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (error) {
    console.error('[Login Error]', error);
    res.status(500).json({ message: 'Failed to login' });
  }
}

export async function logout(_req: Request, res: Response): Promise<void> {
  clearTokenCookies(res);
  res.json({ message: 'Logged out' });
}

export async function refresh(req: Request, res: Response): Promise<void> {
  try {
    const token = req.cookies.refreshToken as string | undefined;
    if (!token) {
      res.status(401).json({ message: 'No refresh token' });
      return;
    }

    const payload = jwt.verify(token, env.JWT_REFRESH_SECRET) as { userId: string };
    const user = await User.findById(payload.userId).select('-password');
    if (!user) {
      res.status(401).json({ message: 'User not found' });
      return;
    }

    setTokenCookies(res, String(user._id));

    res.json({
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
}

export async function getMe(req: AuthRequest, res: Response): Promise<void> {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.set('Cache-Control', 'no-store');
    res.json({
      user: { id: user._id, username: user.username, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error('[GetMe Error]', error);
    res.status(500).json({ message: 'Failed to get user' });
  }
}
