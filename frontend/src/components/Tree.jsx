import React, { useState } from 'react';

/**
 * Tree Component
 * Recursively displays nested data structure
 */
function Tree({ data, className = '', ...props }) {
  return (
    <ul className={`tree ${className}`} {...props}>
      {data.map((node, index) => (
        <TreeNode key={node.id || index} node={node} />
      ))}
    </ul>
  );
}

function TreeNode({ node }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = node.children && node.children.length > 0;

  const toggleExpand = (e) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <li className="tree__item">
      <div 
        className={`tree__content ${hasChildren ? 'tree__content--parent' : ''}`}
        onClick={hasChildren ? toggleExpand : undefined}
      >
        {hasChildren && (
          <span className={`tree__toggle ${isExpanded ? 'tree__toggle--expanded' : ''}`}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </span>
        )}
        {node.icon && <span className="tree__icon">{node.icon}</span>}
        <span className="tree__label">{node.label}</span>
      </div>
      
      {hasChildren && isExpanded && (
        <Tree data={node.children} className="tree--nested" />
      )}
    </li>
  );
}

export default Tree;
