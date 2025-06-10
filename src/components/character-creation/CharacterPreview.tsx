
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Eye, EyeOff, User, Brain, Lightbulb, MessageCircle } from 'lucide-react';

interface CharacterPreviewProps {
  data: any;
}

const CharacterPreview: React.FC<CharacterPreviewProps> = ({ data }) => {
  const getPersonalityDescription = () => {
    const traits = data.personality || {};
    const high = Object.entries(traits)
      .filter(([key, value]) => key !== 'description' && key !== 'traits' && typeof value === 'number' && value >= 7)
      .map(([key]) => key);
    const low = Object.entries(traits)
      .filter(([key, value]) => key !== 'description' && key !== 'traits' && typeof value === 'number' && value <= 3)
      .map(([key]) => key);
    
    return { high, low };
  };

  const personalityAnalysis = getPersonalityDescription();

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="w-5 h-5" />
          Character Preview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Info */}
        <div className="text-center space-y-3">
          <Avatar className="w-20 h-20 mx-auto">
            <AvatarImage src={data.avatar} alt={data.name} />
            <AvatarFallback className="text-xl">
              {data.name?.substring(0, 2)?.toUpperCase() || '??'}
            </AvatarFallback>
          </Avatar>
          
          <div>
            <h3 className="text-lg font-semibold">
              {data.name || 'Unnamed Character'}
            </h3>
            {data.displayName && data.displayName !== data.name && (
              <p className="text-sm text-muted-foreground">
                "{data.displayName}"
              </p>
            )}
          </div>

          {data.role && data.role.length > 0 && (
            <div className="flex flex-wrap gap-1 justify-center">
              {data.role.map((role: string, index: number) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {role}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Personality Snapshot */}
        {data.personality?.description && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              <h4 className="font-medium">Personality</h4>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-3">
              {data.personality.description}
            </p>
            
            {/* Personality Traits Overview */}
            {(personalityAnalysis.high.length > 0 || personalityAnalysis.low.length > 0) && (
              <div className="space-y-2">
                {personalityAnalysis.high.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-primary">High:</p>
                    <div className="flex flex-wrap gap-1">
                      {personalityAnalysis.high.map((trait, index) => (
                        <Badge key={index} variant="outline" className="text-xs capitalize">
                          {trait}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {personalityAnalysis.low.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Low:</p>
                    <div className="flex flex-wrap gap-1">
                      {personalityAnalysis.low.map((trait, index) => (
                        <Badge key={index} variant="outline" className="text-xs capitalize opacity-60">
                          {trait}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Expertise */}
        {data.expertise?.domains && data.expertise.domains.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              <h4 className="font-medium">Expertise</h4>
            </div>
            <div className="space-y-2">
              {data.expertise.domains.slice(0, 3).map((domain: string, index: number) => {
                const depth = data.expertise.depth?.[domain] || 'basic';
                const depthColors = {
                  basic: 'bg-muted',
                  professional: 'bg-primary/20',
                  expert: 'bg-primary'
                };
                return (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span className="truncate flex-1">{domain}</span>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${depthColors[depth as keyof typeof depthColors]}`}
                    >
                      {depth}
                    </Badge>
                  </div>
                );
              })}
              {data.expertise.domains.length > 3 && (
                <p className="text-xs text-muted-foreground">
                  +{data.expertise.domains.length - 3} more
                </p>
              )}
            </div>
          </div>
        )}

        {/* Communication Style */}
        {data.communication && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              <h4 className="font-medium">Communication</h4>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {data.communication.vocabularyLevel && (
                <div>
                  <span className="text-muted-foreground">Vocabulary:</span>
                  <p className="capitalize">{data.communication.vocabularyLevel}</p>
                </div>
              )}
              {data.communication.formality && (
                <div>
                  <span className="text-muted-foreground">Formality:</span>
                  <p className="capitalize">{data.communication.formality}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Goals */}
        {(data.goals?.primary?.length > 0 || data.goals?.hidden?.length > 0) && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <h4 className="font-medium">Goals</h4>
            </div>
            
            {data.goals.primary && data.goals.primary.length > 0 && (
              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  <span className="text-xs font-medium">Primary</span>
                </div>
                {data.goals.primary.slice(0, 2).map((goal: string, index: number) => (
                  <p key={index} className="text-xs text-muted-foreground line-clamp-1">
                    • {goal}
                  </p>
                ))}
              </div>
            )}

            {data.goals.hidden && data.goals.hidden.length > 0 && (
              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <EyeOff className="w-3 h-3" />
                  <span className="text-xs font-medium">Hidden</span>
                </div>
                <p className="text-xs text-muted-foreground italic">
                  {data.goals.hidden.length} hidden motivation{data.goals.hidden.length > 1 ? 's' : ''}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Completion Status */}
        <div className="space-y-2 pt-4 border-t">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Completion</span>
            <span className="text-primary">
              {Math.round(((data.name ? 1 : 0) + 
                          (data.role?.length > 0 ? 1 : 0) + 
                          (data.personality?.description ? 1 : 0) + 
                          (data.expertise?.domains?.length > 0 ? 1 : 0) + 
                          (data.goals?.primary?.length > 0 ? 1 : 0)) / 5 * 100)}%
            </span>
          </div>
          <Progress 
            value={((data.name ? 1 : 0) + 
                    (data.role?.length > 0 ? 1 : 0) + 
                    (data.personality?.description ? 1 : 0) + 
                    (data.expertise?.domains?.length > 0 ? 1 : 0) + 
                    (data.goals?.primary?.length > 0 ? 1 : 0)) / 5 * 100} 
            className="h-2" 
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default CharacterPreview;
