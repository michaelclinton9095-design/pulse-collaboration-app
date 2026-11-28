import React from 'react';
import { useChat } from '../context/ChatContext';
import { demoGoogleAccounts } from '../firebase';
import { X, Check, ExternalLink } from 'lucide-react';

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoogleAuthModal: React.FC<GoogleAuthModalProps> = ({ isOpen, onClose }) => {
  const { signInWithGoogle, currentUser } = useChat();

  if (!isOpen) return null;

  const handleSelectAccount = async (index: number) => {
    await signInWithGoogle(index);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white text-slate-800 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl border border-slate-200 animate-scale-up"
        role="dialog"
        aria-labelledby="google-modal-title"
      >
        {/* Header */}
        <div className="p-6 pb-3 text-center relative border-b border-slate-100">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Google Logo */}
          <div className="flex justify-center mb-2">
            <svg className="w-8 h-8" viewBox="0 0 24 24">
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
          </div>

          <h2 id="google-modal-title" className="text-lg font-semibold text-slate-900 tracking-tight">
            Choose an account
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            to continue to <strong className="text-slate-800">Pulse Chat</strong>
          </p>
        </div>

        {/* Demo Tip Banner */}
        <div className="bg-sky-50 px-4 py-2 text-[11px] text-sky-800 border-b border-sky-100 flex items-center gap-1.5 font-medium">
          <span>💡</span>
          <span>Pick Account 1 in Window A, and Account 2 in Window B (Incognito).</span>
        </div>

        {/* Account List */}
        <div className="divide-y divide-slate-100">
          {demoGoogleAccounts.map((account, index) => {
            const isSelected = currentUser.email === account.email;
            return (
              <button
                key={account.id}
                onClick={() => handleSelectAccount(index)}
                className={`w-full px-5 py-3.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors ${
                  isSelected ? 'bg-sky-50/60' : ''
                }`}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="relative">
                    <img
                      src={account.avatar}
                      alt={account.name}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
                  </div>
                  <div className="overflow-hidden">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 truncate">
                        {account.name}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded-full font-semibold bg-emerald-100 text-emerald-800">
                        User {index + 1}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 block truncate">
                      {account.email}
                    </span>
                    <span className="text-[10px] text-slate-400 block truncate">
                      {account.role}
                    </span>
                  </div>
                </div>

                {isSelected ? (
                  <div className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                ) : (
                  <span className="text-xs text-sky-600 font-semibold px-2 py-1 rounded-lg bg-sky-50 group-hover:bg-sky-100">
                    Select
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
          <p className="text-[10px] text-slate-400">
            Secure Google OAuth 2.0 Simulation • Pulse Real-Time Messaging
          </p>
        </div>
      </div>
    </div>
  );
};
