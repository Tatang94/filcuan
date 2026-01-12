
export interface CuanTheme {
  id: string;
  name: string;
}

export interface CuanContent {
  id: string;
  title: string;
  image_url: string;
  poster: string | null;
  themeId: string;
  description: string;
  tags: string[];
  createdAt?: string;
}

export type AppRoute = '/' | '/explore' | '/rewards' | '/profile' | '/admin' | '/auth' | '/about' | '/tos' | '/privacy' | '/sitemap' | '/contact';

export interface FeedContent {
  id: string;
  title: string;
  image_url: string;
  creator_id: string;
  creator_name: string;
  themeId: string;
  description: string;
  tags: string[];
  createdAt: string;
}

export interface User {
  id?: string;
  username: string;
  displayName?: string;
  coins: number;
  joinedDate: string;
  isLoggedIn: boolean;
  photoURL?: string;
}

export interface WithdrawalRequest {
  id: string;
  username: string;
  amount: number;
  method: 'DANA' | 'OVO' | 'GOPAY' | 'Bank Transfer';
  status: 'pending' | 'approved' | 'rejected';
  timestamp: number;
}
