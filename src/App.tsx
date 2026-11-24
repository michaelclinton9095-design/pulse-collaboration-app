import React, { useState } from 'react';
import { ChatProvider, useChat } from './context/ChatContext';
import { Sidebar } from './components/Sidebar';
import { ChatHeader } from './components/ChatHeader';
import { MessageFeed } from './components/MessageFeed';
import { MessageComposer } from './components/MessageComposer';
import { CreateRoomModal } from './components/CreateRoomModal';
import { UserProfileModal } from './components/UserProfileModal';
import { X, Hash, Calendar, Users, Shield, Bell, CheckCircle2 } from 'lucide-react';

const ChatLayout: React.FC = () => {
  const { activeRoom, users, isOnline } = useChat();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRoomInfoOpen, setIsRoomInfoOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 font-sans text-slate-100">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex h-full">
        <Sidebar
          onOpenCreateModal={() => setIsCreateModalOpen(true)}
          onOpenProfileModal={() => setIsProfileModalOpen(true)}
        />
      </div>

      {/* Mobile Drawer Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Drawer Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-80 transform transition-transform duration-300 ease-in-out lg:hidden ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <Sidebar
          onOpenCreateModal={() => {
            setIsMobileMenuOpen(false);
            setIsCreateModalOpen(true);
          }}
          onOpenProfileModal={() => {
            setIsMobileMenuOpen(false);
            setIsProfileModalOpen(true);
          }}
          onCloseMobileDrawer={() => setIsMobileMenuOpen(false)}
        />
      </div>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-slate-900 relative">
        {/* Top Header */}
        <ChatHeader
          onToggleMobileMenu={() => setIsMobileMenuOpen(prev => !prev)}
          onOpenRoomInfo={() => setIsRoomInfoOpen(prev => !prev)}
        />

        {/* Status banner when offline */}
        {!isOnline && (
          <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 text-xs text-amber-300 flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
            Reconnecting to low-latency stream... Offline caching active.
          </div>
        )}

        {/* Message Feed & Active Content */}
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            <MessageFeed />
            <MessageComposer />
          </div>

          {/* Collapsible Room Details Panel (Desktop) */}
          {isRoomInfoOpen && (
            <aside className="w-80 border-l border-slate-800 bg-slate-950/90 p-5 hidden md:flex flex-col h-full overflow-y-auto animate-fade-in">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <h3 className="font-bold text-sm text-white">Channel Details</h3>
                <button
                  onClick={() => setIsRoomInfoOpen(false)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="py-4 space-y-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Channel Name</span>
                  <div className="flex items-center gap-2 mt-1 text-white font-semibold text-sm">
                    <Hash className="w-4 h-4 text-sky-400" />
                    <span>{activeRoom.name}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Topic</span>
                  <p className="mt-1 text-xs text-slate-300 leading-relaxed bg-slate-900 p-3 rounded-xl border border-slate-800">
                    {activeRoom.description}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Security & Privacy</span>
                  <div className="mt-1.5 flex items-center gap-2 text-xs text-slate-300">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    <span>{activeRoom.isPrivate ? 'Private Invited Room' : 'Public Workspace Channel'}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Created At</span>
                  <div className="mt-1.5 flex items-center gap-2 text-xs text-slate-400">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    <span>{new Date(activeRoom.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Channel Members</span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-800 text-sky-400 text-[10px] font-bold font-mono">
                      {users.length}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {users.map(u => (
                      <div key={u.id} className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900/60 border border-slate-800/80">
                        <div className="relative">
                          <img src={u.avatar} alt={u.name} className="w-7 h-7 rounded-lg object-cover" />
                          <span className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-slate-900 ${
                            u.status === 'online' ? 'bg-emerald-400' : u.status === 'away' ? 'bg-amber-400' : 'bg-slate-500'
                          }`} />
                        </div>
                        <div className="overflow-hidden flex-1">
                          <p className="text-xs font-semibold text-white truncate">{u.name}</p>
                          <p className="text-[10px] text-slate-400 truncate">{u.role || 'Contributor'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          )}
        </div>
      </main>

      {/* Modals */}
      <CreateRoomModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ChatProvider>
      <ChatLayout />
    </ChatProvider>
  );
};

export default App;
