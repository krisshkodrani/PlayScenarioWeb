
import React, { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import MessageBubble from './chat/MessageBubble';
import CharacterAvatar from './chat/CharacterAvatar';
import ProgressRing from './chat/ProgressRing';
import ChatInput from './chat/ChatInput';

interface Character {
  id: string;
  name: string;
  role: string;
  avatar_color: string;
  personality: string;
}

interface Message {
  id: string;
  sender_name: string;
  message: string;
  message_type: 'user' | 'ai';
  character_id?: string;
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

const INITIAL_MESSAGES: Message[] = [
  {
    id: "1",
    sender_name: "You",
    message: "We're receiving a distress signal from the Kobayashi Maru. Should we respond?",
    message_type: "user",
    timestamp: new Date()
  },
  {
    id: "2", 
    sender_name: "Commander Spock",
    message: "Captain, the distress signal originates from deep within the Klingon Neutral Zone. Starfleet regulations clearly prohibit unauthorized entry.",
    message_type: "ai",
    character_id: "spock",
    timestamp: new Date()
  },
  {
    id: "3",
    sender_name: "Dr. McCoy", 
    message: "Spock, there are 300 innocent people on that ship! We can't just abandon them because of some regulation.",
    message_type: "ai",
    character_id: "bones",
    timestamp: new Date()
  }
];

const AI_RESPONSES = [
  {
    character_id: "spock",
    responses: [
      "The probability of survival decreases significantly with each minute of delay, Captain.",
      "Logic dictates we should analyze all available options before proceeding.",
      "I am detecting multiple Klingon vessels in the vicinity. This complicates our situation considerably."
    ]
  },
  {
    character_id: "bones",
    responses: [
      "Dammit Jim, we're doctors, not military strategists! But we can't let people die.",
      "Every second we waste debating, those people are suffering!",
      "Sometimes you have to ignore the rules to do what's right, Captain."
    ]
  },
  {
    character_id: "scotty",
    responses: [
      "The engines can handle a quick rescue mission, but we'll be running on fumes afterward.",
      "I can give you warp 8 for maybe 20 minutes, Captain. After that, we're sitting ducks.",
      "The transporter's ready, but beaming through Klingon shields is gonna be tricky."
    ]
  }
];

const CoreChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [progressPercentage, setProgressPercentage] = useState(15);
  const [turn, setTurn] = useState(1);
  const [credits, setCredits] = useState(95);
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

  const generateAIResponses = async () => {
    setIsTyping(true);
    
    // Randomly select 1-2 characters to respond
    const numResponses = Math.random() > 0.7 ? 2 : 1;
    const respondingCharacters = CHARACTERS
      .sort(() => Math.random() - 0.5)
      .slice(0, numResponses);

    for (let i = 0; i < respondingCharacters.length; i++) {
      const character = respondingCharacters[i];
      const characterResponses = AI_RESPONSES.find(r => r.character_id === character.id);
      
      if (characterResponses) {
        await new Promise(resolve => setTimeout(resolve, 1000 + (i * 500))); // Staggered delays
        
        const randomResponse = characterResponses.responses[
          Math.floor(Math.random() * characterResponses.responses.length)
        ];
        
        const newMessage: Message = {
          id: Date.now().toString() + i,
          sender_name: character.name,
          message: randomResponse,
          message_type: "ai",
          character_id: character.id,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, newMessage]);
      }
    }
    
    setIsTyping(false);
    setProgressPercentage(prev => Math.min(prev + 5, 100));
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender_name: "You",
      message: inputValue,
      message_type: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setTurn(prev => prev + 1);
    setCredits(prev => Math.max(prev - 1, 0));

    // Generate AI responses after a short delay
    setTimeout(() => {
      generateAIResponses();
    }, 500);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-900 text-white">
      {/* Floating Progress Ring */}
      <ProgressRing percentage={progressPercentage} />
      
      {/* Chat Header */}
      <div className="bg-slate-800 border-b border-slate-700 p-4">
        <h1 className="text-lg font-semibold text-cyan-400">Kobayashi Maru Simulation</h1>
        <p className="text-sm text-slate-400">Turn {turn} • {credits} Credits</p>
      </div>
      
      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <MessageBubble 
            key={message.id}
            message={message}
            character={message.character_id ? getCharacterById(message.character_id) : undefined}
          />
        ))}
        
        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex items-center gap-3">
            <CharacterAvatar character={CHARACTERS[0]} size="sm" />
            <div className="bg-slate-800 text-slate-400 px-4 py-3 rounded-2xl rounded-bl-sm max-w-xs">
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
    </div>
  );
};

export default CoreChat;
