
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
  ThumbsDown,
  AlertTriangle,
  Shield,
  Settings
} from 'lucide-react';

interface Message {
  id: string;
  speaker: string;
  content: string;
  timestamp: string;
  type: 'user' | 'ai' | 'system';
  characterId?: string;
  stressLevel?: 'low' | 'medium' | 'high';
}

interface Character {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: 'active' | 'inactive';
  expertise: string[];
  emotionalState: string;
  accentColor: string;
}

interface Objective {
  id: string;
  title: string;
  description: string;
  progress: number;
  priority: 'primary' | 'secondary';
  estimatedTime: string;
  status: 'active' | 'completed' | 'blocked';
}

const GameplayInterface = () => {
  const [selectedCharacter, setSelectedCharacter] = useState<string>('sarah');
  const [messageInput, setMessageInput] = useState('');

  const scenario = {
    title: "Data Breach Response Protocol",
    setting: "TechCorp Industries - IT Security Center",
    userRole: "Chief Information Security Officer",
    currentTurn: 5,
    maxTurns: 10,
    creditsRemaining: 87,
    timeElapsed: "45 minutes",
    severityLevel: "CRITICAL"
  };

  const characters: Character[] = [
    { 
      id: 'sarah', 
      name: 'Sarah Chen', 
      role: 'Security Analyst', 
      avatar: 'SC', 
      status: 'active',
      expertise: ['Threat Analysis', 'Compliance', 'Forensics'],
      emotionalState: 'Stressed',
      accentColor: 'text-purple-400'
    },
    { 
      id: 'marcus', 
      name: 'Marcus Rodriguez', 
      role: 'CEO', 
      avatar: 'MR', 
      status: 'active',
      expertise: ['Executive Decision', 'Public Relations', 'Legal Coordination'],
      emotionalState: 'Pressured',
      accentColor: 'text-amber-400'
    },
    { 
      id: 'alex', 
      name: 'Alex Kim', 
      role: 'Network Administrator', 
      avatar: 'AK', 
      status: 'active',
      expertise: ['Network Security', 'System Administration', 'Incident Response'],
      emotionalState: 'Focused',
      accentColor: 'text-blue-400'
    }
  ];

  const objectives: Objective[] = [
    {
      id: 'contain',
      title: 'Contain Security Breach',
      description: 'Prevent further unauthorized data access and isolate compromised systems',
      progress: 75,
      priority: 'primary',
      estimatedTime: '15 min remaining',
      status: 'active'
    },
    {
      id: 'assess',
      title: 'Assess Data Exposure',
      description: 'Determine scope of compromised customer data and prepare notifications',
      progress: 60,
      priority: 'primary',
      estimatedTime: '30 min remaining',
      status: 'active'
    },
    {
      id: 'operations',
      title: 'Maintain Operations',
      description: 'Balance security measures with business continuity requirements',
      progress: 40,
      priority: 'primary',
      estimatedTime: '2 hours remaining',
      status: 'active'
    }
  ];

  const messages: Message[] = [
    {
      id: 'system-1',
      speaker: 'System Alert',
      content: "Emergency alarms echo through TechCorp's IT security center. Multiple breach alerts flash across monitoring screens as your team discovers unauthorized access to customer databases containing personal information for over 50,000 users.",
      timestamp: '45 min ago',
      type: 'system'
    },
    {
      id: 'user-1',
      speaker: 'You',
      content: "Sarah, I need an immediate assessment of the breach scope. Marcus, prepare for emergency board notification. Alex, start isolation procedures for all affected systems.",
      timestamp: '44 min ago',
      type: 'user'
    },
    {
      id: 'sarah-1',
      speaker: 'Sarah Chen',
      content: "Sir, the breach appears sophisticated. I'm detecting multi-vector attacks through our email gateway and VPN endpoints. Initial analysis suggests they've had access for approximately 72 hours. Customer payment data and personal identifiers are definitely compromised.",
      timestamp: '43 min ago',
      type: 'ai',
      characterId: 'sarah',
      stressLevel: 'high'
    },
    {
      id: 'marcus-1',
      speaker: 'Marcus Rodriguez',
      content: "This is catastrophic for our reputation. We need immediate damage control. What's our legal exposure here? I want a full briefing ready for the board in thirty minutes, and we need to consider public disclosure requirements.",
      timestamp: '42 min ago',
      type: 'ai',
      characterId: 'marcus',
      stressLevel: 'high'
    },
    {
      id: 'alex-1',
      speaker: 'Alex Kim',
      content: "I've isolated the affected database servers and implemented emergency firewall rules. However, the attackers used legitimate admin credentials, suggesting either insider threat or credential theft. I need authorization to shut down all external access while we investigate.",
      timestamp: '40 min ago',
      type: 'ai',
      characterId: 'alex',
      stressLevel: 'medium'
    },
    {
      id: 'user-2',
      speaker: 'You',
      content: "Alex, implement controlled shutdown of external systems but maintain critical operations for existing customers. Sarah, coordinate with legal on breach notification requirements. Marcus, we brief the board honestly but emphasize our rapid response capabilities.",
      timestamp: '38 min ago',
      type: 'user'
    },
    {
      id: 'sarah-2',
      speaker: 'Sarah Chen',
      content: "Legal confirms we have 72 hours for public notification under state regulations, but major clients should be informed immediately. The attack signature matches known APT groups, suggesting state-sponsored activity. This complicates our response significantly.",
      timestamp: '35 min ago',
      type: 'ai',
      characterId: 'sarah',
      stressLevel: 'high'
    },
    {
      id: 'marcus-2',
      speaker: 'Marcus Rodriguez',
      content: "State-sponsored? That changes everything. We need federal coordination immediately. Our stock price will tank when this goes public. What's our timeline for full system recovery and verification that the threat is eliminated?",
      timestamp: '33 min ago',
      type: 'ai',
      characterId: 'marcus',
      stressLevel: 'high'
    },
    {
      id: 'alex-2',
      speaker: 'Alex Kim',
      content: "I've completed the isolation procedures. Preliminary forensics show approximately 847 customer records accessed, but full extraction is unclear. Recovery timeline depends on whether we rebuild affected systems from scratch or attempt cleaning. Scratch rebuild guarantees security but requires 48-72 hours minimum.",
      timestamp: '30 min ago',
      type: 'ai',
      characterId: 'alex',
      stressLevel: 'medium'
    },
    {
      id: 'user-3',
      speaker: 'You',
      content: "We proceed with complete system rebuild for security assurance. Sarah, prepare customer notification templates emphasizing security measures. Marcus, I recommend proactive media engagement highlighting our rapid response rather than waiting for story leaks.",
      timestamp: '28 min ago',
      type: 'user'
    }
  ];

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      console.log(`Sending to ${selectedCharacter}: ${messageInput}`);
      setMessageInput('');
    }
  };

  const getCharacterAccentColor = (characterId: string) => {
    const character = characters.find(c => c.id === characterId);
    return character?.accentColor || 'text-primary';
  };

  const getStressIndicator = (stressLevel?: string) => {
    switch (stressLevel) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-amber-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-primary';
    }
  };

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Crisis Header */}
      <div className="border-b border-border/50 bg-card/30 backdrop-blur-sm relative">
        {/* Emergency lighting effect */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500/0 via-red-500/50 to-red-500/0 animate-pulse"></div>
        
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Scenario Info */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3 objective-highlight rounded-lg px-4 py-2">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <div>
                  <div className="font-semibold text-red-400 text-sm uppercase tracking-wider">
                    {scenario.severityLevel} INCIDENT
                  </div>
                  <div className="text-sm text-foreground">{scenario.title}</div>
                  <div className="text-xs text-muted-foreground">
                    Role: {scenario.userRole}
                  </div>
                </div>
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
                <span className="text-sm font-medium credit-meter">
                  {scenario.creditsRemaining} Credits
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-amber-400" />
                <span className="text-sm text-amber-400">Active Crisis</span>
              </div>
            </div>
          </div>
          
          {/* Crisis Progress */}
          <div className="mt-4">
            <div className="text-xs text-muted-foreground mb-2">
              Incident Duration: {scenario.timeElapsed}
            </div>
            <Progress 
              value={(scenario.currentTurn / scenario.maxTurns) * 100} 
              className="h-2 bg-muted"
            />
          </div>
        </div>
      </div>

      {/* Main Interface */}
      <div className="flex-1 flex">
        {/* Conversation Area */}
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} message-enter`}
              >
                <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                  {message.type === 'system' && (
                    <div className="text-center py-4">
                      <Card className="bg-amber-500/10 border-amber-500/30">
                        <CardContent className="p-4">
                          <p className="text-sm italic text-amber-200 leading-relaxed">
                            {message.content}
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {message.type === 'ai' && (
                    <>
                      <div className="flex items-center space-x-2 mb-2">
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className={`text-xs ${getCharacterAccentColor(message.characterId!)}`}>
                            {characters.find(c => c.id === message.characterId)?.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <span className={`text-sm font-medium ${getCharacterAccentColor(message.characterId!)}`}>
                          {message.speaker}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {characters.find(c => c.id === message.characterId)?.emotionalState}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                      </div>
                      
                      <Card className={`bg-card border-border/50 border-l-4 ${getStressIndicator(message.stressLevel)}`}>
                        <CardContent className="p-4">
                          <p className="text-sm leading-relaxed">{message.content}</p>
                          
                          <div className="flex items-center justify-end space-x-2 mt-3 pt-2 border-t border-border/30">
                            <Button variant="ghost" size="sm" className="h-6 px-2 hover:bg-green-500/20">
                              <ThumbsUp className="w-3 h-3" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-6 px-2 hover:bg-red-500/20">
                              <ThumbsDown className="w-3 h-3" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  )}

                  {message.type === 'user' && (
                    <>
                      <Card className="bg-primary/20 border-primary/30">
                        <CardContent className="p-4">
                          <p className="text-sm leading-relaxed">{message.content}</p>
                        </CardContent>
                      </Card>
                      <div className="text-right mt-1">
                        <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}

            {/* AI Thinking Indicator */}
            <div className="flex justify-start">
              <div className="bg-card border border-border/50 rounded-lg px-4 py-3">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-primary rounded-full typing-dots"></div>
                    <div className="w-2 h-2 bg-primary rounded-full typing-dots" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-2 h-2 bg-primary rounded-full typing-dots" style={{animationDelay: '0.4s'}}></div>
                  </div>
                  <span className="text-xs text-muted-foreground">Crisis team analyzing...</span>
                </div>
              </div>
            </div>
          </div>

          {/* Crisis Controls */}
          <div className="border-t border-border/50 bg-card/30 p-4">
            {/* Character Selection */}
            <div className="flex items-center space-x-4 mb-4">
              <span className="text-sm font-medium text-muted-foreground">Addressing:</span>
              <div className="flex space-x-2 overflow-x-auto">
                {characters.map((character) => (
                  <Button
                    key={character.id}
                    variant={selectedCharacter === character.id ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setSelectedCharacter(character.id)}
                    className={`npc-avatar ${selectedCharacter === character.id ? 'active' : ''} min-w-0 shrink-0`}
                  >
                    <Avatar className="w-6 h-6 mr-2">
                      <AvatarFallback className={`text-xs ${character.accentColor}`}>
                        {character.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-left min-w-0">
                      <div className="text-xs font-medium truncate">{character.name}</div>
                      <div className="text-xs text-muted-foreground truncate">{character.role}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
            
            {/* Crisis Action Buttons */}
            <div className="flex space-x-2 mb-4">
              <Button variant="outline" size="sm" className="border-amber-500/30 text-amber-400">
                Emergency Consultation
              </Button>
              <Button variant="outline" size="sm" className="border-blue-500/30 text-blue-400">
                Request Status Update
              </Button>
              <Button variant="outline" size="sm" className="border-green-500/30 text-green-400">
                Escalate to Federal
              </Button>
            </div>
            
            {/* Message Input */}
            <div className="flex space-x-2">
              <Input
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder={`Command the crisis response team...`}
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

        {/* Objectives Panel */}
        <div className="w-80 border-l border-border/50 bg-card/30 backdrop-blur-sm">
          <div className="p-4 border-b border-border/50">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-accent" />
              <h3 className="font-semibold text-foreground">Mission Objectives</h3>
            </div>
          </div>
          
          <div className="p-4 space-y-4 overflow-y-auto">
            {objectives.map((objective) => (
              <Card key={objective.id} className="bg-card/50">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <h4 className="font-medium text-sm text-foreground">{objective.title}</h4>
                      <Badge 
                        variant={objective.priority === 'primary' ? 'default' : 'secondary'} 
                        className="text-xs"
                      >
                        {objective.priority}
                      </Badge>
                    </div>
                    
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {objective.description}
                    </p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Progress</span>
                        <span className={`font-medium ${
                          objective.progress >= 75 ? 'text-green-400' :
                          objective.progress >= 50 ? 'text-amber-400' : 'text-red-400'
                        }`}>
                          {objective.progress}%
                        </span>
                      </div>
                      <Progress 
                        value={objective.progress} 
                        className={`h-2 ${
                          objective.progress >= 75 ? '[&>div]:bg-green-500' :
                          objective.progress >= 50 ? '[&>div]:bg-amber-500' : '[&>div]:bg-red-500'
                        }`}
                      />
                      <div className="text-xs text-muted-foreground">
                        {objective.estimatedTime}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {/* Crisis Metrics */}
            <Card className="bg-red-500/10 border-red-500/20">
              <CardContent className="p-4">
                <h4 className="font-medium text-sm text-red-400 mb-2">Incident Metrics</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Affected Records:</span>
                    <span className="text-red-400 font-medium">847</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Breach Duration:</span>
                    <span className="text-red-400 font-medium">72 hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Threat Level:</span>
                    <span className="text-red-400 font-medium">APT</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameplayInterface;
