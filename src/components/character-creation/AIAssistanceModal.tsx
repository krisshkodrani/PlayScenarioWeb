
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Wand2, Sparkles } from 'lucide-react';
import { CharacterData, CharacterContext } from '@/types/character';

interface AIAssistanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  characterData: CharacterData;
  characterContext: CharacterContext;
  onApplyChanges: (updates: Partial<CharacterData>) => void;
}

const AIAssistanceModal: React.FC<AIAssistanceModalProps> = ({
  isOpen,
  onClose,
  characterData,
  characterContext,
  onApplyChanges
}) => {
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const mockAIResponse = (userPrompt: string): Partial<CharacterData> => {
    const lowerPrompt = userPrompt.toLowerCase();
    
    if (lowerPrompt.includes('funny') || lowerPrompt.includes('humorous') || lowerPrompt.includes('comedic')) {
      return {
        name: characterData.name || 'Witty McJokester',
        personality: 'A quick-witted and humorous character who loves to make people laugh. Always ready with a clever comeback or a well-timed joke. Has an optimistic outlook on life and uses humor to lighten tense situations. Speaks with playful banter and enjoys wordplay.',
        expertise_keywords: ['comedy', 'entertainment', 'public speaking', 'improvisation', 'storytelling']
      };
    }
    
    if (lowerPrompt.includes('serious') || lowerPrompt.includes('professional') || lowerPrompt.includes('business')) {
      return {
        name: characterData.name || 'Alexandra Sterling',
        personality: 'A highly professional and analytical character with strong leadership qualities. Methodical in approach, values efficiency and clear communication. Maintains composure under pressure and provides thoughtful, well-reasoned advice. Speaks with authority and precision.',
        expertise_keywords: ['leadership', 'strategy', 'analysis', 'project management', 'decision making']
      };
    }
    
    if (lowerPrompt.includes('creative') || lowerPrompt.includes('artistic') || lowerPrompt.includes('imaginative')) {
      return {
        name: characterData.name || 'Luna Artwright',
        personality: 'An imaginative and expressive character with a passion for creative pursuits. Thinks outside the box and approaches problems with innovative solutions. Enthusiastic about sharing ideas and inspiring others. Speaks with vivid imagery and emotional depth.',
        expertise_keywords: ['creativity', 'design', 'innovation', 'brainstorming', 'artistic expression']
      };
    }
    
    if (lowerPrompt.includes('technical') || lowerPrompt.includes('engineer') || lowerPrompt.includes('developer')) {
      return {
        name: characterData.name || 'Alex Codewright',
        personality: 'A logical and detail-oriented character with strong problem-solving skills. Enjoys breaking down complex technical concepts into understandable parts. Patient when explaining difficult topics and always eager to learn new technologies. Speaks with precision and uses clear examples.',
        expertise_keywords: ['programming', 'systems design', 'troubleshooting', 'technology', 'problem solving']
      };
    }
    
    // Default enhancement based on role context
    if (characterContext.role) {
      return {
        name: characterData.name || `${characterContext.role} Character`,
        personality: `An experienced ${characterContext.role.toLowerCase()} with deep knowledge in their field. Professional, knowledgeable, and helpful. Communicates clearly and provides practical advice based on real-world experience.`,
        expertise_keywords: [characterContext.role.toLowerCase(), 'expertise', 'guidance', 'best practices', 'problem solving']
      };
    }
    
    // Generic enhancement
    return {
      name: characterData.name || 'Enhanced Character',
      personality: (characterData.personality || 'A well-rounded character') + ' Enhanced with AI to be more engaging, detailed, and consistent in their responses and interactions.',
      expertise_keywords: characterData.expertise_keywords.length > 0 ? characterData.expertise_keywords : ['communication', 'problem solving', 'collaboration', 'adaptability']
    };
  };

  const handleApplyAI = async () => {
    if (!prompt.trim()) return;
    
    setIsProcessing(true);
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const aiUpdates = mockAIResponse(prompt);
    onApplyChanges(aiUpdates);
    
    setIsProcessing(false);
    setPrompt('');
    onClose();
  };

  const suggestionPrompts = [
    "Make this character more funny and humorous",
    "Add professional business expertise",
    "Enhance with creative and artistic traits",
    "Make them more technical and analytical",
    "Add leadership and mentoring qualities"
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-cyan-400 flex items-center gap-2">
            <Wand2 className="w-5 h-5" />
            AI Character Assistant
          </DialogTitle>
          <DialogDescription className="text-slate-300">
            Describe how you'd like to improve or modify your character. AI will enhance their personality and traits automatically.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="ai-prompt" className="text-white">
              What would you like to improve?
            </Label>
            <Textarea
              id="ai-prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., 'Make this character more funny and engaging' or 'Add technical expertise'"
              className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-violet-400 min-h-[100px]"
              maxLength={500}
            />
            <p className="text-xs text-slate-400">{prompt.length}/500 characters</p>
          </div>

          <div className="space-y-3">
            <Label className="text-slate-300">Quick Suggestions:</Label>
            <div className="flex flex-wrap gap-2">
              {suggestionPrompts.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setPrompt(suggestion)}
                  className="text-xs border-slate-600 text-slate-300 hover:text-white hover:border-violet-400"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>

          <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-violet-400" />
              <span className="text-sm font-medium text-violet-400">AI Will Enhance:</span>
            </div>
            <ul className="text-sm text-slate-300 space-y-1">
              <li>• Character name (if not set)</li>
              <li>• Personality traits and behavior</li>
              <li>• Areas of expertise</li>
              <li>• Communication style and tone</li>
            </ul>
          </div>

          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-slate-600 text-slate-300 hover:text-white"
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              onClick={handleApplyAI}
              disabled={!prompt.trim() || isProcessing}
              className="bg-violet-500 hover:bg-violet-600 text-white"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 mr-2" />
                  Apply AI Enhancement
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIAssistanceModal;
