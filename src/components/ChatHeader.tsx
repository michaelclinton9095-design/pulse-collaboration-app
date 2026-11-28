import React, { useState } from 'react';
import { useChat } from '../context/ChatContext';
import { Hash, Lock, Users, Info, Bell, Menu } from 'lucide-react';
import { GoogleAuthModal } from './GoogleAuthModal';

interface ChatHeaderProps {
  onToggleMobileMenu: () => void;
  onOpenRoomInfo: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ 
  onToggleMobileMenu,
  onOpenRoomInfo 
}) => {
  const { activeRoom, users, typingUser, currentUser } = useChat();
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

  return (
    <header className="h-16 px-4 sm:px-6 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-3 overflow-hidden">
        {/* Mobile menu button */}
        <button
          onClick={onToggleMobileMenu}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden shrink-0"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 overflow-hidden">
          <div className="p-2 rounded-xl bg-slate-800 text-sky-400 shrink-0">
            {activeRoom.isPrivate ? <Lock className="w-4 h-4" /> : <Hash className="w-4 h-4" />}
          </div>
          <div className="overflow-hidden">
            <h2 className="text-sm font-bold text-white tracking-tight truncate">
              {activeRoom.name}
            </h2>
            {typingUser ? (
              <p className="text-[11px] text-emerald-400 font-semibold animate-pulse flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>{typingUser} is typing...</span>
              </p>
            ) : (
              <p className="text-[11px] text-slate-400 truncate hidden sm:block">
                {activeRoom.description}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Google Status Badge / Quick Sign-In */}
        {currentUser.provider === 'google' ? (
          <button
            onClick={() => setIsGoogleModalOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 text-xs transition-colors cursor-pointer"
            title="Click to switch Google demo account"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-semibold truncate max-w-[120px]">{currentUser.name}</span>
          </button>
        ) : (
          <button
            onClick={() => setIsGoogleModalOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-white hover:bg-slate-100 text-slate-900 text-xs font-semibold shadow-sm transition-colors cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Google Login</span>
          </button>
        )}

        {/* Active members pill */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs">
          <Users className="w-3.5 h-3.5 text-sky-400" />
          <span className="font-semibold">{users.length} Active</span>
        </div>

        <button
          onClick={onOpenRoomInfo}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Room Details"
        >
          <Info className="w-4 h-4" />
        </button>
      </div>

      <GoogleAuthModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
      />
    </header>
  );
};
