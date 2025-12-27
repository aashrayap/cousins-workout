'use client'

import { User } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Pencil } from 'lucide-react'

interface PersonalCardProps {
  user: User
  currentWeight: number | null
  onEdit: () => void
  children?: React.ReactNode
}

export function PersonalCard({
  user,
  currentWeight,
  onEdit,
  children
}: PersonalCardProps) {
  const startWeight = user.starting_weight ?? 0
  const goalWeight = user.goal_weight ?? 0
  const current = currentWeight ?? startWeight

  const totalToLose = startWeight - goalWeight
  const lost = startWeight - current
  const progress = totalToLose > 0 ? Math.min(100, Math.max(0, (lost / totalToLose) * 100)) : 0
  const toGo = current - goalWeight

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-semibold">{user.name}</CardTitle>
        <Button variant="ghost" size="icon" onClick={onEdit}>
          <Pencil className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{startWeight} lbs</span>
            <span>{goalWeight} lbs</span>
          </div>
          <div className="relative">
            <Progress value={progress} className="h-3" />
            {current > 0 && (
              <div
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full border-2 border-background"
                style={{ left: `calc(${progress}% - 8px)` }}
              />
            )}
          </div>
          <div className="text-sm text-muted-foreground text-center">
            {toGo > 0 ? (
              <span>{toGo.toFixed(1)} lbs to go · July 7 deadline · {progress.toFixed(0)}% progress</span>
            ) : (
              <span className="text-green-600 font-medium">Goal reached! 🎉</span>
            )}
          </div>
        </div>

        {/* Children slots for WeeklyCheckin and WeightLog */}
        {children}
      </CardContent>
    </Card>
  )
}
