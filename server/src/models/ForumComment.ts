import mongoose, { type Document } from 'mongoose';

export interface IForumComment extends Document {
  post_id: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
  text: string;
  parent_id: mongoose.Types.ObjectId | null;
  edited: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const forumCommentSchema = new mongoose.Schema<IForumComment>(
  {
    post_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ForumPost',
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    text: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 2000,
    },
    parent_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ForumComment',
      default: null,
    },
    edited: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

forumCommentSchema.index({ post_id: 1, createdAt: -1 });
forumCommentSchema.index({ parent_id: 1 });

export const ForumComment = mongoose.model<IForumComment>('ForumComment', forumCommentSchema);
