
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, Plus, X } from 'lucide-react';
import { CharacterData } from '@/types/character';

interface SimplifiedExpertiseProps {
  characterData: CharacterData;
  setCharacterData: React.Dispatch<React.SetStateAction<CharacterData>>;
}

const SimplifiedExpertise: React.FC<SimplifiedExpertiseProps> = ({
  characterData,
  setCharacterData
}) => {
  const [newKeyword, setNewKeyword] = useState('');

  // Keyword management
  const addKeyword = () => {
    if (newKeyword.trim() && !characterData.expertise_keywords.includes(newKeyword.trim())) {
      setCharacterData(prev => ({
        ...prev,
        expertise_keywords: [...prev.expertise_keywords, newKeyword.trim()]
      }));
      setNewKeyword('');
    }
  };

  const removeKeyword = (index: number) => {
    setCharacterData(prev => ({
      ...prev,
      expertise_keywords: prev.expertise_keywords.filter((_, i) => i !== index)
    }));
  };

  return (
    <Card className="bg-gradient-to-br from-slate-800/80 to-slate-700/50 backdrop-blur border border-slate-600">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-cyan-400" />
          Areas of Expertise
        </CardTitle>
        <p className="text-slate-400 text-sm">
          Define what your character knows and specializes in
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Expertise Keywords */}
          <div className="space-y-3">
            <Label className="text-white">Expertise Keywords</Label>
            <div className="flex gap-2">
              <Input
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                placeholder="Add expertise keyword..."
                className="bg-slate-700/50 backdrop-blur border border-slate-600 text-white placeholder-slate-400 focus:border-cyan-400"
                onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
              />
              <Button
                onClick={addKeyword}
                disabled={!newKeyword.trim()}
                className="bg-gradient-to-r from-cyan-400 to-violet-500 hover:from-cyan-300 hover:to-violet-400"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Current Keywords */}
            {characterData.expertise_keywords.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {characterData.expertise_keywords.map((keyword, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1 bg-slate-600 text-slate-200">
                    {keyword}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 ml-1 hover:text-red-400"
                      onClick={() => removeKeyword(index)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
            
            <p className="text-xs text-slate-400">
              Examples: cybersecurity, negotiation, medicine, engineering, leadership, psychology
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SimplifiedExpertise;
