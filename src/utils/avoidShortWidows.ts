export function avoidShortWidows(text: string) {
  const words = text.split(' ');

  const lastWord = words.pop();
  if (!lastWord) return text;

  return words.join(' ') + (words.length > 2 && lastWord.length <= 10 ? ' ' : ' ') + lastWord;
}
