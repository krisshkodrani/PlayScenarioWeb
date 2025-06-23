
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, User, Brain, Lightbulb } from 'lucide-react';

const sections = [
  { id: 'basic', title: 'Basic Information', icon: User },
  { id: 'personality', title: 'Personality', icon: Brain },
  { id: 'expertise', title: 'Expertise', icon: Lightbulb },
];

interface CharacterCreationSidebarProps {
  activeSection: string;
  onSectionChange: (sectionId: string) => void;
  getSectionCompletionStatus: (sectionId: string) => boolean;
}

const CharacterCreationSidebar: React.FC<CharacterCreationSidebarProps> = ({
  activeSection,
  onSectionChange,
  getSectionCompletionStatus
}) => {
  return (
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
                onClick={() => onSectionChange(section.id)}
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
  );
};

export default CharacterCreationSidebar;
