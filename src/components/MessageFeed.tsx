import React, { useEffect, useRef } from 'react';
import { useChat } from '../context/ChatContext';
import { Volume2, Paperclip, CheckCheck, Download, Check } from 'lucide-react';

export const MessageFeed: React.FC = () => {
  const { messages, currentUser, activeRoom } = useChat();
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
          const isOwn = msg.sender.id === currentUser.id;
          const timeFormatted = new Date(msg.createdAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          });

          return (
            <div
              key={msg.id || index}
              className={`flex items-end gap-2 group ${isOwn ? 'justify-end' : 'justify-start'}`}
            >
              {!isOwn && (
                <img
                  src={msg.sender.avatar}
                  alt={msg.sender.name}
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
                    {msg.sender.name}
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

                {/* File Attachment preview */}
                {msg.fileUrl && (
                  <div className="my-1.5 p-2 rounded-xl bg-black/20 border border-white/10 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 truncate">
                      <Paperclip className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="truncate text-[11px]">{msg.fileUrl.split('/').pop() || 'Attachment'}</span>
                    </div>
                    <a
                      href={msg.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1 text-slate-300 hover:text-white rounded bg-white/10 hover:bg-white/20"
                      title="Download"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </a>
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
      <div ref={bottomRef} />
    </div>
  );
};
