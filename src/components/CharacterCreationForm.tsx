
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, Save, Eye, User, Brain, Lightbulb } from 'lucide-react';
import { CharacterData, CharacterContext } from '@/types/character';
import SimplifiedBasicInfo from './character-creation/SimplifiedBasicInfo';
import EnhancedPersonality from './character-creation/EnhancedPersonality';
import SimplifiedExpertise from './character-creation/SimplifiedExpertise';
import SimplifiedPreview from './character-creation/SimplifiedPreview';

const sections = [
  { id: 'basic', title: 'Basic Information', icon: User },
  { id: 'personality', title: 'Personality', icon: Brain },
  { id: 'expertise', title: 'Expertise', icon: Lightbulb },
];

const CharacterCreationForm = () => {
  const [activeSection, setActiveSection] = useState('basic');
  const [showPreview, setShowPreview] = useState(false);
  const [characterData, setCharacterData] = useState<CharacterData>({
    name: '',
    personality: '',
    expertise_keywords: [],
    is_player_character: false
  });
  const [characterContext, setCharacterContext] = useState<CharacterContext>({
    role: ''
  });

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

  const getSectionCompletionStatus = (sectionId: string) => {
    switch (sectionId) {
      case 'basic':
        return !!characterData.name.trim();
      case 'personality':
        return characterData.personality.length >= 100; // Require meaningful content
      case 'expertise':
        return characterData.expertise_keywords.length > 0;
      default:
        return false;
    }
  };

  const renderActiveComponent = () => {
    switch (activeSection) {
      case 'basic':
        return (
          <SimplifiedBasicInfo
            characterData={characterData}
            characterContext={characterContext}
            setCharacterData={setCharacterData}
            setCharacterContext={setCharacterContext}
          />
        );
      case 'personality':
        return (
          <EnhancedPersonality
            characterData={characterData}
            characterContext={characterContext}
            setCharacterData={setCharacterData}
          />
        );
      case 'expertise':
        return (
          <SimplifiedExpertise
            characterData={characterData}
            setCharacterData={setCharacterData}
          />
        );
      default:
        return null;
    }
  };

  if (showPreview) {
    return (
      <div className="min-h-screen bg-slate-900 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Button 
              variant="ghost" 
              onClick={() => setShowPreview(false)}
              className="text-cyan-400 hover:text-cyan-300"
            >
              ← Back to Editor
            </Button>
            <Button className="bg-gradient-to-r from-cyan-400 to-violet-500 hover:from-cyan-300 hover:to-violet-400 shadow-lg shadow-cyan-400/30">
              <Save className="w-4 h-4 mr-2" />
              Save Character
            </Button>
          </div>
          <SimplifiedPreview characterData={characterData} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white">Create Character</h1>
              <p className="text-slate-400 mt-1">
                Design an AI personality for your scenarios
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                onClick={() => setShowPreview(true)}
                className="border-cyan-400/30 hover:border-cyan-400 text-cyan-400 hover:text-cyan-300"
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button className="bg-gradient-to-r from-cyan-400 to-violet-500 hover:from-cyan-300 hover:to-violet-400 shadow-lg shadow-cyan-400/30">
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </Button>
            </div>
          </div>
          
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Character Development Progress</span>
              <span className="text-cyan-400 font-medium">{Math.round(getCompletionProgress())}% Complete</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-cyan-400 to-violet-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${getCompletionProgress()}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Navigation */}
          <div className="w-80 shrink-0">
            <Card className="sticky top-6 bg-gradient-to-br from-slate-800/80 to-slate-700/50 backdrop-blur border border-slate-600">
              <CardHeader>
                <CardTitle className="text-lg text-white">Character Sections</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {sections.map((section) => {
                  const IconComponent = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full text-left p-3 rounded-md transition-colors ${
                        activeSection === section.id
                          ? 'bg-cyan-400/20 border border-cyan-400/30'
                          : 'hover:bg-slate-700/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <IconComponent className="w-4 h-4 text-cyan-400" />
                          <span className="font-medium text-sm text-white">{section.title}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getSectionCompletionStatus(section.id) && (
                            <Badge variant="secondary" className="text-xs bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                              Complete
                            </Badge>
                          )}
                          <ChevronRight className="w-4 h-4 text-slate-400" />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {renderActiveComponent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterCreationForm;
