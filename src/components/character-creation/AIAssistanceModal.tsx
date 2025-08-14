
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
import { Wand2, Sparkles, AlertCircle } from 'lucide-react';
import { CharacterData, CharacterContext } from '@/types/character';
import { useCharacterHelper } from '@/hooks/useCharacterHelper';

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
  const { createCharacter, enhanceCharacter } = useCharacterHelper();

  // Determine if we're creating or editing based on whether character has meaningful data
  const isEditMode = characterData.name?.trim() || characterData.personality?.trim() || characterData.expertise_keywords?.length > 0;
  
  // Get appropriate mutation based on mode
  const mutation = isEditMode ? enhanceCharacter : createCharacter;

  const handleApplyAI = async () => {
    if (!prompt.trim()) return;
    
    try {
      let response;
      
      if (isEditMode) {
        // Enhance existing character
        response = await enhanceCharacter.mutateAsync({
          userRequest: prompt,
          currentCharacterData: {
            name: characterData.name,
            role: characterData.role,
            personality: characterData.personality,
            expertise_keywords: characterData.expertise_keywords,
            background: characterData.background,
            appearance: characterData.appearance,
            goals: characterData.goals,
            fears: characterData.fears,
            notable_quotes: characterData.notable_quotes,
          }
        });
      } else {
        // Create new character
        response = await createCharacter.mutateAsync({
          userRequest: prompt
        });
      }
      
      // Apply the AI response to the form
      onApplyChanges({
        name: response.name,
        role: response.role,
        personality: response.personality,
        expertise_keywords: response.expertise_keywords,
        background: response.background,
        appearance: response.appearance,
        goals: response.goals,
        fears: response.fears,
        notable_quotes: response.notable_quotes,
      });
      
      setPrompt('');
      onClose();
      
    } catch (error) {
      console.error('AI assistance failed:', error);
      // Error is handled by the mutation hook
    }
  };

  // Advanced context-aware suggestions based on current character state
  const getContextualSuggestions = () => {
    if (isEditMode) {
      const suggestions = [];
      
      // Analyze what's missing or could be improved
      if (!characterData.background || characterData.background.length < 50) {
        suggestions.push("Add detailed professional background and experience");
      }
      
      if (!characterData.personality || characterData.personality.length < 100) {
        suggestions.push("Develop more complex personality traits and quirks");
      }
      
      if (!characterData.expertise_keywords || characterData.expertise_keywords.length < 3) {
        suggestions.push("Add specific skills and areas of expertise");
      }
      
      if (!characterData.goals || characterData.goals.length < 30) {
        suggestions.push("Clarify personal motivations and objectives");
      }
      
      if (!characterData.fears || characterData.fears.length < 30) {
        suggestions.push("Add realistic concerns and vulnerabilities");
      }
      
      if (!characterData.appearance || characterData.appearance.length < 30) {
        suggestions.push("Create distinctive physical appearance details");
      }
      
      // Default improvement suggestions if nothing specific needed
      if (suggestions.length === 0) {
        suggestions.push(
          "Add more depth and complexity",
          "Increase professional authenticity",
          "Improve communication style",
          "Strengthen motivation and stakes",
          "Add unique personality quirks"
        );
      }
      
      return suggestions.slice(0, 5); // Limit to 5 suggestions
    } else {
      // Creation mode suggestions based on common character archetypes
      return [
        "Create a business executive leader",
        "Design a technical expert specialist", 
        "Build a creative professional",
        "Develop a healthcare worker",
        "Make an educator or trainer"
      ];
    }
  };
  
  const suggestionPrompts = getContextualSuggestions();
  
  const isProcessing = mutation.isPending;
  const error = mutation.error;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-cyan-400 flex items-center gap-2">
            <Wand2 className="w-5 h-5" />
            AI Character Assistant {isEditMode ? '(Enhancement Mode)' : '(Creation Mode)'}
          </DialogTitle>
          <DialogDescription className="text-slate-300">
            {isEditMode 
              ? 'Describe how you\'d like to improve or modify your character. AI will enhance their existing traits.'
              : 'Describe the character you want to create. AI will generate complete character details for you.'
            }
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

          {error && (
            <div className="bg-red-900/50 border border-red-600 rounded-lg p-3 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-red-200">
                <p className="font-medium">AI assistance failed</p>
                <p className="text-red-300">{error.message}</p>
              </div>
            </div>
          )}

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
              <span className="text-sm font-medium text-violet-400">
                {isEditMode ? 'AI Will Enhance:' : 'AI Will Generate:'}
              </span>
            </div>
            <ul className="text-sm text-slate-300 space-y-1">
              <li>• Character name and role</li>
              <li>• Detailed personality and behavior</li>
              <li>• Areas of expertise and skills</li>
              <li>• Background story and appearance</li>
              <li>• Goals, fears, and notable quotes</li>
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
                  {isEditMode ? 'Enhancing...' : 'Creating...'}
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 mr-2" />
                  {isEditMode ? 'Apply AI Enhancement' : 'Create with AI'}
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
