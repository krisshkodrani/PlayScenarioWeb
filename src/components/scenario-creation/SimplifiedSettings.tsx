
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Settings, Globe, Lock } from 'lucide-react';
import { ScenarioData } from '@/types/scenario';

interface SimplifiedSettingsProps {
  data: ScenarioData;
  onChange: (updates: Partial<ScenarioData>) => void;
}

const SimplifiedSettings: React.FC<SimplifiedSettingsProps> = ({ data, onChange }) => {
  return (
    <div className="space-y-6">
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-cyan-400 flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Publication Settings
          </CardTitle>
          <p className="text-slate-400 text-sm">
            Control how your scenario is shared and accessed
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="is-public" className="text-white font-medium">
                Public Scenario
              </Label>
              <p className="text-sm text-slate-400">
                Allow other users to discover and play your scenario
              </p>
            </div>
            <Switch
              id="is-public"
              checked={data.is_public}
              onCheckedChange={(checked) => onChange({ is_public: checked })}
            />
          </div>
          
          <div className="p-4 rounded-lg border border-slate-600 bg-slate-700/30">
            <div className="flex items-start gap-3">
              {data.is_public ? (
                <Globe className="w-5 h-5 text-emerald-400 mt-0.5" />
              ) : (
                <Lock className="w-5 h-5 text-amber-400 mt-0.5" />
              )}
              <div className="space-y-1">
                <h4 className="text-white font-medium">
                  {data.is_public ? 'Public Scenario' : 'Private Scenario'}
                </h4>
                <p className="text-sm text-slate-400">
                  {data.is_public 
                    ? 'Your scenario will be visible in the public library and can be played by anyone.'
                    : 'Your scenario will only be accessible to you and those you explicitly share it with.'
                  }
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white text-sm">📋 Publishing Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-slate-400">
            <p>• Ensure your scenario has a clear title and description</p>
            <p>• Add at least one objective to guide participants</p>
            <p>• Include characters with detailed personalities</p>
            <p>• Test your scenario before making it public</p>
            <p>• Follow community guidelines for appropriate content</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SimplifiedSettings;
