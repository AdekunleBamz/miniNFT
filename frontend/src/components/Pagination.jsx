function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  hasNextPage,
  hasPrevPage,
  startIndex,
  endIndex,
  totalItems,
  showInfo = true,
}) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  return (
    <div className="pagination">
      {showInfo && (
        <div className="pagination-info">
          Showing {startIndex}-{endIndex} of {totalItems}
        </div>
      )}
      
      <div className="pagination-controls">
        <button
          className="pagination-btn"
          onClick={() => onPageChange(1)}
          disabled={!hasPrevPage}
          aria-label="First page"
        >
          ««
        </button>
        
        <button
          className="pagination-btn"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPrevPage}
          aria-label="Previous page"
        >
          «
        </button>
        
        <div className="pagination-pages">
          {getPageNumbers().map(page => (
            <button
              key={page}
              className={`pagination-page ${page === currentPage ? 'active' : ''}`}
              onClick={() => onPageChange(page)}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </button>
          ))}
        </div>
        
        <button
          className="pagination-btn"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNextPage}
          aria-label="Next page"
        >
          »
        </button>
        
        <button
          className="pagination-btn"
          onClick={() => onPageChange(totalPages)}
          disabled={!hasNextPage}
          aria-label="Last page"
        >
          »»
        </button>
      </div>
    </div>
  );
}

export default Pagination;
