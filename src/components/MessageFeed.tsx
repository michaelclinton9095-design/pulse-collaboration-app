import React, { useEffect, useRef } from 'react';
import { useChat } from '../context/ChatContext';
import { Volume2, Paperclip, CheckCheck, Download } from 'lucide-react';

export const MessageFeed: React.FC = () => {
  const { messages, currentUser } = useChat();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
      {messages.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-center text-slate-500">
          <p className="text-sm font-semibold">No messages in this channel yet.</p>
          <p className="text-xs mt-1">Start the conversation below!</p>
        </div>
      ) : (
        messages.map((msg) => {
          const isOwn = msg.sender.id === currentUser.id;
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isOwn ? 'flex-row-reverse' : ''}`}
            >
              <img
                src={msg.sender.avatar}
                alt={msg.sender.name}
                className="w-8 h-8 rounded-xl object-cover border border-slate-700 shrink-0 mt-0.5"
              />

              <div className={`max-w-lg space-y-1 ${isOwn ? 'items-end text-right' : ''}`}>
                <div className="flex items-center gap-2 text-[10px] text-slate-400">
                  <span className="font-bold text-slate-300">{msg.sender.name}</span>
                  <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>

                {/* Bubble */}
                <div
                  className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm ${
                    isOwn
                      ? 'bg-sky-600 text-white rounded-tr-none'
                      : 'bg-slate-800 text-slate-100 rounded-tl-none border border-slate-700/60'
                  }`}
                >
                  {msg.text && <p className="whitespace-pre-wrap">{msg.text}</p>}

                  {/* Audio note preview */}
                  {msg.audioUrl && (
                    <div className="mt-2 p-2 rounded-xl bg-slate-900/60 border border-white/10 space-y-1">
                      <div className="flex items-center gap-2 text-xs text-sky-400">
                        <Volume2 className="w-4 h-4" />
                        <span className="font-semibold">Voice Message</span>
                      </div>
                      <audio controls src={msg.audioUrl} className="w-full max-w-[240px] h-7 pt-1" />
                    </div>
                  )}

                  {/* File preview */}
                  {msg.fileUrl && (
                    <div className="mt-2 p-2 rounded-xl bg-slate-900/60 border border-white/10 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2 truncate">
                        <Paperclip className="w-4 h-4 text-sky-400 shrink-0" />
                        <span className="truncate">{msg.fileUrl.split('/').pop() || 'Attachment'}</span>
                      </div>
                      <a
                        href={msg.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1 text-slate-300 hover:text-white rounded bg-slate-800 hover:bg-slate-700"
                        title="Download / Open"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </div>

                {isOwn && (
                  <div className="flex items-center justify-end gap-1 text-[10px] text-sky-400">
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>Delivered</span>
                  </div>
                )}
              </div>
            </div>
          );
        })
      )}
      <div ref={bottomRef} />
    </div>
  );
};
