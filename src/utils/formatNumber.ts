export function formatNumber(number?: number) {
  if (number === undefined) return;
  return new Intl.NumberFormat('gb-GB').format(number);
}
