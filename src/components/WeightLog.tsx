'use client'

import { WeightLog as WeightLogType, formatDate } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Plus, TrendingDown, TrendingUp, Minus } from 'lucide-react'

interface WeightLogProps {
  logs: WeightLogType[]
  onLogWeight: () => void
}

export function WeightLog({ logs, onLogWeight }: WeightLogProps) {
  return (
    <div className="space-y-3">
      <Separator />
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Weight Log</h3>
        <Button variant="outline" size="sm" onClick={onLogWeight}>
          <Plus className="h-4 w-4 mr-1" />
          Log Weight
        </Button>
      </div>

      {logs.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-2">
          No weight entries yet
        </p>
      ) : (
        <div className="space-y-1">
          {logs.slice(0, 5).map((log, i) => {
            const prevLog = logs[i + 1]
            const change = prevLog ? log.weight - prevLog.weight : 0
            const date = new Date(log.logged_at)

            return (
              <div
                key={log.id}
                className="flex items-center justify-between text-sm py-1"
              >
                <span className="text-muted-foreground">
                  {formatDate(date)}
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{log.weight} lbs</span>
                  {change !== 0 && (
                    <span
                      className={`flex items-center text-xs ${
                        change < 0 ? 'text-green-600' : 'text-red-500'
                      }`}
                    >
                      {change < 0 ? (
                        <TrendingDown className="h-3 w-3 mr-0.5" />
                      ) : (
                        <TrendingUp className="h-3 w-3 mr-0.5" />
                      )}
                      {Math.abs(change).toFixed(1)}
                    </span>
                  )}
                  {change === 0 && prevLog && (
                    <span className="flex items-center text-xs text-muted-foreground">
                      <Minus className="h-3 w-3" />
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
