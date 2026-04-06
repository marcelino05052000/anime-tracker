import mongoose, { type Document } from 'mongoose';

export interface IAnimeListEntry extends Document {
  user: mongoose.Types.ObjectId;
  mal_id: number;
  title: string;
  image_url: string;
  score: number | null;
  episodes: number | null;
  status: string;
  user_score: number | null;
  current_episode: number | null;
  added_at: Date;
  updated_at: Date;
}

const animeListEntrySchema = new mongoose.Schema<IAnimeListEntry>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  mal_id: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  image_url: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    default: null,
  },
  episodes: {
    type: Number,
    default: null,
  },
  status: {
    type: String,
    required: true,
    enum: ['watching', 'completed', 'plan_to_watch', 'dropped'],
  },
  user_score: {
    type: Number,
    default: null,
    min: 1,
    max: 10,
  },
  current_episode: {
    type: Number,
    default: null,
    min: 0,
  },
  added_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

animeListEntrySchema.index({ user: 1, mal_id: 1 }, { unique: true });

export const AnimeListEntry = mongoose.model<IAnimeListEntry>('AnimeListEntry', animeListEntrySchema);
