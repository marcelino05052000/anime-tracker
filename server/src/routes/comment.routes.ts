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
} from '../controllers/comment.controller.js';

const router = Router();

const createCommentSchema = z.object({
  text: z.string().min(1).max(1000),
  parent_id: z.string().optional(),
});

const updateCommentSchema = z.object({
  text: z.string().min(1).max(1000),
});

const voteSchema = z.object({
  value: z.number().refine((v) => v === 1 || v === -1, { message: 'Value must be 1 or -1' }),
});

// Public routes (with optional auth for user_vote)
router.get('/:mal_id', optionalAuth, getComments);
router.get('/:comment_id/replies', optionalAuth, getReplies);

// Protected routes
router.post('/:mal_id', verifyAccessToken, validate(createCommentSchema), createComment);
router.patch('/:comment_id', verifyAccessToken, validate(updateCommentSchema), updateComment);
router.delete('/:comment_id', verifyAccessToken, deleteComment);
router.post('/:comment_id/vote', verifyAccessToken, validate(voteSchema), voteComment);
router.delete('/:comment_id/vote', verifyAccessToken, removeVote);

export default router;
