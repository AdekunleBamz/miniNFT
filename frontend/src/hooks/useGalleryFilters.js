import { useState, useMemo } from 'react';

export function useGalleryFilters(tokens) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' | 'desc'
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  
  const filteredTokens = useMemo(() => {
    let result = [...tokens];
    
    // Filter by search query (token ID)
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      result = result.filter(tokenId => 
        String(tokenId).includes(query)
      );
    }
    
    // Sort
    result.sort((a, b) => {
      if (sortOrder === 'asc') return a - b;
      return b - a;
    });
    
    return result;
  }, [tokens, searchQuery, sortOrder]);

  const clearFilters = () => {
    setSearchQuery('');
    setSortOrder('desc');
    setShowFavoritesOnly(false);
  };

  const hasActiveFilters = searchQuery.trim() !== '' || sortOrder !== 'desc' || showFavoritesOnly;

  return {
    searchQuery,
    setSearchQuery,
    sortOrder,
    setSortOrder,
    showFavoritesOnly,
    setShowFavoritesOnly,
    filteredTokens,
    clearFilters,
    hasActiveFilters,
    resultCount: filteredTokens.length,
    totalCount: tokens.length,
  };
}

export default useGalleryFilters;
