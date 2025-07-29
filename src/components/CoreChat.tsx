
import React, { useState, useEffect, useRef, useCallback } from 'react';
import ChatHeader from './chat/ChatHeader';
import MessagesList from './chat/MessagesList';
import ChatInput from './chat/ChatInput';
import ObjectiveDrawer from './chat/ObjectiveDrawer';
import CharacterDrawer from './chat/CharacterDrawer';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useRealtimeChat } from '@/hooks/useRealtimeChat';
import { supabase } from '@/integrations/supabase/client';

interface Character {
  id: string;
  name: string;
  role: string;
  avatar_color: string;
  personality: string;
}

interface CoreChatProps {
  instanceId: string;
  scenarioId: string;
}

const CoreChatInner: React.FC<CoreChatProps> = ({ instanceId, scenarioId }) => {
  const { user } = useAuth();
  const [inputValue, setInputValue] = useState('');
  const [chatMode, setChatMode] = useState<'focused' | 'unfocused'>('unfocused');
  const [showObjectiveDrawer, setShowObjectiveDrawer] = useState(false);
  const [showCharacterDrawer, setShowCharacterDrawer] = useState(false);
  const [hasObjectiveUpdates, setHasObjectiveUpdates] = useState(false);
  const [hasCharacterUpdates, setHasCharacterUpdates] = useState(false);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [isUserNearBottom, setIsUserNearBottom] = useState(true);

  const {
    messages,
    instance,
    scenario,
    loading,
    error,
    isTyping,
    sendMessage
  } = useRealtimeChat({ instanceId, scenarioId });

  // Enhanced scroll handling
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current && isUserNearBottom) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [isUserNearBottom]);

  // Check if user is near bottom of scroll
  const checkScrollPosition = useCallback(() => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      const threshold = 100; // pixels from bottom
      const nearBottom = scrollHeight - scrollTop - clientHeight < threshold;
      setIsUserNearBottom(nearBottom);
    }
  }, []);

  // Auto-scroll on initial load
  useEffect(() => {
    if (messages.length > 0) {
      // Always scroll to bottom on initial load
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
        setIsUserNearBottom(true);
      }, 100);
    }
  }, []); // Only run once on mount

  // Auto-scroll for new messages and typing state changes
  useEffect(() => {
    if (isUserNearBottom) {
      // Small delay to ensure DOM is updated
      setTimeout(scrollToBottom, 50);
    }
  }, [messages, isTyping, scrollToBottom]);

  // Auto-scroll when typing starts
  useEffect(() => {
    if (isTyping && isUserNearBottom) {
      setTimeout(scrollToBottom, 100);
    }
  }, [isTyping, scrollToBottom]);

  // Fetch characters for this scenario
  useEffect(() => {
    const fetchCharacters = async () => {
      if (!scenarioId) return;

      try {
        const { data, error } = await supabase
          .from('scenario_characters')
          .select('*')
          .eq('scenario_id', scenarioId);

        if (error) throw error;

        const formattedCharacters = data?.map(char => ({
          id: char.id,
          name: char.name,
          role: char.role || 'Character',
          avatar_color: 'bg-blue-600', // Default color, could be randomized
          personality: char.personality
        })) || [];

        setCharacters(formattedCharacters);
      } catch (err) {
        console.error('Error fetching characters:', err);
      }
    };

    fetchCharacters();
  }, [scenarioId]);

  // Calculate progress based on current turn vs max turns
  useEffect(() => {
    if (instance && scenario?.max_turns) {
      const progress = Math.min((instance.current_turn / scenario.max_turns) * 100, 100);
      setProgressPercentage(progress);
    }
  }, [instance, scenario]);

  const getCharacterById = (id: string): Character | undefined => {
    return characters.find(char => char.id === id);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isTyping) return;

    // Add prefix based on mode
    const prefix = chatMode === 'focused' ? 'CHAT ' : 'ACTION ';
    const messageContent = prefix + inputValue;
    setInputValue('');
    
    // Map focus states to message modes
    const messageMode = chatMode === 'focused' ? 'chat' : 'action';
    await sendMessage(messageContent, messageMode);
  };

  const toggleMode = () => {
    setChatMode(prev => prev === 'focused' ? 'unfocused' : 'focused');
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  const toggleObjectiveDrawer = () => {
    setShowObjectiveDrawer(!showObjectiveDrawer);
    if (showCharacterDrawer) {
      setShowCharacterDrawer(false);
    }
    if (!showObjectiveDrawer) {
      setHasObjectiveUpdates(false);
    }
  };

  const toggleCharacterDrawer = () => {
    setShowCharacterDrawer(!showCharacterDrawer);
    if (showObjectiveDrawer) {
      setShowObjectiveDrawer(false);
    }
    if (!showCharacterDrawer) {
      setHasCharacterUpdates(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading scenario...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900 text-white">
        <div className="text-center">
          <p className="text-red-400 mb-4">Error: {error}</p>
          <p className="text-slate-300">Unable to load scenario chat</p>
        </div>
      </div>
    );
  }

  if (!scenario || !instance) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900 text-white">
        <div className="text-center">
          <p className="text-slate-300">Scenario or instance not found</p>
        </div>
      </div>
    );
  }

  // Transform objectives for the drawer
  const objectives = scenario.objectives?.map((obj: any, index: number) => ({
    id: obj.id || `objective-${index}`,
    title: obj.description || obj.title || 'Objective',
    description: obj.description || obj.title || 'Complete this objective',
    completion_percentage: 0, // This would need to be calculated based on progress
    status: 'active' as const,
    priority: obj.priority || 'normal' as const,
    hints: [],
    progress_notes: 'In progress...'
  })) || [];

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <ChatHeader
        scenarioTitle={scenario.title}
        currentTurn={instance.current_turn}
        maxTurns={scenario.max_turns || 20}
        progressPercentage={progressPercentage}
        hasObjectiveUpdates={hasObjectiveUpdates}
        hasCharacterUpdates={hasCharacterUpdates}
        onToggleObjectiveDrawer={toggleObjectiveDrawer}
        onToggleCharacterDrawer={toggleCharacterDrawer}
      />
      
      {/* Message List */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-hidden"
        onScroll={checkScrollPosition}
      >
        <MessagesList
          messages={messages.map(msg => ({
            id: msg.id,
            sender_name: msg.sender_name,
            message: msg.message,
            message_type: msg.message_type as 'user_message' | 'ai_response' | 'system',
            timestamp: new Date(msg.timestamp),
            mode: msg.mode,
            character_name: msg.character_name,
            response_type: msg.response_type,
            internal_state: msg.internal_state,
            suggested_follow_ups: msg.suggested_follow_ups,
            metrics: msg.metrics,
            flags: msg.flags
          }))}
          isTyping={isTyping}
          typingCharacter={characters[0] || {
            id: 'default',
            name: 'Assistant',
            role: 'AI Assistant',
            avatar_color: 'bg-blue-600',
            personality: 'Helpful'
          }}
          characters={characters}
          getCharacterById={getCharacterById}
          onSuggestionClick={handleSuggestionClick}
        />
        <div ref={messagesEndRef} />
      </div>
      
      {/* Message Input */}
      <ChatInput 
        value={inputValue}
        onChange={setInputValue}
        onSend={handleSendMessage}
        disabled={isTyping}
        mode={chatMode}
        onModeToggle={toggleMode}
      />

      {/* Objective Drawer */}
      <ObjectiveDrawer
        isOpen={showObjectiveDrawer}
        onClose={() => setShowObjectiveDrawer(false)}
        objectives={objectives}
      />

      {/* Character Drawer */}
      <CharacterDrawer
        isOpen={showCharacterDrawer}
        onClose={() => setShowCharacterDrawer(false)}
        characters={characters}
      />
    </div>
  );
};

const CoreChat: React.FC<CoreChatProps> = ({ instanceId, scenarioId }) => {
  return (
    <ProtectedRoute>
      <CoreChatInner instanceId={instanceId} scenarioId={scenarioId} />
    </ProtectedRoute>
  );
};

export default CoreChat;
