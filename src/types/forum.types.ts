export type ForumCategory =
  | 'discussion'
  | 'theories'
  | 'reviews'
  | 'spoilers'
  | 'news'
  | 'episode_discussion';

export interface ForumPostUser {
  _id: string;
  username: string;
  role: string;
}

export interface ForumPost {
  _id: string;
  author: ForumPostUser;
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
  last_activity: string;
  edited: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ForumComment {
  _id: string;
  post_id: string;
  author: ForumPostUser;
  text: string;
  parent_id: string | null;
  edited: boolean;
  score: number;
  upvotes: number;
  downvotes: number;
  reply_count?: number;
  user_vote: number | null;
  createdAt: string;
  updatedAt: string;
}

export type ForumCommentSort = 'recent' | 'top';
export type ForumPostSort = 'recent' | 'popular' | 'views';
