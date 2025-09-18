"use client";

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const DateRangePicker = ({ 
  startDate, 
  endDate, 
  onDateChange, 
  unavailableDates = [],
  minDate = new Date(),
  apartmentId 
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isSelectingEnd, setIsSelectingEnd] = useState(false);
  const [hoveredDate, setHoveredDate] = useState(null);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isDateUnavailable = (date) => {
    return unavailableDates.some(range => {
      const start = new Date(range.startDate);
      const end = new Date(range.endDate);
      // Check if date falls within any unavailable range (inclusive of start, exclusive of end)
      return date >= start && date < end;
    });
  };

  const isDateInRange = (date) => {
    if (!startDate || !endDate) return false;
    return date >= new Date(startDate) && date <= new Date(endDate);
  };

  const isDateInHoverRange = (date) => {
    if (!startDate || !hoveredDate || isSelectingEnd === false) return false;
    const start = new Date(startDate);
    const hover = hoveredDate;
    const minRange = start < hover ? start : hover;
    const maxRange = start > hover ? start : hover;
    return date >= minRange && date <= maxRange;
  };

  const handleDateClick = (date) => {
    if (isDateUnavailable(date) || date < minDate) return;

    if (!startDate || (startDate && endDate)) {
      // Starting new selection
      onDateChange(date.toISOString().split('T')[0], null);
      setIsSelectingEnd(true);
    } else if (isSelectingEnd) {
      // Selecting end date
      if (date < new Date(startDate)) {
        // If clicked date is before start date, make it the new start date
        onDateChange(date.toISOString().split('T')[0], null);
      } else {
        // Check if any unavailable dates are in the range
        const start = new Date(startDate);
        const hasUnavailableInRange = unavailableDates.some(range => {
          const rangeStart = new Date(range.startDate);
          const rangeEnd = new Date(range.endDate);
          // Check for any overlap with the selected range
          return (start < rangeEnd && date >= rangeStart);
        });

        if (hasUnavailableInRange) {
          // Show user feedback about the conflict
          alert('The selected date range contains unavailable dates. Please select a different range.');
          // Reset selection
          onDateChange(date.toISOString().split('T')[0], null);
        } else {
          onDateChange(startDate, date.toISOString().split('T')[0]);
          setIsSelectingEnd(false);
        }
      }
    }
  };

  const navigateMonth = (direction) => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + direction, 1));
  };

  const renderCalendar = (monthOffset = 0) => {
    const displayMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + monthOffset, 1);
    const daysInMonth = getDaysInMonth(displayMonth);
    const firstDay = getFirstDayOfMonth(displayMonth);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(displayMonth.getFullYear(), displayMonth.getMonth(), day);
      const isUnavailable = isDateUnavailable(date);
      const isPast = date < minDate;
      const isSelected = (startDate && date.toISOString().split('T')[0] === startDate) || 
                        (endDate && date.toISOString().split('T')[0] === endDate);
      const isInRange = isDateInRange(date);
      const isInHoverRange = isDateInHoverRange(date);
      const isToday = date.toDateString() === new Date().toDateString();

      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(date)}
          onMouseEnter={() => setHoveredDate(date)}
          onMouseLeave={() => setHoveredDate(null)}
          disabled={isUnavailable || isPast}
          className={`
            h-10 w-10 rounded-lg text-sm font-medium transition-all duration-200 relative
            ${isPast || isUnavailable 
              ? 'text-gray-300 cursor-not-allowed bg-gray-50' 
              : 'text-gray-700 hover:bg-purple-100'
            }
            ${isSelected 
              ? 'bg-purple-primary text-white hover:bg-purple-secondary' 
              : ''
            }
            ${isInRange && !isSelected 
              ? 'bg-purple-100 text-purple-primary' 
              : ''
            }
            ${isInHoverRange && !isSelected && !isInRange
              ? 'bg-purple-50 text-purple-primary' 
              : ''
            }
            ${isToday && !isSelected && !isPast
              ? 'border-2 border-purple-primary' 
              : ''
            }
          `}
        >
          {day}
          {isUnavailable && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-0.5 h-6 bg-red-400 rotate-45"></div>
            </div>
          )}
        </button>
      );
    }

    return (
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">
            {months[displayMonth.getMonth()]} {displayMonth.getFullYear()}
          </h3>
          {monthOffset === 0 && (
            <div className="flex space-x-2">
              <button
                onClick={() => navigateMonth(-1)}
                className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ChevronLeft size={20} className="text-gray-600" />
              </button>
              <button
                onClick={() => navigateMonth(1)}
                className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ChevronRight size={20} className="text-gray-600" />
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
            <div key={day} className="h-8 flex items-center justify-center text-xs font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg max-w-full mx-auto">
      <div className="flex flex-col lg:flex-row">
        {renderCalendar(0)}
        <div className="border-t lg:border-t-0 lg:border-l border-gray-200">
          {renderCalendar(1)}
        </div>
      </div>
      
      <div className="border-t border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm space-y-2 sm:space-y-0">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-primary rounded"></div>
              <span className="text-gray-600">Selected</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gray-300 rounded relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-0.5 h-2 bg-red-400 rotate-45"></div>
                </div>
              </div>
              <span className="text-gray-600">Unavailable</span>
            </div>
          </div>
          
          {startDate && endDate && (
            <div className="text-purple-primary font-medium text-center sm:text-right">
              {new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()}
            </div>
          )}
        </div>
        
        {unavailableDates.length > 0 && (
          <div className="mt-3 text-xs text-gray-500 text-center">
            Note: Dates with a red line are already booked and cannot be selected.
          </div>
        )}
      </div>
    </div>
  );
};

export default DateRangePicker;
