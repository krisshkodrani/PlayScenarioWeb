import React, { useState, useEffect, useRef, useCallback, useLayoutEffect, useMemo } from 'react';
import ChatHeader from './chat/ChatHeader';
import MessagesList from './chat/MessagesList';
import ChatInput from './chat/ChatInput';
import MessagesSkeleton from './chat/MessagesSkeleton';
import ObjectiveDrawer from './chat/ObjectiveDrawer';
import CharacterDrawer from './chat/CharacterDrawer';
import StreamingDebugInfo from './chat/StreamingDebugInfo';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useRealtimeChat } from '@/hooks/useRealtimeChat';
import { useUnifiedScroll } from '@/hooks/useUnifiedScroll';
import { supabase } from '@/integrations/supabase/client';

// Debug mode configuration
const DEBUG_CHAT = import.meta.env.VITE_DEBUG_CHAT === '1';

interface Character {
  id: string;
  name: string;
  role: string;
  avatar_color: string;
  personality: string;
  avatar_url?: string; // Avatar image URL
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
  const [streamingQueueLength, setStreamingQueueLength] = useState(0);
  const [isAnyStreaming, setIsAnyStreaming] = useState(false);

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

  // Step 1: Deterministic message pipeline
  type Msg = any;
  const processMessages = useCallback((raw: Msg[], scen?: any): Msg[] => {
    const list: Msg[] = [];
    const map = new Map<string, Msg>();

    const hasTurn0Narration = raw.some((m: Msg) => m?.message_type === 'narration' && (m?.turn_number ?? -1) === 0);

    if (scen?.scenario_opening_message && !hasTurn0Narration) {
      const openingMessage: Msg = {
        id: 'opening-synthetic',
        sender_name: 'Narrator',
        message: scen.scenario_opening_message,
        message_type: 'narration',
        timestamp: new Date(0).toISOString(), // earliest
        turn_number: 0,
        sequence_number: 0
      };
      const key = openingMessage.id || `${openingMessage.turn_number}-${openingMessage.sequence_number}-Narrator`;
      map.set(key, openingMessage);
    }

    for (const m of raw) {
      const key = m.id || `${m.turn_number ?? ''}-${m.sequence_number ?? ''}-${m.sender_name ?? ''}`;
      if (!map.has(key)) {
        map.set(key, m);
      }
    }

    map.forEach((v) => list.push(v));

    list.sort((a, b) => {
      const tn = (a.turn_number ?? 0) - (b.turn_number ?? 0);
      if (tn !== 0) return tn;
      // Treat missing sequence_number as +Infinity so optimistic items render last within a turn
      const snA = (a.sequence_number === undefined || a.sequence_number === null) ? Number.POSITIVE_INFINITY : a.sequence_number;
      const snB = (b.sequence_number === undefined || b.sequence_number === null) ? Number.POSITIVE_INFINITY : b.sequence_number;
      const sn = (snA as number) - (snB as number);
      if (sn !== 0) return sn;
      // Robust timestamp fallback: missing/invalid timestamps go last
      const ta = isNaN(new Date(a.timestamp).getTime()) ? Number.MAX_SAFE_INTEGER : new Date(a.timestamp).getTime();
      const tb = isNaN(new Date(b.timestamp).getTime()) ? Number.MAX_SAFE_INTEGER : new Date(b.timestamp).getTime();
      return ta - tb;
    });

    return list;
  }, []);

  const processedMessages = useMemo(() => processMessages(messages as any[], scenario), [messages, scenario, processMessages]);

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

  // Update header progress ring based on objectives progress
  useEffect(() => {
    const count = objectivesWithProgress?.length ?? 0;
    if (!count) {
      setProgressPercentage(0);
      return;
    }
    const avg = objectivesWithProgress.reduce((sum: number, obj: any) => {
      const pct = typeof obj?.completion_percentage === 'number'
        ? obj.completion_percentage
        : (typeof obj?.progress_percentage === 'number' ? obj.progress_percentage : 0);
      return sum + pct;
    }, 0) / count;
    setProgressPercentage(Math.round(avg));
  }, [objectivesWithProgress]);

  // Unified scroll hook
  const { containerRef, handleScroll, scrollToBottom, isAutoScrollEnabled, isNearBottom } = useUnifiedScroll(32);
  const lastMsgIdRef = useRef<string | null>(null);
  const initialScrollDone = useRef(false);

  useLayoutEffect(() => {
    // First paint to bottom without animation once loading completes and messages ready
    if (!initialScrollDone.current && !loading && processedMessages.length > 0) {
      scrollToBottom(true, 'auto' as any);
      initialScrollDone.current = true;
      return;
    }

    const last = processedMessages[processedMessages.length - 1];
    if (!last) return;
    const changed = lastMsgIdRef.current !== last.id;
    if (changed) {
      lastMsgIdRef.current = last.id;
    }

    // Only auto-scroll on new message if user is near bottom right now
    if (changed && (isAutoScrollEnabled || isNearBottom())) {
      scrollToBottom(false, 'smooth' as any);
    }
  }, [processedMessages, isAutoScrollEnabled, isNearBottom, loading, scrollToBottom]);

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
          personality: String(char.personality || 'A mysterious character'),
          avatar_url: char.avatar_url
        })),
        ...(playerChar ? [{
          id: String(playerChar.id || 'player'),
          name: String(playerChar.name || 'Player'),
          role: 'Player',
          avatar_color: String(playerChar.avatar_color || 'bg-green-600'),
          personality: String(playerChar.personality || 'The player character'),
          avatar_url: playerChar.avatar_url
        }] : [])
      ];
      setCharacters(allCharacters);
    }
  }, [instance]);

  const getCharacterById = (id: string): Character | undefined => {
    return characters.find(char => char.id === id);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    const prefix = chatMode === 'focused' ? 'CHAT ' : 'ACTION ';
    const messageContent = prefix + inputValue;
    setInputValue('');
    // Only auto-scroll if the user was near the bottom at send time
    if (isAutoScrollEnabled || isNearBottom()) {
      scrollToBottom(true, 'auto' as any);
    }
    const messageMode = chatMode === 'focused' ? 'chat' : 'action';
    await sendMessage(messageContent, messageMode);
  };

  const toggleMode = () => {
    setChatMode(prev => prev === 'focused' ? 'unfocused' : 'focused');
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  const handleQueueChange = useCallback((queueLength: number, streaming: boolean) => {
    setStreamingQueueLength(queueLength);
    setIsAnyStreaming(streaming);
    // Do not force scrolling here; respect user manual scroll state
  }, []);

  // Toggle global streaming class for motion reduction (delay to allow indicator fade-out)
  useEffect(() => {
    let timer: number | undefined;
    if (isAnyStreaming) {
      timer = window.setTimeout(() => {
        document.body.classList.add('is-streaming');
      }, 300); // allow waiting pill to fade out smoothly
    } else {
      document.body.classList.remove('is-streaming');
    }
    return () => {
      if (timer) window.clearTimeout(timer);
      document.body.classList.remove('is-streaming');
    };
  }, [isAnyStreaming]);

  // Derived awaiting state: locked input but no streaming yet
  const isAwaitingResponse = isTyping && !isAnyStreaming;
  const [showWaitingIndicator, setShowWaitingIndicator] = useState(false);
  useEffect(() => {
    if (isAwaitingResponse) {
      setShowWaitingIndicator(true);
      return;
    }
    const t = setTimeout(() => setShowWaitingIndicator(false), 250); // allow fade-out
    return () => clearTimeout(t);
  }, [isAwaitingResponse]);

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
        scrollToBottom(true, 'auto' as any);
        initialScrollDone.current = true;
      });
    }
  }, [loading, scrollToBottom]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900 text-white">
        <div className="text-center">
          <p className="text-slate-400 text-sm tracking-wide">connecting...</p>
        </div>
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
    <div className="flex flex-col h-screen bg-slate-900 text-white">
      {/* Header */}
      <ChatHeader
        scenarioTitle={scenario.title}
        currentTurn={instance.current_turn}
        maxTurns={scenario.max_turns || 20}
        progressPercentage={progressPercentage}
        hasObjectiveUpdates={hasObjectiveUpdates}
        hasCharacterUpdates={hasCharacterUpdates}
        onToggleObjectiveDrawer={() => { setShowObjectiveDrawer(v => !v); if (!showObjectiveDrawer) setHasObjectiveUpdates(false); }}
        onToggleCharacterDrawer={() => { setShowCharacterDrawer(v => !v); if (!showCharacterDrawer) setHasCharacterUpdates(false); }}
      />

      {/* Progress Notifications */}
      {progressNotifications.length > 0 && (
        <div className="fixed top-20 right-4 z-40 space-y-2">
          {progressNotifications.map((notification) => (
            <div
              key={notification.id}
              className="bg-slate-800/90 border border-slate-700 text-slate-200 px-3 py-2 rounded-md shadow-md"
            >
              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-slate-300 animate-pulse" />
                <div className="font-medium text-xs">Objective progress</div>
              </div>
              <div className="text-xs opacity-80 mt-1">
                {notification.objective}: +{notification.change}% ({notification.newPercentage}%)
              </div>
              <div className="text-[10px] opacity-60 mt-1 capitalize">
                Status: {notification.status.replace(/_/g, ' ')}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Scroll Container */}
      <div ref={containerRef} className="flex-1 overflow-y-auto scrollbar-smooth streaming-container" onScroll={handleScroll}>
        <div className="mx-auto w-full max-w-5xl xl:max-w-6xl px-4 md:px-6 py-6">
          <MessagesList
            messages={(processedMessages as any[]).map((msg: any) => ({
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
              flags: msg.flags,
              streamed: msg.streamed,
              turn_number: msg.turn_number,
              sequence_number: msg.sequence_number
            }))}
            isTyping={isTyping}
            typingCharacter={undefined}
            characters={characters}
            getCharacterById={getCharacterById}
            onSuggestionClick={handleSuggestionClick}
            onQueueChange={handleQueueChange}
            instanceId={instanceId}
          />
        </div>
      </div>

      {/* Awaiting response indicator (centered; smooth fade/slide) */}
      {showWaitingIndicator && (
        <div
          className={`fixed left-1/2 -translate-x-1/2 bottom-24 z-40 pointer-events-none transition-all duration-200 allow-animations ${
            isAwaitingResponse ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'
          }`}
          role="status"
          aria-live="polite"
        >
          <div className="backdrop-blur bg-slate-800/70 border border-slate-700/60 text-slate-300 px-3 py-1.5 rounded-full shadow-md">
            <div className="flex items-center gap-2">
              <span className="text-xs">Waiting for response</span>
              <span className="flex items-center gap-1" aria-hidden="true">
                <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></span>
                <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></span>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Message Input */}
      <ChatInput 
        value={inputValue}
        onChange={setInputValue}
        onSend={handleSendMessage}
        disabled={isTyping}
        mode={chatMode}
        onModeToggle={() => setChatMode(prev => prev === 'focused' ? 'unfocused' : 'focused')}
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

      {/* Debug Info */}
      <StreamingDebugInfo 
        messages={processedMessages as any}
        show={DEBUG_CHAT}
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
