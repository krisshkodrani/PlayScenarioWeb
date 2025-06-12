
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { 
  MoreVertical, 
  Edit, 
  Eye, 
  Copy, 
  Share, 
  Globe, 
  Lock, 
  Trash2 
} from 'lucide-react';
import { Scenario } from '@/types/scenario';

interface ScenarioActionMenuProps {
  scenario: Scenario;
  onEdit: () => void;
  onView: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onTogglePublic: (isPublic: boolean) => void;
}

const ScenarioActionMenu: React.FC<ScenarioActionMenuProps> = ({
  scenario,
  onEdit,
  onView,
  onDelete,
  onDuplicate,
  onTogglePublic
}) => {
  const handleShare = () => {
    const url = `${window.location.origin}/scenario/${scenario.id}`;
    navigator.clipboard.writeText(url);
  };

  // Mock is_public property since it's not in the current Scenario type
  const isPublic = Math.random() > 0.5;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
        <DropdownMenuItem onClick={onView} className="text-slate-300 hover:bg-slate-700">
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onEdit} className="text-slate-300 hover:bg-slate-700">
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onDuplicate} className="text-slate-300 hover:bg-slate-700">
          <Copy className="mr-2 h-4 w-4" />
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleShare} className="text-slate-300 hover:bg-slate-700">
          <Share className="mr-2 h-4 w-4" />
          Share
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-slate-600" />
        <DropdownMenuItem 
          onClick={() => onTogglePublic(!isPublic)}
          className="text-slate-300 hover:bg-slate-700"
        >
          {isPublic ? (
            <>
              <Lock className="mr-2 h-4 w-4" />
              Make Private
            </>
          ) : (
            <>
              <Globe className="mr-2 h-4 w-4" />
              Make Public
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-slate-600" />
        <DropdownMenuItem 
          onClick={onDelete}
          className="text-red-400 hover:bg-red-900/20"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ScenarioActionMenu;
