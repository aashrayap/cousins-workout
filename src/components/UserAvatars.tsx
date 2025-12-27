'use client'

import { User } from '@/lib/types'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface UserAvatarsProps {
  users: User[]
  selectedUserId: string | null
  onSelectUser: (userId: string) => void
  onAddUser: () => void
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function UserAvatars({
  users,
  selectedUserId,
  onSelectUser,
  onAddUser
}: UserAvatarsProps) {
  return (
    <div className="flex items-center gap-3 p-4 overflow-x-auto">
      {users.map(user => (
        <button
          key={user.id}
          onClick={() => onSelectUser(user.id)}
          className={cn(
            'relative flex-shrink-0 rounded-full transition-all',
            selectedUserId === user.id
              ? 'ring-2 ring-primary ring-offset-2'
              : 'hover:ring-2 hover:ring-muted-foreground/30 hover:ring-offset-1'
          )}
        >
          <Avatar className="h-12 w-12">
            <AvatarImage src={user.photo_url || undefined} alt={user.name} />
            <AvatarFallback className="bg-primary/10 text-primary font-medium">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
        </button>
      ))}
      <Button
        variant="outline"
        size="icon"
        className="h-12 w-12 rounded-full flex-shrink-0"
        onClick={onAddUser}
      >
        <Plus className="h-5 w-5" />
      </Button>
    </div>
  )
}
