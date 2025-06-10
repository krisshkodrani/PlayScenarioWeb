
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  Target, 
  Send, 
  Zap, 
  Clock, 
  Users,
  ThumbsUp,
  ThumbsDown 
} from 'lucide-react';

interface Message {
  id: string;
  speaker: string;
  content: string;
  timestamp: string;
  type: 'user' | 'ai';
  characterId?: string;
}

interface Character {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: 'active' | 'inactive';
}

const GameplayDemo = () => {
  const [selectedCharacter, setSelectedCharacter] = useState<string>('char1');
  const [messageInput, setMessageInput] = useState('');

  const scenario = {
    title: "The AI Ethics Committee",
    objective: "Investigate the autonomous system malfunction and determine responsible parties",
    currentTurn: 3,
    maxTurns: 10,
    creditsRemaining: 47
  };

  const characters: Character[] = [
    { id: 'char1', name: 'Dr. Chen', role: 'AI Safety Lead', avatar: 'DC', status: 'active' },
    { id: 'char2', name: 'Marcus', role: 'System Engineer', avatar: 'MS', status: 'active' },
    { id: 'char3', name: 'ARIA', role: 'AI Assistant', avatar: 'AI', status: 'active' },
    { id: 'char4', name: 'Prof. Kumar', role: 'Ethics Advisor', avatar: 'PK', status: 'inactive' }
  ];

  const messages: Message[] = [
    {
      id: '1',
      speaker: 'Dr. Chen',
      content: "The autonomous traffic system experienced a critical failure at 14:30. Three vehicles were affected, though thankfully no injuries occurred.",
      timestamp: '2 min ago',
      type: 'ai',
      characterId: 'char1'
    },
    {
      id: '2',
      speaker: 'You',
      content: "What specific safeguards failed? I need to understand the sequence of events.",
      timestamp: '1 min ago',
      type: 'user'
    },
    {
      id: '3',
      speaker: 'Marcus',
      content: "The redundant safety checks were bypassed. Someone modified the core decision matrix without proper authorization.",
      timestamp: '30 sec ago',
      type: 'ai',
      characterId: 'char2'
    }
  ];

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      console.log(`Sending to ${selectedCharacter}: ${messageInput}`);
      setMessageInput('');
    }
  };

  const getCharacterColor = (characterId: string) => {
    const colors = {
      'char1': 'text-primary',
      'char2': 'text-secondary', 
      'char3': 'text-accent',
      'char4': 'text-green-400'
    };
    return colors[characterId] || 'text-primary';
  };

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Header with Objective and Status */}
      <div className="border-b border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Objective */}
            <div className="flex items-center space-x-3 objective-highlight rounded-lg px-4 py-2">
              <Target className="w-5 h-5 text-accent" />
              <div>
                <div className="font-semibold text-accent text-sm uppercase tracking-wider">Objective</div>
                <div className="text-sm text-foreground">{scenario.objective}</div>
              </div>
            </div>
            
            {/* Status Indicators */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">
                  Turn <span className="text-primary font-medium">{scenario.currentTurn}</span> of {scenario.maxTurns}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-accent" />
                <span className={`text-sm font-medium ${scenario.creditsRemaining < 20 ? 'resource-warning' : 'credit-meter'}`}>
                  {scenario.creditsRemaining} Credits
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-secondary" />
                <span className="text-sm">{characters.filter(c => c.status === 'active').length} Active</span>
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <Progress 
              value={(scenario.currentTurn / scenario.maxTurns) * 100} 
              className="h-2 bg-muted"
            />
          </div>
        </div>
      </div>

      {/* Main Gameplay Area */}
      <div className="flex-1 flex">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="text-center py-4">
              <Badge variant="secondary" className="px-4 py-2">
                {scenario.title}
              </Badge>
            </div>
            
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} message-enter`}
              >
                <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                  {message.type === 'ai' && (
                    <div className="flex items-center space-x-2 mb-2">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className={`text-xs ${getCharacterColor(message.characterId!)}`}>
                          {characters.find(c => c.id === message.characterId)?.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <span className={`text-sm font-medium ${getCharacterColor(message.characterId!)}`}>
                        {message.speaker}
                      </span>
                      <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                    </div>
                  )}
                  
                  <Card className={`${
                    message.type === 'user' 
                      ? 'bg-primary/20 border-primary/30' 
                      : 'bg-card border-border/50'
                  }`}>
                    <CardContent className="p-4">
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      
                      {message.type === 'ai' && (
                        <div className="flex items-center justify-end space-x-2 mt-3 pt-2 border-t border-border/30">
                          <Button variant="ghost" size="sm" className="h-6 px-2 hover:bg-green-500/20">
                            <ThumbsUp className="w-3 h-3" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-6 px-2 hover:bg-red-500/20">
                            <ThumbsDown className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  {message.type === 'user' && (
                    <div className="text-right mt-1">
                      <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            <div className="flex justify-start">
              <div className="bg-card border border-border/50 rounded-lg px-4 py-3">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-primary rounded-full typing-dots"></div>
                    <div className="w-2 h-2 bg-primary rounded-full typing-dots" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-2 h-2 bg-primary rounded-full typing-dots" style={{animationDelay: '0.4s'}}></div>
                  </div>
                  <span className="text-xs text-muted-foreground">ARIA is thinking...</span>
                </div>
              </div>
            </div>
          </div>

          {/* Character Selection Bar */}
          <div className="border-t border-border/50 bg-card/30 p-4">
            <div className="flex items-center space-x-4 mb-4">
              <span className="text-sm font-medium text-muted-foreground">Speaking to:</span>
              <div className="flex space-x-2">
                {characters.map((character) => (
                  <Button
                    key={character.id}
                    variant={selectedCharacter === character.id ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setSelectedCharacter(character.id)}
                    className={`npc-avatar ${selectedCharacter === character.id ? 'active' : ''}`}
                    disabled={character.status === 'inactive'}
                  >
                    <Avatar className="w-6 h-6 mr-2">
                      <AvatarFallback className={`text-xs ${getCharacterColor(character.id)}`}>
                        {character.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-left">
                      <div className="text-xs font-medium">{character.name}</div>
                      <div className="text-xs text-muted-foreground">{character.role}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
            
            {/* Message Input */}
            <div className="flex space-x-2">
              <Input
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder={`Ask ${characters.find(c => c.id === selectedCharacter)?.name} something...`}
                className="flex-1 bg-input border-border/50 focus:border-primary/50"
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Button 
                onClick={handleSendMessage}
                className="glow-primary"
                disabled={!messageInput.trim()}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameplayDemo;
