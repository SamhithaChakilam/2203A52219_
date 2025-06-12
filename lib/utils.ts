import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// Debounce function to limit API calls
export const debounce = <T extends (...args: any[]) => any>(func: T, wait: number) => {
  let timeout: NodeJS.Timeout

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }

    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
