import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate.js';
import { verifyAccessToken } from '../middleware/auth.js';
import { getList, addEntry, updateEntry, deleteEntry, importEntries } from '../controllers/list.controller.js';

const router = Router();

router.use(verifyAccessToken);

const addEntrySchema = z.object({
  mal_id: z.number().int().positive(),
  title: z.string().min(1),
  image_url: z.string().min(1),
  score: z.number().nullable().optional(),
  episodes: z.number().int().nullable().optional(),
  status: z.enum(['watching', 'completed', 'plan_to_watch', 'dropped']),
  user_score: z.number().int().min(1).max(10).nullable().optional(),
  current_episode: z.number().int().min(0).nullable().optional(),
});

const updateEntrySchema = z.object({
  status: z.enum(['watching', 'completed', 'plan_to_watch', 'dropped']).optional(),
  user_score: z.number().int().min(1).max(10).nullable().optional(),
  current_episode: z.number().int().min(0).nullable().optional(),
});

const importSchema = z.object({
  entries: z.array(z.object({
    mal_id: z.number().int().positive(),
    title: z.string().min(1),
    image_url: z.string().min(1),
    score: z.number().nullable().optional(),
    episodes: z.number().int().nullable().optional(),
    status: z.enum(['watching', 'completed', 'plan_to_watch', 'dropped']),
    user_score: z.number().int().min(1).max(10).nullable().optional(),
    current_episode: z.number().int().min(0).nullable().optional(),
    added_at: z.string().optional(),
    updated_at: z.string().optional(),
  })),
});

router.get('/', getList);
router.post('/', validate(addEntrySchema), addEntry);
router.patch('/:mal_id', validate(updateEntrySchema), updateEntry);
router.delete('/:mal_id', deleteEntry);
router.post('/import', validate(importSchema), importEntries);

export default router;
