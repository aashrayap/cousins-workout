'use client'

import { useState, useEffect } from 'react'
import { getWeekNumber, User } from '@/lib/types'
import { useUsers } from '@/hooks/useUsers'
import { useCheckins, useAllCheckins } from '@/hooks/useCheckins'
import { useWeightLogs } from '@/hooks/useWeightLogs'

import { UserAvatars } from '@/components/UserAvatars'
import { PersonalCard } from '@/components/PersonalCard'
import { WeeklyCheckin } from '@/components/WeeklyCheckin'
import { WeightLog } from '@/components/WeightLog'
import { Leaderboard } from '@/components/Leaderboard'
import { SeasonStats } from '@/components/SeasonStats'
import { AddUserModal } from '@/components/AddUserModal'
import { EditProfileModal } from '@/components/EditProfileModal'
import { LogWeightModal } from '@/components/LogWeightModal'

export default function Home() {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [weekNum, setWeekNum] = useState<number | null>(null)
  const [showAddUser, setShowAddUser] = useState(false)
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [showLogWeight, setShowLogWeight] = useState(false)

  // Set week number on client side only to avoid SSR timezone issues
  useEffect(() => {
    setWeekNum(getWeekNumber(new Date()))
  }, [])

  const { users, loading: usersLoading, addUser, updateUser } = useUsers()
  const { checkins, toggleCheckin } = useCheckins(selectedUserId, weekNum)
  const { checkins: allCheckins, refetch: refetchAllCheckins } = useAllCheckins(weekNum)
  const { logs, addLog, latestWeight } = useWeightLogs(selectedUserId)

  const selectedUser = users.find(u => u.id === selectedUserId) || null

  // Auto-select first user if none selected
  if (!selectedUserId && users.length > 0 && !usersLoading) {
    setSelectedUserId(users[0].id)
  }

  const handleAddUser = async (data: {
    name: string
    starting_weight: number
    goal_weight: number
    photo_url: string | null
  }) => {
    const newUser = await addUser(data)
    setSelectedUserId(newUser.id)
  }

  const handleUpdateUser = async (id: string, data: Partial<User>) => {
    await updateUser(id, data)
  }

  const handleLogWeight = async (weight: number, date: string) => {
    await addLog(weight, date)
  }

  const handleToggleCheckin = async (date: string, field: 'workout' | 'ate_clean' | 'steps') => {
    await toggleCheckin(date, field)
    // Refresh leaderboard data
    refetchAllCheckins()
  }

  if (usersLoading || weekNum === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <h1 className="text-2xl font-bold text-center mb-4">
          Cousins Accountability
        </h1>

        {/* User Avatars */}
        <UserAvatars
          users={users}
          selectedUserId={selectedUserId}
          onSelectUser={setSelectedUserId}
          onAddUser={() => setShowAddUser(true)}
        />

        {/* Personal Card (only show if user selected) */}
        {selectedUser && (
          <div className="my-6">
            <PersonalCard
              user={selectedUser}
              currentWeight={latestWeight}
              onEdit={() => setShowEditProfile(true)}
            >
              <WeeklyCheckin
                weekNum={weekNum}
                checkins={checkins}
                onWeekChange={setWeekNum}
                onToggle={handleToggleCheckin}
              />
              <WeightLog
                logs={logs}
                onLogWeight={() => setShowLogWeight(true)}
              />
            </PersonalCard>
          </div>
        )}

        {/* No user selected state */}
        {!selectedUser && users.length === 0 && (
          <div className="my-6 text-center text-muted-foreground">
            <p>No users yet. Click the + button to add someone!</p>
          </div>
        )}

        {/* Leaderboard */}
        <div className="my-6">
          <Leaderboard
            users={users}
            checkins={allCheckins}
            selectedUserId={selectedUserId}
          />
        </div>

        {/* Season Stats */}
        <SeasonStats userCount={users.length} />
      </div>

      {/* Modals */}
      <AddUserModal
        open={showAddUser}
        onClose={() => setShowAddUser(false)}
        onSubmit={handleAddUser}
      />

      <EditProfileModal
        open={showEditProfile}
        user={selectedUser}
        onClose={() => setShowEditProfile(false)}
        onSubmit={handleUpdateUser}
      />

      <LogWeightModal
        open={showLogWeight}
        onClose={() => setShowLogWeight(false)}
        onSubmit={handleLogWeight}
        recentLogs={logs}
      />
    </div>
  )
}
