import React, { useEffect, useRef } from 'react';
import { useChat } from '../context/ChatContext';
import { Volume2, Paperclip, CheckCheck, Download, Check } from 'lucide-react';

export const MessageFeed: React.FC = () => {
  const { messages, currentUser, activeRoom, typingUser } = useChat();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 bg-[#0b141a] bg-opacity-95 bg-[radial-gradient(#182229_1px,transparent_1px)] [background-size:16px_16px]">
      {/* WhatsApp-Style Date Pill */}
      <div className="flex justify-center my-2">
        <span className="px-3 py-1 rounded-lg bg-[#182229] border border-white/5 text-[11px] font-semibold text-slate-400 shadow-sm">
          Today
        </span>
      </div>

      {/* Security notice */}
      <div className="flex justify-center mb-4">
        <p className="max-w-md text-center text-[10px] text-amber-300/80 bg-[#182229]/80 border border-amber-500/10 px-3 py-1.5 rounded-xl shadow-sm">
          🔒 Messages in #{activeRoom?.name || 'chat'} are synchronized in real-time across WebSockets.
        </p>
      </div>

      {messages.length === 0 ? (
        <div className="h-48 flex flex-col items-center justify-center text-center text-slate-500">
          <p className="text-sm font-semibold">No messages in this chat yet.</p>
          <p className="text-xs mt-1 text-slate-400">Type a message below to start chatting!</p>
        </div>
      ) : (
        messages.map((msg, index) => {
          const isOwn = (msg.sender?.id && currentUser?.id && msg.sender.id === currentUser.id) || 
                        (msg.sender?.name && currentUser?.name && msg.sender.name === currentUser.name);
          const timeFormatted = msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          }) : '';

          const senderAvatar = msg.sender?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop';
          const senderName = msg.sender?.name || 'Teammate';

          return (
            <div
              key={msg.id || index}
              className={`flex items-end gap-2 group ${isOwn ? 'justify-end' : 'justify-start'}`}
            >
              {!isOwn && (
                <img
                  src={senderAvatar}
                  alt={senderName}
                  className="w-7 h-7 rounded-full object-cover border border-slate-700 shrink-0 mb-1"
                />
              )}

              <div
                className={`relative max-w-[85%] sm:max-w-md px-3.5 py-2 rounded-2xl shadow-md text-xs sm:text-sm leading-relaxed ${
                  isOwn
                    ? 'bg-[#005c4b] text-white rounded-br-xs'
                    : 'bg-[#202c33] text-slate-100 rounded-bl-xs border border-white/5'
                }`}
              >
                {/* Sender Name for group chats */}
                {!isOwn && (
                  <span className="text-[11px] font-bold text-emerald-400 block mb-0.5">
                    {senderName}
                  </span>
                )}

                {/* Text Body */}
                {msg.text && (
                  <p className="whitespace-pre-wrap break-words pr-12 pb-1 inline-block">
                    {msg.text}
                  </p>
                )}

                {/* Audio message preview */}
                {msg.audioUrl && (
                  <div className="my-1.5 p-2 rounded-xl bg-black/20 border border-white/10 space-y-1">
                    <div className="flex items-center gap-2 text-xs text-emerald-400">
                      <Volume2 className="w-4 h-4" />
                      <span className="font-semibold text-[11px]">Voice Note</span>
                    </div>
                    <audio controls src={msg.audioUrl} className="w-full max-w-[220px] h-7 pt-1" />
                  </div>
                )}

                {/* File Attachment preview (Images + Documents) */}
                {msg.fileUrl && (
                  <div className="my-1.5 p-2 rounded-xl bg-black/20 border border-white/10 space-y-1.5">
                    {/\.(png|jpe?g|gif|webp|svg)($|\?)/i.test(msg.fileUrl) ? (
                      <div className="rounded-lg overflow-hidden border border-white/10 max-h-48 bg-black/30">
                        <img
                          src={msg.fileUrl}
                          alt="Attachment preview"
                          className="w-full h-full object-cover max-h-48"
                        />
                      </div>
                    ) : null}
                    <div className="flex items-center justify-between gap-3 text-xs pt-0.5">
                      <div className="flex items-center gap-2 truncate">
                        <Paperclip className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="truncate text-[11px] font-medium">{msg.fileUrl.split('/').pop() || 'Attachment'}</span>
                      </div>
                      <a
                        href={msg.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2 py-1 text-slate-200 hover:text-white rounded-lg bg-white/10 hover:bg-white/20 flex items-center gap-1 shrink-0 font-medium text-[10px] transition-colors"
                        title="Download file"
                      >
                        <Download className="w-3 h-3" />
                        <span>Download</span>
                      </a>
                    </div>
                  </div>
                )}

                {/* Timestamp & WhatsApp Double Blue Ticks */}
                <div className="float-right ml-2 mt-1 flex items-center gap-1 text-[10px] text-slate-300/80 select-none">
                  <span>{timeFormatted}</span>
                  {isOwn && (
                    <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb]" />
                  )}
                </div>
              </div>
            </div>
          );
        })
      )}

      {/* Live In-Feed Typing Indicator */}
      {typingUser && (
        <div className="flex items-center gap-2 animate-fade-in pl-1">
          <div className="bg-[#202c33] border border-white/5 px-3.5 py-2 rounded-2xl rounded-bl-xs text-xs text-slate-300 flex items-center gap-2 shadow-md">
            <span className="font-bold text-emerald-400 text-[11px]">{typingUser}</span>
            <span className="text-[11px] text-slate-400">is typing</span>
            <div className="flex items-center gap-1 ml-0.5 pt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
};
