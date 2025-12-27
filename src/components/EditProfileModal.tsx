'use client'

import { useState, useEffect } from 'react'
import { User } from '@/lib/types'
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

interface EditProfileModalProps {
  open: boolean
  user: User | null
  onClose: () => void
  onSubmit: (id: string, data: Partial<User>) => Promise<void>
}

export function EditProfileModal({
  open,
  user,
  onClose,
  onSubmit
}: EditProfileModalProps) {
  const [name, setName] = useState('')
  const [photoUrl, setPhotoUrl] = useState('')
  const [startingWeight, setStartingWeight] = useState('')
  const [goalWeight, setGoalWeight] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) {
      setName(user.name)
      setPhotoUrl(user.photo_url || '')
      setStartingWeight(user.starting_weight?.toString() || '')
      setGoalWeight(user.goal_weight?.toString() || '')
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setError('')

    if (!name.trim()) {
      setError('Name is required')
      return
    }

    setLoading(true)
    try {
      await onSubmit(user.id, {
        name: name.trim(),
        photo_url: photoUrl.trim() || null,
        starting_weight: startingWeight ? parseFloat(startingWeight) : null,
        goal_weight: goalWeight ? parseFloat(goalWeight) : null
      })
      onClose()
    } catch {
      setError('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Name</Label>
            <Input
              id="edit-name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-photo">Photo URL</Label>
            <Input
              id="edit-photo"
              type="url"
              placeholder="https://..."
              value={photoUrl}
              onChange={e => setPhotoUrl(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-starting">Starting Weight (lbs)</Label>
              <Input
                id="edit-starting"
                type="number"
                step="0.1"
                value={startingWeight}
                onChange={e => setStartingWeight(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-goal">Goal Weight (lbs)</Label>
              <Input
                id="edit-goal"
                type="number"
                step="0.1"
                value={goalWeight}
                onChange={e => setGoalWeight(e.target.value)}
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
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
