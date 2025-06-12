
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const CreationTips: React.FC = () => {
  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-sm text-slate-400">Creation Tips</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-slate-300 space-y-2">
        <p>• Start with clear objectives that guide the experience</p>
        <p>• Create characters with distinct personalities and expertise</p>
        <p>• Write an engaging initial scene prompt</p>
        <p>• Define clear win and lose conditions</p>
        <p>• Test your scenario before publishing</p>
      </CardContent>
    </Card>
  );
};

export default CreationTips;
