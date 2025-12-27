'use client'

import { useState } from 'react'
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

interface AddUserModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: {
    name: string
    starting_weight: number
    goal_weight: number
    photo_url: string | null
  }) => Promise<void>
}

export function AddUserModal({ open, onClose, onSubmit }: AddUserModalProps) {
  const [name, setName] = useState('')
  const [startingWeight, setStartingWeight] = useState('')
  const [goalWeight, setGoalWeight] = useState('')
  const [photoUrl, setPhotoUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!name.trim()) {
      setError('Name is required')
      return
    }
    if (!startingWeight) {
      setError('Starting weight is required')
      return
    }
    if (!goalWeight) {
      setError('Goal weight is required')
      return
    }

    setLoading(true)
    try {
      await onSubmit({
        name: name.trim(),
        starting_weight: parseFloat(startingWeight),
        goal_weight: parseFloat(goalWeight),
        photo_url: photoUrl.trim() || null
      })
      // Reset form
      setName('')
      setStartingWeight('')
      setGoalWeight('')
      setPhotoUrl('')
      onClose()
    } catch {
      setError('Failed to add user. Name might already exist.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              placeholder="e.g. Ash"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="photo">Photo URL (optional)</Label>
            <Input
              id="photo"
              type="url"
              placeholder="https://..."
              value={photoUrl}
              onChange={e => setPhotoUrl(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="starting">Starting Weight (lbs) *</Label>
              <Input
                id="starting"
                type="number"
                step="0.1"
                placeholder="e.g. 240"
                value={startingWeight}
                onChange={e => setStartingWeight(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="goal">Goal Weight (lbs) *</Label>
              <Input
                id="goal"
                type="number"
                step="0.1"
                placeholder="e.g. 190"
                value={goalWeight}
                onChange={e => setGoalWeight(e.target.value)}
                required
              />
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add User'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
