import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface CharacterPublicationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPublishing: boolean;
  characterName: string;
  actionType: 'publish' | 'private';
}

const CharacterPublicationDialog: React.FC<CharacterPublicationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isPublishing,
  characterName,
  actionType
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="bg-slate-800 border-slate-700">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">
            {actionType === 'publish' ? 'Make Character Public?' : 'Make Character Private?'}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-slate-300">
            {actionType === 'publish' ? (
              <>
                Making <span className="text-cyan-400 font-medium">"{characterName}"</span> public will allow other players to use this character in their scenarios. The character will be visible in the character browser and can be added to any scenario.
              </>
            ) : (
              <>
                Making <span className="text-cyan-400 font-medium">"{characterName}"</span> private will remove it from public visibility. Only you will be able to use this character in scenarios.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel 
            className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
            disabled={isPublishing}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isPublishing}
            className={actionType === 'publish' 
              ? "bg-gradient-to-r from-cyan-400 to-violet-500 hover:from-cyan-300 hover:to-violet-400 text-slate-900 font-semibold" 
              : "bg-slate-600 hover:bg-slate-500 text-white"
            }
          >
            {isPublishing ? 'Processing...' : (actionType === 'publish' ? 'Make Public' : 'Make Private')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CharacterPublicationDialog;