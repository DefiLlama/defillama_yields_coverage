import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(num: number | null | undefined): string {
  if (num === null || num === undefined) return "N/A"
  if (num < 1000) return num.toFixed(2)
  if (num < 1_000_000) return `${(num / 1000).toFixed(1)}K`
  if (num < 1_000_000_000) return `${(num / 1_000_000).toFixed(2)}M`
  return `${(num / 1_000_000_000).toFixed(2)}B`
}

export function formatDate(timestamp: number | null | undefined): string {
  if (!timestamp) return "Unknown"
  const date = new Date(timestamp * 1000)
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

export function getRelativeTime(timestamp: number | null | undefined): string {
  if (!timestamp) return "Unknown"
  const now = Date.now()
  const date = timestamp * 1000
  const diff = now - date
  
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)
  
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 30) return `${days}d ago`
  if (months < 12) return `${months}mo ago`
  return `${years}y ago`
}

