
import React, { KeyboardEvent } from 'react';
import { Send, MessageCircle, Zap } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
  mode: 'chat' | 'action';
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
            mode === 'chat' 
              ? 'border-slate-600 focus:border-cyan-400 focus:ring-cyan-400' 
              : 'border-amber-600/50 focus:border-amber-400 focus:ring-amber-400'
          }`}
          placeholder={mode === 'chat' ? "Type your response..." : "Enter an action or command..."}
        />
        
        {/* Mode Toggle Button */}
        <Toggle
          pressed={mode === 'action'}
          onPressedChange={onModeToggle}
          className={`min-w-[80px] min-h-[44px] font-medium text-sm transition-all duration-200 ${
            mode === 'chat'
              ? 'bg-cyan-500/20 text-cyan-400 border-cyan-400 hover:bg-cyan-500/30 data-[state=off]:bg-cyan-500/20'
              : 'bg-amber-500/20 text-amber-400 border-amber-400 hover:bg-amber-500/30 data-[state=on]:bg-amber-500/20'
          }`}
          aria-label={`Switch to ${mode === 'chat' ? 'action' : 'chat'} mode (Ctrl+T)`}
          title={`${mode === 'chat' ? 'CHAT' : 'ACTION'} mode (Ctrl+T to toggle)`}
        >
          <div className="flex items-center gap-2">
            {mode === 'chat' ? (
              <MessageCircle className="w-4 h-4" />
            ) : (
              <Zap className="w-4 h-4" />
            )}
            <span>{mode === 'chat' ? 'CHAT' : 'ACTION'}</span>
          </div>
        </Toggle>
        
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
