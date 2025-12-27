'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { WeightLog } from '@/lib/types'

export function useWeightLogs(userId: string | null) {
  const [logs, setLogs] = useState<WeightLog[]>([])
  const [loading, setLoading] = useState(true)

  const fetchLogs = useCallback(async () => {
    if (!userId) {
      setLogs([])
      setLoading(false)
      return
    }

    const { data, error } = await supabase
      .from('weight_logs')
      .select('*')
      .eq('user_id', userId)
      .order('logged_at', { ascending: false })
      .limit(10)

    if (error) {
      console.error('Error fetching weight logs:', error)
      return
    }
    setLogs(data || [])
    setLoading(false)
  }, [userId])

  useEffect(() => {
    fetchLogs()
  }, [fetchLogs])

  const addLog = async (weight: number, date: string) => {
    if (!userId) return

    const { data, error } = await supabase
      .from('weight_logs')
      .insert({
        user_id: userId,
        weight,
        logged_at: date
      })
      .select()
      .single()

    if (error) {
      console.error('Error adding weight log:', error)
      throw error
    }
    setLogs(prev => [data, ...prev].slice(0, 10))
    return data
  }

  const latestWeight = logs[0]?.weight ?? null

  return { logs, loading, addLog, latestWeight, refetch: fetchLogs }
}
