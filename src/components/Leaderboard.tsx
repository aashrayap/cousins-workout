'use client'

import { User, Checkin, getWeekNumber } from '@/lib/types'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

interface LeaderboardProps {
  users: User[]
  checkins: Checkin[]
  selectedUserId: string | null
}

interface UserScore {
  user: User
  total: number
  checks: number[]
}

export function Leaderboard({ users, checkins, selectedUserId }: LeaderboardProps) {
  const currentWeek = getWeekNumber(new Date())

  // Calculate scores for each user
  const scores: UserScore[] = users.map(user => {
    const userCheckins = checkins.filter(c => c.user_id === user.id)
    let total = 0
    const checks: number[] = []

    userCheckins.forEach(c => {
      if (c.workout) { total++; checks.push(1) }
      if (c.ate_clean) { total++; checks.push(1) }
      if (c.steps) { total++; checks.push(1) }
    })

    return { user, total, checks }
  })

  // Sort by total descending
  scores.sort((a, b) => b.total - a.total)

  // Danger zone is bottom 2 (if 3+ users)
  const dangerZoneStart = Math.max(0, scores.length - 2)

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Leaderboard</h2>
        <span className="text-sm text-muted-foreground">Week {currentWeek}</span>
      </div>

      <div className="space-y-1">
        {scores.map((score, index) => {
          const isInDangerZone = index >= dangerZoneStart && scores.length >= 3
          const isSelected = score.user.id === selectedUserId
          const isFirst = index === 0 && score.total > 0

          return (
            <div key={score.user.id}>
              {/* Separator before danger zone */}
              {index === dangerZoneStart && scores.length >= 3 && (
                <Separator className="my-2 bg-red-200" />
              )}

              <div
                className={cn(
                  'flex items-center gap-3 py-2 px-3 rounded-md',
                  isInDangerZone && 'bg-red-50 text-red-900',
                  isSelected && !isInDangerZone && 'bg-muted'
                )}
              >
                {/* Rank */}
                <span className="w-6 text-center font-medium">
                  {index + 1}
                </span>

                {/* Trophy or danger indicator */}
                <span className="w-6 text-center">
                  {isFirst && '🏆'}
                  {isInDangerZone && '🔴'}
                </span>

                {/* Name */}
                <span className="flex-1 font-medium">
                  {score.user.name}
                </span>

                {/* Check marks visualization */}
                <span className="text-green-600 text-xs tracking-tighter">
                  {'✓'.repeat(Math.min(score.total, 21))}
                </span>

                {/* Total */}
                <span className="w-8 text-right font-bold">
                  {score.total}
                </span>

                {/* Selected indicator */}
                {isSelected && (
                  <span className="text-muted-foreground">←</span>
                )}
              </div>
            </div>
          )
        })}

        {scores.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No users yet. Add someone to get started!
          </p>
        )}
      </div>
    </div>
  )
}
