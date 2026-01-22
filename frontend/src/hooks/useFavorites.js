import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'mininft-favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    }
    return [];
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = useCallback((tokenId) => {
    setFavorites(prev => {
      if (prev.includes(tokenId)) return prev;
      return [...prev, tokenId];
    });
  }, []);

  const removeFavorite = useCallback((tokenId) => {
    setFavorites(prev => prev.filter(id => id !== tokenId));
  }, []);

  const toggleFavorite = useCallback((tokenId) => {
    setFavorites(prev => {
      if (prev.includes(tokenId)) {
        return prev.filter(id => id !== tokenId);
      }
      return [...prev, tokenId];
    });
  }, []);

  const isFavorite = useCallback((tokenId) => {
    return favorites.includes(tokenId);
  }, [favorites]);

  const clearFavorites = useCallback(() => {
    setFavorites([]);
  }, []);

  return {
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    clearFavorites,
    count: favorites.length,
  };
}

export default useFavorites;
