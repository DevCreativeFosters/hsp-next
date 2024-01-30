export function formatDateDayLongMonthYear(date) {
  if (!date) {
    console.error('No date provided:', date);
    return null;
  }

  const parsedDate = new Date(date);

  if (isNaN(parsedDate)) {
    console.error('Invalid date provided:', date);
    return null;
  }

  return parsedDate.toLocaleString('en-AU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
