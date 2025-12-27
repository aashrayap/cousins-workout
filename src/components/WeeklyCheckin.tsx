'use client'

import { Checkin, getWeekDates, getWeekNumber, formatDate, isCurrentWeek, isPastWeek, TOTAL_WEEKS } from '@/lib/types'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface WeeklyCheckinProps {
  weekNum: number
  checkins: Checkin[]
  onWeekChange: (weekNum: number) => void
  onToggle: (date: string, field: 'workout' | 'ate_clean' | 'steps') => void
}

const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
const ROWS: { key: 'workout' | 'ate_clean' | 'steps'; label: string }[] = [
  { key: 'workout', label: 'Workout' },
  { key: 'ate_clean', label: 'Clean' },
  { key: 'steps', label: 'Steps' }
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
    <div className="space-y-3">
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
        <div className="text-sm font-medium">
          {formatDate(start)} - {formatDate(end)}
          {isCurrent && <span className="text-muted-foreground ml-1">(This Week)</span>}
          {isPast && <span className="text-muted-foreground ml-1">(Week {weekNum})</span>}
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
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="text-left font-medium py-1 pr-2"></th>
              {DAYS.map((day, i) => (
                <th key={i} className="text-center font-medium py-1 px-1 min-w-[32px]">
                  {day}
                </th>
              ))}
              <th className="text-center font-medium py-1 pl-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map(row => (
              <tr key={row.key}>
                <td className="text-left py-1 pr-2 text-muted-foreground">{row.label}</td>
                {weekDates.map((date, i) => {
                  const c = checkinMap.get(date)
                  const checked = c ? c[row.key] : false
                  return (
                    <td key={i} className="text-center py-1 px-1">
                      <Checkbox
                        checked={checked}
                        disabled={!canEdit}
                        onCheckedChange={() => onToggle(date, row.key)}
                        className={cn(
                          'h-5 w-5',
                          isPast && 'opacity-50'
                        )}
                      />
                    </td>
                  )
                })}
                <td className="text-center py-1 pl-2 font-medium">{totals[row.key]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-center text-sm text-muted-foreground">
        Total this week: <span className="font-medium text-foreground">{weekTotal}</span> checks
      </div>
    </div>
  )
}
