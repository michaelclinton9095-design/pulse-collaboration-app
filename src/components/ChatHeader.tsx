import React from 'react';
import { useChat } from '../context/ChatContext';
import { Hash, Lock, Users, Info, Bell, Menu } from 'lucide-react';

interface ChatHeaderProps {
  onToggleMobileMenu: () => void;
  onOpenRoomInfo: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ 
  onToggleMobileMenu,
  onOpenRoomInfo 
}) => {
  const { activeRoom, users } = useChat();

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
            <p className="text-[11px] text-slate-400 truncate hidden sm:block">
              {activeRoom.description}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
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
    </header>
  );
};
