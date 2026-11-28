import React, { useState } from 'react';
import { useChat } from '../context/ChatContext';
import { 
  MessageSquare, Plus, Search, Hash, Lock, 
  Settings, Users, Radio, Shield, LogOut, RefreshCw 
} from 'lucide-react';
import { GoogleAuthModal } from './GoogleAuthModal';

interface SidebarProps {
  onOpenCreateModal: () => void;
  onOpenProfileModal: () => void;
  onCloseMobileDrawer?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  onOpenCreateModal, 
  onOpenProfileModal,
  onCloseMobileDrawer 
}) => {
  const { rooms, activeRoomId, selectRoom, currentUser, isOnline, signOut } = useChat();
  const [searchTerm, setSearchTerm] = useState('');
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

  const filteredRooms = rooms.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (id: string) => {
    selectRoom(id);
    if (onCloseMobileDrawer) onCloseMobileDrawer();
  };

  return (
    <aside className="w-80 bg-slate-950 border-r border-slate-800 flex flex-col h-full shrink-0">
      {/* Brand & Presence Header */}
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-sky-600 text-white flex items-center justify-center font-black text-sm shadow-sm shadow-sky-600/30">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-white tracking-tight">PULSE</span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-sky-950 text-sky-400 border border-sky-800">
                REAL-TIME
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
              <span className="text-[10px] text-slate-400 font-medium">
                {isOnline ? 'WebSocket Connected' : 'Offline Mode'}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={onOpenCreateModal}
          className="p-1.5 rounded-xl bg-slate-800 hover:bg-sky-600 text-slate-300 hover:text-white transition-colors"
          title="Create New Channel"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* User Card & Google Auth */}
      <div className="mx-3 my-2 space-y-2">
        <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="relative shrink-0">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-9 h-9 rounded-xl object-cover border border-slate-700"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-slate-900" />
            </div>
            <div className="overflow-hidden">
              <div className="flex items-center gap-1.5">
                <strong className="text-xs font-bold text-white block truncate">{currentUser.name}</strong>
                {currentUser.provider === 'google' && (
                  <span className="px-1 py-0.2 rounded text-[8px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    Google
                  </span>
                )}
              </div>
              <span className="text-[10px] text-slate-400 block truncate">{currentUser.email || currentUser.role || 'Member'}</span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {currentUser.provider === 'google' ? (
              <>
                <button
                  onClick={() => setIsGoogleModalOpen(true)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-sky-400 hover:bg-slate-800 transition-colors"
                  title="Switch Google Account (User 1 / User 2)"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={signOut}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                  title="Sign out of Google"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </>
            ) : null}
            <button
              onClick={onOpenProfileModal}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Account Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {currentUser.provider !== 'google' ? (
          <button
            onClick={() => setIsGoogleModalOpen(true)}
            className="w-full py-2 px-3 rounded-xl text-xs font-semibold bg-white hover:bg-slate-100 text-slate-900 transition-all flex items-center justify-center gap-2 shadow-sm border border-slate-300"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Sign in with Google</span>
          </button>
        ) : (
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Signed in via Google
            </span>
            <button
              onClick={() => setIsGoogleModalOpen(true)}
              className="text-[10px] text-sky-400 hover:text-sky-300 font-medium hover:underline"
            >
              Switch demo user ➔
            </button>
          </div>
        )}
      </div>

      <GoogleAuthModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
      />

      {/* Search Input */}
      <div className="px-3 mb-2">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search channels..."
            className="w-full pl-8 pr-3 py-1.5 rounded-xl text-xs bg-slate-900 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Channels List */}
      <div className="flex-1 overflow-y-auto px-2 space-y-1 py-1">
        <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Channels &amp; Rooms ({filteredRooms.length})
        </div>

        {filteredRooms.map((room) => {
          const isActive = room.id === activeRoomId;
          return (
            <button
              key={room.id}
              onClick={() => handleSelect(room.id)}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
                isActive
                  ? 'bg-sky-600 text-white shadow-sm shadow-sky-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center gap-2 overflow-hidden">
                {room.isPrivate ? (
                  <Lock className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                ) : (
                  <Hash className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                )}
                <span className="truncate">{room.name}</span>
              </div>

              {room.unreadCount ? (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-sky-400 text-slate-950">
                  {room.unreadCount}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-slate-800 text-[10px] text-slate-500 flex items-center justify-between">
        <span>Portfolio Pulse App</span>
        <span className="font-mono text-sky-400">v2.0.0 (TS)</span>
      </div>
    </aside>
  );
};
