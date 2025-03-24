import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function truncateAddress(address: string, len: number[] = [6, 4]) {
  return address.slice(0, len[0]) + '...' + address.slice(-len[1]);
}
