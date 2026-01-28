import React from 'react';

/**
 * Timeline Component
 * Displays a list of events in chronological order
 */
function Timeline({ children, alternate = false, className = '', ...props }) {
  const timelineClasses = [
    'timeline',
    alternate && 'timeline--alternate',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={timelineClasses} {...props}>
      {children}
    </div>
  );
}

/**
 * TimelineItem Component
 * Single event in the timeline
 */
export function TimelineItem({ 
  children, 
  dot, 
  lineVariant = 'solid',
  active = false,
  className = '',
  ...props 
}) {
  const itemClasses = [
    'timeline-item',
    active && 'timeline-item--active',
    className
  ].filter(Boolean).join(' ');
  
  const lineClasses = [
    'timeline-item__line',
    `timeline-item__line--${lineVariant}`
  ].join(' ');

  return (
    <div className={itemClasses} {...props}>
      <div className="timeline-item__separator">
        <div className="timeline-item__dot">
          {dot || <div className="timeline-item__dot-inner" />}
        </div>
        <div className={lineClasses} />
      </div>
      <div className="timeline-item__content">
        {children}
      </div>
    </div>
  );
}

Timeline.Item = TimelineItem;

export default Timeline;
