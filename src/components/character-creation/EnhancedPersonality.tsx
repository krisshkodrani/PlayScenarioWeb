
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Brain, HelpCircle, BookOpen, Lightbulb, CheckCircle } from 'lucide-react';
import { CharacterData, CharacterContext } from '@/types/character';

interface EnhancedPersonalityProps {
  characterData: CharacterData;
  characterContext: CharacterContext;
  setCharacterData: React.Dispatch<React.SetStateAction<CharacterData>>;
}

const EnhancedPersonality: React.FC<EnhancedPersonalityProps> = ({
  characterData,
  characterContext,
  setCharacterData
}) => {
  const [showPersonalityGuide, setShowPersonalityGuide] = useState(false);

  // Role-based personality suggestions
  const getRoleSuggestions = (role: string) => {
    const suggestions: Record<string, string[]> = {
      'CEO': ['decisive leadership style', 'strategic thinking', 'stakeholder focus'],
      'IT Security': ['analytical mindset', 'attention to detail', 'calm under pressure'],
      'Doctor': ['empathetic bedside manner', 'clinical precision', 'ethical decision-making'],
      'Engineer': ['problem-solving approach', 'technical communication', 'methodical thinking'],
      'Manager': ['team coordination skills', 'diplomatic communication', 'results-oriented'],
      'Analyst': ['data-driven decisions', 'research-focused', 'thorough documentation'],
      'Sales': ['persuasive communication', 'relationship building', 'goal-oriented'],
      'Teacher': ['patient explanation style', 'encouraging manner', 'knowledge sharing'],
      'Consultant': ['advisory approach', 'client-focused', 'expertise demonstration']
    };
    
    const roleKey = Object.keys(suggestions).find(key => 
      role.toLowerCase().includes(key.toLowerCase())
    );
    
    return roleKey ? suggestions[roleKey] : ['professional demeanor', 'clear communication', 'collaborative approach'];
  };

  // Add personality hint to existing text
  const addPersonalityHint = (hint: string) => {
    const currentText = characterData.personality.trim();
    
    if (currentText.length === 0) {
      setCharacterData(prev => ({
        ...prev,
        personality: `Character demonstrates ${hint}.`
      }));
    } else if (currentText.length < 50) {
      setCharacterData(prev => ({
        ...prev,
        personality: `${currentText} Shows ${hint}.`
      }));
    } else {
      setCharacterData(prev => ({
        ...prev,
        personality: `${currentText} Also known for ${hint}.`
      }));
    }
  };

  return (
    <Card className="bg-gradient-to-br from-slate-800/80 to-slate-700/50 backdrop-blur border border-slate-600">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Brain className="w-5 h-5 text-cyan-400" />
          Personality Description
        </CardTitle>
        <p className="text-slate-400 text-sm">
          Describe your character's personality, motivations, behavior patterns, and speech style
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-white">Character Personality *</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPersonalityGuide(!showPersonalityGuide)}
              className="text-slate-400 border-slate-600 hover:text-white hover:border-slate-500"
            >
              <HelpCircle className="w-4 h-4 mr-1" />
              {showPersonalityGuide ? 'Hide Guide' : 'Writing Guide'}
            </Button>
          </div>

          {/* Expandable Writing Guide */}
          {showPersonalityGuide && (
            <Card className="p-4 bg-slate-700/20 border border-slate-600">
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-cyan-400 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Personality Writing Guide
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h5 className="text-white font-medium mb-2">Core Elements:</h5>
                    <ul className="space-y-1 text-slate-400">
                      <li>• Primary personality traits</li>
                      <li>• Professional behavior style</li>
                      <li>• Decision-making approach</li>
                      <li>• Stress response patterns</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="text-white font-medium mb-2">Communication:</h5>
                    <ul className="space-y-1 text-slate-400">
                      <li>• Speaking style & vocabulary</li>
                      <li>• Formality level</li>
                      <li>• Emotional expression</li>
                      <li>• Unique speech patterns</li>
                    </ul>
                  </div>
                </div>
                <div className="p-3 bg-slate-800/50 rounded border border-slate-600">
                  <p className="text-xs text-slate-300">
                    <strong>Example:</strong> "Dr. Sarah Chen is highly analytical and methodical, preferring data-driven decisions over intuition. She remains calm under pressure but can become impatient with inefficient processes. Speaks in precise, technical language and has a dry sense of humor that emerges during tense situations."
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Enhanced Textarea */}
          <div className="relative">
            <Textarea
              value={characterData.personality}
              onChange={(e) => setCharacterData(prev => ({ ...prev, personality: e.target.value }))}
              placeholder="Describe how your character thinks, speaks, and behaves. Include their professional demeanor, decision-making style, and unique personality traits..."
              rows={8}
              maxLength={2000}
              className="bg-slate-700/50 backdrop-blur border border-slate-600 text-white placeholder-slate-400 focus:border-cyan-400 resize-none pr-12"
            />
            
            {/* Character count in corner */}
            <div className="absolute bottom-3 right-3 text-xs text-slate-500">
              {characterData.personality.length}/2000
            </div>
          </div>

          {/* Role-based Quick Suggestions */}
          {characterContext.role && characterData.personality.length < 100 && (
            <div className="p-3 bg-cyan-500/10 rounded-lg border border-cyan-400/30">
              <p className="text-sm text-cyan-400 mb-2 flex items-center gap-1">
                <Lightbulb className="w-4 h-4" />
                For a {characterContext.role}, consider including:
              </p>
              <div className="flex flex-wrap gap-2">
                {getRoleSuggestions(characterContext.role).map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    onClick={() => addPersonalityHint(suggestion)}
                    className="text-xs text-cyan-300 hover:text-cyan-200 h-6 px-2 bg-slate-800/50 hover:bg-cyan-500/20"
                  >
                    + {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Personality Strength Indicator */}
          {characterData.personality.length > 0 && (
            <div className="flex items-center gap-2 text-xs">
              <div className="flex-1 bg-slate-700 rounded-full h-1.5">
                <div 
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    characterData.personality.length < 100 ? 'bg-red-400' :
                    characterData.personality.length < 200 ? 'bg-amber-400' :
                    'bg-emerald-400'
                  }`}
                  style={{ width: `${Math.min((characterData.personality.length / 300) * 100, 100)}%` }}
                />
              </div>
              <span className="text-slate-400">
                {characterData.personality.length < 100 ? 'Too brief' :
                 characterData.personality.length < 200 ? 'Good length' : 'Detailed'}
              </span>
              {characterData.personality.length >= 200 && (
                <CheckCircle className="w-4 h-4 text-emerald-400" />
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedPersonality;
