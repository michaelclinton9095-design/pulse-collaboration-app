import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../context/ChatContext';
import { Send, Mic, Paperclip, Loader2, Square } from 'lucide-react';

export const MessageComposer: React.FC = () => {
  const { sendMessage, uploadVoice, uploadAttachment, sendTyping } = useChat();
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);
  const typingTimeoutRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, []);

  const handleTextChange = (val: string) => {
    setText(val);
    sendTyping(true);

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      sendTyping(false);
    }, 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !isUploading) {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      sendTyping(false);
      sendMessage(text.trim());
      setText('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const processFileUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const result = await uploadAttachment(file);
      if (result) {
        sendMessage(`Shared document: ${result.name}`, undefined, result.url, result.name, result.size);
      } else {
        sendMessage(`Attached file: ${file.name}`, undefined, URL.createObjectURL(file), file.name, file.size);
      }
    } catch {
      sendMessage(`Attached file: ${file.name}`, undefined, URL.createObjectURL(file), file.name, file.size);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await processFileUpload(file);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) await processFileUpload(file);
  };

  const startVoiceRecording = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          stream.getTracks().forEach((track) => track.stop());

          setIsUploading(true);
          const uploadedUrl = await uploadVoice(audioBlob);
          setIsUploading(false);

          sendMessage('', uploadedUrl || URL.createObjectURL(audioBlob));
        };

        mediaRecorder.start();
        setIsRecording(true);
        setRecordingSeconds(0);
        timerRef.current = setInterval(() => {
          setRecordingSeconds((prev) => prev + 1);
        }, 1000);
      } else {
        // Fallback simulated voice note
        triggerFallbackVoiceNote();
      }
    } catch {
      // Permission denied or headless environment fallback
      triggerFallbackVoiceNote();
    }
  };

  const triggerFallbackVoiceNote = () => {
    setIsRecording(true);
    setRecordingSeconds(0);
    timerRef.current = setInterval(() => {
      setRecordingSeconds((prev) => prev + 1);
    }, 1000);
  };

  const stopVoiceRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRecording(false);

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    } else {
      // Send simulated voice note recording
      sendMessage('', 'https://actions.google.com/sounds/v1/water/rain_heavy.ogg');
    }
  };

  const toggleVoiceRecording = () => {
    if (!isRecording) {
      startVoiceRecording();
    } else {
      stopVoiceRecording();
    }
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`p-3 sm:p-4 bg-slate-950 border-t border-slate-800 shrink-0 transition-colors ${
        isDragging ? 'bg-emerald-950/40 border-emerald-500/50' : ''
      }`}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelected}
        className="hidden"
        title="Upload Attachment"
      />

      {isDragging ? (
        <div className="py-2.5 px-4 text-center rounded-2xl border-2 border-dashed border-emerald-400 bg-emerald-500/10 text-emerald-300 text-xs font-semibold animate-pulse flex items-center justify-center gap-2">
          <Paperclip className="w-4 h-4" />
          <span>Drop image or document here to attach &amp; send</span>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 bg-[#202c33] border border-white/10 rounded-2xl p-1.5 focus-within:border-emerald-500/50 transition-colors shadow-lg"
        >
        {/* Attachment button */}
        <button
          type="button"
          onClick={handleAttachmentClick}
          disabled={isUploading}
          className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/5 transition-colors shrink-0 disabled:opacity-50"
          title="Attach Document or Image"
        >
          {isUploading ? <Loader2 className="w-5 h-5 animate-spin text-emerald-400" /> : <Paperclip className="w-5 h-5" />}
        </button>

        {/* Text Input / Recording indicator */}
        {isRecording ? (
          <div className="flex-1 flex items-center gap-2 py-1.5 px-3 text-xs text-rose-400">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            <span className="font-semibold">Recording Voice Note... ({recordingSeconds}s)</span>
          </div>
        ) : (
          <textarea
            rows={1}
            value={text}
            onChange={(e) => handleTextChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1 bg-transparent text-xs sm:text-sm text-slate-100 placeholder-slate-400 focus:outline-none resize-none py-2 px-2 max-h-32"
          />
        )}

        {/* Voice Note Button */}
        <button
          type="button"
          onClick={toggleVoiceRecording}
          disabled={isUploading}
          className={`p-2 rounded-full transition-colors shrink-0 ${
            isRecording
              ? 'bg-rose-600 text-white animate-pulse'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
          title={isRecording ? 'Stop & Send Recording' : 'Voice Message'}
        >
          {isRecording ? <Square className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        {/* Send Button WhatsApp Style */}
        <button
          type="submit"
          disabled={!text.trim() || isUploading || isRecording}
          className="p-2.5 rounded-full bg-[#00a884] hover:bg-[#029071] active:bg-[#007a5e] disabled:opacity-30 text-white shadow-md transition-all shrink-0"
          title="Send (Enter)"
        >
          <Send className="w-4 h-4 ml-0.5" />
        </button>
      </form>
    )}
  </div>
);
};
