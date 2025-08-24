import React, { KeyboardEvent } from 'react';
import { Send, ChevronLeft, ChevronRight } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem
} from '@/components/ui/dropdown-menu';
import { CHAT_MODES, MODE_LABELS, MODE_PLACEHOLDERS } from '@/constants/chatCommands';

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

  const currentChatMode = CHAT_MODES[mode];
  const label = MODE_LABELS[currentChatMode];
  const placeholder = MODE_PLACEHOLDERS[currentChatMode];

  return (
    <div className="sticky bottom-0 bg-gradient-to-r from-slate-800/95 to-slate-700/80 backdrop-blur-lg border-t border-slate-600 shadow-lg shadow-slate-900/50 p-4 z-10 chat-input-container">
      <div className="flex gap-3 items-stretch">
        {/* Mode Switcher - text-only, side arrows, same height as input */}
        <div className="flex items-center gap-1 h-12 px-1 rounded-lg border border-slate-600 bg-slate-800/60">
          <button
            type="button"
            onClick={onModeToggle}
            className="h-12 px-3 inline-flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-700/60 rounded"
            aria-label="Previous mode"
            title="Toggle mode (Ctrl+T)"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="h-12 px-4 inline-flex items-center gap-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-slate-400 hover:bg-slate-700/50 text-slate-200"
                aria-label="Select mode (Ctrl+T to toggle)"
                title={`${label} mode (Ctrl+T to toggle)`}
              >
                <span className="uppercase tracking-wide text-sm font-semibold text-slate-200">{label}</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="top"
              align="start"
              sideOffset={8}
              className="z-50 bg-slate-800 border border-slate-700 text-slate-200"
            >
              <DropdownMenuRadioGroup
                value={mode}
                onValueChange={(val) => onModeChange(val as 'focused' | 'unfocused')}
              >
                <DropdownMenuRadioItem value="focused">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">SAY</span>
                  </div>
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="unfocused">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">DO</span>
                  </div>
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <button
            type="button"
            onClick={onModeToggle}
            className="h-12 px-3 inline-flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-700/60 rounded"
            aria-label="Next mode"
            title="Toggle mode (Ctrl+T)"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Text input - enforce same 48px height */}
        <input 
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className={`h-12 flex-1 bg-slate-800/60 backdrop-blur border rounded-lg px-4 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 border-slate-600 focus:border-slate-400 focus:ring-slate-400`}
          placeholder={placeholder}
        />
        
        {/* Send Button - match height */}
        <button 
          onClick={onSend}
          disabled={disabled || !value.trim()}
          className="h-12 bg-slate-700 text-slate-100 px-4 rounded-lg min-w-[48px] flex items-center justify-center hover:bg-slate-600 transition-all shadow disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-800"
          aria-label="Send message"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
