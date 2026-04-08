import type { Request, Response } from 'express';
import mongoose from 'mongoose';
import { ForumPost } from '../models/ForumPost.js';
import { ForumComment } from '../models/ForumComment.js';
import { ForumCommentVote } from '../models/ForumCommentVote.js';
import { User } from '../models/User.js';
import type { AuthRequest } from '../types/index.js';

export async function getComments(req: Request, res: Response): Promise<void> {
  try {
    const { postId } = req.params;
    const sort = req.query.sort === 'top' ? 'top' : 'recent';
    const userId = (req as AuthRequest).userId;

    const comments = await ForumComment.find({ post_id: postId, parent_id: null })
      .populate('author', 'username role')
      .sort(sort === 'recent' ? { createdAt: -1 } : {})
      .lean();

    const commentIds = comments.map((c) => c._id);

    const voteAgg = await ForumCommentVote.aggregate([
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

    const replyAgg = await ForumComment.aggregate([
      { $match: { parent_id: { $in: commentIds } } },
      { $group: { _id: '$parent_id', count: { $sum: 1 } } },
    ]);
    const replyMap = new Map(replyAgg.map((r) => [String(r._id), r.count]));

    let userVoteMap = new Map<string, number>();
    if (userId) {
      const userVotes = await ForumCommentVote.find({
        user: new mongoose.Types.ObjectId(userId),
        comment_id: { $in: commentIds },
      }).lean();
      userVoteMap = new Map(userVotes.map((v) => [String(v.comment_id), v.value]));
    }

    const result = comments.map((c) => {
      const votes = voteMap.get(String(c._id));
      return {
        _id: c._id,
        post_id: c.post_id,
        author: c.author,
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
    console.error('[GetForumComments Error]', error);
    res.status(500).json({ message: 'Failed to get comments' });
  }
}

export async function getReplies(req: Request, res: Response): Promise<void> {
  try {
    const { commentId } = req.params;
    const userId = (req as AuthRequest).userId;

    const replies = await ForumComment.find({ parent_id: commentId })
      .populate('author', 'username role')
      .sort({ createdAt: 1 })
      .lean();

    const replyIds = replies.map((r) => r._id);

    const voteAgg = await ForumCommentVote.aggregate([
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
      const userVotes = await ForumCommentVote.find({
        user: new mongoose.Types.ObjectId(userId),
        comment_id: { $in: replyIds },
      }).lean();
      userVoteMap = new Map(userVotes.map((v) => [String(v.comment_id), v.value]));
    }

    const result = replies.map((r) => {
      const votes = voteMap.get(String(r._id));
      return {
        _id: r._id,
        post_id: r.post_id,
        author: r.author,
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
    console.error('[GetForumReplies Error]', error);
    res.status(500).json({ message: 'Failed to get replies' });
  }
}

export async function createComment(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { postId } = req.params;
    const { text, parent_id } = req.body as { text: string; parent_id?: string };

    const post = await ForumPost.findById(postId);
    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    if (post.locked) {
      res.status(403).json({ message: 'This post is locked' });
      return;
    }

    if (parent_id) {
      const parent = await ForumComment.findById(parent_id);
      if (!parent) {
        res.status(404).json({ message: 'Parent comment not found' });
        return;
      }
      if (parent.parent_id !== null) {
        res.status(400).json({ message: 'Cannot reply to a reply' });
        return;
      }
    }

    const comment = await ForumComment.create({
      post_id: postId,
      author: req.userId,
      text,
      parent_id: parent_id ?? null,
    });

    // Update post: last_activity and comment_count
    post.last_activity = new Date();
    post.comment_count += 1;
    await post.save();

    const populated = await comment.populate('author', 'username role');

    res.status(201).json({
      comment: {
        _id: populated._id,
        post_id: populated.post_id,
        author: populated.author,
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
    console.error('[CreateForumComment Error]', error);
    res.status(500).json({ message: 'Failed to create comment' });
  }
}

export async function updateComment(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { commentId } = req.params;
    const { text } = req.body as { text: string };

    const comment = await ForumComment.findById(commentId);
    if (!comment) {
      res.status(404).json({ message: 'Comment not found' });
      return;
    }

    if (String(comment.author) !== req.userId) {
      res.status(403).json({ message: 'Not authorized' });
      return;
    }

    comment.text = text;
    comment.edited = true;
    await comment.save();

    res.json({ comment });
  } catch (error) {
    console.error('[UpdateForumComment Error]', error);
    res.status(500).json({ message: 'Failed to update comment' });
  }
}

export async function deleteComment(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { commentId } = req.params;

    const comment = await ForumComment.findById(commentId);
    if (!comment) {
      res.status(404).json({ message: 'Comment not found' });
      return;
    }

    const user = await User.findById(req.userId).select('role').lean();
    const isAuthor = String(comment.author) === req.userId;
    const isMod = user?.role === 'moderator' || user?.role === 'admin';

    if (!isAuthor && !isMod) {
      res.status(403).json({ message: 'Not authorized' });
      return;
    }

    let deletedCount = 1;

    if (comment.parent_id === null) {
      const replyIds = await ForumComment.find({ parent_id: comment._id }).distinct('_id');
      const allIds = [comment._id, ...replyIds];
      await ForumCommentVote.deleteMany({ comment_id: { $in: allIds } });
      await ForumComment.deleteMany({ _id: { $in: allIds } });
      deletedCount = allIds.length;
    } else {
      await ForumCommentVote.deleteMany({ comment_id: comment._id });
      await comment.deleteOne();
    }

    // Decrement comment_count on the post
    await ForumPost.findByIdAndUpdate(comment.post_id, {
      $inc: { comment_count: -deletedCount },
    });

    res.json({ message: 'Comment deleted' });
  } catch (error) {
    console.error('[DeleteForumComment Error]', error);
    res.status(500).json({ message: 'Failed to delete comment' });
  }
}

export async function voteComment(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { commentId } = req.params;
    const { value } = req.body as { value: number };

    const comment = await ForumComment.findById(commentId);
    if (!comment) {
      res.status(404).json({ message: 'Comment not found' });
      return;
    }

    await ForumCommentVote.findOneAndUpdate(
      {
        user: new mongoose.Types.ObjectId(req.userId!),
        comment_id: new mongoose.Types.ObjectId(commentId as string),
      },
      { value },
      { upsert: true },
    );

    res.json({ message: 'Vote recorded' });
  } catch (error) {
    console.error('[VoteForumComment Error]', error);
    res.status(500).json({ message: 'Failed to vote' });
  }
}

export async function removeVote(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { commentId } = req.params;

    await ForumCommentVote.findOneAndDelete({
      user: new mongoose.Types.ObjectId(req.userId!),
      comment_id: new mongoose.Types.ObjectId(commentId as string),
    });

    res.json({ message: 'Vote removed' });
  } catch (error) {
    console.error('[RemoveForumVote Error]', error);
    res.status(500).json({ message: 'Failed to remove vote' });
  }
}
