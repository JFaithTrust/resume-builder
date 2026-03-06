import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Validates if a string is a valid URL or email
 * Allows tel:, mailto:, and standard http(s) URLs
 */
export function isValidUrl(url: string): boolean {
  if (!url) return true; // Empty URLs are valid (optional fields)

  const urlPatterns = [
    /^https?:\/\//,      // http(s) URLs
    /^mailto:/,           // Email links
    /^tel:/,              // Phone links
    /^\/\//,              // Protocol-relative URLs
  ];

  // Check if URL starts with a valid protocol
  if (urlPatterns.some(pattern => pattern.test(url))) {
    try {
      new URL(url.replace(/^\/\//, 'http://'));
      return true;
    } catch {
      return false;
    }
  }

  return false;
}

/**
 * Creates a debounced version of a function with specified delay
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;

  return function (...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}


