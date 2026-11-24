import React, { useState } from 'react';
import { useChat } from '../context/ChatContext';
import { 
  MessageSquare, Plus, Search, Hash, Lock, 
  Settings, Users, Radio, Shield, LogOut 
} from 'lucide-react';

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
  const { rooms, activeRoomId, selectRoom, currentUser, isOnline } = useChat();
  const [searchTerm, setSearchTerm] = useState('');

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

      {/* User Card */}
      <div className="p-3 mx-3 my-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
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
            <strong className="text-xs font-bold text-white block truncate">{currentUser.name}</strong>
            <span className="text-[10px] text-slate-400 block truncate">{currentUser.role || 'Member'}</span>
          </div>
        </div>

        <button
          onClick={onOpenProfileModal}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Account Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

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
