import mongoose, { type Document } from 'mongoose';

export interface IEpisodeRelease extends Document {
  mal_id: number;
  title: string;
  image_url: string;
  episode_number: number | null;
  aired_date: Date;
  created_at: Date;
}

const episodeReleaseSchema = new mongoose.Schema<IEpisodeRelease>({
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
  episode_number: {
    type: Number,
    default: null,
  },
  aired_date: {
    type: Date,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

episodeReleaseSchema.index({ mal_id: 1, aired_date: 1 }, { unique: true });

export const EpisodeRelease = mongoose.model<IEpisodeRelease>('EpisodeRelease', episodeReleaseSchema);
