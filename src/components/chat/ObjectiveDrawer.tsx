
import React from 'react';
import { X, Lightbulb, ChevronRight } from 'lucide-react';

interface Objective {
  id: string;
  title: string;
  description: string;
  completion_percentage: number;
  status: 'active' | 'completed' | 'failed';
  priority: 'critical' | 'normal';
  hints: string[];
  progress_notes: string;
}

interface ObjectiveDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  objectives: Objective[];
}

const ObjectiveDrawer: React.FC<ObjectiveDrawerProps> = ({ isOpen, onClose, objectives }) => {
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
        className={`fixed inset-x-0 bottom-0 bg-slate-800 border-t-2 border-cyan-400 z-50 
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
        <div className="px-6 pb-4 border-b border-slate-700 flex-shrink-0">
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
          <p className="text-sm text-slate-400 mt-1">Kobayashi Maru Simulation • Turn 1</p>
        </div>
        
        {/* Scrollable Content - Key changes here */}
        <div className="flex-1 overflow-y-auto px-6 py-4 min-h-0">
          <div className="space-y-6">
            {objectives.map((objective) => (
              <div key={objective.id} className="bg-slate-700 rounded-xl p-5 border border-slate-600">
                {/* Header with Priority Badge */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-white">{objective.title}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        objective.priority === 'critical' 
                          ? 'bg-red-500/20 text-red-400 border border-red-500' 
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500'
                      }`}>
                        {objective.priority.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-slate-300">{objective.description}</p>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-slate-400">Progress</span>
                    <span className="text-sm font-bold text-cyan-400">{objective.completion_percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-600 rounded-full h-2">
                    <div 
                      className="bg-cyan-400 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${objective.completion_percentage}%` }}
                    />
                  </div>
                </div>
                
                {/* Progress Notes */}
                <div className="mb-4 p-3 bg-slate-800 rounded-lg">
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
