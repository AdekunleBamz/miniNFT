import { useState, useCallback, useEffect, useRef } from 'react';

/**
 * Hook for managing filter state
 * @param {Object} initialFilters - Initial filter values
 * @param {Object} options - Filter options
 * @returns {Object} Filter state and handlers
 */
export function useFilter(initialFilters = {}, options = {}) {
  const {
    onFilterChange,
    syncToUrl = false,
    urlParamPrefix = ''
  } = options;

  const [filters, setFilters] = useState(initialFilters);
  const [activeFilterCount, setActiveFilterCount] = useState(0);
  const initialRef = useRef(initialFilters);

  // Calculate active filter count
  useEffect(() => {
    let count = 0;
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== initialRef.current[key] && value !== '' && value !== null && value !== undefined) {
        if (Array.isArray(value) && value.length === 0) return;
        count++;
      }
    });
    setActiveFilterCount(count);
  }, [filters]);

  // Sync to URL if enabled
  useEffect(() => {
    if (!syncToUrl) return;

    const url = new URL(window.location.href);
    
    Object.entries(filters).forEach(([key, value]) => {
      const paramName = urlParamPrefix + key;
      
      if (value === '' || value === null || value === undefined) {
        url.searchParams.delete(paramName);
      } else if (Array.isArray(value)) {
        url.searchParams.delete(paramName);
        value.forEach(v => url.searchParams.append(paramName, v));
      } else {
        url.searchParams.set(paramName, String(value));
      }
    });

    window.history.replaceState({}, '', url.toString());
  }, [filters, syncToUrl, urlParamPrefix]);

  const setFilter = useCallback((key, value) => {
    setFilters(prev => {
      const updated = { ...prev, [key]: value };
      onFilterChange?.(updated);
      return updated;
    });
  }, [onFilterChange]);

  const setMultipleFilters = useCallback((updates) => {
    setFilters(prev => {
      const updated = { ...prev, ...updates };
      onFilterChange?.(updated);
      return updated;
    });
  }, [onFilterChange]);

  const toggleFilter = useCallback((key, value) => {
    setFilters(prev => {
      const current = prev[key];
      
      if (Array.isArray(current)) {
        const updated = current.includes(value)
          ? current.filter(v => v !== value)
          : [...current, value];
        const newFilters = { ...prev, [key]: updated };
        onFilterChange?.(newFilters);
        return newFilters;
      }
      
      const updated = current === value ? initialRef.current[key] : value;
      const newFilters = { ...prev, [key]: updated };
      onFilterChange?.(newFilters);
      return newFilters;
    });
  }, [onFilterChange]);

  const resetFilter = useCallback((key) => {
    setFilters(prev => {
      const updated = { ...prev, [key]: initialRef.current[key] };
      onFilterChange?.(updated);
      return updated;
    });
  }, [onFilterChange]);

  const resetAllFilters = useCallback(() => {
    setFilters(initialRef.current);
    onFilterChange?.(initialRef.current);
  }, [onFilterChange]);

  const hasActiveFilters = activeFilterCount > 0;

  const isFilterActive = useCallback((key, value) => {
    const current = filters[key];
    if (Array.isArray(current)) {
      return current.includes(value);
    }
    return current === value;
  }, [filters]);

  return {
    filters,
    setFilter,
    setMultipleFilters,
    toggleFilter,
    resetFilter,
    resetAllFilters,
    activeFilterCount,
    hasActiveFilters,
    isFilterActive
  };
}

/**
 * Hook for range filter (min/max)
 */
export function useRangeFilter(key, options = {}) {
  const { min: initialMin = 0, max: initialMax = 100, step = 1 } = options;
  
  const [range, setRange] = useState({ min: initialMin, max: initialMax });

  const setMin = useCallback((value) => {
    setRange(prev => ({
      ...prev,
      min: Math.min(value, prev.max - step)
    }));
  }, [step]);

  const setMax = useCallback((value) => {
    setRange(prev => ({
      ...prev,
      max: Math.max(value, prev.min + step)
    }));
  }, [step]);

  const reset = useCallback(() => {
    setRange({ min: initialMin, max: initialMax });
  }, [initialMin, initialMax]);

  const isInRange = useCallback((value) => {
    return value >= range.min && value <= range.max;
  }, [range]);

  return {
    range,
    setRange,
    setMin,
    setMax,
    reset,
    isInRange,
    isModified: range.min !== initialMin || range.max !== initialMax
  };
}

/**
 * Hook for multi-select filter
 */
export function useMultiSelect(initialSelected = [], options = {}) {
  const { maxSelections, onSelectionChange } = options;
  
  const [selected, setSelected] = useState(initialSelected);

  const toggle = useCallback((item) => {
    setSelected(prev => {
      let updated;
      
      if (prev.includes(item)) {
        updated = prev.filter(i => i !== item);
      } else {
        if (maxSelections && prev.length >= maxSelections) {
          return prev;
        }
        updated = [...prev, item];
      }
      
      onSelectionChange?.(updated);
      return updated;
    });
  }, [maxSelections, onSelectionChange]);

  const select = useCallback((item) => {
    setSelected(prev => {
      if (prev.includes(item)) return prev;
      if (maxSelections && prev.length >= maxSelections) return prev;
      
      const updated = [...prev, item];
      onSelectionChange?.(updated);
      return updated;
    });
  }, [maxSelections, onSelectionChange]);

  const deselect = useCallback((item) => {
    setSelected(prev => {
      const updated = prev.filter(i => i !== item);
      onSelectionChange?.(updated);
      return updated;
    });
  }, [onSelectionChange]);

  const clear = useCallback(() => {
    setSelected([]);
    onSelectionChange?.([]);
  }, [onSelectionChange]);

  const selectAll = useCallback((items) => {
    const toSelect = maxSelections 
      ? items.slice(0, maxSelections)
      : items;
    setSelected(toSelect);
    onSelectionChange?.(toSelect);
  }, [maxSelections, onSelectionChange]);

  return {
    selected,
    toggle,
    select,
    deselect,
    clear,
    selectAll,
    isSelected: (item) => selected.includes(item),
    count: selected.length,
    canSelectMore: !maxSelections || selected.length < maxSelections
  };
}

/**
 * Hook for sort options
 */
export function useSort(defaultSort = { field: 'id', order: 'asc' }) {
  const [sort, setSort] = useState(defaultSort);

  const setField = useCallback((field) => {
    setSort(prev => ({
      field,
      order: prev.field === field 
        ? (prev.order === 'asc' ? 'desc' : 'asc')
        : 'asc'
    }));
  }, []);

  const setOrder = useCallback((order) => {
    setSort(prev => ({ ...prev, order }));
  }, []);

  const toggle = useCallback(() => {
    setSort(prev => ({
      ...prev,
      order: prev.order === 'asc' ? 'desc' : 'asc'
    }));
  }, []);

  const reset = useCallback(() => {
    setSort(defaultSort);
  }, [defaultSort]);

  const sortFn = useCallback((a, b) => {
    const aVal = a[sort.field];
    const bVal = b[sort.field];
    const order = sort.order === 'asc' ? 1 : -1;

    if (typeof aVal === 'number') {
      return (aVal - bVal) * order;
    }
    return String(aVal).localeCompare(String(bVal)) * order;
  }, [sort]);

  return {
    sort,
    setField,
    setOrder,
    toggle,
    reset,
    sortFn
  };
}

export default useFilter;
