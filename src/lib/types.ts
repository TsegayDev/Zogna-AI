export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  status?: 'loading' | 'streaming' | 'success' | 'failed';
  timestamp: string;
};

export type Chat = {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
  model: string;
};

export type AIModel = {
  id: string;
  name: string;
  provider: string;
};

export interface AppUser {
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  plan: 'Free' | 'Premium' | 'Unlimited';
  tokens: number;
}
