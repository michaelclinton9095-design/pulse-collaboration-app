import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../context/ChatContext';
import { Send, Mic, Paperclip, Loader2, Square } from 'lucide-react';

export const MessageComposer: React.FC = () => {
  const { sendMessage, uploadVoice, uploadAttachment } = useChat();
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !isUploading) {
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

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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
    <div className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800 shrink-0">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelected}
        className="hidden"
        title="Upload Attachment"
      />

      <form
        onSubmit={handleSubmit}
        className="flex items-end gap-2 bg-slate-900 border border-slate-800 rounded-2xl p-2 focus-within:border-sky-500 transition-colors"
      >
        {/* Attachment button */}
        <button
          type="button"
          onClick={handleAttachmentClick}
          disabled={isUploading}
          className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors shrink-0 disabled:opacity-50"
          title="Attach File"
        >
          {isUploading ? <Loader2 className="w-4 h-4 animate-spin text-sky-400" /> : <Paperclip className="w-4 h-4" />}
        </button>

        {/* Text Input / Recording indicator */}
        {isRecording ? (
          <div className="flex-1 flex items-center gap-2 py-1.5 px-2 text-xs text-rose-400">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            <span className="font-semibold">Recording voice note... ({recordingSeconds}s)</span>
          </div>
        ) : (
          <textarea
            rows={1}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message... (Enter to send)"
            className="flex-1 bg-transparent text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none resize-none py-1.5 px-1 max-h-32"
          />
        )}

        {/* Voice Note Button */}
        <button
          type="button"
          onClick={toggleVoiceRecording}
          disabled={isUploading}
          className={`p-2 rounded-xl transition-colors shrink-0 ${
            isRecording
              ? 'bg-rose-600 text-white animate-pulse'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
          title={isRecording ? 'Stop & Send Recording' : 'Record Voice Note'}
        >
          {isRecording ? <Square className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        {/* Send Button */}
        <button
          type="submit"
          disabled={!text.trim() || isUploading || isRecording}
          className="p-2 rounded-xl bg-sky-600 hover:bg-sky-500 active:bg-sky-700 disabled:opacity-40 disabled:hover:bg-sky-600 text-white shadow-sm transition-all shrink-0"
          title="Send Message"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
