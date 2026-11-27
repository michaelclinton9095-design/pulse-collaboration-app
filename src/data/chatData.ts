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
    id: 'room-general',
    name: 'general',
    description: 'Company-wide updates, open discussions, and general collaboration.',
    createdAt: '2026-11-01T08:00:00Z',
    unreadCount: 0
  },
  {
    id: 'room-engineering',
    name: 'engineering',
    description: 'System design, microservices latency, and distributed WebSocket state coordination.',
    createdAt: '2026-11-05T12:00:00Z',
    unreadCount: 2
  },
  {
    id: 'room-announcements',
    name: 'announcements',
    description: 'Major platform releases, sprint milestones, and production notices.',
    createdAt: '2026-11-10T14:30:00Z',
    unreadCount: 0
  },
  {
    id: 'room-support-rca',
    name: 'support-and-rca',
    description: 'Live incident triage, root cause analysis breakdowns, and performance logs.',
    createdAt: '2026-11-15T09:00:00Z',
    unreadCount: 0
  }
];

export const initialMessages: Record<string, ChatMessage[]> = {
  'room-general': [
    {
      id: 'msg-g1',
      roomId: 'room-general',
      sender: sampleUsers[1],
      text: 'Good morning team! Ready for the sprint review demo today?',
      createdAt: '2026-11-27T09:00:00Z'
    },
    {
      id: 'msg-g2',
      roomId: 'room-general',
      sender: currentUserDefault,
      text: 'Good morning Sarah! All 4 ecosystem apps are up and passing health checks.',
      createdAt: '2026-11-27T09:01:30Z'
    }
  ],
  'room-engineering': [
    {
      id: 'msg-1',
      roomId: 'room-engineering',
      sender: sampleUsers[1],
      text: 'Hey team, what are your thoughts on pairing WebSocket event streams with optimistic client-side UI updates in our React frontend?',
      createdAt: '2026-11-27T10:14:00Z'
    },
    {
      id: 'msg-2',
      roomId: 'room-engineering',
      sender: currentUserDefault,
      text: 'Optimistic updates eliminate perceived latency! We append immediately with a pending state, and reconcile once the socket server acknowledges the message.',
      createdAt: '2026-11-27T10:15:30Z'
    },
    {
      id: 'msg-3',
      roomId: 'room-engineering',
      sender: sampleUsers[2],
      text: 'Agreed! And the deduplication filter prevents duplicate speech or bubbles when both clients sync.',
      createdAt: '2026-11-27T10:17:00Z'
    }
  ],
  'room-announcements': [
    {
      id: 'msg-a1',
      roomId: 'room-announcements',
      sender: sampleUsers[2],
      text: '📢 Notice: Pulse Real-Time Collaboration v2.4 successfully deployed to production.',
      createdAt: '2026-11-27T08:30:00Z'
    }
  ],
  'room-support-rca': [
    {
      id: 'msg-4',
      roomId: 'room-support-rca',
      sender: sampleUsers[3],
      text: 'We reviewed the database timeout issue from yesterday. Adding compound indexes brought query response time from 42s down to 35ms.',
      createdAt: '2026-11-27T11:00:00Z'
    }
  ]
};
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
