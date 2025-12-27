export interface User {
  id: string
  name: string
  photo_url: string | null
  starting_weight: number | null
  goal_weight: number | null
  created_at: string
}

export interface Checkin {
  id: string
  user_id: string
  date: string
  workout: boolean
  ate_clean: boolean
  steps: boolean
  created_at: string
}

export interface WeightLog {
  id: string
  user_id: string
  weight: number
  logged_at: string
  created_at: string
}

// Challenge dates
export const CHALLENGE_START = new Date('2024-12-23')
export const CHALLENGE_END = new Date('2025-07-07')
export const TOTAL_WEEKS = 28

export function getWeekNumber(date: Date): number {
  const diff = date.getTime() - CHALLENGE_START.getTime()
  const weekNum = Math.floor(diff / (7 * 24 * 60 * 60 * 1000)) + 1
  return Math.max(1, Math.min(weekNum, TOTAL_WEEKS))
}

export function getWeekDates(weekNum: number): { start: Date; end: Date } {
  const start = new Date(CHALLENGE_START)
  start.setDate(start.getDate() + (weekNum - 1) * 7)
  const end = new Date(start)
  end.setDate(end.getDate() + 6)
  return { start, end }
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function isCurrentWeek(weekNum: number): boolean {
  return getWeekNumber(new Date()) === weekNum
}

export function isPastWeek(weekNum: number): boolean {
  return weekNum < getWeekNumber(new Date())
}
