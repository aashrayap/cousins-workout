'use client'

import { Checkin, getWeekDates, getWeekNumber, formatDate, isCurrentWeek, isPastWeek, TOTAL_WEEKS } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface WeeklyCheckinProps {
  weekNum: number
  checkins: Checkin[]
  onWeekChange: (weekNum: number) => void
  onToggle: (date: string, field: 'workout' | 'ate_clean' | 'steps') => void
}

const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
const ROWS: { key: 'workout' | 'ate_clean' | 'steps'; label: string; icon: string }[] = [
  { key: 'workout', label: 'Workout', icon: '💪' },
  { key: 'ate_clean', label: 'Clean', icon: '🥗' },
  { key: 'steps', label: 'Steps', icon: '👟' }
]

export function WeeklyCheckin({
  weekNum,
  checkins,
  onWeekChange,
  onToggle
}: WeeklyCheckinProps) {
  const { start, end } = getWeekDates(weekNum)
  const currentWeekNum = getWeekNumber(new Date())
  const isCurrent = isCurrentWeek(weekNum)
  const isPast = isPastWeek(weekNum)
  const canEdit = isCurrent

  // Generate dates for each day of the week
  const weekDates: string[] = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(start)
    d.setDate(d.getDate() + i)
    weekDates.push(d.toISOString().split('T')[0])
  }

  // Build lookup map
  const checkinMap = new Map<string, Checkin>()
  checkins.forEach(c => checkinMap.set(c.date, c))

  // Calculate totals
  const totals = { workout: 0, ate_clean: 0, steps: 0 }
  ROWS.forEach(row => {
    weekDates.forEach(date => {
      const c = checkinMap.get(date)
      if (c && c[row.key]) totals[row.key]++
    })
  })
  const weekTotal = totals.workout + totals.ate_clean + totals.steps

  return (
    <div className="space-y-4">
      {/* Week Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onWeekChange(weekNum - 1)}
          disabled={weekNum <= 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="text-sm font-medium text-center">
          <div>{formatDate(start)} - {formatDate(end)}</div>
          {isCurrent && <div className="text-xs text-muted-foreground">This Week</div>}
          {isPast && <div className="text-xs text-muted-foreground">Week {weekNum}</div>}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onWeekChange(weekNum + 1)}
          disabled={weekNum >= currentWeekNum || weekNum >= TOTAL_WEEKS}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Grid */}
      <div className="rounded-lg border bg-card overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-[80px_repeat(7,1fr)_50px] bg-muted/50 border-b">
          <div className="p-2 text-xs font-medium text-muted-foreground"></div>
          {DAYS.map((day, i) => (
            <div key={i} className="p-2 text-center text-xs font-medium text-muted-foreground">
              {day}
            </div>
          ))}
          <div className="p-2 text-center text-xs font-medium text-muted-foreground">Tot</div>
        </div>

        {/* Rows */}
        {ROWS.map((row, rowIndex) => (
          <div
            key={row.key}
            className={cn(
              "grid grid-cols-[80px_repeat(7,1fr)_50px]",
              rowIndex < ROWS.length - 1 && "border-b"
            )}
          >
            <div className="p-2 flex items-center gap-1.5 text-sm">
              <span>{row.icon}</span>
              <span className="text-muted-foreground">{row.label}</span>
            </div>
            {weekDates.map((date, i) => {
              const c = checkinMap.get(date)
              const checked = c ? c[row.key] : false
              return (
                <button
                  key={i}
                  onClick={() => canEdit && onToggle(date, row.key)}
                  disabled={!canEdit}
                  className={cn(
                    "p-2 flex items-center justify-center transition-colors",
                    canEdit && "hover:bg-muted/50 cursor-pointer",
                    !canEdit && "cursor-default",
                    isPast && "opacity-60"
                  )}
                >
                  <div
                    className={cn(
                      "w-7 h-7 rounded-md flex items-center justify-center transition-all",
                      checked
                        ? "bg-green-500 text-white"
                        : "bg-muted/50 border border-border"
                    )}
                  >
                    {checked && <Check className="h-4 w-4" />}
                  </div>
                </button>
              )
            })}
            <div className="p-2 flex items-center justify-center">
              <span className={cn(
                "text-sm font-semibold",
                totals[row.key] === 7 && "text-green-600",
                totals[row.key] === 0 && "text-muted-foreground"
              )}>
                {totals[row.key]}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="text-center">
        <span className="text-sm text-muted-foreground">Total: </span>
        <span className={cn(
          "text-lg font-bold",
          weekTotal >= 15 && "text-green-600",
          weekTotal === 0 && "text-muted-foreground"
        )}>
          {weekTotal}
        </span>
        <span className="text-sm text-muted-foreground"> / 21</span>
      </div>
    </div>
  )
}
