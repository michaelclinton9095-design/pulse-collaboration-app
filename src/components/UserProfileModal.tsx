import React, { useState } from 'react';
import { X, Check, Camera, Shield, Globe } from 'lucide-react';
import { useChat } from '../context/ChatContext';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, updateCurrentUser } = useChat();
  const [name, setName] = useState(currentUser.name);
  const [role, setRole] = useState(currentUser.role || 'Full-Stack Engineer');
  const [status, setStatus] = useState<'online' | 'away' | 'offline'>(currentUser.status);
  const [avatar, setAvatar] = useState(currentUser.avatar);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    updateCurrentUser({
      name: name.trim(),
      role: role.trim(),
      status,
      avatar
    });
    onClose();
  };

  const sampleAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-scale-up"
        role="dialog"
        aria-labelledby="profile-modal-title"
        aria-modal="true"
      >
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-sky-500/10 text-sky-400 rounded-lg">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 id="profile-modal-title" className="text-lg font-semibold text-white">Your Profile Settings</h2>
              <p className="text-xs text-slate-400">Manage your persona and status in real-time rooms</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="flex flex-col items-center gap-3">
            <div className="relative group">
              <img
                src={avatar}
                alt={name}
                className="w-20 h-20 rounded-full object-cover ring-4 ring-sky-500/20"
              />
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              {sampleAvatars.map((url, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => setAvatar(url)}
                  className={`w-7 h-7 rounded-full overflow-hidden border-2 transition-transform ${avatar === url ? 'border-sky-500 scale-110' : 'border-transparent hover:scale-105'}`}
                >
                  <img src={url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Display Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Role / Designation
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Current Presence Status
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setStatus('online')}
                className={`py-2 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-2 transition-all ${
                  status === 'online'
                    ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 font-semibold'
                    : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Online
              </button>
              <button
                type="button"
                onClick={() => setStatus('away')}
                className={`py-2 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-2 transition-all ${
                  status === 'away'
                    ? 'bg-amber-500/10 border-amber-500 text-amber-400 font-semibold'
                    : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                Away
              </button>
              <button
                type="button"
                onClick={() => setStatus('offline')}
                className={`py-2 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-2 transition-all ${
                  status === 'offline'
                    ? 'bg-slate-700/50 border-slate-500 text-slate-300 font-semibold'
                    : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-slate-500"></span>
                Invisible
              </button>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl text-xs font-medium bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-md shadow-sky-500/20 transition-all flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
