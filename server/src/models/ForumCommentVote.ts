import mongoose, { type Document } from 'mongoose';

export interface IForumCommentVote extends Document {
  user: mongoose.Types.ObjectId;
  comment_id: mongoose.Types.ObjectId;
  value: number;
}

const forumCommentVoteSchema = new mongoose.Schema<IForumCommentVote>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  comment_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ForumComment',
    required: true,
    index: true,
  },
  value: {
    type: Number,
    required: true,
    enum: [1, -1],
  },
});

forumCommentVoteSchema.index({ user: 1, comment_id: 1 }, { unique: true });

export const ForumCommentVote = mongoose.model<IForumCommentVote>('ForumCommentVote', forumCommentVoteSchema);
