
import React, { useState, useEffect, useRef } from 'react';
import ChatHeader from './chat/ChatHeader';
import MessagesList from './chat/MessagesList';
import ChatInput from './chat/ChatInput';
import ObjectiveDrawer from './chat/ObjectiveDrawer';
import CharacterDrawer from './chat/CharacterDrawer';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

interface Character {
  id: string;
  name: string;
  role: string;
  avatar_color: string;
  personality: string;
}

interface MockMessage {
  id: string;
  sender_name: string;
  message: string;
  message_type: 'user' | 'ai';
  timestamp: Date;
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

// Mock conversation data
const MOCK_MESSAGES: MockMessage[] = [
  {
    id: "1",
    sender_name: "Commander Spock",
    message: "Captain, we are receiving a distress signal from the Kobayashi Maru. The vessel appears to be disabled in the Klingon Neutral Zone. Logic dictates we must consider our options carefully.",
    message_type: "ai",
    timestamp: new Date(Date.now() - 300000) // 5 minutes ago
  },
  {
    id: "2", 
    sender_name: "You",
    message: "What's the tactical situation, Spock? How many Klingon ships are in the area?",
    message_type: "user",
    timestamp: new Date(Date.now() - 240000) // 4 minutes ago
  },
  {
    id: "3",
    sender_name: "Commander Spock", 
    message: "Sensors detect three Klingon D7 battle cruisers patrolling the sector. Their weaponry is sufficient to destroy both the Enterprise and the disabled vessel. However, I calculate a 23.7% probability of successful rescue if we approach from the asteroid field to mask our sensor signature.",
    message_type: "ai",
    timestamp: new Date(Date.now() - 180000) // 3 minutes ago
  }
];

const CoreChatInner: React.FC = () => {
  const { user } = useAuth();
  const [inputValue, setInputValue] = useState('');
  const [progressPercentage, setProgressPercentage] = useState(15);
  const [showObjectiveDrawer, setShowObjectiveDrawer] = useState(false);
  const [showCharacterDrawer, setShowCharacterDrawer] = useState(false);
  const [objectives, setObjectives] = useState(OBJECTIVE_DATA);
  const [hasObjectiveUpdates, setHasObjectiveUpdates] = useState(false);
  const [hasCharacterUpdates, setHasCharacterUpdates] = useState(false);
  const [messages, setMessages] = useState<MockMessage[]>(MOCK_MESSAGES);
  const [currentTurn, setCurrentTurn] = useState(3);
  const [maxTurns] = useState(10);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
    
    // Add user message
    const userMessage: MockMessage = {
      id: Date.now().toString(),
      sender_name: "You", 
      message: messageContent,
      message_type: "user",
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setCurrentTurn(prev => prev + 1);
    
    // Simulate AI response
    setIsTyping(true);
    setTimeout(() => {
      const aiMessage: MockMessage = {
        id: (Date.now() + 1).toString(),
        sender_name: "Commander Spock",
        message: "Fascinating. Your strategic thinking demonstrates both courage and prudence. I shall analyze the implications of this approach and provide tactical recommendations.",
        message_type: "ai", 
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
      setProgressPercentage(prev => Math.min(prev + 5, 100));
      
      // Simulate objective updates
      setHasObjectiveUpdates(true);
      setTimeout(() => setHasObjectiveUpdates(false), 3000);
    }, 2000);
  };

  const toggleObjectiveDrawer = () => {
    setShowObjectiveDrawer(!showObjectiveDrawer);
    // Close character drawer if it's open
    if (showCharacterDrawer) {
      setShowCharacterDrawer(false);
    }
    if (!showObjectiveDrawer) {
      setHasObjectiveUpdates(false);
    }
  };

  const toggleCharacterDrawer = () => {
    setShowCharacterDrawer(!showCharacterDrawer);
    // Close objective drawer if it's open
    if (showObjectiveDrawer) {
      setShowObjectiveDrawer(false);
    }
    if (!showCharacterDrawer) {
      setHasCharacterUpdates(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <ChatHeader
        scenarioTitle="Kobayashi Maru Simulation"
        currentTurn={currentTurn}
        maxTurns={maxTurns}
        progressPercentage={progressPercentage}
        hasObjectiveUpdates={hasObjectiveUpdates}
        hasCharacterUpdates={hasCharacterUpdates}
        onToggleObjectiveDrawer={toggleObjectiveDrawer}
        onToggleCharacterDrawer={toggleCharacterDrawer}
      />
      
      {/* Message List */}
      <MessagesList
        messages={messages}
        isTyping={isTyping}
        typingCharacter={CHARACTERS[0]}
        getCharacterById={getCharacterById}
      />
      
      <div ref={messagesEndRef} />
      
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

      {/* Character Drawer */}
      <CharacterDrawer
        isOpen={showCharacterDrawer}
        onClose={() => setShowCharacterDrawer(false)}
        characters={CHARACTERS}
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
