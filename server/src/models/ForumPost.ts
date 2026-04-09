import mongoose, { type Document } from 'mongoose';

export const FORUM_CATEGORIES = [
  'discussion',
  'theories',
  'reviews',
  'spoilers',
  'news',
  'episode_discussion',
] as const;

export type ForumCategory = (typeof FORUM_CATEGORIES)[number];

export interface IForumPost extends Document {
  author: mongoose.Types.ObjectId;
  mal_id: number;
  anime_title: string;
  anime_image_url: string;
  title: string;
  body: string;
  category: ForumCategory;
  episode_number: number | null;
  tags: string[];
  pinned: boolean;
  locked: boolean;
  views: number;
  comment_count: number;
  last_activity: Date;
  edited: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const forumPostSchema = new mongoose.Schema<IForumPost>(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    mal_id: {
      type: Number,
      required: true,
    },
    anime_title: {
      type: String,
      required: true,
    },
    anime_image_url: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 200,
    },
    body: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 5000,
    },
    category: {
      type: String,
      required: true,
      enum: FORUM_CATEGORIES,
    },
    episode_number: {
      type: Number,
      default: null,
    },
    tags: {
      type: [String],
      default: [],
    },
    pinned: {
      type: Boolean,
      default: false,
    },
    locked: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
    },
    comment_count: {
      type: Number,
      default: 0,
    },
    last_activity: {
      type: Date,
      default: Date.now,
    },
    edited: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

forumPostSchema.index({ mal_id: 1, category: 1 });
forumPostSchema.index({ last_activity: -1 });
forumPostSchema.index({ category: 1, last_activity: -1 });

export const ForumPost = mongoose.model<IForumPost>('ForumPost', forumPostSchema);
