"use client"

import { useState, useEffect, useCallback } from "react"
import { UserPreferences, DEFAULT_PREFERENCES } from "@/lib/types"

const STORAGE_KEY = "tsr_preferences"

export function usePreferences() {
  const [preferences, setPreferencesState] = useState<UserPreferences>(DEFAULT_PREFERENCES)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setPreferencesState({ ...DEFAULT_PREFERENCES, ...JSON.parse(stored) })
      }
    } catch {}
    setLoaded(true)
  }, [])

  const setPreferences = useCallback((update: Partial<UserPreferences>) => {
    setPreferencesState((prev) => {
      const next = { ...prev, ...update }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch {}
      return next
    })
  }, [])

  const resetPreferences = useCallback(() => {
    setPreferencesState(DEFAULT_PREFERENCES)
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {}
  }, [])

  return { preferences, setPreferences, resetPreferences, loaded }
}
