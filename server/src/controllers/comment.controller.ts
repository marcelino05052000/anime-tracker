import type { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Comment } from '../models/Comment.js';
import { CommentVote } from '../models/CommentVote.js';
import type { AuthRequest } from '../types/index.js';

export async function getComments(req: Request, res: Response): Promise<void> {
  try {
    const mal_id = Number(req.params.mal_id);
    const sort = req.query.sort === 'top' ? 'top' : 'recent';
    const userId = (req as AuthRequest).userId;

    const comments = await Comment.find({ mal_id, parent_id: null })
      .populate('user', 'username')
      .sort(sort === 'recent' ? { createdAt: -1 } : {})
      .lean();

    const commentIds = comments.map((c) => c._id);

    const voteAgg = await CommentVote.aggregate([
      { $match: { comment_id: { $in: commentIds } } },
      {
        $group: {
          _id: '$comment_id',
          score: { $sum: '$value' },
          upvotes: { $sum: { $cond: [{ $eq: ['$value', 1] }, 1, 0] } },
          downvotes: { $sum: { $cond: [{ $eq: ['$value', -1] }, 1, 0] } },
        },
      },
    ]);
    const voteMap = new Map(voteAgg.map((v) => [String(v._id), v]));

    const replyAgg = await Comment.aggregate([
      { $match: { parent_id: { $in: commentIds } } },
      { $group: { _id: '$parent_id', count: { $sum: 1 } } },
    ]);
    const replyMap = new Map(replyAgg.map((r) => [String(r._id), r.count]));

    let userVoteMap = new Map<string, number>();
    if (userId) {
      const userVotes = await CommentVote.find({
        user: new mongoose.Types.ObjectId(userId),
        comment_id: { $in: commentIds },
      }).lean();
      userVoteMap = new Map(userVotes.map((v) => [String(v.comment_id), v.value]));
    }

    const result = comments.map((c) => {
      const votes = voteMap.get(String(c._id));
      return {
        _id: c._id,
        user: c.user,
        mal_id: c.mal_id,
        text: c.text,
        edited: c.edited,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
        score: votes?.score ?? 0,
        upvotes: votes?.upvotes ?? 0,
        downvotes: votes?.downvotes ?? 0,
        reply_count: replyMap.get(String(c._id)) ?? 0,
        user_vote: userVoteMap.get(String(c._id)) ?? null,
      };
    });

    if (sort === 'top') {
      result.sort((a, b) => b.score - a.score);
    }

    res.json({ comments: result });
  } catch (error) {
    console.error('[GetComments Error]', error);
    res.status(500).json({ message: 'Failed to get comments' });
  }
}

export async function getReplies(req: Request, res: Response): Promise<void> {
  try {
    const commentId = req.params.comment_id;
    const userId = (req as AuthRequest).userId;

    const replies = await Comment.find({ parent_id: commentId })
      .populate('user', 'username')
      .sort({ createdAt: 1 })
      .lean();

    const replyIds = replies.map((r) => r._id);

    const voteAgg = await CommentVote.aggregate([
      { $match: { comment_id: { $in: replyIds } } },
      {
        $group: {
          _id: '$comment_id',
          score: { $sum: '$value' },
          upvotes: { $sum: { $cond: [{ $eq: ['$value', 1] }, 1, 0] } },
          downvotes: { $sum: { $cond: [{ $eq: ['$value', -1] }, 1, 0] } },
        },
      },
    ]);
    const voteMap = new Map(voteAgg.map((v) => [String(v._id), v]));

    let userVoteMap = new Map<string, number>();
    if (userId) {
      const userVotes = await CommentVote.find({
        user: new mongoose.Types.ObjectId(userId),
        comment_id: { $in: replyIds },
      }).lean();
      userVoteMap = new Map(userVotes.map((v) => [String(v.comment_id), v.value]));
    }

    const result = replies.map((r) => {
      const votes = voteMap.get(String(r._id));
      return {
        _id: r._id,
        user: r.user,
        mal_id: r.mal_id,
        text: r.text,
        parent_id: r.parent_id,
        edited: r.edited,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
        score: votes?.score ?? 0,
        upvotes: votes?.upvotes ?? 0,
        downvotes: votes?.downvotes ?? 0,
        user_vote: userVoteMap.get(String(r._id)) ?? null,
      };
    });

    res.json({ replies: result });
  } catch (error) {
    console.error('[GetReplies Error]', error);
    res.status(500).json({ message: 'Failed to get replies' });
  }
}

export async function createComment(req: AuthRequest, res: Response): Promise<void> {
  try {
    const mal_id = Number(req.params.mal_id);
    const { text, parent_id } = req.body as { text: string; parent_id?: string };

    if (parent_id) {
      const parent = await Comment.findById(parent_id);
      if (!parent) {
        res.status(404).json({ message: 'Parent comment not found' });
        return;
      }
      if (parent.parent_id !== null) {
        res.status(400).json({ message: 'Cannot reply to a reply' });
        return;
      }
    }

    const comment = await Comment.create({
      user: req.userId,
      mal_id,
      text,
      parent_id: parent_id ?? null,
    });

    const populated = await comment.populate('user', 'username');

    res.status(201).json({
      comment: {
        _id: populated._id,
        user: populated.user,
        mal_id: populated.mal_id,
        text: populated.text,
        parent_id: populated.parent_id,
        edited: populated.edited,
        createdAt: populated.createdAt,
        updatedAt: populated.updatedAt,
        score: 0,
        upvotes: 0,
        downvotes: 0,
        reply_count: 0,
        user_vote: null,
      },
    });
  } catch (error) {
    console.error('[CreateComment Error]', error);
    res.status(500).json({ message: 'Failed to create comment' });
  }
}

export async function updateComment(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { comment_id } = req.params;
    const { text } = req.body as { text: string };

    const comment = await Comment.findById(comment_id);
    if (!comment) {
      res.status(404).json({ message: 'Comment not found' });
      return;
    }

    if (String(comment.user) !== req.userId) {
      res.status(403).json({ message: 'Not authorized' });
      return;
    }

    comment.text = text;
    comment.edited = true;
    await comment.save();

    res.json({ comment });
  } catch (error) {
    console.error('[UpdateComment Error]', error);
    res.status(500).json({ message: 'Failed to update comment' });
  }
}

export async function deleteComment(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { comment_id } = req.params;

    const comment = await Comment.findById(comment_id);
    if (!comment) {
      res.status(404).json({ message: 'Comment not found' });
      return;
    }

    if (String(comment.user) !== req.userId) {
      res.status(403).json({ message: 'Not authorized' });
      return;
    }

    if (comment.parent_id === null) {
      const replyIds = await Comment.find({ parent_id: comment._id }).distinct('_id');
      const allIds = [comment._id, ...replyIds];
      await CommentVote.deleteMany({ comment_id: { $in: allIds } });
      await Comment.deleteMany({ _id: { $in: allIds } });
    } else {
      await CommentVote.deleteMany({ comment_id: comment._id });
      await comment.deleteOne();
    }

    res.json({ message: 'Comment deleted' });
  } catch (error) {
    console.error('[DeleteComment Error]', error);
    res.status(500).json({ message: 'Failed to delete comment' });
  }
}

export async function voteComment(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { comment_id } = req.params;
    const { value } = req.body as { value: number };

    const comment = await Comment.findById(comment_id);
    if (!comment) {
      res.status(404).json({ message: 'Comment not found' });
      return;
    }

    await CommentVote.findOneAndUpdate(
      {
        user: new mongoose.Types.ObjectId(req.userId!),
        comment_id: new mongoose.Types.ObjectId(comment_id as string),
      },
      { value },
      { upsert: true },
    );

    res.json({ message: 'Vote recorded' });
  } catch (error) {
    console.error('[VoteComment Error]', error);
    res.status(500).json({ message: 'Failed to vote' });
  }
}

export async function removeVote(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { comment_id } = req.params;

    await CommentVote.findOneAndDelete({
      user: new mongoose.Types.ObjectId(req.userId!),
      comment_id: new mongoose.Types.ObjectId(comment_id as string),
    });

    res.json({ message: 'Vote removed' });
  } catch (error) {
    console.error('[RemoveVote Error]', error);
    res.status(500).json({ message: 'Failed to remove vote' });
  }
}
