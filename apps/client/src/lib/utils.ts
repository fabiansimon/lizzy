import { clsx, type ClassValue } from 'clsx';
import { formatDistanceToNow } from 'date-fns';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function truncateAddress(address: string, len: number[] = [6, 4]) {
  return address.slice(0, len[0]) + '...' + address.slice(-len[1]);
}

export function formatDuration(seconds: number) {
  const days = Math.floor(seconds / (24 * 60 * 60));
  if (days === 1) return '1 day';
  return `${days} days`;
}

export function formatDate(dateString: string) {
  try {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  } catch (error) {
    return 'Invalid date';
  }
}

export function truncateURL(url: string) {
  if (url.length > 30) {
    return url.slice(0, 30) + '...' + url.slice(-10);
  }
  return url;
}
