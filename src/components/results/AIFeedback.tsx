
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain } from 'lucide-react';

interface AIFeedbackProps {
  completionReason: string | null;
  status: string;
  objectives: Record<string, any>;
}

const AIFeedback: React.FC<AIFeedbackProps> = ({ 
  completionReason, 
  status, 
  objectives 
}) => {
  const getFeedbackMessage = () => {
    if (completionReason) return completionReason;
    
    switch (status) {
      case 'won':
        return "Excellent work! You successfully completed the scenario and achieved your objectives through strategic thinking and effective decision-making.";
      case 'lost':
        return "While you didn't achieve victory this time, you demonstrated problem-solving skills. Review the objectives and consider alternative approaches for next time.";
      case 'abandoned':
        return "You left the scenario incomplete. Consider returning to finish what you started and achieve the learning objectives.";
      default:
        return "You completed the scenario. Review your performance and consider how you might approach similar challenges in the future.";
    }
  };

  const getImprovementSuggestions = () => {
    const suggestions = [
      "Consider exploring different conversation strategies",
      "Focus on gathering information before making decisions",
      "Pay attention to character relationships and motivations"
    ];

    // Add status-specific suggestions
    if (status === 'lost') {
      suggestions.push("Review the win conditions and adjust your approach");
    } else if (status === 'abandoned') {
      suggestions.push("Try to complete scenarios for maximum learning benefit");
    }

    return suggestions;
  };

  return (
    <Card className="bg-slate-800 border-slate-700 my-8">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Brain className="w-5 h-5 text-cyan-400" />
          AI Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-slate-700 p-4 rounded-lg">
          <p className="text-slate-300 leading-relaxed">
            {getFeedbackMessage()}
          </p>
        </div>

        {/* Improvement Suggestions */}
        <div className="mt-4 space-y-2">
          <h4 className="text-white font-medium">Areas for Growth:</h4>
          <div className="text-sm text-slate-400 space-y-1">
            {getImprovementSuggestions().map((suggestion, index) => (
              <div key={index}>• {suggestion}</div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIFeedback;
