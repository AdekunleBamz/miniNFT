function FilterBar({ 
  searchQuery, 
  onSearchChange, 
  sortOrder, 
  onSortChange,
  showFavoritesOnly,
  onFavoritesToggle,
  hasActiveFilters,
  onClearFilters,
  resultCount,
  totalCount 
}) {
  return (
    <div className="filter-bar">
      <div className="filter-bar-left">
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by Token ID..."
            aria-label="Search by Token ID"
          />
          {searchQuery && (
            <button
              className="search-clear"
              onClick={() => onSearchChange('')}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>
        
        <button 
          className={`filter-btn ${showFavoritesOnly ? 'active' : ''}`}
          onClick={onFavoritesToggle}
          aria-pressed={showFavoritesOnly}
        >
          ❤️ Favorites
        </button>
      </div>
      
      <div className="filter-bar-right">
        <div className="sort-select-wrapper">
          <select
            className="sort-select"
            value={sortOrder}
            onChange={(e) => onSortChange(e.target.value)}
            aria-label="Sort order"
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>
        
        {hasActiveFilters && (
          <button 
            className="clear-filters-btn"
            onClick={onClearFilters}
          >
            Clear Filters
          </button>
        )}
      </div>
      
      {resultCount !== totalCount && (
        <div className="filter-results">
          Showing {resultCount} of {totalCount}
        </div>
      )}
    </div>
  );
}

export default FilterBar;
