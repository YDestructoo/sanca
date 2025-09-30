/**
 * Utility functions for handling Philippine Standard Time (PST/UTC+8)
 */

// Philippine Standard Time is UTC+8
const PHILIPPINE_TIMEZONE = 'Asia/Manila';

/**
 * Format a date to Philippine Standard Time
 */
export const formatToPhilippineTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleTimeString('en-US', {
    timeZone: PHILIPPINE_TIMEZONE,
    hour12: true,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

/**
 * Format a date to Philippine Standard Time (date only)
 */
export const formatToPhilippineDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleDateString('en-US', {
    timeZone: PHILIPPINE_TIMEZONE,
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Format a date to Philippine Standard Time (date and time)
 */
export const formatToPhilippineDateTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleString('en-US', {
    timeZone: PHILIPPINE_TIMEZONE,
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

/**
 * Get current Philippine Standard Time
 */
export const getCurrentPhilippineTime = (): Date => {
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const philippineTime = new Date(utc + (8 * 3600000)); // UTC+8
  return philippineTime;
};

/**
 * Format date label for relative time (Today, Yesterday, etc.) in Philippine time
 */
export const formatDateLabel = (dateString?: string): string => {
  if (!dateString) return "";
  
  const dateObj = new Date(dateString);
  if (isNaN(dateObj.getTime())) return dateString;
  
  const now = getCurrentPhilippineTime();
  const msInDay = 24 * 60 * 60 * 1000;
  const diffDays = Math.floor((now.getTime() - dateObj.getTime()) / msInDay);
  
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  const weeks = Math.floor(diffDays / 7);
  return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
};

/**
 * Create a timestamp in Philippine Standard Time
 */
export const createPhilippineTimestamp = (): string => {
  return getCurrentPhilippineTime().toISOString();
};

// Voice recording functions removed
