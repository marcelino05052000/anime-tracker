export interface NotificationItem {
  _id: string;
  user: string;
  mal_id: number;
  title: string;
  image_url: string;
  episode_number: number | null;
  aired_date: string;
  read: boolean;
  created_at: string;
}

export interface NotificationPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface NotificationsResponse {
  data: NotificationItem[];
  pagination: NotificationPagination;
}

export interface UnreadCountResponse {
  count: number;
}
