
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Brain, Lightbulb } from 'lucide-react';
import { CharacterData } from '@/types/character';
import { getCharacterColor } from '@/utils/characterColors';

interface SimplifiedPreviewProps {
  characterData: CharacterData;
}

const SimplifiedPreview: React.FC<SimplifiedPreviewProps> = ({ characterData }) => {
  // Enhanced completion progress
  const getCompletionProgress = () => {
    const requirements = [
      !!characterData.name.trim(),                    // Name required
      characterData.personality.length >= 100,       // Minimum personality length
      characterData.expertise_keywords.length > 0    // At least 1 expertise keyword
    ];
    
    const completed = requirements.filter(Boolean).length;
  return (completed / requirements.length) * 100;
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || '?';
  };

  const avatarColor = getCharacterColor(characterData.name);

  return (
    <Card className="sticky top-4 bg-gradient-to-br from-slate-800/80 to-slate-700/50 backdrop-blur border border-slate-600">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <User className="w-5 h-5 text-cyan-400" />
          Character Preview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Character Avatar and Name */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <Avatar className="w-16 h-16 shrink-0">
              <AvatarImage src={characterData.avatar_url} alt={characterData.name} />
              <AvatarFallback className={`${avatarColor} text-white font-semibold text-lg`}>
                {getInitials(characterData.name || 'Unnamed Character')}
              </AvatarFallback>
            </Avatar>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">
              {characterData.name || 'Unnamed Character'}
            </h3>
            <Badge variant={characterData.is_public ? "default" : "secondary"} className="mt-2">
              {characterData.is_public ? 'Public Character' : 'Private Character'}
            </Badge>
          </div>
        </div>

        {/* Personality Preview */}
        {characterData.personality && (
          <div className="space-y-2">
            <h4 className="font-medium text-cyan-400 flex items-center gap-2">
              <Brain className="w-4 h-4" />
              Personality
            </h4>
            <p className="text-sm text-slate-300 line-clamp-4">
              {characterData.personality}
            </p>
          </div>
        )}

        {/* Expertise Preview */}
        {characterData.expertise_keywords.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-cyan-400 flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              Expertise
            </h4>
            <div className="flex flex-wrap gap-1">
              {characterData.expertise_keywords.slice(0, 6).map((keyword, index) => (
                <Badge key={index} variant="outline" className="text-xs text-slate-300 border-slate-500">
                  {keyword}
                </Badge>
              ))}
              {characterData.expertise_keywords.length > 6 && (
                <Badge variant="outline" className="text-xs text-slate-400 border-slate-600">
                  +{characterData.expertise_keywords.length - 6} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Completion Status */}
        <div className="space-y-2 pt-4 border-t border-slate-600">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Completion</span>
            <span className="text-cyan-400 font-semibold">
              {Math.round(getCompletionProgress())}%
            </span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-cyan-400 to-violet-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${getCompletionProgress()}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SimplifiedPreview;
