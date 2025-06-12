
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Brain, Lightbulb } from 'lucide-react';
import { Character } from '@/types/scenario';
import CharacterAvatar from '@/components/chat/CharacterAvatar';

interface CharacterShowcaseProps {
  characters: Character[];
}

const CharacterShowcase: React.FC<CharacterShowcaseProps> = ({ characters }) => {
  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-cyan-400">
          <Users className="w-6 h-6" />
          Characters You'll Interact With
        </CardTitle>
      </CardHeader>
      <CardContent>
        {characters.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {characters.map((character) => (
              <div 
                key={character.id}
                className="p-5 bg-slate-700/50 rounded-lg border border-slate-600/50 hover:border-slate-500/50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <CharacterAvatar character={character} size="lg" />
                  
                  <div className="flex-1 space-y-3">
                    <div>
                      <h4 className="font-semibold text-white text-lg">
                        {character.name}
                      </h4>
                      <p className="text-cyan-400 font-medium">
                        {character.role}
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Brain className="w-4 h-4 text-violet-400" />
                        <span className="text-slate-400">Personality:</span>
                      </div>
                      <p className="text-sm text-slate-300 leading-relaxed line-clamp-3">
                        {character.personality}
                      </p>
                    </div>
                    
                    {character.expertise_keywords && character.expertise_keywords.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Lightbulb className="w-4 h-4 text-amber-400" />
                          <span className="text-slate-400">Expertise:</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {character.expertise_keywords.slice(0, 3).map((keyword) => (
                            <Badge 
                              key={keyword}
                              variant="outline" 
                              className="text-xs text-slate-400 border-slate-500"
                            >
                              {keyword.replace('-', ' ')}
                            </Badge>
                          ))}
                          {character.expertise_keywords.length > 3 && (
                            <Badge 
                              variant="outline" 
                              className="text-xs text-slate-500 border-slate-600"
                            >
                              +{character.expertise_keywords.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-400">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No characters defined for this scenario.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CharacterShowcase;
