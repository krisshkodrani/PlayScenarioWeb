
import React, { KeyboardEvent } from 'react';
import { Send, MessageCircle, Zap } from 'lucide-react';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
  mode: 'focused' | 'unfocused';
  onModeToggle: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ 
  value, 
  onChange, 
  onSend, 
  disabled = false,
  mode,
  onModeToggle
}) => {
  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
    // Toggle mode with Ctrl/Cmd + T
    if (e.key === 't' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      onModeToggle();
    }
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
          className={`flex-1 bg-gradient-to-br from-slate-700/50 to-slate-800/50 backdrop-blur border rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-1 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ${
            mode === 'focused' 
              ? 'border-slate-600 focus:border-cyan-400 focus:ring-cyan-400' 
              : 'border-amber-600/50 focus:border-amber-400 focus:ring-amber-400'
          }`}
          placeholder={mode === 'focused' ? "Type your response..." : "Enter an action or command..."}
        />
        
        {/* Mode Toggle Button */}
        <button
          onClick={onModeToggle}
          className={`min-w-[44px] min-h-[44px] font-medium text-sm transition-all duration-200 rounded-lg border-2 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 ${
            mode === 'focused'
              ? 'bg-cyan-500/20 text-cyan-400 border-cyan-400 hover:bg-cyan-500/30 focus:ring-cyan-400'
              : 'bg-amber-500/20 text-amber-400 border-amber-400 hover:bg-amber-500/30 focus:ring-amber-400'
          }`}
          aria-label={`Switch to ${mode === 'focused' ? 'unfocused' : 'focused'} mode (Ctrl+T)`}
          title={`${mode === 'focused' ? 'FOCUSED' : 'UNFOCUSED'} mode (Ctrl+T to toggle)`}
        >
          {mode === 'focused' ? (
            <MessageCircle className="w-5 h-5" />
          ) : (
            <Zap className="w-5 h-5" />
          )}
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
