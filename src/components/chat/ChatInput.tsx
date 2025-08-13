
import React, { KeyboardEvent } from 'react';
import { Send, MessageCircle, Zap, ChevronLeft, ChevronRight } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem
} from '@/components/ui/dropdown-menu';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
  mode: 'focused' | 'unfocused';
  onModeToggle: () => void;
  onModeChange: (mode: 'focused' | 'unfocused') => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ 
  value, 
  onChange, 
  onSend, 
  disabled = false,
  mode,
  onModeToggle,
  onModeChange
}) => {
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
    // Toggle mode with Ctrl/Cmd + T
    if ((e.key === 't' || e.key === 'T') && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      onModeToggle();
    }
  };

  return (
    <div className="sticky bottom-0 bg-gradient-to-r from-slate-800/95 to-slate-700/80 backdrop-blur-lg border-t border-slate-600 shadow-lg shadow-slate-900/50 p-4 z-10">
      <div className="flex gap-3 items-end">
        {/* Mode Switcher - moved to the left */}
        <div
          className={`flex items-center gap-1 rounded-lg border-2 h-[44px] px-1 transition-all duration-200 ${
            mode === 'focused'
              ? 'bg-cyan-500/10 border-cyan-400 text-cyan-400'
              : 'bg-amber-500/10 border-amber-400 text-amber-400'
          }`}
        >
          <button
            type="button"
            onClick={() => onModeChange(mode === 'focused' ? 'unfocused' : 'focused')}
            className="w-8 h-8 inline-flex items-center justify-center rounded-md hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-cyan-400"
            aria-label="Previous mode"
            title="Previous mode"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="h-8 px-2 inline-flex items-center gap-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-cyan-400 hover:bg-white/5"
                aria-label="Select mode (Ctrl+T to toggle)"
                title={`${mode === 'focused' ? 'CHAT' : 'ACTION'} mode (Ctrl+T to toggle)`}
              >
                {mode === 'focused' ? (
                  <MessageCircle className="w-4 h-4" />
                ) : (
                  <Zap className="w-4 h-4" />
                )}
                <span className="uppercase tracking-wide text-xs font-medium">
                  {mode === 'focused' ? 'CHAT' : 'ACTION'}
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="top"
              align="start"
              sideOffset={8}
              className="z-50 bg-slate-800 border border-gray-700 text-white"
            >
              <DropdownMenuRadioGroup
                value={mode}
                onValueChange={(val) => onModeChange(val as 'focused' | 'unfocused')}
              >
                <DropdownMenuRadioItem value="focused">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm">Chat</span>
                  </div>
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="unfocused">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span className="text-sm">Action</span>
                  </div>
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <button
            type="button"
            onClick={() => onModeChange(mode === 'focused' ? 'unfocused' : 'focused')}
            className="w-8 h-8 inline-flex items-center justify-center rounded-md hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-cyan-400"
            aria-label="Next mode"
            title="Next mode"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Text input */}
        <input 
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className={`flex-1 bg-gradient-to-br from-slate-700/50 to-slate-800/50 backdrop-blur border rounded-lg px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ${
            mode === 'focused' 
              ? 'border-slate-600 focus:border-cyan-400 focus:ring-cyan-400' 
              : 'border-amber-600/50 focus:border-amber-400 focus:ring-amber-400'
          }`}
          placeholder={mode === 'focused' ? 'Type your response...' : 'Enter an action or command...'}
        />
        
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
