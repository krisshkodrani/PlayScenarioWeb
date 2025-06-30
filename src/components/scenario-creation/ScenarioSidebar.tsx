
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Save, 
  Globe, 
  Sparkles, 
  CheckCircle, 
  AlertCircle,
  User,
  Bot
} from 'lucide-react';
import { ScenarioData } from '@/types/scenario';

interface ScenarioSidebarProps {
  scenarioData: ScenarioData;
  isComplete: boolean;
  isLoading: boolean;
  onSave: () => void;
  onPublish: () => void;
  onUseAI: () => void;
}

const ScenarioSidebar: React.FC<ScenarioSidebarProps> = ({
  scenarioData,
  isComplete,
  isLoading,
  onSave,
  onPublish,
  onUseAI
}) => {
  // Character validation
  const playerCharacters = scenarioData.characters.filter(char => char.is_player_character);
  const aiCharacters = scenarioData.characters.filter(char => !char.is_player_character);
  
  const charactersValid = playerCharacters.length === 1 && 
                         aiCharacters.length >= 1 && 
                         aiCharacters.length <= 5 && 
                         scenarioData.characters.length <= 6;

  return (
    <div className="space-y-4">
      {/* Character Status */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-slate-300">Character Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-slate-300">Player Characters</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge 
                variant={playerCharacters.length === 1 ? "default" : "destructive"}
                className={playerCharacters.length === 1 ? "bg-emerald-500" : ""}
              >
                {playerCharacters.length}/1
              </Badge>
              {playerCharacters.length === 1 ? (
                <CheckCircle className="w-4 h-4 text-emerald-500" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-400" />
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-violet-400" />
              <span className="text-sm text-slate-300">AI Characters</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge 
                variant={aiCharacters.length >= 1 && aiCharacters.length <= 5 ? "default" : "destructive"}
                className={aiCharacters.length >= 1 && aiCharacters.length <= 5 ? "bg-emerald-500" : ""}
              >
                {aiCharacters.length}/1-5
              </Badge>
              {aiCharacters.length >= 1 && aiCharacters.length <= 5 ? (
                <CheckCircle className="w-4 h-4 text-emerald-500" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-400" />
              )}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-700">
            <span className="text-sm text-slate-300">Total Characters</span>
            <div className="flex items-center gap-2">
              <Badge 
                variant={scenarioData.characters.length <= 6 ? "default" : "destructive"}
                className={scenarioData.characters.length <= 6 ? "bg-slate-600" : ""}
              >
                {scenarioData.characters.length}/6
              </Badge>
              {scenarioData.characters.length <= 6 ? (
                <CheckCircle className="w-4 h-4 text-emerald-500" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-400" />
              )}
            </div>
          </div>

          {!charactersValid && scenarioData.characters.length > 0 && (
            <div className="text-xs text-red-400 bg-red-500/10 p-2 rounded border border-red-500/20">
              Character requirements not met. Check the Characters tab for details.
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Enhancement */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-slate-300">AI Enhancement</CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            onClick={onUseAI}
            className="w-full bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white"
            disabled={isLoading}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Enhance with AI
          </Button>
          <p className="text-xs text-slate-400 mt-2">
            Let AI help improve your scenario content
          </p>
        </CardContent>
      </Card>

      {/* Save Actions */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-slate-300">Save Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            onClick={onSave}
            variant="outline"
            className="w-full border-slate-600 text-slate-300 hover:text-white"
            disabled={isLoading}
          >
            <Save className="w-4 h-4 mr-2" />
            Save Draft
          </Button>
          
          <Button
            onClick={onPublish}
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white"
            disabled={!isComplete || isLoading}
          >
            <Globe className="w-4 h-4 mr-2" />
            {isComplete ? 'Publish Scenario' : 'Complete to Publish'}
          </Button>
          
          <p className="text-xs text-slate-400">
            {isComplete 
              ? 'Your scenario is ready to publish!' 
              : 'Complete all sections to publish your scenario'
            }
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScenarioSidebar;
