import { clsx as clsxLib, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]): string {
  return clsxLib(...inputs);
}
