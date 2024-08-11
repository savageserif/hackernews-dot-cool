export function formatNumber(number?: number) {
  if (number === undefined) return;
  return new Intl.NumberFormat('gb-GB').format(number);
}

export function formatNumberWithLabel(number: number | undefined, label: string) {
  if (number === undefined) return;
  return formatNumber(number) + ' ' + label + (number !== 1 ? 's' : '');
}

export function formatAbsoluteTimestamp(time?: number) {
  if (time === undefined) return;

  return new Intl.DateTimeFormat('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }).format(time * 1000);
}

export function avoidShortWidows(text: string) {
  const words = text.split(' ');

  const lastWord = words.pop();
  if (!lastWord) return text;

  return words.join(' ') + (words.length > 2 && lastWord.length <= 10 ? ' ' : ' ') + lastWord;
}
