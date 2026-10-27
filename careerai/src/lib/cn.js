// Joins class names, ignoring falsy values.
export function cn(...parts) {
  return parts.flat().filter(Boolean).join(' ')
}
