
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { User, HelpCircle } from 'lucide-react';
import { CharacterData, CharacterContext } from '@/types/character';

interface SimplifiedBasicInfoProps {
  characterData: CharacterData;
  characterContext: CharacterContext;
  setCharacterData: React.Dispatch<React.SetStateAction<CharacterData>>;
  setCharacterContext: React.Dispatch<React.SetStateAction<CharacterContext>>;
}

const SimplifiedBasicInfo: React.FC<SimplifiedBasicInfoProps> = ({
  characterData,
  characterContext,
  setCharacterData,
  setCharacterContext
}) => {
  return (
    <Card className="bg-gradient-to-br from-slate-800/80 to-slate-700/50 backdrop-blur border border-slate-600">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <User className="w-5 h-5 text-cyan-400" />
          Character Basics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Character Name - Required */}
        <div className="space-y-2">
          <Label className="text-white">Character Name *</Label>
          <Input
            value={characterData.name}
            onChange={(e) => setCharacterData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Enter character name"
            className="bg-slate-700/50 backdrop-blur border border-slate-600 text-white placeholder-slate-400 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
            maxLength={50}
          />
          <p className="text-xs text-slate-400">{characterData.name.length}/50 characters</p>
        </div>

        {/* Role Context Input (for smart suggestions) */}
        <div className="space-y-2">
          <Label className="text-white">Role/Position (Optional)</Label>
          <Input
            value={characterContext.role}
            onChange={(e) => setCharacterContext(prev => ({ ...prev, role: e.target.value }))}
            placeholder="e.g., IT Security Analyst, CEO, Doctor..."
            className="bg-slate-700/50 backdrop-blur border border-slate-600 text-white placeholder-slate-400 focus:border-cyan-400"
          />
          <p className="text-xs text-slate-400">
            Helps provide better personality and expertise suggestions
          </p>
        </div>

        {/* General Guidelines */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-white">General Guidelines</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-auto p-1 text-slate-400 hover:text-cyan-400">
                    <HelpCircle className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-sm bg-slate-800 border-slate-600 text-white p-4 z-50">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-cyan-400">Writing Guide for Character Guidelines</h4>
                    
                    <div className="space-y-2 text-sm">
                      <div>
                        <p className="font-medium text-amber-400">GLOBAL RULES</p>
                        <ul className="list-disc list-inside space-y-1 text-xs ml-2">
                          <li>Speak in first-person as {characterData.name || '{{CHAR_NAME}}'}.</li>
                          <li>The user is <strong>{{USER_NAME}}</strong>; address them directly.</li>
                          <li>Refer to other characters only indirectly ("Team reported...").</li>
                          <li>No meta-talk about AI or prompts. Output plain text, 60-120 words.</li>
                        </ul>
                      </div>
                      
                      <div>
                        <p className="font-medium text-violet-400">BEHAVIORAL CONSTRAINTS</p>
                        <ul className="list-disc list-inside space-y-1 text-xs ml-2">
                          <li>Stay in character at all times</li>
                          <li>Maintain consistent personality traits</li>
                          <li>Respond based on expertise and role</li>
                        </ul>
                      </div>
                      
                      <div>
                        <p className="font-medium text-emerald-400">INTERACTION STYLE</p>
                        <ul className="list-disc list-inside space-y-1 text-xs ml-2">
                          <li>Professional yet approachable tone</li>
                          <li>Provide relevant context when needed</li>
                          <li>Ask clarifying questions when appropriate</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Textarea
            value={characterData.guidelines || ''}
            onChange={(e) => setCharacterData(prev => ({ ...prev, guidelines: e.target.value }))}
            placeholder="Define comprehensive guidelines for character behavior, interaction patterns, and response constraints..."
            rows={6}
            className="bg-slate-700/50 backdrop-blur border border-slate-600 text-white placeholder-slate-400 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 resize-none"
            maxLength={3000}
          />
          <p className="text-xs text-slate-400">{(characterData.guidelines || '').length}/3000 characters</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SimplifiedBasicInfo;
