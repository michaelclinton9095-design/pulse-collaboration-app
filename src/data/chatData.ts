import { ChatRoom, UserProfile, ChatMessage } from '../types';

export const currentUserDefault: UserProfile = {
  id: 'usr-me',
  name: 'Senior Full-Stack Engineer',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
  role: 'Technical Support & Systems Architect',
  status: 'online'
};

export const sampleUsers: UserProfile[] = [
  currentUserDefault,
  {
    id: 'usr-1',
    name: 'Sarah Connor',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
    role: 'Lead Cloud DevOps',
    status: 'online'
  },
  {
    id: 'usr-2',
    name: 'Alexandre Dumas',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    role: 'Backend Architect',
    status: 'online'
  },
  {
    id: 'usr-3',
    name: 'Priya Patel',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop',
    role: 'Frontend Specialist',
    status: 'away'
  }
];

export const initialRooms: ChatRoom[] = [
  {
    id: 'room-architecture',
    name: 'Architecture & System Design',
    description: 'High-level discussions on distributed state, WebSocket resilience, and clean API models.',
    createdAt: '2026-11-01T08:00:00Z',
    unreadCount: 0
  },
  {
    id: 'room-support-rca',
    name: 'Production Support & RCA',
    description: 'Live incident triage, root cause analysis breakdowns, and production performance logs.',
    createdAt: '2026-11-05T12:00:00Z',
    unreadCount: 2
  },
  {
    id: 'room-frontend',
    name: 'Frontend & Tailwind UI',
    description: 'Modern component libraries, React 19 hooks, and responsive design systems.',
    createdAt: '2026-11-10T14:30:00Z',
    unreadCount: 0
  },
  {
    id: 'room-lounge',
    name: 'General Lounge',
    description: 'Casual tech chats, freelance contract discussions, and open collaboration.',
    createdAt: '2026-11-15T09:00:00Z',
    unreadCount: 0
  }
];

export const initialMessages: Record<string, ChatMessage[]> = {
  'room-architecture': [
    {
      id: 'msg-1',
      roomId: 'room-architecture',
      sender: sampleUsers[1],
      text: 'Hey team, what are your thoughts on pairing WebSocket event streams with optimistic client-side UI updates in our React frontend?',
      createdAt: '2026-11-16T10:14:00Z'
    },
    {
      id: 'msg-2',
      roomId: 'room-architecture',
      sender: currentUserDefault,
      text: 'Optimistic updates are essential for perceived latency! We append immediately with a pending state, and if the WebSocket socket heartbeat confirms acknowledgment, we flip it to synced. If it fails, we trigger an automatic retry with exponential backoff.',
      createdAt: '2026-11-16T10:15:30Z'
    },
    {
      id: 'msg-3',
      roomId: 'room-architecture',
      sender: sampleUsers[2],
      text: 'Agreed! That prevents the UI from feeling sluggish on high-latency mobile networks.',
      createdAt: '2026-11-16T10:17:00Z'
    }
  ],
  'room-support-rca': [
    {
      id: 'msg-4',
      roomId: 'room-support-rca',
      sender: sampleUsers[3],
      text: 'We just reviewed the database timeout issue from yesterday. Adding compound indexes on (status, createdAt) brought query response time from 42s down to 35ms.',
      createdAt: '2026-11-16T11:00:00Z'
    },
    {
      id: 'msg-5',
      roomId: 'room-support-rca',
      sender: currentUserDefault,
      text: 'Great catch! The root cause analysis report has been published to Codenest so the rest of the engineering team can reference the pattern.',
      createdAt: '2026-11-16T11:02:15Z'
    }
  ],
  'room-frontend': [
    {
      id: 'msg-6',
      roomId: 'room-frontend',
      sender: currentUserDefault,
      text: 'All frontend applications have been completely migrated to modern Tailwind CSS design tokens with full responsive support and dark mode.',
      createdAt: '2026-11-16T12:00:00Z'
    }
  ],
  'room-lounge': [
    {
      id: 'msg-7',
      roomId: 'room-lounge',
      sender: sampleUsers[1],
      text: 'Welcome to Pulse Real-Time Chat! Feel free to create new public or private channels.',
      createdAt: '2026-11-16T09:00:00Z'
    }
  ]
};
