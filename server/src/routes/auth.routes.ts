import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate.js';
import { verifyAccessToken } from '../middleware/auth.js';
import { register, login, logout, refresh, getMe } from '../controllers/auth.controller.js';

const router = Router();

const registerSchema = z.object({
  username: z.string().min(3).max(20).trim(),
  email: z.string().email().toLowerCase().trim(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email().toLowerCase().trim(),
  password: z.string().min(1),
});

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/logout', logout);
router.post('/refresh', refresh);
router.get('/me', verifyAccessToken, getMe);

export default router;
