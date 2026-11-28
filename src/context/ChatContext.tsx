import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { ChatRoom, ChatMessage, UserProfile } from '../types';
import { initialRooms, initialMessages, sampleUsers, currentUserDefault } from '../data/chatData';
import { loginWithGoogle, logoutGoogle } from '../firebase';

const BACKEND_URL = (import.meta as any).env?.VITE_BACKEND_URL || 'http://localhost:5002';

interface ChatContextType {
  currentUser: UserProfile;
  updateCurrentUser: (data: Partial<UserProfile>) => void;
  signInWithGoogle: (accountIndex?: number) => Promise<void>;
  signOut: () => Promise<void>;
  rooms: ChatRoom[];
  activeRoomId: string;
  activeRoom: ChatRoom;
  selectRoom: (roomId: string) => void;
  createRoom: (name: string, description: string, isPrivate?: boolean) => void;
  messages: ChatMessage[];
  sendMessage: (text: string, audioUrl?: string, fileUrl?: string, fileName?: string, fileSize?: number) => void;
  uploadVoice: (audioBlob: Blob) => Promise<string | null>;
  uploadAttachment: (file: File) => Promise<{ url: string; name: string; size: number } | null>;
  users: UserProfile[];
  isOnline: boolean;
  isFirebaseActive: boolean;
  typingUser: string | null;
  sendTyping: (isTyping: boolean) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('pulse_user');
    return saved ? JSON.parse(saved) : currentUserDefault;
  });

  const [rooms, setRooms] = useState<ChatRoom[]>(() => {
    const saved = localStorage.getItem('pulse_rooms');
    return saved ? JSON.parse(saved) : initialRooms;
  });

  const [activeRoomId, setActiveRoomId] = useState<string>(() => {
    return rooms[0]?.id || 'room-general';
  });

  const [messagesMap, setMessagesMap] = useState<Record<string, ChatMessage[]>>(() => {
    const saved = localStorage.getItem('pulse_messages');
    return saved ? JSON.parse(saved) : initialMessages;
  });

  const [users, setUsers] = useState<UserProfile[]>(sampleUsers);
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isFirebaseActive, setIsFirebaseActive] = useState<boolean>(true);
  const [typingUser, setTypingUser] = useState<string | null>(null);

  const socketRef = useRef<Socket | null>(null);

  // Initialize Socket.IO connection
  useEffect(() => {
    const socket = io(BACKEND_URL, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 5000,
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      setIsOnline(true);
      setIsFirebaseActive(true);
      socket.emit('presence:update', { userId: currentUser.id, status: currentUser.status });
      if (activeRoomId) {
        socket.emit('channel:join', activeRoomId);
      }
    });

    socket.on('disconnect', () => {
      setIsOnline(false);
    });

    socket.on('connect_error', () => {
      // Keep resilient fallback active
      setIsOnline(navigator.onLine);
    });

    socket.on('typing:start', ({ user, roomId }: { user: any; roomId: string }) => {
      if (roomId === activeRoomId && user?.name !== currentUser.name) {
        setTypingUser(user?.name || 'Someone');
      }
    });

    socket.on('typing:stop', ({ roomId }: { roomId: string }) => {
      if (roomId === activeRoomId) {
        setTypingUser(null);
      }
    });

    socket.on('message:new', (newMsg: any) => {
      const formattedMsg: ChatMessage = {
        id: newMsg._id || newMsg.id || `msg-${Date.now()}`,
        clientId: newMsg.clientId,
        roomId: newMsg.roomId,
        sender: newMsg.sender,
        text: newMsg.text || '',
        audioUrl: newMsg.audioUrl,
        fileUrl: newMsg.fileUrl,
        createdAt: newMsg.createdAt || new Date().toISOString(),
      };

      setMessagesMap((prev) => {
        const roomMessages = prev[formattedMsg.roomId] || [];

        // 1. If already present by database ID, skip
        if (roomMessages.some((m) => m.id === formattedMsg.id)) {
          return prev;
        }

        // 2. If matching our optimistic message by clientId, reconcile it in-place
        if (formattedMsg.clientId && roomMessages.some((m) => m.id === formattedMsg.clientId || m.clientId === formattedMsg.clientId)) {
          return {
            ...prev,
            [formattedMsg.roomId]: roomMessages.map((m) =>
              m.id === formattedMsg.clientId || m.clientId === formattedMsg.clientId
                ? { ...formattedMsg, id: formattedMsg.id }
                : m
            ),
          };
        }

        // 3. Fallback deduplication: same sender + exact text + sent within 3 seconds
        const isDuplicateRecent = roomMessages.some(
          (m) =>
            m.sender?.id === formattedMsg.sender?.id &&
            m.text === formattedMsg.text &&
            Math.abs(new Date(m.createdAt).getTime() - new Date(formattedMsg.createdAt).getTime()) < 3500
        );

        if (isDuplicateRecent) {
          // Reconcile ID if it was an optimistic temp message
          return {
            ...prev,
            [formattedMsg.roomId]: roomMessages.map((m) =>
              m.sender?.id === formattedMsg.sender?.id && m.text === formattedMsg.text && m.id.startsWith('msg-')
                ? { ...formattedMsg, id: formattedMsg.id }
                : m
            ),
          };
        }

        return {
          ...prev,
          [formattedMsg.roomId]: [...roomMessages, formattedMsg],
        };
      });
    });

    socket.on('presence:update', ({ userId, status }: { userId: string; status: 'online' | 'offline' | 'away' }) => {
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, status } : u))
      );
    });

    return () => {
      socket.disconnect();
    };
  }, [currentUser.id]);

  // Load Channels and Users from MongoDB backend on mount
  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/channels`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const mappedRooms: ChatRoom[] = data.map((c: any) => ({
              id: c.channelId || c._id || c.id,
              name: c.name,
              description: c.description || 'Channel discussion',
              createdAt: c.createdAt || new Date().toISOString(),
              isPrivate: c.isPrivate || false,
              unreadCount: 0,
            }));
            setRooms(mappedRooms);
            if (!mappedRooms.some((r) => r.id === activeRoomId)) {
              setActiveRoomId(mappedRooms[0].id);
            }
          }
        }
      } catch {
        // Fallback to local state if server is booting
      }
    };

    const fetchUsers = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/auth/users`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const mappedUsers: UserProfile[] = data.map((u: any) => ({
              id: u._id || u.id,
              name: u.name,
              avatar: u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
              role: u.role || 'Member',
              status: u.status || 'online',
              lastSeen: u.lastSeen,
            }));
            setUsers(mappedUsers);
          }
        }
      } catch {
        // Fallback to sampleUsers
      }
    };

    fetchChannels();
    fetchUsers();
  }, []);

  // Sync Room switch with backend messages and Socket.IO room join
  useEffect(() => {
    if (!activeRoomId) return;

    if (socketRef.current?.connected) {
      socketRef.current.emit('channel:join', activeRoomId);
    }

    const fetchMessages = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/messages/room/${activeRoomId}`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            const mapped: ChatMessage[] = data.map((m: any) => ({
              id: m._id || m.id,
              roomId: m.roomId,
              sender: m.sender,
              text: m.text || '',
              audioUrl: m.audioUrl,
              fileUrl: m.fileUrl,
              createdAt: m.createdAt || new Date().toISOString(),
            }));
            setMessagesMap((prev) => ({
              ...prev,
              [activeRoomId]: mapped,
            }));
          }
        }
      } catch {
        // Fallback to local messages
      }
    };

    fetchMessages();
  }, [activeRoomId]);

  // Persist locally for immediate offline responsiveness
  useEffect(() => {
    localStorage.setItem('pulse_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('pulse_rooms', JSON.stringify(rooms));
  }, [rooms]);

  useEffect(() => {
    localStorage.setItem('pulse_messages', JSON.stringify(messagesMap));
  }, [messagesMap]);

  const activeRoom = rooms.find((r) => r.id === activeRoomId) || rooms[0] || {
    id: 'room-general',
    name: 'general',
    description: 'Company-wide updates, open discussions, and general collaboration.',
    createdAt: new Date().toISOString(),
  };

  const messages = messagesMap[activeRoomId] || [];

  const selectRoom = (roomId: string) => {
    if (socketRef.current?.connected && activeRoomId) {
      socketRef.current.emit('channel:leave', activeRoomId);
    }
    setActiveRoomId(roomId);
  };

  const createRoom = async (name: string, description: string, isPrivate = false) => {
    const slugId = `room-${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}`;
    const newRoom: ChatRoom = {
      id: slugId,
      name,
      description: description || 'Custom discussion room',
      createdAt: new Date().toISOString(),
      isPrivate,
      unreadCount: 0,
    };

    // Optimistic UI update
    setRooms((prev) => [...prev, newRoom]);
    setActiveRoomId(newRoom.id);

    // Sync to MongoDB backend
    try {
      const res = await fetch(`${BACKEND_URL}/api/channels`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channelId: slugId,
          name,
          description,
          isPrivate,
        }),
      });
      if (res.ok) {
        const saved = await res.json();
        setRooms((prev) =>
          prev.map((r) => (r.id === slugId ? { ...r, id: saved.channelId || saved._id || slugId } : r))
        );
      }
    } catch (err) {
      console.warn('Failed to persist channel to backend, stored locally:', err);
    }
  };

  const updateCurrentUser = (data: Partial<UserProfile>) => {
    setCurrentUser((prev) => {
      const updated = { ...prev, ...data };
      if (socketRef.current?.connected && data.status) {
        socketRef.current.emit('presence:update', { userId: updated.id, status: data.status });
      }
      return updated;
    });
  };

  const signInWithGoogle = async (accountIndex = 0) => {
    try {
      const googleUser = await loginWithGoogle(accountIndex);
      setCurrentUser(googleUser);
      localStorage.setItem('pulse_user', JSON.stringify(googleUser));
      if (socketRef.current?.connected) {
        socketRef.current.emit('presence:update', { userId: googleUser.id, status: 'online' });
      }
    } catch (err) {
      console.warn('Google sign-in error:', err);
    }
  };

  const signOut = async () => {
    try {
      await logoutGoogle();
      setCurrentUser(currentUserDefault);
      localStorage.setItem('pulse_user', JSON.stringify(currentUserDefault));
      if (socketRef.current?.connected) {
        socketRef.current.emit('presence:update', { userId: currentUserDefault.id, status: 'online' });
      }
    } catch (err) {
      console.warn('Sign out error:', err);
    }
  };

  const uploadVoice = async (audioBlob: Blob): Promise<string | null> => {
    try {
      const formData = new FormData();
      formData.append('voice', audioBlob, `voice-${Date.now()}.webm`);
      formData.append('audio', audioBlob, `voice-${Date.now()}.webm`);
      const res = await fetch(`${BACKEND_URL}/api/upload/voice`, {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        const urlPath = data.audioUrl || data.url;
        if (urlPath) {
          return urlPath.startsWith('http') ? urlPath : `${BACKEND_URL}${urlPath}`;
        }
      }
    } catch (err) {
      console.warn('Audio upload failed:', err);
    }
    return null;
  };

  const uploadAttachment = async (file: File): Promise<{ url: string; name: string; size: number } | null> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`${BACKEND_URL}/api/upload/file`, {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        const urlPath = data.fileUrl || data.url;
        const resolvedUrl = urlPath 
          ? (urlPath.startsWith('http') ? urlPath : `${BACKEND_URL}${urlPath}`)
          : URL.createObjectURL(file);
        return {
          url: resolvedUrl,
          name: data.fileName || file.name,
          size: data.fileSize || file.size,
        };
      }
    } catch (err) {
      console.warn('File upload failed:', err);
    }
    return null;
  };

  const sendMessage = async (
    text: string,
    audioUrl?: string,
    fileUrl?: string,
    fileName?: string,
    fileSize?: number
  ) => {
    if (!text.trim() && !audioUrl && !fileUrl) return;

    const tempId = `msg-${Date.now()}`;
    const newMsg: ChatMessage = {
      id: tempId,
      clientId: tempId,
      roomId: activeRoomId,
      sender: currentUser,
      text: text.trim(),
      audioUrl,
      fileUrl,
      createdAt: new Date().toISOString(),
    };

    // Optimistic update
    setMessagesMap((prev) => ({
      ...prev,
      [activeRoomId]: [...(prev[activeRoomId] || []), newMsg],
    }));

    const payload = {
      roomId: activeRoomId,
      sender: currentUser,
      text: text.trim(),
      audioUrl,
      fileUrl,
      fileName,
      fileSize,
      clientId: tempId,
    };

    // Send via live Socket.IO if connected
    if (socketRef.current?.connected) {
      socketRef.current.emit('typing:stop', { roomId: activeRoomId, user: currentUser });
      socketRef.current.emit('message:send', payload, (response: any) => {
        if (response?.status === 'ok' && response.message?._id) {
          setMessagesMap((prev) => ({
            ...prev,
            [activeRoomId]: (prev[activeRoomId] || []).map((m) =>
              m.id === tempId ? { ...m, id: response.message._id } : m
            ),
          }));
        }
      });
    } else {
      // Fallback to HTTP POST
      try {
        await fetch(`${BACKEND_URL}/api/messages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } catch (err) {
        console.warn('Message send HTTP fallback failed:', err);
      }
    }
  };

  const sendTyping = (isTyping: boolean) => {
    if (socketRef.current?.connected) {
      if (isTyping) {
        socketRef.current.emit('typing:start', { roomId: activeRoomId, user: currentUser });
      } else {
        socketRef.current.emit('typing:stop', { roomId: activeRoomId, user: currentUser });
      }
    }
  };

  return (
    <ChatContext.Provider
      value={{
        currentUser,
        updateCurrentUser,
        signInWithGoogle,
        signOut,
        rooms,
        activeRoomId,
        activeRoom,
        selectRoom,
        createRoom,
        messages,
        sendMessage,
        uploadVoice,
        uploadAttachment,
        users,
        isOnline,
        isFirebaseActive,
        typingUser,
        sendTyping,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useChat must be used within ChatProvider');
  return context;
};
