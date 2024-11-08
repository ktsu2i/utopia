import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Convert unicode to emoji
export function parseEmoji(unicode: string) {
  return String.fromCodePoint(parseInt(unicode, 16))
}
