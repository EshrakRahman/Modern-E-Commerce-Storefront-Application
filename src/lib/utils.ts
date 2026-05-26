import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function cleanStringParam(val: any): string | undefined {
  if (val === undefined || val === null || val === "") return undefined;
  let clean = String(val).trim();
  if (clean.startsWith('"') && clean.endsWith('"')) {
    clean = clean.slice(1, -1);
  }
  if (clean.startsWith("'") && clean.endsWith("'")) {
    clean = clean.slice(1, -1);
  }
  return clean || undefined;
}

export function parsePageParam(pageParam: any): number {
  if (pageParam === undefined || pageParam === null || pageParam === "") return 1;
  let clean = String(pageParam).trim();
  if (clean.startsWith('"') && clean.endsWith('"')) {
    clean = clean.slice(1, -1);
  }
  if (clean.startsWith("'") && clean.endsWith("'")) {
    clean = clean.slice(1, -1);
  }
  const parsed = Number(clean);
  return isNaN(parsed) || parsed < 1 ? 1 : parsed;
}

export function parseNumericParam(val: any): number | undefined {
  if (val === undefined || val === null || val === "") return undefined;
  let clean = String(val).trim();
  if (clean.startsWith('"') && clean.endsWith('"')) {
    clean = clean.slice(1, -1);
  }
  if (clean.startsWith("'") && clean.endsWith("'")) {
    clean = clean.slice(1, -1);
  }
  const parsed = Number(clean);
  return isNaN(parsed) ? undefined : parsed;
}
