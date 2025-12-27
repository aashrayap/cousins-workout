'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { Checkin, getWeekDates } from '@/lib/types'

export function useCheckins(userId: string | null, weekNum: number) {
  const [checkins, setCheckins] = useState<Checkin[]>([])
  const [loading, setLoading] = useState(true)

  const fetchCheckins = useCallback(async () => {
    if (!userId) {
      setCheckins([])
      setLoading(false)
      return
    }

    const { start, end } = getWeekDates(weekNum)
    const startStr = start.toISOString().split('T')[0]
    const endStr = end.toISOString().split('T')[0]

    const { data, error } = await supabase
      .from('checkins')
      .select('*')
      .eq('user_id', userId)
      .gte('date', startStr)
      .lte('date', endStr)
      .order('date', { ascending: true })

    if (error) {
      console.error('Error fetching checkins:', error)
      return
    }
    setCheckins(data || [])
    setLoading(false)
  }, [userId, weekNum])

  useEffect(() => {
    fetchCheckins()
  }, [fetchCheckins])

  const toggleCheckin = async (
    date: string,
    field: 'workout' | 'ate_clean' | 'steps'
  ) => {
    if (!userId) return

    const existing = checkins.find(c => c.date === date)

    if (existing) {
      const { data, error } = await supabase
        .from('checkins')
        .update({ [field]: !existing[field] })
        .eq('id', existing.id)
        .select()
        .single()

      if (error) {
        console.error('Error updating checkin:', error)
        return
      }
      setCheckins(prev => prev.map(c => c.id === existing.id ? data : c))
    } else {
      const { data, error } = await supabase
        .from('checkins')
        .insert({
          user_id: userId,
          date,
          [field]: true
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating checkin:', error)
        return
      }
      setCheckins(prev => [...prev, data])
    }
  }

  return { checkins, loading, toggleCheckin, refetch: fetchCheckins }
}

export function useAllCheckins(weekNum: number) {
  const [checkins, setCheckins] = useState<Checkin[]>([])
  const [loading, setLoading] = useState(true)

  const fetchCheckins = useCallback(async () => {
    const { start, end } = getWeekDates(weekNum)
    const startStr = start.toISOString().split('T')[0]
    const endStr = end.toISOString().split('T')[0]

    const { data, error } = await supabase
      .from('checkins')
      .select('*')
      .gte('date', startStr)
      .lte('date', endStr)

    if (error) {
      console.error('Error fetching all checkins:', error)
      return
    }
    setCheckins(data || [])
    setLoading(false)
  }, [weekNum])

  useEffect(() => {
    fetchCheckins()
  }, [fetchCheckins])

  return { checkins, loading, refetch: fetchCheckins }
}
