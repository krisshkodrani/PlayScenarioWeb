
import React, { useState, useEffect } from 'react';
import PageHeader from '@/components/navigation/PageHeader';
import { Button } from '@/components/ui/button';
import { CharacterModerationFilters } from '@/components/admin/CharacterModerationFilters';
import { CharacterModerationTable } from '@/components/admin/CharacterModerationTable';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { 
  adminCharacterService, 
  AdminCharacterFilters, 
  AdminCharacter 
} from '@/services/admin/adminCharacterService';
import { Shield, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CharacterModeration: React.FC = () => {
  const { toast } = useToast();
  const [characters, setCharacters] = useState<AdminCharacter[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const [filters, setFilters] = useState<AdminCharacterFilters>({
    search: '',
    status: 'all',
    creator: '',
    role: '',
    dateFrom: '',
    dateTo: ''
  });

  const loadCharacters = async (page: number = 1) => {
    setLoading(true);
    try {
      const result = await adminCharacterService.getCharacters(filters, page, pageSize);
      setCharacters(result.characters);
      setTotal(result.total);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error loading characters:', error);
      toast({
        title: "Error",
        description: "Failed to load characters. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCharacters(1);
  }, [filters]);

  const handleBlockCharacter = async (characterId: string, reason: string) => {
    try {
      await adminCharacterService.blockCharacter(characterId, reason);
      toast({
        title: "Character Blocked",
        description: "The character has been successfully blocked.",
      });
      await loadCharacters(currentPage);
    } catch (error) {
      console.error('Error blocking character:', error);
      toast({
        title: "Error",
        description: "Failed to block character. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUnblockCharacter = async (characterId: string, reason: string) => {
    try {
      await adminCharacterService.unblockCharacter(characterId, reason);
      toast({
        title: "Character Unblocked",
        description: "The character has been successfully unblocked.",
      });
      await loadCharacters(currentPage);
    } catch (error) {
      console.error('Error unblocking character:', error);
      toast({
        title: "Error",
        description: "Failed to unblock character. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSetPendingReview = async (characterId: string, reason: string) => {
    try {
      await adminCharacterService.setPendingReview(characterId, reason);
      toast({
        title: "Character Marked for Review",
        description: "The character has been marked for pending review.",
      });
      await loadCharacters(currentPage);
    } catch (error) {
      console.error('Error setting pending review:', error);
      toast({
        title: "Error",
        description: "Failed to mark character for review. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      creator: '',
      role: '',
      
      dateFrom: '',
      dateTo: ''
    });
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <PageHeader
          title="Character Moderation"
          subtitle="Review and moderate character content"
          actions={
            <Button
              onClick={() => loadCharacters(currentPage)}
              className="bg-cyan-400 text-slate-900 hover:bg-cyan-300"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          }
        />

        <CharacterModerationFilters
          filters={filters}
          onFiltersChange={setFilters}
          onClearFilters={handleClearFilters}
        />

        <CharacterModerationTable
          characters={characters}
          loading={loading}
          onBlockCharacter={handleBlockCharacter}
          onUnblockCharacter={handleUnblockCharacter}
          onSetPendingReview={handleSetPendingReview}
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => currentPage > 1 && loadCharacters(currentPage - 1)}
                    className={currentPage <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer text-cyan-400 hover:text-cyan-300'}
                  />
                </PaginationItem>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => loadCharacters(page)}
                        isActive={currentPage === page}
                        className="cursor-pointer text-slate-300 hover:text-white hover:bg-slate-700"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => currentPage < totalPages && loadCharacters(currentPage + 1)}
                    className={currentPage >= totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer text-cyan-400 hover:text-cyan-300'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}

        {/* Summary */}
        <div className="text-center text-slate-400 text-sm">
          Showing {characters.length} of {total} characters
          {total > 0 && ` (Page ${currentPage} of ${totalPages})`}
        </div>
      </div>
    </div>
  );
};

export default CharacterModeration;
