import mongoose, { type Document } from 'mongoose';

export interface ICommentVote extends Document {
  user: mongoose.Types.ObjectId;
  comment_id: mongoose.Types.ObjectId;
  value: number;
}

const commentVoteSchema = new mongoose.Schema<ICommentVote>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  comment_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    required: true,
    index: true,
  },
  value: {
    type: Number,
    required: true,
    enum: [1, -1],
  },
});

commentVoteSchema.index({ user: 1, comment_id: 1 }, { unique: true });

export const CommentVote = mongoose.model<ICommentVote>('CommentVote', commentVoteSchema);
