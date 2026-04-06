import type { Response } from 'express';
import mongoose from 'mongoose';
import { AnimeListEntry } from '../models/AnimeListEntry.js';
import type { AuthRequest } from '../types/index.js';

export async function getList(req: AuthRequest, res: Response): Promise<void> {
  try {
    const filter: Record<string, unknown> = { user: req.userId };
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const entries = await AnimeListEntry.find(filter).sort({ updated_at: -1 });
    res.json({ entries });
  } catch (error) {
    console.error('[GetList Error]', error);
    res.status(500).json({ message: 'Failed to get list' });
  }
}

export async function addEntry(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { mal_id, title, image_url, score, episodes, status, user_score, current_episode } = req.body;

    const existing = await AnimeListEntry.findOne({ user: req.userId, mal_id });
    if (existing) {
      res.status(409).json({ message: 'Entry already exists' });
      return;
    }

    const entry = await AnimeListEntry.create({
      user: req.userId,
      mal_id,
      title,
      image_url,
      score: score ?? null,
      episodes: episodes ?? null,
      status,
      user_score: user_score ?? null,
      current_episode: current_episode ?? null,
    });

    res.status(201).json({ entry });
  } catch (error) {
    console.error('[AddEntry Error]', error);
    res.status(500).json({ message: 'Failed to add entry' });
  }
}

export async function updateEntry(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { mal_id } = req.params;
    const updates: Record<string, unknown> = { updated_at: new Date() };

    if (req.body.status !== undefined) updates.status = req.body.status;
    if (req.body.user_score !== undefined) updates.user_score = req.body.user_score;
    if (req.body.current_episode !== undefined) updates.current_episode = req.body.current_episode;

    const entry = await AnimeListEntry.findOneAndUpdate(
      { user: req.userId, mal_id: Number(mal_id) },
      { $set: updates },
      { new: true },
    );

    if (!entry) {
      res.status(404).json({ message: 'Entry not found' });
      return;
    }

    res.json({ entry });
  } catch (error) {
    console.error('[UpdateEntry Error]', error);
    res.status(500).json({ message: 'Failed to update entry' });
  }
}

export async function deleteEntry(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { mal_id } = req.params;

    const entry = await AnimeListEntry.findOneAndDelete({
      user: req.userId,
      mal_id: Number(mal_id),
    });

    if (!entry) {
      res.status(404).json({ message: 'Entry not found' });
      return;
    }

    res.json({ message: 'Entry removed' });
  } catch (error) {
    console.error('[DeleteEntry Error]', error);
    res.status(500).json({ message: 'Failed to delete entry' });
  }
}

export async function importEntries(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { entries } = req.body as { entries: Array<Record<string, unknown>> };

    const userId = new mongoose.Types.ObjectId(req.userId);

    const operations = entries.map((entry) => ({
      updateOne: {
        filter: { user: userId, mal_id: Number(entry.mal_id) },
        update: {
          $set: {
            user: userId,
            mal_id: Number(entry.mal_id),
            title: String(entry.title),
            image_url: String(entry.image_url),
            score: (entry.score as number | null) ?? null,
            episodes: (entry.episodes as number | null) ?? null,
            status: String(entry.status),
            user_score: (entry.user_score as number | null) ?? null,
            current_episode: (entry.current_episode as number | null) ?? null,
            updated_at: entry.updated_at ? new Date(entry.updated_at as string) : new Date(),
          },
          $setOnInsert: {
            added_at: entry.added_at ? new Date(entry.added_at as string) : new Date(),
          },
        },
        upsert: true,
      },
    }));

    const result = await AnimeListEntry.bulkWrite(operations as Parameters<typeof AnimeListEntry.bulkWrite>[0]);
    const imported = result.upsertedCount + result.modifiedCount;

    res.json({ imported });
  } catch (error) {
    console.error('[ImportEntries Error]', error);
    res.status(500).json({ message: 'Failed to import entries' });
  }
}
