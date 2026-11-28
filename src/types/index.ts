export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  role?: string;
  status: 'online' | 'offline' | 'away';
  lastSeen?: string;
  email?: string;
  provider?: 'google' | 'guest' | 'local';
}

export interface ChatRoom {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  isPrivate?: boolean;
  unreadCount?: number;
}

export interface ChatMessage {
  id: string;
  clientId?: string;
  roomId: string;
  sender: UserProfile;
  text: string;
  audioUrl?: string;
  fileUrl?: string;
  createdAt: string;
  status?: 'sending' | 'sent' | 'read';
}
