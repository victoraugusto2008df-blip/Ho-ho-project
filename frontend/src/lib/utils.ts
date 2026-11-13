import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combina classes Tailwind resolvendo conflitos de especificidade com segurança.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

