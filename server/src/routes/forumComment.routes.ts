import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate.js';
import { verifyAccessToken, optionalAuth } from '../middleware/auth.js';
import {
  getComments,
  getReplies,
  createComment,
  updateComment,
  deleteComment,
  voteComment,
  removeVote,
} from '../controllers/forumComment.controller.js';

const router = Router({ mergeParams: true });

const createCommentSchema = z.object({
  text: z.string().min(1).max(2000),
  parent_id: z.string().optional(),
});

const updateCommentSchema = z.object({
  text: z.string().min(1).max(2000),
});

const voteSchema = z.object({
  value: z.number().refine((v) => v === 1 || v === -1, { message: 'Value must be 1 or -1' }),
});

// Public routes (with optional auth for user_vote)
router.get('/', optionalAuth, getComments);
router.get('/:commentId/replies', optionalAuth, getReplies);

// Protected routes
router.post('/', verifyAccessToken, validate(createCommentSchema), createComment);
router.patch('/:commentId', verifyAccessToken, validate(updateCommentSchema), updateComment);
router.delete('/:commentId', verifyAccessToken, deleteComment);
router.post('/:commentId/vote', verifyAccessToken, validate(voteSchema), voteComment);
router.delete('/:commentId/vote', verifyAccessToken, removeVote);

export default router;
