import React, { useState, useEffect, useRef, useCallback, useLayoutEffect } from 'react';
import ChatHeader from './chat/ChatHeader';
import MessagesList from './chat/MessagesList';
import ChatInput from './chat/ChatInput';
import MessagesSkeleton from './chat/MessagesSkeleton';
import ObjectiveDrawer from './chat/ObjectiveDrawer';
import CharacterDrawer from './chat/CharacterDrawer';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useRealtimeChat } from '@/hooks/useRealtimeChat';
import { supabase } from '@/integrations/supabase/client';

// Debug mode configuration
const DEBUG_CHAT = import.meta.env.VITE_DEBUG_CHAT === '1';

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
  const [progressNotifications, setProgressNotifications] = useState<Array<{
    id: string;
    objective: string;
    change: number;
    newPercentage: number;
    status: string;
    timestamp: number;
  }>>([]);
  const [previousProgress, setPreviousProgress] = useState<Record<string, number>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [isUserNearBottom, setIsUserNearBottom] = useState(true);
  const lastMsgIdRef = useRef<string | null>(null);

  const {
    messages,
    instance,
    scenario,
    objectivesWithProgress,
    loading,
    error,
    isTyping,
    sendMessage
  } = useRealtimeChat({ instanceId, scenarioId });

  // Create synthetic opening message when scenario loads and persist until real narrator message arrives
  const messagesWithOpening = React.useMemo(() => {
    // If no scenario opening message, return messages as-is
    if (!scenario?.scenario_opening_message) {
      return messages;
    }
    const opening = scenario.scenario_opening_message || "";
    
    // Check if we already have a real opening/narrator message from backend
    const hasRealNarratorMessage = messages.some(msg => {
      const msgText = typeof (msg as any).message === 'string' ? (msg as any).message : (msg as any).message ? JSON.stringify((msg as any).message) : '';
      return (
        (msg as any).message_type === 'narration' &&
        (msg as any).id !== 'opening-synthetic' &&
        (
          msgText === opening ||
          (opening && msgText.includes(opening.substring(0, 50))) ||
          (msg as any).turn_number === 0 ||
          (msg as any).sender_name === 'Narrator'
        )
      );
    });
    
    // If we have a real narrator message from backend, return messages as-is (no synthetic needed)
    if (hasRealNarratorMessage) {
      return messages;
    }
    
    // Check if we already have a synthetic opening message in our messages
    const hasSyntheticOpening = messages.some((msg: any) => msg.id === 'opening-synthetic');
    
    // Create synthetic opening message if we don't have one and no real narrator message exists
    if (!hasSyntheticOpening) {
      const openingMessage = {
        id: 'opening-synthetic',
        sender_name: 'Narrator',
        message: opening,
        message_type: 'narration' as const,
        timestamp: new Date(Date.now() - 1000).toISOString(), // Slightly in the past to appear first
        turn_number: 0,
        sequence_number: 0
      };
      
      // Add synthetic message at the beginning, followed by other messages
      return [openingMessage as any, ...messages];
    }
    
    // Synthetic opening already exists, return messages as-is
    return messages;
  }, [messages, scenario?.scenario_opening_message]);

  // Enhanced deduplication that handles mode switches
  const dedupedMessages = React.useMemo(() => {
    const seen = new Set<string>();
    const contentSeen = new Map<string, any>(); // Track by content with metadata
    const out: any[] = [];
    
    for (const m of messagesWithOpening as any[]) {
      const text = typeof m.message === 'string' ? m.message : m?.message ? JSON.stringify(m.message) : '';
      
      // Primary key includes ID if available
      const fullKey = m.id || `${m.message_type}|${m.sender_name || m.character_name}|${text}|${m.turn_number ?? ''}|${m.sequence_number ?? ''}`;
      
      // Content key for cross-turn deduplication (especially for AI responses)
      const contentKey = `${m.message_type}|${m.sender_name || m.character_name}|${text.substring(0, 200)}`;
      
      // Check for exact duplicate
      if (seen.has(fullKey)) {
        if (DEBUG_CHAT) console.debug('[CoreChat] Dropping exact duplicate', { id: m.id, key: fullKey });
        continue;
      }
      
      // For AI responses, check content duplication across turns
      if (m.message_type === 'ai_response') {
        const existing = contentSeen.get(contentKey);
        if (existing) {
          // If same content exists with a different turn, keep the one with higher turn
          const existingTurn = existing.turn_number ?? 0;
          const currentTurn = m.turn_number ?? 0;
          
          if (currentTurn <= existingTurn) {
            if (DEBUG_CHAT) console.debug('[CoreChat] Dropping duplicate AI content from earlier/same turn', { 
              current: currentTurn, 
              existing: existingTurn,
              character: m.character_name 
            });
            continue;
          } else {
            // Remove the older one and add the newer
            const oldIndex = out.findIndex(msg => msg === existing);
            if (oldIndex >= 0) {
              out.splice(oldIndex, 1);
              if (DEBUG_CHAT) console.debug('[CoreChat] Replacing older duplicate with newer turn', {
                old: existingTurn,
                new: currentTurn,
                character: m.character_name
              });
            }
          }
        }
        contentSeen.set(contentKey, m);
      }
      
      seen.add(fullKey);
      out.push(m);
    }
    
    if (DEBUG_CHAT && messagesWithOpening.length !== out.length) {
      console.debug('[CoreChat] Deduped messages', { 
        before: messagesWithOpening.length, 
        after: out.length, 
        dropped: messagesWithOpening.length - out.length 
      });
    }
    
    return out;
  }, [messagesWithOpening]);

  // objectivesWithProgress is now provided by useRealtimeChat hook
  // This eliminates duplicate calculations and ensures consistent data flow

  // 🎯 ENHANCED: Force progress re-evaluation when AI messages arrive
  useEffect(() => {
    // Check for recent AI/narrator messages that might indicate turn completion
    const recentAIMessages = messages.filter(msg => 
      (msg.message_type === 'ai_response' || msg.message_type === 'narration') &&
      Date.now() - new Date(msg.timestamp).getTime() < 5000 // Within last 5 seconds
    );
    
    if (recentAIMessages.length > 0) {
      console.log('🎯 CoreChat: Recent AI messages detected - forcing progress check', {
        recentMessages: recentAIMessages.map(m => ({ 
          type: m.message_type, 
          sender: m.sender_name, 
          turn: m.turn_number 
        }))
      });
      
      // Add small delay to ensure instance refresh has completed
      setTimeout(() => {
        console.log('🎯 CoreChat: Triggering progress re-evaluation after AI messages');
        // Force React to re-evaluate progress by updating a dummy state
        setHasObjectiveUpdates(prev => !prev);
      }, 100);
    }
  }, [messages]); // This effect runs whenever messages change
  
  // Detect objective progress changes and show notifications - fixed dependencies
  useEffect(() => {
    console.log('🎯 CoreChat: objectivesWithProgress changed', {
      length: objectivesWithProgress.length,
      objectives: objectivesWithProgress.map(obj => ({
        id: obj.id,
        completion_percentage: obj.completion_percentage,
        status: obj.status
      }))
    });
    
    if (!objectivesWithProgress.length) {
      console.log('🎯 CoreChat: No objectives to process');
      return;
    }
    
    const newNotifications: typeof progressNotifications = [];
    const currentProgress: Record<string, number> = {};
    
    objectivesWithProgress.forEach((objective) => {
      const objKey = `objective_${objective.id}`;
      const currentPercentage = objective.completion_percentage;
      const previousPercentage = previousProgress[objKey] || 0;
      
      currentProgress[objKey] = currentPercentage;
      
      // Detect ANY progress changes (not just significant ones)
      const change = currentPercentage - previousPercentage;
      const isFirstProgress = previousPercentage === 0 && currentPercentage > 0;
      const isSignificantChange = change >= 10;
      const isAnyChange = change > 0;
      
      // Show notifications for any positive change to ensure progress is visible
      if (isAnyChange) {
        console.log('🔔 CoreChat: Creating notification for objective progress', {
          objective: objective.title,
          change,
          currentPercentage,
          previousPercentage,
          isFirstProgress,
          isSignificantChange,
          isAnyChange,
          objectiveStatus: objective.status
        });
        
        newNotifications.push({
          id: `${objKey}-${Date.now()}-${Math.random()}`, // Add randomness to prevent ID collisions
          objective: objective.title,
          change,
          newPercentage: currentPercentage,
          status: objective.status,
          timestamp: Date.now()
        });
      }
    });
    
    // Only update if there are actual changes to prevent infinite re-renders
    const progressChanged = Object.keys(currentProgress).some(key => 
      currentProgress[key] !== previousProgress[key]
    );
    
    if (progressChanged) {
      console.log('🎯 CoreChat: Progress changed detected', {
        currentProgress,
        previousProgress,
        changes: Object.keys(currentProgress).map(key => ({
          key,
          current: currentProgress[key],
          previous: previousProgress[key],
          change: currentProgress[key] - (previousProgress[key] || 0)
        }))
      });
      
      setPreviousProgress(currentProgress);
      
      if (newNotifications.length > 0) {
        console.log('🔔 CoreChat: Creating progress notifications', newNotifications);
        setProgressNotifications(prev => [...prev, ...newNotifications]);
        setHasObjectiveUpdates(true);
        
        // Auto-clear notifications after 5 seconds
        newNotifications.forEach(notification => {
          setTimeout(() => {
            setProgressNotifications(prev => prev.filter(n => n.id !== notification.id));
          }, 5000);
        });
        
        console.log('🎯 Objective progress detected:', newNotifications);
      } else {
        console.log('🎯 CoreChat: Progress changed but no significant changes for notifications');
      }
    } else {
      console.log('🎯 CoreChat: No progress changes detected');
    }
  }, [objectivesWithProgress, previousProgress]);

  // Enhanced scroll handling
  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth', force: boolean = false) => {
    if (!messagesEndRef.current) return;
    if (!force && !isUserNearBottom) return;
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior, block: 'end' });
    });
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

  // Smooth auto-scroll with instant first paint - updated to use messagesWithOpening
  const initialScrollDone = useRef(false);
  useLayoutEffect(() => {
    if (!messagesEndRef.current) return;

    // First render after load: jump to bottom without animation
    if (!initialScrollDone.current && (messagesWithOpening.length > 0)) {
      requestAnimationFrame(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'auto', block: 'end' });
        initialScrollDone.current = true;
      });
      return;
    }

    // Scroll only when a new message actually appears (avoid reacting to isTyping)
    const last = messagesWithOpening[messagesWithOpening.length - 1];
    if (last && lastMsgIdRef.current !== last.id) {
      lastMsgIdRef.current = last.id;
      if (isUserNearBottom) {
        requestAnimationFrame(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
        });
      }
    }
  }, [messagesWithOpening, isUserNearBottom]);

  // Observe container resize to keep view stuck to bottom when near bottom
  useEffect(() => {
    if (!messagesContainerRef.current) return;
    const ro = new ResizeObserver(() => {
      if (isUserNearBottom) {
        scrollToBottom('smooth');
      }
    });
    ro.observe(messagesContainerRef.current);
    return () => ro.disconnect();
  }, [isUserNearBottom, scrollToBottom]);

  // Load characters from instance data when available
  useEffect(() => {
    if (instance) {
      // Characters are now embedded in the instance
      const aiCharacters = Array.isArray(instance.ai_characters) ? instance.ai_characters : [];
      const playerChar = instance.player_character;
      
      const allCharacters: Character[] = [
        ...aiCharacters.map((char: any) => ({
          id: String(char.id || `ai_${Math.random()}`),
          name: String(char.name || 'Character'),
          role: String(char.role || 'Character'),
          avatar_color: String(char.avatar_color || 'bg-blue-600'),
          personality: String(char.personality || 'A mysterious character')
        })),
        ...(playerChar ? [{
          id: String(playerChar.id || 'player'),
          name: String(playerChar.name || 'Player'),
          role: 'Player',
          avatar_color: String(playerChar.avatar_color || 'bg-green-600'),
          personality: String(playerChar.personality || 'The player character')
        }] : [])
      ];
      
      setCharacters(allCharacters);
    }
  }, [instance]);

  // Calculate progress based on actual objective completion (not turns)
  useEffect(() => {
    if (objectivesWithProgress.length > 0) {
      // Calculate average completion percentage across all objectives
      const totalProgress = objectivesWithProgress.reduce((sum, obj) => sum + obj.completion_percentage, 0);
      const averageProgress = Math.round(totalProgress / objectivesWithProgress.length);
      setProgressPercentage(averageProgress);
    } else {
      // Fallback to 0% if no objectives are loaded yet
      setProgressPercentage(0);
    }
  }, [objectivesWithProgress]);

  const getCharacterById = (id: string): Character | undefined => {
    return characters.find(char => char.id === id);
  };

  const handleSendMessage = async () => {
    // Allow sending while AI is typing
    if (!inputValue.trim()) return;

    const prefix = chatMode === 'focused' ? 'CHAT ' : 'ACTION ';
    const messageContent = prefix + inputValue;
    setInputValue('');

    // Jump to bottom immediately so the just-sent message is visible
    scrollToBottom('auto', true);
    
    // Map focus states to message modes
    const messageMode = chatMode === 'focused' ? 'chat' : 'action';
    await sendMessage(messageContent, messageMode);

    // No extra scroll here; useLayoutEffect will handle after messages update
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

  // Loading message with patience
  const [loadingStartTime] = useState(Date.now());
  const [showPatientMessage, setShowPatientMessage] = useState(false);

  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        setShowPatientMessage(true);
      }, 10000); // Show patient message after 10 seconds
      
      return () => clearTimeout(timer);
    }
  }, [loading]);

  // After loading finishes, jump to bottom once without animation to resume like a normal chat
  useEffect(() => {
    if (!loading) {
      requestAnimationFrame(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'auto', block: 'end' });
        initialScrollDone.current = true;
        setIsUserNearBottom(true);
      });
    }
  }, [loading]);

  if (loading) {
    return (
      <div className="flex flex-col h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        {/* Header with scenario title if available */}
        <div className="sticky top-0 bg-gradient-to-r from-slate-800 to-slate-700/95 backdrop-blur-lg border-b-2 border-cyan-400/30 shadow-xl shadow-slate-900/80 p-4 z-30 min-h-[80px]">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              {scenario?.title ? (
                <h1 className="text-lg font-semibold text-cyan-400">{scenario.title}</h1>
              ) : (
                <div className="h-6 w-48 bg-slate-700/70 rounded-md animate-pulse" />
              )}
              <div className="text-sm text-slate-400 mt-1">Loading conversation...</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-slate-700/70 animate-pulse" />
              <div className="w-12 h-12 rounded-full bg-slate-700/70 animate-pulse" />
            </div>
          </div>
        </div>
        
        {/* Messages with narrator preview */}
        <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4">
          {/* Loading skeleton with better status messages */}
          <div className="mb-6">
            <div className="animate-pulse">
              <div className="bg-slate-700/30 rounded-lg p-4 max-w-4xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"></div>
                  <div className="h-5 w-20 bg-slate-600/50 rounded animate-pulse"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-slate-600/50 rounded w-full"></div>
                  <div className="h-4 bg-slate-600/50 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-600/50 rounded w-5/6"></div>
                </div>
              </div>
            </div>
            <div className="text-center text-slate-400 text-sm mt-3">
              {showPatientMessage 
                ? "Still loading... This may take a moment. Please be patient." 
                : "Loading scenario and creating opening message..."}
            </div>
          </div>
          
          {/* Skeleton for additional messages */}
          <MessagesSkeleton rows={3} />
        </div>
        
        {/* Input disabled during loading */}
        <ChatInput 
          value={inputValue}
          onChange={setInputValue}
          onSend={() => {}}
          disabled
          mode={chatMode}
          onModeToggle={() => {}}
          onModeChange={setChatMode}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900 text-white">
        <div className="text-center max-w-md">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-red-400 mb-4">Chat Initialization Failed</h2>
          <p className="text-slate-300 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-cyan-400 text-slate-900 px-6 py-3 rounded-lg font-medium hover:bg-cyan-300 transition-colors"
          >
            Refresh Page
          </button>
          
          {/* Fallback: Show initial scene if available */}
          {scenario?.scenario_opening_message && (
            <div className="mt-8 p-4 bg-slate-800 rounded-lg border border-gray-700">
              <h3 className="text-cyan-400 font-medium mb-2">Scenario Overview</h3>
              <p className="text-slate-300 text-sm">{scenario.scenario_opening_message}</p>
            </div>
          )}
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
      
      {/* Progress Notifications */}
      {progressNotifications.length > 0 && (
        <div className="fixed top-20 right-4 z-40 space-y-2">
          {progressNotifications.map((notification) => (
            <div
              key={notification.id}
              className="bg-gradient-to-r from-emerald-600 to-green-500 text-white px-4 py-3 rounded-lg shadow-lg animate-in slide-in-from-right duration-300"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <div className="font-medium text-sm">Objective Progress!</div>
              </div>
              <div className="text-sm opacity-90 mt-1">
                {notification.objective}: +{notification.change}% ({notification.newPercentage}%)
              </div>
              <div className="text-xs opacity-75 mt-1 capitalize">
                Status: {notification.status.replace(/_/g, ' ')}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Scroll Container */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto scrollbar-hide"
        onScroll={checkScrollPosition}
      >
        <MessagesList
          messages={messagesWithOpening.map((msg: any) => ({
            id: msg.id,
            sender_name: msg.sender_name,
            message: typeof msg.message === 'object' ? JSON.stringify(msg.message) : msg.message,
            message_type: msg.message_type as 'user_message' | 'ai_response' | 'system' | 'narration',
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
          typingCharacter={undefined}
          characters={characters}
          getCharacterById={getCharacterById}
          onSuggestionClick={handleSuggestionClick}
          instanceId={instanceId}
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
        onModeChange={setChatMode}
      />

      {/* Objective Drawer */}
      <ObjectiveDrawer
        isOpen={showObjectiveDrawer}
        onClose={() => setShowObjectiveDrawer(false)}
        objectives={objectivesWithProgress}
        scenarioTitle={scenario?.title}
        currentTurn={instance?.current_turn}
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
