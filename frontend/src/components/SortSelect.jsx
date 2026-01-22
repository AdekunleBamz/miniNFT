function SortSelect({ value, onChange, options }) {
  return (
    <div className="sort-select-wrapper">
      <label className="sort-label">Sort by:</label>
      <select
        className="sort-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Sort order"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

SortSelect.defaultProps = {
  options: [
    { value: 'desc', label: 'Newest First' },
    { value: 'asc', label: 'Oldest First' },
  ],
};

export default SortSelect;
