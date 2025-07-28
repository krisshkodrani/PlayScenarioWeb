import { useState, useCallback, useMemo } from 'react';

export interface BulkSelectionHook<T> {
  selectedItems: Set<string>;
  isSelected: (id: string) => boolean;
  isAllSelected: boolean;
  isPartialSelected: boolean;
  selectedCount: number;
  totalCount: number;
  toggleItem: (id: string) => void;
  toggleAll: () => void;
  clearSelection: () => void;
  selectItems: (ids: string[]) => void;
  getSelectedIds: () => string[];
}

export const useBulkSelection = <T extends { id: string }>(
  items: T[]
): BulkSelectionHook<T> => {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const totalCount = items.length;
  const selectedCount = selectedItems.size;

  const isSelected = useCallback((id: string) => {
    return selectedItems.has(id);
  }, [selectedItems]);

  const isAllSelected = useMemo(() => {
    return totalCount > 0 && selectedCount === totalCount;
  }, [selectedCount, totalCount]);

  const isPartialSelected = useMemo(() => {
    return selectedCount > 0 && selectedCount < totalCount;
  }, [selectedCount, totalCount]);

  const toggleItem = useCallback((id: string) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const toggleAll = useCallback(() => {
    if (isAllSelected) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(items.map(item => item.id)));
    }
  }, [isAllSelected, items]);

  const clearSelection = useCallback(() => {
    setSelectedItems(new Set());
  }, []);

  const selectItems = useCallback((ids: string[]) => {
    setSelectedItems(new Set(ids));
  }, []);

  const getSelectedIds = useCallback(() => {
    return Array.from(selectedItems);
  }, [selectedItems]);

  return {
    selectedItems,
    isSelected,
    isAllSelected,
    isPartialSelected,
    selectedCount,
    totalCount,
    toggleItem,
    toggleAll,
    clearSelection,
    selectItems,
    getSelectedIds
  };
};