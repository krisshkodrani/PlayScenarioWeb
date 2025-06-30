
import React, { KeyboardEvent } from 'react';
import { Send, MessageCircle } from 'lucide-react';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ 
  value, 
  onChange, 
  onSend, 
  disabled = false 
}) => {
  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const handleChatClick = () => {
    // Placeholder for chat functionality - could open chat history, settings, etc.
    console.log('Chat button clicked');
  };

  return (
    <div className="bg-gradient-to-r from-slate-800/80 to-slate-700/50 backdrop-blur border-t border-slate-600 p-4">
      <div className="flex gap-3 items-end">
        <input 
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={disabled}
          className="flex-1 bg-gradient-to-br from-slate-700/50 to-slate-800/50 backdrop-blur border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder="Type your response..."
        />
        
        {/* Chat Button */}
        <button 
          onClick={handleChatClick}
          className="bg-slate-700/80 backdrop-blur border border-slate-600 text-slate-400 hover:text-cyan-400 hover:border-cyan-400/50 p-3 rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center transition-all duration-200 hover:shadow-lg hover:shadow-cyan-400/20 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-800"
          aria-label="Chat options"
        >
          <MessageCircle className="w-5 h-5" />
        </button>
        
        {/* Send Button */}
        <button 
          onClick={onSend}
          disabled={disabled || !value.trim()}
          className="bg-gradient-to-r from-cyan-400 to-violet-500 text-white p-3 rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center hover:from-cyan-300 hover:to-violet-400 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-800"
          aria-label="Send message"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
