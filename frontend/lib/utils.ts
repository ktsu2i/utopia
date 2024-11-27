import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Convert unicode to emoji
export function parseEmoji(unicode: string) {
  // exception for red heart
  console.log(unicode);
  if (unicode === "2764") {
    return String.fromCodePoint(parseInt(unicode, 16)) + String.fromCodePoint(0xFE0F);
  }
  return String.fromCodePoint(parseInt(unicode, 16))
}
