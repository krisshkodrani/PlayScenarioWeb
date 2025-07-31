
import React from 'react';
import { X, User, Briefcase } from 'lucide-react';
import CharacterAvatar from './CharacterAvatar';

interface Character {
  id: string;
  name: string;
  role: string;
  avatar_color: string;
  avatar_url?: string;
  personality: string;
}

interface CharacterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  characters: Character[];
}

const CharacterDrawer: React.FC<CharacterDrawerProps> = ({ isOpen, onClose, characters }) => {
  return (
    <>
      {/* Overlay Background */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`} 
        onClick={onClose} 
      />

      {/* Character Drawer */}
      <div 
        className={`fixed inset-x-0 bottom-0 bg-gradient-to-br from-slate-800/80 to-slate-700/50 backdrop-blur border-t-2 border-violet-400 z-50 
          transition-transform duration-300 ease-out rounded-t-2xl flex flex-col ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`} 
        style={{ height: '70vh' }}
      >
        {/* Drag Handle */}
        <div className="flex justify-center py-3 flex-shrink-0">
          <div className="w-12 h-1 bg-slate-600 rounded-full" />
        </div>
        
        {/* Header */}
        <div className="px-6 pb-4 border-b border-slate-600 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-violet-400">Active Characters</h2>
            <button 
              onClick={onClose} 
              className="text-slate-400 hover:text-white transition-colors p-1"
              aria-label="Close characters"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="text-sm text-slate-400 mt-1">Kobayashi Maru Simulation • Available Characters</p>
        </div>
        
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 min-h-0">
          <div className="space-y-4">
            {characters.map((character) => (
              <div key={character.id} className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 backdrop-blur border border-slate-600 rounded-xl p-5 shadow-lg">
                {/* Character Header */}
                <div className="flex items-center gap-4 mb-3">
                  <CharacterAvatar character={character} size="lg" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-white text-lg">{character.name}</h3>
                    <div className="flex items-center gap-2 text-violet-400 mt-1">
                      <Briefcase className="w-4 h-4" />
                      <span className="text-sm font-medium">{character.role}</span>
                    </div>
                  </div>
                </div>
                
                {/* Personality Section */}
                <div className="mb-4 p-3 bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur border border-slate-600 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-cyan-400" />
                    <h4 className="text-sm font-medium text-cyan-400">Personality Profile</h4>
                  </div>
                  <p className="text-sm text-slate-300">{character.personality}</p>
                </div>
                
                {/* Status Indicator */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-xs text-emerald-400 font-medium">ACTIVE</span>
                  </div>
                  <span className="text-xs text-slate-400">Ready for interaction</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default CharacterDrawer;
