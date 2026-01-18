import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge Tailwind + conditional classes
 * @param  {...any} inputs - class names
 * @returns {string} - merged class string
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
