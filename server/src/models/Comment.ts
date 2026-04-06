import mongoose, { type Document } from 'mongoose';

export interface IComment extends Document {
  user: mongoose.Types.ObjectId;
  mal_id: number;
  text: string;
  parent_id: mongoose.Types.ObjectId | null;
  edited: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new mongoose.Schema<IComment>(
  {
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
    text: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 1000,
    },
    parent_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
      default: null,
    },
    edited: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

commentSchema.index({ mal_id: 1, createdAt: -1 });
commentSchema.index({ parent_id: 1 });

export const Comment = mongoose.model<IComment>('Comment', commentSchema);
