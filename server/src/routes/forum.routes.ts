import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate.js';
import { verifyAccessToken, requireRole } from '../middleware/auth.js';
import { FORUM_CATEGORIES } from '../models/ForumPost.js';
import {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  togglePin,
  toggleLock,
} from '../controllers/forum.controller.js';
import forumCommentRoutes from './forumComment.routes.js';

const router = Router();

const createPostSchema = z.object({
  mal_id: z.number(),
  anime_title: z.string().min(1),
  anime_image_url: z.string().min(1),
  title: z.string().min(3).max(200),
  body: z.string().min(1).max(5000),
  category: z.enum(FORUM_CATEGORIES),
  episode_number: z.number().optional(),
  tags: z.array(z.string().max(30)).max(5).optional(),
});

const updatePostSchema = z.object({
  title: z.string().min(3).max(200).optional(),
  body: z.string().min(1).max(5000).optional(),
  tags: z.array(z.string().max(30)).max(5).optional(),
});

// Public routes
router.get('/', getPosts);
router.get('/:postId', getPost);

// Protected routes
router.post('/', verifyAccessToken, validate(createPostSchema), createPost);
router.patch('/:postId', verifyAccessToken, validate(updatePostSchema), updatePost);
router.delete('/:postId', verifyAccessToken, deletePost);

// Mod/admin routes
router.patch('/:postId/pin', verifyAccessToken, requireRole('moderator', 'admin'), togglePin);
router.patch('/:postId/lock', verifyAccessToken, requireRole('moderator', 'admin'), toggleLock);

// Nest comment routes under /forum/:postId/comments
router.use('/:postId/comments', forumCommentRoutes);

export default router;
