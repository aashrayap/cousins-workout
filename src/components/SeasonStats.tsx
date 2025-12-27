'use client'

import { getWeekNumber, TOTAL_WEEKS } from '@/lib/types'

interface SeasonStatsProps {
  userCount: number
}

export function SeasonStats({ userCount }: SeasonStatsProps) {
  const currentWeek = getWeekNumber(new Date())
  const stakePerPerson = 500
  const totalPot = userCount * stakePerPerson

  return (
    <div className="text-center py-4 text-sm text-muted-foreground">
      <span className="font-medium text-foreground">Season Stats</span>
      <span className="mx-2">·</span>
      <span>Weeks: {currentWeek}/{TOTAL_WEEKS}</span>
      <span className="mx-2">·</span>
      <span>Pot: ${totalPot.toLocaleString()}</span>
      <span className="mx-2">·</span>
      <span>Belly dances owed: 0</span>
    </div>
  )
}
