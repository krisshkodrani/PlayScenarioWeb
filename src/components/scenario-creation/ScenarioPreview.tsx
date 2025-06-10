
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Play, Target, Users, Clock, Eye, EyeOff } from 'lucide-react';

interface ScenarioPreviewProps {
  data: any;
  onChange: (data: any) => void;
}

const ScenarioPreview: React.FC<ScenarioPreviewProps> = ({ data }) => {
  const difficultyColors = {
    beginner: 'text-green-400 border-green-400',
    intermediate: 'text-yellow-400 border-yellow-400',
    advanced: 'text-orange-400 border-orange-400',
    expert: 'text-red-400 border-red-400'
  };

  const totalPoints = (data.primaryObjectives || []).reduce((sum: number, obj: any) => sum + (obj.points || 0), 0) +
                    (data.secondaryObjectives || []).reduce((sum: number, obj: any) => sum + (obj.points || 0), 0);

  return (
    <div className="space-y-6">
      {/* Scenario Header */}
      <Card className="p-6 bg-slate-800 border-slate-600">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white mb-2">
                {data.title || 'Untitled Scenario'}
              </h1>
              <div className="flex items-center gap-4 text-sm text-slate-400 mb-4">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{data.estimatedTime || 30} minutes</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{(data.assignedCharacters || []).length} characters</span>
                </div>
                <div className="flex items-center gap-1">
                  <Target className="w-4 h-4" />
                  <span>{totalPoints} points available</span>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <Badge 
                  variant="outline" 
                  className={difficultyColors[data.difficulty as keyof typeof difficultyColors] || 'text-slate-400 border-slate-400'}
                >
                  {data.difficulty || 'Beginner'}
                </Badge>
                {data.category && (
                  <Badge variant="secondary">
                    {data.category.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                  </Badge>
                )}
                {data.maturityRating && data.maturityRating !== 'general' && (
                  <Badge variant="outline" className="text-amber-400 border-amber-400">
                    {data.maturityRating}
                  </Badge>
                )}
              </div>
            </div>
            <Button className="bg-cyan-500 hover:bg-cyan-600">
              <Play className="w-4 h-4 mr-2" />
              Play Scenario
            </Button>
          </div>

          <p className="text-slate-300 leading-relaxed">
            {data.description || 'No description provided.'}
          </p>

          {data.tags && data.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {data.tags.map((tag: string) => (
                <Badge key={tag} variant="outline" className="text-violet-400 border-violet-400">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Characters */}
      {data.assignedCharacters && data.assignedCharacters.length > 0 && (
        <Card className="p-4 bg-slate-800 border-slate-600">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-cyan-400">Characters</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.assignedCharacters.map((assignment: any) => (
                <div key={assignment.characterId} className="flex items-center gap-3 p-3 bg-slate-700 rounded-lg">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={`/placeholder.svg?height=40&width=40&text=${assignment.characterName.charAt(0)}`} />
                    <AvatarFallback>{assignment.characterName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-medium text-white">{assignment.characterName}</h4>
                    <p className="text-sm text-cyan-400">{assignment.role}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Priority {assignment.priority}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Objectives */}
      <div className="space-y-4">
        {/* Primary Objectives */}
        {data.primaryObjectives && data.primaryObjectives.length > 0 && (
          <Card className="p-4 bg-slate-800 border-slate-600">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-medium text-cyan-400">Primary Objectives</h3>
                <Badge variant="secondary">Required</Badge>
              </div>
              <div className="space-y-3">
                {data.primaryObjectives.map((objective: any) => (
                  <div key={objective.id} className="p-3 bg-slate-700 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-white">{objective.title}</h4>
                      <Badge variant="outline" className="text-amber-400 border-amber-400">
                        {objective.points} pts
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-300">{objective.description}</p>
                    {objective.successCriteria && (
                      <p className="text-xs text-cyan-400 mt-2">
                        Success: {objective.successCriteria}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* Secondary Objectives */}
        {data.secondaryObjectives && data.secondaryObjectives.length > 0 && (
          <Card className="p-4 bg-slate-800 border-slate-600">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-violet-400" />
                <h3 className="text-lg font-medium text-violet-400">Secondary Objectives</h3>
                <Badge variant="secondary">Bonus</Badge>
              </div>
              <div className="space-y-3">
                {data.secondaryObjectives.map((objective: any) => (
                  <div key={objective.id} className="p-3 bg-slate-700 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-white">{objective.title}</h4>
                      <Badge variant="outline" className="text-violet-400 border-violet-400">
                        +{objective.points} pts
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-300">{objective.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* Hidden Objectives */}
        {data.hiddenObjectives && data.hiddenObjectives.length > 0 && (
          <Card className="p-4 bg-slate-800 border-slate-600 border-dashed">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <EyeOff className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-medium text-amber-400">Hidden Objectives</h3>
                <Badge variant="secondary">Secret</Badge>
              </div>
              <div className="space-y-3">
                {data.hiddenObjectives.map((objective: any) => (
                  <div key={objective.id} className="p-3 bg-slate-700 rounded-lg border border-dashed border-slate-600">
                    <h4 className="font-medium text-white mb-2">{objective.title}</h4>
                    <p className="text-sm text-slate-300 mb-2">{objective.description}</p>
                    <p className="text-xs text-amber-400">
                      Revealed: {objective.triggerCondition}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Scenes */}
      {data.scenes && data.scenes.length > 0 && (
        <Card className="p-4 bg-slate-800 border-slate-600">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-cyan-400">Scenario Structure</h3>
            <div className="space-y-3">
              {data.scenes.map((scene: any, index: number) => (
                <div key={scene.id} className="flex items-start gap-4 p-3 bg-slate-700 rounded-lg">
                  <Badge variant="outline" className="text-cyan-400 border-cyan-400 mt-1">
                    Scene {index + 1}
                  </Badge>
                  <div className="flex-1">
                    <h4 className="font-medium text-white mb-1">{scene.title}</h4>
                    <p className="text-sm text-slate-300">{scene.description}</p>
                    {scene.environmentContext && (
                      <p className="text-xs text-slate-400 mt-2">
                        Environment: {scene.environmentContext}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Conversation Starters */}
      {data.conversationStarters && data.conversationStarters.length > 0 && (
        <Card className="p-4 bg-slate-800 border-slate-600">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-cyan-400">How to Begin</h3>
            <div className="space-y-2">
              {data.conversationStarters.map((starter: string, index: number) => (
                <div key={index} className="p-3 bg-slate-700 rounded-lg border-l-4 border-cyan-500">
                  <p className="text-sm text-slate-200 italic">"{starter}"</p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Incomplete Scenario Warning */}
      {(!data.title || !data.description || !data.assignedCharacters?.length || !data.primaryObjectives?.length) && (
        <Card className="p-4 bg-yellow-900/20 border-yellow-600">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center mt-0.5">
              <span className="text-xs font-bold text-black">!</span>
            </div>
            <div>
              <h4 className="font-medium text-yellow-400 mb-2">Scenario Incomplete</h4>
              <p className="text-sm text-yellow-200 mb-3">
                Complete the required sections to publish your scenario:
              </p>
              <ul className="text-sm text-yellow-200 space-y-1">
                {!data.title && <li>• Add a scenario title</li>}
                {!data.description && <li>• Provide a scenario description</li>}
                {!data.assignedCharacters?.length && <li>• Assign at least one character</li>}
                {!data.primaryObjectives?.length && <li>• Define primary objectives</li>}
              </ul>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ScenarioPreview;
