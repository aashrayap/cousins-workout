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

// Challenge dates (use noon to avoid timezone issues)
export const CHALLENGE_START = new Date('2025-12-29T12:00:00')
export const CHALLENGE_END = new Date('2026-07-07T12:00:00')
export const TOTAL_WEEKS = 28

function getLocalDateNoon(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0)
}

export function getWeekNumber(date: Date): number {
  const normalizedDate = getLocalDateNoon(date)
  const diff = normalizedDate.getTime() - CHALLENGE_START.getTime()
  const weekNum = Math.floor(diff / (7 * 24 * 60 * 60 * 1000)) + 1

  // Before challenge starts -> week 1
  if (weekNum < 1) return 1
  // After challenge ends -> last week
  if (weekNum > TOTAL_WEEKS) return TOTAL_WEEKS

  return weekNum
}

export function getWeekDates(weekNum: number): { start: Date; end: Date } {
  const start = new Date(CHALLENGE_START)
  start.setDate(start.getDate() + (weekNum - 1) * 7)
  start.setHours(0, 0, 0, 0)
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

export function isDateInChallenge(dateStr: string): boolean {
  const date = new Date(dateStr + 'T12:00:00')
  const startDate = new Date('2025-12-29T00:00:00')
  const endDate = new Date('2026-07-07T23:59:59')
  return date >= startDate && date <= endDate
}
