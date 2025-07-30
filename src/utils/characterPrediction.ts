import { Message } from '../types/chat';

interface Character {
  id: string;
  name: string;
  role: string;
  avatar_color: string;
  personality: string;
}

interface CharacterPredictionContext {
  messages: Message[];
  characters: Character[];
  lastUserMessage?: Message;
  scenarioContext?: string;
}

/**
 * Predicts which character is most likely to respond next based on conversation context
 */
export function predictRespondingCharacter({
  messages,
  characters,
  lastUserMessage,
  scenarioContext
}: CharacterPredictionContext): Character | null {
  if (!characters || characters.length === 0) return null;
  
  // If only one character, return that character
  if (characters.length === 1) return characters[0];
  
  // Analyze recent conversation to predict next speaker
  const recentMessages = messages.slice(-10); // Look at last 10 messages
  
  // Find characters who have spoken recently
  const activeCharacters = new Map<string, number>();
  
  recentMessages.forEach((msg, index) => {
    if (msg.message_type === 'ai_response' && msg.character_name) {
      const character = characters.find(c => c.name.toLowerCase() === msg.character_name?.toLowerCase());
      if (character) {
        // More recent messages get higher weight
        const weight = index + 1;
        activeCharacters.set(character.id, (activeCharacters.get(character.id) || 0) + weight);
      }
    }
  });
  
  // If user message mode is 'action', predict based on character expertise
  if (lastUserMessage?.mode === 'action') {
    const actionBasedCharacter = predictCharacterForAction(lastUserMessage.message, characters);
    if (actionBasedCharacter) return actionBasedCharacter;
  }
  
  // Find character who hasn't spoken recently (encourage rotation)
  const unactiveCharacters = characters.filter(c => !activeCharacters.has(c.id));
  if (unactiveCharacters.length > 0) {
    return unactiveCharacters[0];
  }
  
  // Return character with lowest recent activity (encourage balance)
  let minActivity = Infinity;
  let selectedCharacter = characters[0];
  
  characters.forEach(character => {
    const activity = activeCharacters.get(character.id) || 0;
    if (activity < minActivity) {
      minActivity = activity;
      selectedCharacter = character;
    }
  });
  
  return selectedCharacter;
}

/**
 * Predicts character based on action content and character expertise
 */
function predictCharacterForAction(actionMessage: string, characters: Character[]): Character | null {
  const actionLower = actionMessage.toLowerCase();
  
  // Simple keyword matching based on character roles
  const roleKeywords = {
    'scientist': ['analyze', 'research', 'study', 'investigate', 'experiment', 'examine'],
    'doctor': ['heal', 'treat', 'diagnose', 'medicine', 'medical', 'health'],
    'engineer': ['build', 'repair', 'construct', 'design', 'technical', 'system'],
    'captain': ['command', 'order', 'lead', 'decide', 'strategy', 'mission'],
    'security': ['protect', 'defend', 'guard', 'weapon', 'attack', 'secure'],
    'diplomat': ['negotiate', 'discuss', 'talk', 'peaceful', 'agreement', 'treaty']
  };
  
  for (const character of characters) {
    const characterRole = character.role.toLowerCase();
    const keywords = roleKeywords[characterRole as keyof typeof roleKeywords] || [];
    
    if (keywords.some(keyword => actionLower.includes(keyword))) {
      return character;
    }
  }
  
  return null;
}

/**
 * Generates character-specific typing messages based on personality and role
 */
export function getCharacterTypingMessage(character: Character | null, messageMode?: 'chat' | 'action'): string {
  if (!character) {
    return messageMode === 'action' ? 'AI is processing your action...' : 'AI is thinking...';
  }
  
  const personalityLower = character.personality.toLowerCase();
  const roleLower = character.role.toLowerCase();
  
  // Character-specific typing messages based on personality traits
  const typingMessages = {
    logical: ['analyzing', 'calculating', 'processing', 'evaluating'],
    emotional: ['considering', 'reflecting', 'feeling', 'pondering'],
    analytical: ['examining', 'studying', 'investigating', 'researching'],
    practical: ['planning', 'organizing', 'preparing', 'deciding'],
    creative: ['imagining', 'envisioning', 'crafting', 'designing'],
    cautious: ['carefully considering', 'weighing options', 'assessing', 'deliberating'],
    bold: ['strategizing', 'formulating', 'planning action', 'preparing response']
  };
  
  // Role-specific action messages
  const actionMessages = {
    scientist: 'analyzing the situation',
    doctor: 'assessing the medical implications',
    engineer: 'evaluating technical solutions',
    captain: 'considering strategic options',
    security: 'reviewing security protocols',
    diplomat: 'formulating diplomatic response'
  };
  
  let selectedMessage = 'thinking';
  
  if (messageMode === 'action' && actionMessages[roleLower as keyof typeof actionMessages]) {
    selectedMessage = actionMessages[roleLower as keyof typeof actionMessages];
  } else {
    // Find personality-based message
    for (const [trait, messages] of Object.entries(typingMessages)) {
      if (personalityLower.includes(trait)) {
        selectedMessage = messages[Math.floor(Math.random() * messages.length)];
        break;
      }
    }
  }
  
  return `${character.name} is ${selectedMessage}...`;
}

/**
 * Determines if multiple characters might respond (for group scenarios)
 */
export function shouldShowMultipleCharacters(
  characters: Character[],
  recentMessages: Message[]
): boolean {
  if (characters.length <= 1) return false;
  
  // Check if multiple characters have been active recently
  const recentSpeakers = new Set();
  const recent = recentMessages.slice(-5);
  
  recent.forEach(msg => {
    if (msg.message_type === 'ai_response' && msg.character_name) {
      recentSpeakers.add(msg.character_name.toLowerCase());
    }
  });
  
  return recentSpeakers.size > 1;
}