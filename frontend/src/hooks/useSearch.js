import { useState, useCallback, useEffect, useRef } from 'react';

/**
 * Hook for managing search functionality
 * @param {Array} items - Items to search through
 * @param {Object} options - Search options
 * @returns {Object} Search state and handlers
 */
export function useSearch(items = [], options = {}) {
  const {
    keys = ['name'],
    debounceMs = 300,
    minLength = 1,
    caseSensitive = false
  } = options;

  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [results, setResults] = useState(items);
  const [isSearching, setIsSearching] = useState(false);
  const timeoutRef = useRef(null);

  // Debounce the search query
  useEffect(() => {
    setIsSearching(true);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setDebouncedQuery(query);
      setIsSearching(false);
    }, debounceMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [query, debounceMs]);

  // Perform search when debounced query changes
  useEffect(() => {
    if (debouncedQuery.length < minLength) {
      setResults(items);
      return;
    }

    const searchTerm = caseSensitive ? debouncedQuery : debouncedQuery.toLowerCase();

    const filtered = items.filter(item => {
      return keys.some(key => {
        const value = getNestedValue(item, key);
        if (value === null || value === undefined) return false;
        
        const stringValue = String(value);
        const compareValue = caseSensitive ? stringValue : stringValue.toLowerCase();
        
        return compareValue.includes(searchTerm);
      });
    });

    setResults(filtered);
  }, [items, debouncedQuery, keys, minLength, caseSensitive]);

  const clearSearch = useCallback(() => {
    setQuery('');
    setDebouncedQuery('');
    setResults(items);
  }, [items]);

  const highlightMatch = useCallback((text, className = 'search-highlight') => {
    if (!debouncedQuery || debouncedQuery.length < minLength) {
      return text;
    }

    const regex = new RegExp(`(${escapeRegExp(debouncedQuery)})`, caseSensitive ? 'g' : 'gi');
    const parts = String(text).split(regex);

    return parts.map((part, i) => 
      regex.test(part) 
        ? { type: 'match', text: part, className }
        : { type: 'text', text: part }
    );
  }, [debouncedQuery, minLength, caseSensitive]);

  return {
    query,
    setQuery,
    results,
    isSearching,
    clearSearch,
    highlightMatch,
    hasQuery: query.length >= minLength,
    resultCount: results.length
  };
}

/**
 * Hook for search suggestions/autocomplete
 * @param {Function} fetchSuggestions - Function to fetch suggestions
 * @param {Object} options - Options
 * @returns {Object} Suggestion state and handlers
 */
export function useSearchSuggestions(fetchSuggestions, options = {}) {
  const {
    debounceMs = 300,
    minLength = 2,
    maxSuggestions = 10,
    cacheResults = true
  } = options;

  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);
  const cacheRef = useRef(new Map());
  const abortControllerRef = useRef(null);

  useEffect(() => {
    if (query.length < minLength) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    // Check cache first
    if (cacheResults && cacheRef.current.has(query)) {
      setSuggestions(cacheRef.current.get(query));
      setIsOpen(true);
      return;
    }

    const timeoutId = setTimeout(async () => {
      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      setIsLoading(true);

      try {
        const results = await fetchSuggestions(query, {
          signal: abortControllerRef.current.signal
        });
        
        const limited = results.slice(0, maxSuggestions);
        
        if (cacheResults) {
          cacheRef.current.set(query, limited);
        }
        
        setSuggestions(limited);
        setIsOpen(limited.length > 0);
        setSelectedIndex(-1);
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Search suggestions error:', error);
          setSuggestions([]);
        }
      } finally {
        setIsLoading(false);
      }
    }, debounceMs);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [query, fetchSuggestions, debounceMs, minLength, maxSuggestions, cacheResults]);

  const handleKeyDown = useCallback((e) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        if (selectedIndex >= 0) {
          e.preventDefault();
          return suggestions[selectedIndex];
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
    return null;
  }, [isOpen, suggestions, selectedIndex]);

  const selectSuggestion = useCallback((index) => {
    if (index >= 0 && index < suggestions.length) {
      const selected = suggestions[index];
      setQuery(typeof selected === 'string' ? selected : selected.label || selected.name);
      setIsOpen(false);
      setSelectedIndex(-1);
      return selected;
    }
    return null;
  }, [suggestions]);

  const clearCache = useCallback(() => {
    cacheRef.current.clear();
  }, []);

  return {
    query,
    setQuery,
    suggestions,
    isLoading,
    isOpen,
    setIsOpen,
    selectedIndex,
    handleKeyDown,
    selectSuggestion,
    clearCache
  };
}

/**
 * Hook for recent searches
 */
export function useRecentSearches(storageKey = 'recentSearches', maxItems = 10) {
  const [searches, setSearches] = useState(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const addSearch = useCallback((query) => {
    if (!query || typeof query !== 'string') return;
    
    const trimmed = query.trim();
    if (!trimmed) return;

    setSearches(prev => {
      const filtered = prev.filter(s => s !== trimmed);
      const updated = [trimmed, ...filtered].slice(0, maxItems);
      
      try {
        localStorage.setItem(storageKey, JSON.stringify(updated));
      } catch (error) {
        console.warn('Failed to save recent searches:', error);
      }
      
      return updated;
    });
  }, [storageKey, maxItems]);

  const removeSearch = useCallback((query) => {
    setSearches(prev => {
      const updated = prev.filter(s => s !== query);
      localStorage.setItem(storageKey, JSON.stringify(updated));
      return updated;
    });
  }, [storageKey]);

  const clearSearches = useCallback(() => {
    setSearches([]);
    localStorage.removeItem(storageKey);
  }, [storageKey]);

  return {
    searches,
    addSearch,
    removeSearch,
    clearSearches
  };
}

// Helper functions
function getNestedValue(obj, path) {
  return path.split('.').reduce((current, key) => 
    current && current[key] !== undefined ? current[key] : null, obj
  );
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export default useSearch;
