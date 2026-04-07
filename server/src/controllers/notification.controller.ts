import type { Response } from 'express';
import mongoose from 'mongoose';
import { Notification } from '../models/Notification.js';
import type { AuthRequest } from '../types/index.js';

export async function getNotifications(req: AuthRequest, res: Response): Promise<void> {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20));
    const skip = (page - 1) * limit;

    const [notifications, total] = await Promise.all([
      Notification.find({ user: req.userId })
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Notification.countDocuments({ user: req.userId }),
    ]);

    res.json({
      data: notifications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('[GetNotifications Error]', error);
    res.status(500).json({ message: 'Failed to get notifications' });
  }
}

export async function getUnreadCount(req: AuthRequest, res: Response): Promise<void> {
  try {
    const count = await Notification.countDocuments({ user: req.userId, read: false });
    res.json({ count });
  } catch (error) {
    console.error('[GetUnreadCount Error]', error);
    res.status(500).json({ message: 'Failed to get unread count' });
  }
}

export async function markAsRead(req: AuthRequest, res: Response): Promise<void> {
  try {
    const id = req.params['id'] as string;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid notification ID' });
      return;
    }

    const notification = await Notification.findOneAndUpdate(
      { _id: id, user: req.userId },
      { $set: { read: true } },
      { new: true },
    );

    if (!notification) {
      res.status(404).json({ message: 'Notification not found' });
      return;
    }

    res.json({ success: true });
  } catch (error) {
    console.error('[MarkAsRead Error]', error);
    res.status(500).json({ message: 'Failed to mark notification as read' });
  }
}

export async function markAllAsRead(req: AuthRequest, res: Response): Promise<void> {
  try {
    await Notification.updateMany(
      { user: req.userId, read: false },
      { $set: { read: true } },
    );

    res.json({ success: true });
  } catch (error) {
    console.error('[MarkAllAsRead Error]', error);
    res.status(500).json({ message: 'Failed to mark all notifications as read' });
  }
}
