import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function formatDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateRange(
  startDate: string,
  endDate: string | null,
  isCurrentRole?: boolean
): string {
  const start = formatDate(startDate);
  if (isCurrentRole || !endDate) {
    return `${start} - Present`;
  }
  return `${start} - ${formatDate(endDate)}`;
}
