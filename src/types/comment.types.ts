export interface CommentUser {
  _id: string;
  username: string;
}

export interface ApiComment {
  _id: string;
  user: CommentUser;
  mal_id: number;
  text: string;
  parent_id: string | null;
  edited: boolean;
  createdAt: string;
  updatedAt: string;
  score: number;
  upvotes: number;
  downvotes: number;
  reply_count?: number;
  user_vote: number | null;
}

export type CommentSort = 'recent' | 'top';
