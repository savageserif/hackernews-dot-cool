export function absoluteTimestamp(time?: number) {
  if (time === undefined) return;

  return new Intl.DateTimeFormat('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }).format(time * 1000);
}
