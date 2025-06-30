
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
import { ScenarioData } from '@/types/scenario';

interface AIAssistanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  scenarioData: ScenarioData;
  onApplyChanges: (updates: Partial<ScenarioData>) => void;
}

const AIAssistanceModal: React.FC<AIAssistanceModalProps> = ({
  isOpen,
  onClose,
  scenarioData,
  onApplyChanges
}) => {
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const mockAIResponse = (userPrompt: string): Partial<ScenarioData> => {
    const lowerPrompt = userPrompt.toLowerCase();
    
    if (lowerPrompt.includes('more fun') || lowerPrompt.includes('funnier') || lowerPrompt.includes('entertaining')) {
      return {
        title: scenarioData.title || 'Epic Adventure Scenario',
        description: 'An exciting and engaging scenario filled with unexpected twists, humor, and interactive challenges that will keep participants on their toes!',
        initial_scene_prompt: 'Welcome to an extraordinary adventure! You find yourself in a mysterious location where anything can happen. The air buzzes with excitement and possibility...',
        objectives: [
          { id: 1, description: 'Discover three hidden secrets that will unlock the main quest' },
          { id: 2, description: 'Form strategic alliances with at least two other participants' },
          { id: 3, description: 'Overcome a surprising challenge using creativity and teamwork' },
          { id: 4, description: 'Achieve the ultimate goal while having maximum fun!' }
        ]
      };
    }
    
    if (lowerPrompt.includes('professional') || lowerPrompt.includes('business') || lowerPrompt.includes('corporate')) {
      return {
        title: scenarioData.title || 'Professional Development Scenario',
        description: 'A structured professional scenario designed to enhance workplace skills, communication, and strategic thinking in a realistic business environment.',
        initial_scene_prompt: 'You are in a professional setting where critical decisions need to be made. Your expertise and judgment will be tested as you navigate complex workplace challenges...',
        objectives: [
          { id: 1, description: 'Demonstrate effective communication and leadership skills' },
          { id: 2, description: 'Analyze the situation and propose viable solutions' },
          { id: 3, description: 'Collaborate effectively with team members to achieve goals' }
        ]
      };
    }
    
    if (lowerPrompt.includes('creative') || lowerPrompt.includes('artistic') || lowerPrompt.includes('imaginative')) {
      return {
        title: scenarioData.title || 'Creative Expression Scenario',
        description: 'An imaginative scenario that encourages creative thinking, artistic expression, and innovative problem-solving through unique challenges.',
        initial_scene_prompt: 'Step into a world where creativity knows no bounds. Your imagination is your greatest tool as you explore, create, and transform the environment around you...',
        objectives: [
          { id: 1, description: 'Create an original solution using artistic or creative methods' },
          { id: 2, description: 'Inspire others through innovative thinking and expression' },
          { id: 3, description: 'Transform ordinary situations into extraordinary experiences' }
        ]
      };
    }
    
    // Default enhancement
    return {
      title: scenarioData.title || 'Enhanced Interactive Scenario',
      description: (scenarioData.description || 'A comprehensive scenario') + ' Enhanced with AI to provide better engagement, clearer objectives, and more immersive storytelling.',
      initial_scene_prompt: 'The scene is set for an engaging experience. You are about to embark on a journey that will challenge your skills and creativity...',
      objectives: scenarioData.objectives.length > 0 ? scenarioData.objectives : [
        { id: 1, description: 'Complete the primary challenge with excellence' },
        { id: 2, description: 'Demonstrate key skills throughout the scenario' },
        { id: 3, description: 'Achieve successful collaboration and communication' }
      ]
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
    "Make this scenario more fun and engaging",
    "Add professional business context",
    "Enhance with creative and artistic elements",
    "Make it more challenging and educational",
    "Add team collaboration objectives"
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-cyan-400 flex items-center gap-2">
            <Wand2 className="w-5 h-5" />
            AI Scenario Assistant
          </DialogTitle>
          <DialogDescription className="text-slate-300">
            Describe how you'd like to improve or modify your scenario. AI will enhance your content automatically.
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
              placeholder="e.g., 'Make this scenario more fun and interactive' or 'Add more professional context'"
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
              <li>• Scenario title and description</li>
              <li>• Initial scene prompt</li>
              <li>• Objectives and goals</li>
              <li>• Overall engagement and clarity</li>
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
