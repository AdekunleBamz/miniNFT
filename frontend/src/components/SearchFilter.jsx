import { useState } from 'react';
import { Spinner } from './Spinner';

/**
 * Search bar component with suggestions
 */
export function SearchBar({
  value = '',
  onChange,
  onSearch,
  placeholder = 'Search...',
  suggestions = [],
  loading = false,
  showClear = true,
  autoFocus = false,
  className = ''
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const handleKeyDown = (e) => {
    if (suggestions.length === 0) return;

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
          onSearch?.(suggestions[selectedIndex]);
        } else if (value) {
          onSearch?.(value);
        }
        break;
      case 'Escape':
        setIsFocused(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleClear = () => {
    onChange?.('');
    setSelectedIndex(-1);
  };

  const showSuggestions = isFocused && suggestions.length > 0;

  return (
    <div className={`search-bar ${className}`}>
      <div className="search-bar__input-wrapper">
        <span className="search-bar__icon">🔍</span>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="search-bar__input"
        />
        {loading && (
          <span className="search-bar__loading">
            <Spinner size="small" />
          </span>
        )}
        {showClear && value && !loading && (
          <button
            type="button"
            onClick={handleClear}
            className="search-bar__clear"
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {showSuggestions && (
        <ul className="search-bar__suggestions">
          {suggestions.map((suggestion, index) => (
            <li
              key={typeof suggestion === 'string' ? suggestion : suggestion.id || index}
              onClick={() => onSearch?.(suggestion)}
              className={`search-bar__suggestion ${
                index === selectedIndex ? 'search-bar__suggestion--selected' : ''
              }`}
            >
              {typeof suggestion === 'string' ? suggestion : suggestion.label || suggestion.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/**
 * Filter chip component
 */
export function FilterChip({
  label,
  active = false,
  count,
  onClick,
  onRemove,
  removable = false,
  icon,
  className = ''
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`filter-chip ${active ? 'filter-chip--active' : ''} ${className}`}
    >
      {icon && <span className="filter-chip__icon">{icon}</span>}
      <span className="filter-chip__label">{label}</span>
      {count !== undefined && (
        <span className="filter-chip__count">{count}</span>
      )}
      {removable && active && (
        <span
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.();
          }}
          className="filter-chip__remove"
        >
          ✕
        </span>
      )}
    </button>
  );
}

/**
 * Filter group component
 */
export function FilterGroup({
  title,
  filters = [],
  activeFilters = [],
  onFilterChange,
  multiSelect = true,
  className = ''
}) {
  const handleFilterClick = (filter) => {
    if (multiSelect) {
      const isActive = activeFilters.includes(filter.value);
      const updated = isActive
        ? activeFilters.filter(v => v !== filter.value)
        : [...activeFilters, filter.value];
      onFilterChange?.(updated);
    } else {
      onFilterChange?.(filter.value);
    }
  };

  const isActive = (filter) => {
    if (multiSelect) {
      return activeFilters.includes(filter.value);
    }
    return activeFilters === filter.value;
  };

  return (
    <div className={`filter-group ${className}`}>
      {title && <h4 className="filter-group__title">{title}</h4>}
      <div className="filter-group__filters">
        {filters.map((filter) => (
          <FilterChip
            key={filter.value}
            label={filter.label}
            active={isActive(filter)}
            count={filter.count}
            icon={filter.icon}
            onClick={() => handleFilterClick(filter)}
            removable={multiSelect}
            onRemove={() => {
              onFilterChange?.(activeFilters.filter(v => v !== filter.value));
            }}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Active filters display
 */
export function ActiveFilters({
  filters = [],
  onRemove,
  onClearAll,
  className = ''
}) {
  if (filters.length === 0) return null;

  return (
    <div className={`active-filters ${className}`}>
      <div className="active-filters__list">
        {filters.map((filter) => (
          <span key={filter.value} className="active-filters__item">
            {filter.label}
            <button
              type="button"
              onClick={() => onRemove?.(filter.value)}
              className="active-filters__remove"
              aria-label={`Remove ${filter.label} filter`}
            >
              ✕
            </button>
          </span>
        ))}
      </div>
      <button
        type="button"
        onClick={onClearAll}
        className="active-filters__clear"
      >
        Clear all
      </button>
    </div>
  );
}

/**
 * Range slider for price/value filtering
 */
export function RangeSlider({
  min = 0,
  max = 100,
  value = [0, 100],
  step = 1,
  onChange,
  formatValue = (v) => v,
  label,
  className = ''
}) {
  const [localValue, setLocalValue] = useState(value);

  const handleMinChange = (e) => {
    const newMin = Math.min(Number(e.target.value), localValue[1] - step);
    const updated = [newMin, localValue[1]];
    setLocalValue(updated);
    onChange?.(updated);
  };

  const handleMaxChange = (e) => {
    const newMax = Math.max(Number(e.target.value), localValue[0] + step);
    const updated = [localValue[0], newMax];
    setLocalValue(updated);
    onChange?.(updated);
  };

  const minPercent = ((localValue[0] - min) / (max - min)) * 100;
  const maxPercent = ((localValue[1] - min) / (max - min)) * 100;

  return (
    <div className={`range-slider ${className}`}>
      {label && <label className="range-slider__label">{label}</label>}
      <div className="range-slider__values">
        <span>{formatValue(localValue[0])}</span>
        <span>—</span>
        <span>{formatValue(localValue[1])}</span>
      </div>
      <div className="range-slider__track">
        <div
          className="range-slider__fill"
          style={{
            left: `${minPercent}%`,
            width: `${maxPercent - minPercent}%`
          }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={localValue[0]}
          onChange={handleMinChange}
          className="range-slider__input range-slider__input--min"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={localValue[1]}
          onChange={handleMaxChange}
          className="range-slider__input range-slider__input--max"
        />
      </div>
    </div>
  );
}

export default SearchBar;
