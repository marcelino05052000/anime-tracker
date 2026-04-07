import mongoose, { type Document } from 'mongoose';

export interface INotification extends Document {
  user: mongoose.Types.ObjectId;
  mal_id: number;
  title: string;
  image_url: string;
  episode_number: number | null;
  aired_date: Date;
  read: boolean;
  created_at: Date;
}

const notificationSchema = new mongoose.Schema<INotification>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
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
  episode_number: {
    type: Number,
    default: null,
  },
  aired_date: {
    type: Date,
    required: true,
  },
  read: {
    type: Boolean,
    default: false,
    index: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

notificationSchema.index({ user: 1, created_at: -1 });
notificationSchema.index({ user: 1, mal_id: 1, aired_date: 1 }, { unique: true });

export const Notification = mongoose.model<INotification>('Notification', notificationSchema);
