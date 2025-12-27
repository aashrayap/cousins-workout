'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { User } from '@/lib/types'

export function useUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  const fetchUsers = useCallback(async () => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching users:', error)
      return
    }
    setUsers(data || [])
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const addUser = async (user: Omit<User, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('users')
      .insert(user)
      .select()
      .single()

    if (error) {
      console.error('Error adding user:', error)
      throw error
    }
    setUsers(prev => [...prev, data])
    return data
  }

  const updateUser = async (id: string, updates: Partial<User>) => {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating user:', error)
      throw error
    }
    setUsers(prev => prev.map(u => u.id === id ? data : u))
    return data
  }

  return { users, loading, addUser, updateUser, refetch: fetchUsers }
}
