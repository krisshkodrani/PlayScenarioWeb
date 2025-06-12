
import React from 'react';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';

interface NoSearchResultsProps {
  query: string;
  onClearSearch?: () => void;
}

const NoSearchResults: React.FC<NoSearchResultsProps> = ({ 
  query, 
  onClearSearch 
}) => {
  return (
    <div className="text-center py-12">
      <div className="max-w-md mx-auto">
        {/* Icon */}
        <div className="w-16 h-16 mx-auto mb-6 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700">
          <Search className="w-8 h-8 text-slate-400" />
        </div>

        {/* Heading */}
        <h3 className="text-xl font-semibold text-white mb-2">
          No characters found
        </h3>
        
        {/* Description */}
        <p className="text-slate-400 mb-6">
          No characters match your search for{' '}
          <span className="text-cyan-400 font-medium">"{query}"</span>
        </p>

        {/* Actions */}
        <div className="space-y-3">
          {onClearSearch && (
            <Button 
              variant="outline" 
              onClick={onClearSearch}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <X className="w-4 h-4 mr-2" />
              Clear Search
            </Button>
          )}
          
          <p className="text-sm text-slate-500">
            Try adjusting your search terms or filters
          </p>
        </div>
      </div>
    </div>
  );
};

export default NoSearchResults;
