
import React, { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import MessageBubble from './chat/MessageBubble';
import CharacterAvatar from './chat/CharacterAvatar';
import ProgressRing from './chat/ProgressRing';
import ChatInput from './chat/ChatInput';
import ObjectiveDrawer from './chat/ObjectiveDrawer';
import { useRealtimeChat } from '@/hooks/useRealtimeChat';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

interface Character {
  id: string;
  name: string;
  role: string;
  avatar_color: string;
  personality: string;
}

const CHARACTERS: Character[] = [
  {
    id: "spock",
    name: "Commander Spock",
    role: "Science Officer", 
    avatar_color: "bg-blue-600",
    personality: "Logical, analytical"
  },
  {
    id: "bones",
    name: "Dr. McCoy",
    role: "Chief Medical Officer",
    avatar_color: "bg-green-600", 
    personality: "Emotional, humanitarian"
  },
  {
    id: "scotty",
    name: "Chief Engineer Scott",
    role: "Engineering Officer",
    avatar_color: "bg-red-600",
    personality: "Pragmatic, resourceful"
  }
];

const OBJECTIVE_DATA = [
  {
    id: "rescue-crew",
    title: "Rescue Kobayashi Maru Crew",
    description: "Attempt to save 300 civilian lives aboard the disabled vessel",
    completion_percentage: 25,
    status: "active" as const,
    priority: "critical" as const,
    hints: ["Consider diplomatic approach", "Evaluate ship capabilities", "Time is critical"],
    progress_notes: "Initial distress signal acknowledged. Multiple strategy options available."
  },
  {
    id: "avoid-war", 
    title: "Prevent Galactic Incident",
    description: "Navigate Klingon territory without triggering interstellar conflict",
    completion_percentage: 10,
    status: "active" as const,
    priority: "critical" as const, 
    hints: ["Review Federation treaties", "Consider Klingon honor code", "Diplomatic channels available"],
    progress_notes: "Entered neutral zone. Klingon patrol ships detected nearby."
  },
  {
    id: "preserve-ship",
    title: "Minimize Enterprise Damage", 
    description: "Protect your crew and vessel from destruction",
    completion_percentage: 85,
    status: "active" as const,
    priority: "normal" as const,
    hints: ["Shield optimization available", "Emergency protocols ready", "Crew safety paramount"],
    progress_notes: "Shields at optimal levels. All systems functioning normally."
  }
];

// Mock scenario ID - in a real app, this would come from routing
const SCENARIO_ID = "kobayashi-maru-scenario";

const CoreChatInner: React.FC = () => {
  const { user } = useAuth();
  const [inputValue, setInputValue] = useState('');
  const [progressPercentage, setProgressPercentage] = useState(15);
  const [credits, setCredits] = useState(95);
  const [showObjectiveDrawer, setShowObjectiveDrawer] = useState(false);
  const [objectives, setObjectives] = useState(OBJECTIVE_DATA);
  const [hasObjectiveUpdates, setHasObjectiveUpdates] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    instance,
    loading,
    error,
    isTyping,
    sendMessage
  } = useRealtimeChat({ scenarioId: SCENARIO_ID });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getCharacterById = (id: string): Character | undefined => {
    return CHARACTERS.find(char => char.id === id);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isTyping) return;

    const messageContent = inputValue;
    setInputValue('');
    
    try {
      await sendMessage(messageContent);
      setCredits(prev => Math.max(prev - 1, 0));
      setProgressPercentage(prev => Math.min(prev + 5, 100));
      
      // Simulate objective updates
      setHasObjectiveUpdates(true);
      setTimeout(() => setHasObjectiveUpdates(false), 3000);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const toggleObjectiveDrawer = () => {
    setShowObjectiveDrawer(!showObjectiveDrawer);
    if (!showObjectiveDrawer) {
      setHasObjectiveUpdates(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto mb-4"></div>
            <p className="text-slate-400">Loading conversation...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-400 mb-4">Error: {error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-cyan-400 text-slate-900 px-4 py-2 rounded-lg font-medium"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Floating Progress Ring */}
      <ProgressRing 
        percentage={progressPercentage} 
        onClick={toggleObjectiveDrawer}
        hasUpdates={hasObjectiveUpdates}
      />
      
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-slate-800/80 to-slate-700/50 backdrop-blur border-b border-slate-600 p-4">
        <h1 className="text-lg font-semibold text-cyan-400">Kobayashi Maru Simulation</h1>
        <p className="text-sm text-slate-400">
          Turn {instance?.current_turn || 0} • {credits} Credits
        </p>
      </div>
      
      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <MessageBubble 
            key={message.id}
            message={{
              id: message.id,
              sender_name: message.sender_name,
              message: message.message,
              message_type: message.message_type as 'user' | 'ai',
              timestamp: new Date(message.timestamp)
            }}
            character={message.message_type === 'ai' ? getCharacterById('spock') : undefined}
          />
        ))}
        
        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex items-center gap-3">
            <CharacterAvatar character={CHARACTERS[0]} size="sm" />
            <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 backdrop-blur border border-slate-600 text-slate-400 px-4 py-3 rounded-2xl rounded-bl-sm max-w-xs">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Message Input */}
      <ChatInput 
        value={inputValue}
        onChange={setInputValue}
        onSend={handleSendMessage}
        disabled={isTyping}
      />

      {/* Objective Drawer */}
      <ObjectiveDrawer
        isOpen={showObjectiveDrawer}
        onClose={() => setShowObjectiveDrawer(false)}
        objectives={objectives}
      />
    </div>
  );
};

const CoreChat: React.FC = () => {
  return (
    <ProtectedRoute>
      <CoreChatInner />
    </ProtectedRoute>
  );
};

export default CoreChat;
