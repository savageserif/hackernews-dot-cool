import { formatNumber } from '@/utils/formatNumber';

export function formatNumberWithLabel(number: number | undefined, label: string) {
  if (number === undefined) return;
  return formatNumber(number) + ' ' + label + (number !== 1 ? 's' : '');
}
