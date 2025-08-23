export type ChatMode = 'chat' | 'action';

export const CHAT_MODES: Record<'focused' | 'unfocused', ChatMode> = {
  focused: 'chat',
  unfocused: 'action',
};

export const MODE_LABELS: Record<ChatMode, string> = {
  chat: 'SAY',
  action: 'DO',
};

export const MODE_PREFIXES: Record<ChatMode, string> = {
  chat: 'SAY ',
  action: 'DO ',
};

export const MODE_PLACEHOLDERS: Record<ChatMode, string> = {
  chat: 'Type what you want to say…',
  action: 'Describe what you want to do…',
};

// Robust inference from user-entered text (backward-compatible)
export function inferModeFromText(text?: string): ChatMode {
  const t = (text || '').trim();
  const U = t.toUpperCase();

  // Action-first detection
  if (
    U.startsWith('DO ') ||
    U.startsWith('!DO') ||
    U.startsWith('ACTION ') ||
    U.startsWith('DO SOMETHING')
  ) {
    return 'action';
  }

  // Chat detection
  if (
    U.startsWith('SAY ') ||
    U.startsWith('!SAY') ||
    U.startsWith('CHAT ') ||
    U.startsWith('SPEAK ') ||
    U.startsWith('TALK ')
  ) {
    return 'chat';
  }

  // Default to chat
  return 'chat';
}
