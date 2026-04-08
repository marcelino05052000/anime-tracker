import type { Request, Response } from 'express';
import mongoose from 'mongoose';
import { ForumPost } from '../models/ForumPost.js';
import { ForumComment } from '../models/ForumComment.js';
import { ForumCommentVote } from '../models/ForumCommentVote.js';
import { User } from '../models/User.js';
import type { AuthRequest } from '../types/index.js';

export async function getPosts(req: Request, res: Response): Promise<void> {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));
    const skip = (page - 1) * limit;
    const category = req.query.category as string | undefined;
    const mal_id = req.query.mal_id ? Number(req.query.mal_id) : undefined;
    const sort = (req.query.sort as string) || 'recent';

    const filter: Record<string, unknown> = {};
    if (category) filter.category = category;
    if (mal_id) filter.mal_id = mal_id;

    let sortOption: Record<string, 1 | -1>;
    switch (sort) {
      case 'popular':
        sortOption = { comment_count: -1 };
        break;
      case 'views':
        sortOption = { views: -1 };
        break;
      default:
        sortOption = { last_activity: -1 };
    }

    // Pinned posts first when filtering by mal_id
    if (mal_id) {
      sortOption = { pinned: -1, ...sortOption };
    }

    const [posts, total] = await Promise.all([
      ForumPost.find(filter)
        .populate('author', 'username role')
        .sort(sortOption)
        .skip(skip)
        .limit(limit)
        .lean(),
      ForumPost.countDocuments(filter),
    ]);

    res.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('[GetPosts Error]', error);
    res.status(500).json({ message: 'Failed to get posts' });
  }
}

export async function getPost(req: Request, res: Response): Promise<void> {
  try {
    const { postId } = req.params;

    const post = await ForumPost.findByIdAndUpdate(
      postId,
      { $inc: { views: 1 } },
      { new: true },
    )
      .populate('author', 'username role')
      .lean();

    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    res.json({ post });
  } catch (error) {
    console.error('[GetPost Error]', error);
    res.status(500).json({ message: 'Failed to get post' });
  }
}

export async function createPost(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { mal_id, anime_title, anime_image_url, title, body, category, episode_number, tags } =
      req.body as {
        mal_id: number;
        anime_title: string;
        anime_image_url: string;
        title: string;
        body: string;
        category: string;
        episode_number?: number;
        tags?: string[];
      };

    const post = await ForumPost.create({
      author: req.userId,
      mal_id,
      anime_title,
      anime_image_url,
      title,
      body,
      category,
      episode_number: episode_number ?? null,
      tags: tags ?? [],
      last_activity: new Date(),
    });

    const populated = await post.populate('author', 'username role');

    res.status(201).json({ post: populated });
  } catch (error) {
    console.error('[CreatePost Error]', error);
    res.status(500).json({ message: 'Failed to create post' });
  }
}

export async function updatePost(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { postId } = req.params;
    const { title, body, tags } = req.body as { title?: string; body?: string; tags?: string[] };

    const post = await ForumPost.findById(postId);
    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    if (String(post.author) !== req.userId) {
      res.status(403).json({ message: 'Only the author can edit this post' });
      return;
    }

    if (title !== undefined) post.title = title;
    if (body !== undefined) post.body = body;
    if (tags !== undefined) post.tags = tags;
    post.edited = true;
    await post.save();

    const populated = await post.populate('author', 'username role');
    res.json({ post: populated });
  } catch (error) {
    console.error('[UpdatePost Error]', error);
    res.status(500).json({ message: 'Failed to update post' });
  }
}

export async function deletePost(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { postId } = req.params;

    const post = await ForumPost.findById(postId);
    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    const user = await User.findById(req.userId).select('role').lean();
    const isAuthor = String(post.author) === req.userId;
    const isMod = user?.role === 'moderator' || user?.role === 'admin';

    if (!isAuthor && !isMod) {
      res.status(403).json({ message: 'Not authorized' });
      return;
    }

    // Cascade delete: comments and their votes
    const commentIds = await ForumComment.find({ post_id: post._id }).distinct('_id');
    if (commentIds.length > 0) {
      await ForumCommentVote.deleteMany({ comment_id: { $in: commentIds } });
      await ForumComment.deleteMany({ post_id: post._id });
    }

    await post.deleteOne();

    res.json({ message: 'Post deleted' });
  } catch (error) {
    console.error('[DeletePost Error]', error);
    res.status(500).json({ message: 'Failed to delete post' });
  }
}

export async function togglePin(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { postId } = req.params;

    const post = await ForumPost.findById(postId);
    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    post.pinned = !post.pinned;
    await post.save();

    res.json({ post: { _id: post._id, pinned: post.pinned } });
  } catch (error) {
    console.error('[TogglePin Error]', error);
    res.status(500).json({ message: 'Failed to toggle pin' });
  }
}

export async function toggleLock(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { postId } = req.params;

    const post = await ForumPost.findById(postId);
    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    post.locked = !post.locked;
    await post.save();

    res.json({ post: { _id: post._id, locked: post.locked } });
  } catch (error) {
    console.error('[ToggleLock Error]', error);
    res.status(500).json({ message: 'Failed to toggle lock' });
  }
}
