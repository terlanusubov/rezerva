// Format date to display in a readable format
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Format date for input field (YYYY-MM-DD)
export function formatDateForInput(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Format time for input field (HH:MM)
export function formatTimeForInput(date: Date): string {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

// Parse date and time strings into a Date object
export function parseDateAndTime(
  dateStr: string,
  timeStr: string,
): Date | null {
  try {
    if (!dateStr || !timeStr) return null;

    const [hours, minutes] = timeStr.split(':').map(Number);
    const [year, month, day] = dateStr.split('-').map(Number);

    if (
      isNaN(hours) ||
      isNaN(minutes) ||
      isNaN(year) ||
      isNaN(month) ||
      isNaN(day)
    ) {
      return null;
    }

    const date = new Date(year, month - 1, day, hours, minutes);
    return date;
  } catch (error) {
    console.error('Error parsing date/time:', error);
    return null;
  }
}

// Create a Date object for the end of the current day
export function getEndOfDay(): Date {
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);
  return endOfDay;
}
