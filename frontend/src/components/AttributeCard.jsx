/**
 * AttributeCard component for NFT metadata attributes
 */
import React from 'react';

export function AttributeCard({ 
  traitType, 
  value, 
  rarity, 
  count, 
  total,
  variant = 'default',
  className = '' 
}) {
  const percentage = count && total ? ((count / total) * 100).toFixed(1) : null;

  return (
    <div className={`attribute-card attribute-card--${variant} ${className}`}>
      <div className="attribute-card__header">
        <span className="attribute-card__trait">{traitType}</span>
        {percentage && (
          <span className="attribute-card__rarity">
            {percentage}% have this
          </span>
        )}
      </div>
      <div className="attribute-card__value">{value}</div>
      {rarity && (
        <div className="attribute-card__rarity-bar">
          <div
            className="attribute-card__rarity-fill"
            style={{ width: `${percentage || 0}%` }}
          />
        </div>
      )}
    </div>
  );
}

export function AttributeGrid({ attributes = [], columns = 3 }) {
  return (
    <div
      className="attribute-grid"
      style={{ '--columns': columns }}
    >
      {attributes.map((attr, index) => (
        <AttributeCard
          key={index}
          traitType={attr.trait_type}
          value={attr.value}
          rarity={attr.rarity}
          count={attr.count}
          total={attr.total}
        />
      ))}
    </div>
  );
}

export function AttributeFilter({ 
  attributes = [], 
  selected = {}, 
  onChange,
  expandedTraits = [] 
}) {
  const groupedAttributes = attributes.reduce((acc, attr) => {
    if (!acc[attr.trait_type]) {
      acc[attr.trait_type] = [];
    }
    acc[attr.trait_type].push(attr);
    return acc;
  }, {});

  const handleSelect = (traitType, value) => {
    const current = selected[traitType] || [];
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    
    onChange?.({
      ...selected,
      [traitType]: updated.length > 0 ? updated : undefined,
    });
  };

  return (
    <div className="attribute-filter">
      {Object.entries(groupedAttributes).map(([traitType, values]) => (
        <div key={traitType} className="attribute-filter__group">
          <div className="attribute-filter__header">
            <span className="attribute-filter__title">{traitType}</span>
            <span className="attribute-filter__count">{values.length}</span>
          </div>
          
          <div className="attribute-filter__options">
            {values.map((attr, index) => {
              const isSelected = (selected[traitType] || []).includes(attr.value);
              
              return (
                <button
                  key={index}
                  className={`attribute-filter__option ${isSelected ? 'attribute-filter__option--selected' : ''}`}
                  onClick={() => handleSelect(traitType, attr.value)}
                >
                  <span className="attribute-filter__value">{attr.value}</span>
                  {attr.count && (
                    <span className="attribute-filter__badge">{attr.count}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export function AttributeSummary({ attributes = [] }) {
  if (attributes.length === 0) return null;

  return (
    <div className="attribute-summary">
      {attributes.slice(0, 4).map((attr, index) => (
        <span key={index} className="attribute-summary__item">
          <span className="attribute-summary__trait">{attr.trait_type}:</span>
          <span className="attribute-summary__value">{attr.value}</span>
        </span>
      ))}
      {attributes.length > 4 && (
        <span className="attribute-summary__more">
          +{attributes.length - 4} more
        </span>
      )}
    </div>
  );
}

export default AttributeCard;
