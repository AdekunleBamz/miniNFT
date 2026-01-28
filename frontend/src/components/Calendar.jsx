import React, { useState } from 'react';

/**
 * Calendar Component
 * Simple monthly calendar view
 */
function Calendar({
  year,
  month,
  selectedDate,
  onDateClick,
  className = '',
  ...props
}) {
  const currentDate = new Date();
  const activeYear = year || currentDate.getFullYear();
  const activeMonth = month !== undefined ? month : currentDate.getMonth();

  const daysInMonth = new Date(activeYear, activeMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(activeYear, activeMonth, 1).getDay();

  const days = [...Array(daysInMonth).keys()].map(i => i + 1);
  const emptyDays = [...Array(firstDayOfMonth).keys()];

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handleDateClick = (day) => {
    if (onDateClick) {
      onDateClick(new Date(activeYear, activeMonth, day));
    }
  };

  const isSelected = (day) => {
    if (!selectedDate) return false;
    return (
      selectedDate.getFullYear() === activeYear &&
      selectedDate.getMonth() === activeMonth &&
      selectedDate.getDate() === day
    );
  };

  const isToday = (day) => {
    const today = new Date();
    return (
      today.getFullYear() === activeYear &&
      today.getMonth() === activeMonth &&
      today.getDate() === day
    );
  };

  return (
    <div className={`calendar ${className}`} {...props}>
      <div className="calendar__header">
        <span className="calendar__month">{monthNames[activeMonth]}</span>
        <span className="calendar__year">{activeYear}</span>
      </div>
      <div className="calendar__grid">
        <div className="calendar__weekday">Sun</div>
        <div className="calendar__weekday">Mon</div>
        <div className="calendar__weekday">Tue</div>
        <div className="calendar__weekday">Wed</div>
        <div className="calendar__weekday">Thu</div>
        <div className="calendar__weekday">Fri</div>
        <div className="calendar__weekday">Sat</div>
        
        {emptyDays.map(i => (
          <div key={`empty-${i}`} className="calendar__day calendar__day--empty" />
        ))}
        
        {days.map(day => (
          <button
            key={day}
            type="button"
            className={`
              calendar__day 
              ${isSelected(day) ? 'calendar__day--selected' : ''} 
              ${isToday(day) ? 'calendar__day--today' : ''}
            `}
            onClick={() => handleDateClick(day)}
            aria-label={`${monthNames[activeMonth]} ${day}, ${activeYear}`}
            aria-current={isToday(day) ? 'date' : undefined}
            aria-selected={isSelected(day)}
          >
            {day}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Calendar;
