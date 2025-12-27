'use client'

import { useState } from 'react'
import { WeightLog as WeightLogType, formatDate } from '@/lib/types'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface LogWeightModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (weight: number, date: string) => Promise<void>
  recentLogs: WeightLogType[]
}

export function LogWeightModal({
  open,
  onClose,
  onSubmit,
  recentLogs
}: LogWeightModalProps) {
  const today = new Date().toISOString().split('T')[0]
  const [weight, setWeight] = useState('')
  const [date, setDate] = useState(today)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!weight) return

    setLoading(true)
    try {
      await onSubmit(parseFloat(weight), date)
      setWeight('')
      setDate(today)
      onClose()
    } catch (error) {
      console.error('Failed to log weight:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Log Weight</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              max={today}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="weight">Weight (lbs)</Label>
            <Input
              id="weight"
              type="number"
              step="0.1"
              placeholder="e.g. 185.5"
              value={weight}
              onChange={e => setWeight(e.target.value)}
              required
            />
          </div>

          {recentLogs.length > 0 && (
            <div className="text-sm text-muted-foreground">
              <p className="font-medium mb-1">Recent entries:</p>
              {recentLogs.slice(0, 3).map(log => (
                <div key={log.id} className="flex justify-between">
                  <span>{formatDate(new Date(log.logged_at))}</span>
                  <span>{log.weight} lbs</span>
                </div>
              ))}
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !weight}>
              {loading ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
