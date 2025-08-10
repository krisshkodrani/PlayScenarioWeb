
import React from 'react';
import { X, Lightbulb, ChevronRight } from 'lucide-react';

interface Objective {
  id: string;
  title: string;
  description: string;
  completion_percentage: number;
  status: 'active' | 'completed' | 'failed' | 'inactive' | 'struggling' | 'nearly_complete' | 'significant_progress' | 'making_progress' | 'started' | 'not_started';
  priority: 'critical' | 'normal';
  hints: string[];
  progress_notes: string;
}

interface ObjectiveDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  objectives: Objective[];
  scenarioTitle?: string;
  currentTurn?: number;
}

const ObjectiveDrawer: React.FC<ObjectiveDrawerProps> = ({ isOpen, onClose, objectives, scenarioTitle, currentTurn }) => {
  return (
    <>
      {/* Overlay Background */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`} 
        onClick={onClose} 
      />

      {/* Objective Drawer - Fixed Version */}
      <div 
        className={`fixed inset-x-0 bottom-0 bg-gradient-to-br from-slate-800/80 to-slate-700/50 backdrop-blur border-t-2 border-cyan-400 z-50 
          transition-transform duration-300 ease-out rounded-t-2xl flex flex-col ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`} 
        style={{ height: '70vh' }}
      >
        {/* Drag Handle - Fixed height */}
        <div className="flex justify-center py-3 flex-shrink-0">
          <div className="w-12 h-1 bg-slate-600 rounded-full" />
        </div>
        
        {/* Header - Fixed height */}
        <div className="px-6 pb-4 border-b border-slate-600 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-cyan-400">Mission Objectives</h2>
            <button 
              onClick={onClose} 
              className="text-slate-400 hover:text-white transition-colors p-1"
              aria-label="Close objectives"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            {scenarioTitle || 'Active Scenario'} • Turn {currentTurn || 1}
          </p>
        </div>
        
        {/* Scrollable Content - Key changes here */}
        <div className="flex-1 overflow-y-auto px-6 py-4 min-h-0">
          <div className="space-y-6">
            {objectives.map((objective) => (
              <div key={objective.id} className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 backdrop-blur border border-slate-600 rounded-xl p-5 shadow-lg">
                {/* Header with Priority Badge */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-white">{objective.title}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${
                        objective.priority === 'critical' 
                          ? 'bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-400 border-red-500' 
                          : 'bg-gradient-to-r from-amber-500/20 to-amber-600/20 text-amber-400 border-amber-500'
                      }`}>
                        {objective.priority.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-slate-300">{objective.description}</p>
                  </div>
                </div>
                
                {/* Progress Bar with Status */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-400">Progress</span>
                      <span className={`px-2 py-0.5 text-xs rounded-full font-medium capitalize ${
                        objective.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' :
                        objective.status === 'nearly_complete' ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' :
                        objective.status === 'significant_progress' ? 'bg-blue-500/15 text-blue-300 border border-blue-500/30' :
                        objective.status === 'making_progress' || objective.status === 'active' ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30' :
                        objective.status === 'started' ? 'bg-yellow-500/15 text-yellow-300 border border-yellow-500/30' :
                        objective.status === 'struggling' ? 'bg-orange-500/15 text-orange-300 border border-orange-500/30' :
                        objective.status === 'inactive' || objective.status === 'not_started' ? 'bg-slate-500/15 text-slate-400 border border-slate-500/30' :
                        'bg-red-500/15 text-red-300 border border-red-500/30'
                      }`}>
                        {objective.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-cyan-400">{objective.completion_percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-600 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all duration-500 shadow-lg ${
                        objective.completion_percentage >= 85 ? 'bg-gradient-to-r from-emerald-400 to-green-500' :
                        objective.completion_percentage >= 60 ? 'bg-gradient-to-r from-blue-400 to-emerald-400' :
                        objective.completion_percentage >= 35 ? 'bg-gradient-to-r from-cyan-400 to-blue-400' :
                        objective.completion_percentage >= 15 ? 'bg-gradient-to-r from-yellow-400 to-cyan-400' :
                        'bg-gradient-to-r from-orange-400 to-yellow-400'
                      }`}
                      style={{ width: `${objective.completion_percentage}%` }}
                    />
                  </div>
                </div>
                
                {/* Progress Notes */}
                <div className="mb-4 p-3 bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur border border-slate-600 rounded-lg">
                  <p className="text-sm text-slate-300">{objective.progress_notes}</p>
                </div>
                
                {/* Strategic Hints */}
                <div>
                  <h4 className="text-sm font-medium text-violet-400 mb-2 flex items-center gap-1">
                    <Lightbulb className="w-4 h-4" />
                    Strategic Hints
                  </h4>
                  <ul className="space-y-1">
                    {objective.hints.map((hint, index) => (
                      <li key={index} className="text-sm text-slate-400 flex items-start gap-2">
                        <ChevronRight className="w-3 h-3 mt-0.5 text-violet-500 flex-shrink-0" />
                        {hint}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ObjectiveDrawer;
