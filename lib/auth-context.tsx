'use client'

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react'
import { api, setCookie, getCookie, deleteCookie } from './api'
import { User, UserRole, Club } from '@/features/auth/types'

const SESSION_DURATION_MS = 10 * 60 * 1000 // 10 minutes (600,000 ms)

interface AuthContextType {
  user: User | null
  role: UserRole
  teamId: string | null
  teamName: string
  availableClubs: Club[]
  selectedClubId: string | null
  selectedClub: Club | null
  setSelectedClubId: (id: string | null) => void
  login: (email: string, password?: string) => Promise<{ success: boolean; message?: string }>
  logout: (reason?: 'manual' | 'expired') => void
  switchMockUser: (type: 'super_admin' | 'fajr_admin' | 'teamx_admin' | 'user') => Promise<boolean>
  isLoading: boolean
  sessionExpiresAt: number | null
  remainingSeconds: number
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [selectedClubId, setSelectedClubIdState] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [sessionExpiresAt, setSessionExpiresAt] = useState<number | null>(null)
  const [remainingSeconds, setRemainingSeconds] = useState<number>(600)

  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const clearSessionTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const logout = useCallback((reason: 'manual' | 'expired' = 'manual') => {
    clearSessionTimer()
    setUser(null)
    setSelectedClubIdState(null)
    setSessionExpiresAt(null)
    setRemainingSeconds(0)

    // Clear cookies
    deleteCookie('razmyar_token')
    deleteCookie('razmyar_expires_at')
    deleteCookie('razmyar_role')

    // Clear local storage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('razmyar_token')
      localStorage.removeItem('razmyar_user')
      localStorage.removeItem('razmyar_selected_club_id')
      localStorage.removeItem('razmyar_expires_at')

      // Notify backend if manual
      if (reason === 'manual') {
        api.auth.logout().catch(() => {})
      }

      // Redirect to login if not already there
      const targetUrl = reason === 'expired' ? '/login?expired=true' : '/login'
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = targetUrl
      }
    }
  }, [clearSessionTimer])

  const scheduleSessionExpiration = useCallback((expiresAt: number) => {
    clearSessionTimer()
    setSessionExpiresAt(expiresAt)

    const msUntilExpiry = expiresAt - Date.now()

    if (msUntilExpiry <= 0) {
      logout('expired')
      return
    }

    timerRef.current = setTimeout(() => {
      logout('expired')
    }, msUntilExpiry)
  }, [clearSessionTimer, logout])

  // Initialize and validate session on mount
  useEffect(() => {
    try {
      const savedUserStr = localStorage.getItem('razmyar_user')
      const token = getCookie('razmyar_token') || localStorage.getItem('razmyar_token')
      const rawExpiresAt = getCookie('razmyar_expires_at') || localStorage.getItem('razmyar_expires_at')
      const savedClubId = localStorage.getItem('razmyar_selected_club_id')

      if (token && rawExpiresAt && savedUserStr) {
        const expiresAt = parseInt(rawExpiresAt, 10)
        const now = Date.now()

        // Check 10-minute validity
        if (now >= expiresAt) {
          // Session expired
          logout('expired')
        } else {
          const parsedUser = JSON.parse(savedUserStr)
          setUser(parsedUser)
          scheduleSessionExpiration(expiresAt)

          if (savedClubId !== null) {
            setSelectedClubIdState(savedClubId === 'ALL' ? null : savedClubId)
          } else if (parsedUser.availableClubs && parsedUser.availableClubs.length > 0) {
            setSelectedClubIdState(parsedUser.availableClubs[0].id)
          }
        }
      } else {
        // No valid session, clean up
        deleteCookie('razmyar_token')
        deleteCookie('razmyar_expires_at')
        deleteCookie('razmyar_role')
      }
    } catch (e) {
      console.error('Error loading auth state:', e)
      logout('manual')
    } finally {
      setIsLoading(false)
    }
  }, [logout, scheduleSessionExpiration])

  // Periodic interval to verify remaining time and update countdown
  useEffect(() => {
    if (!sessionExpiresAt) return

    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.floor((sessionExpiresAt - Date.now()) / 1000))
      setRemainingSeconds(remaining)

      if (remaining <= 0) {
        clearInterval(interval)
        logout('expired')
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [sessionExpiresAt, logout])

  // Listen to custom session-expired events from api.ts
  useEffect(() => {
    const handleExpired = () => {
      logout('expired')
    }
    window.addEventListener('razmyar-session-expired', handleExpired)
    return () => window.removeEventListener('razmyar-session-expired', handleExpired)
  }, [logout])

  const setSelectedClubId = (id: string | null) => {
    setSelectedClubIdState(id)
    if (typeof window !== 'undefined') {
      if (id) {
        localStorage.setItem('razmyar_selected_club_id', id)
      } else {
        localStorage.setItem('razmyar_selected_club_id', 'ALL')
      }
      window.dispatchEvent(new Event('club-changed'))
    }
  }

  const login = async (email: string, password = 'Password123'): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await api.auth.login(email, password)
      if (res && res.token && res.user) {
        const expiresAt = res.expiresAt || (Date.now() + SESSION_DURATION_MS)

        // Set cookies with 10-minute expiry (600 seconds)
        setCookie('razmyar_token', res.token, 600)
        setCookie('razmyar_expires_at', expiresAt.toString(), 600)
        setCookie('razmyar_role', res.user.role, 600)

        // Set local storage
        localStorage.setItem('razmyar_token', res.token)
        localStorage.setItem('razmyar_user', JSON.stringify(res.user))
        localStorage.setItem('razmyar_expires_at', expiresAt.toString())

        setUser(res.user)
        scheduleSessionExpiration(expiresAt)

        // Set default selected club
        if (res.user.role === 'SUPER_ADMIN') {
          setSelectedClubId(null)
        } else if (res.user.availableClubs && res.user.availableClubs.length > 0) {
          setSelectedClubId(res.user.availableClubs[0].id)
        } else {
          setSelectedClubId(null)
        }

        return { success: true }
      }
      return { success: false, message: 'اطلاعات ورود ناقص است' }
    } catch (err: any) {
      return { success: false, message: err.message || 'نام کاربری یا رمز عبور نامعتبر است' }
    }
  }

  const switchMockUser = async (type: 'super_admin' | 'fajr_admin' | 'teamx_admin' | 'user') => {
    const mockMap = {
      super_admin: { email: 'owner@razmyar.ir', password: '123456' },
      fajr_admin: { email: 'coach_fajr', password: '123456' },
      teamx_admin: { email: 'teamx@razmyar.ir', password: '123456' },
      user: { email: 'user@razmyar.ir', password: '123456' },
    }

    const target = mockMap[type]
    const res = await login(target.email, target.password)
    return res.success
  }

  const role: UserRole = user?.role || 'USER'
  const teamId = user?.teamId || null
  const teamName = user?.team?.name || (teamId === 'FAJR' ? 'تیم فجر' : teamId === 'TEAM_X' ? 'تیم X' : 'کل پلتفرم')
  const availableClubs = user?.availableClubs || []
  const selectedClub = availableClubs.find((c) => c.id === selectedClubId) || null

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        teamId,
        teamName,
        availableClubs,
        selectedClubId,
        selectedClub,
        setSelectedClubId,
        login,
        logout,
        switchMockUser,
        isLoading,
        sessionExpiresAt,
        remainingSeconds,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
