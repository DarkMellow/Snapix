/**
 * Formats a date string relatively (e.g., '1 day ago', '3 hours ago') within 7 days.
 * Beyond 7 days, formats as a standard date (e.g., 'Jul 14').
 * @param {string|Date} dateInput 
 * @returns {string}
 */
export const formatRelativeDate = (dateInput) => {
  if (!dateInput) return "";
  
  const date = new Date(dateInput);
  const now = new Date();
  
  // Guard for future dates
  if (date > now) {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }

  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHr / 24);

  if (diffSec < 60) {
    return "Just now";
  } else if (diffMin < 60) {
    return diffMin === 1 ? "1 minute ago" : `${diffMin} minutes ago`;
  } else if (diffHr < 24) {
    return diffHr === 1 ? "1 hour ago" : `${diffHr} hours ago`;
  } else if (diffDays < 7) {
    return diffDays === 1 ? "1 day ago" : `${diffDays} days ago`;
  } else {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }
};
