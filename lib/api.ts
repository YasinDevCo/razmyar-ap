/**
 * Razmyar API Client Layer
 * Connects Next.js Frontend to Express Backend.
 * Handles 10-Minute Cookie Expiration & Token Management.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'))
  return match ? decodeURIComponent(match[3]) : null
}

export function setCookie(name: string, value: string, maxAgeSeconds: number = 600) {
  if (typeof document === 'undefined') return
  const isSecure = typeof window !== 'undefined' && window.location.protocol === 'https:'
  document.cookie = `${name}=${encodeURIComponent(value)}; max-age=${maxAgeSeconds}; path=/; SameSite=Lax${isSecure ? '; Secure' : ''}`
}

export function deleteCookie(name: string) {
  if (typeof document === 'undefined') return
  const isSecure = typeof window !== 'undefined' && window.location.protocol === 'https:'
  document.cookie = `${name}=; max-age=0; path=/; SameSite=Lax; expires=Thu, 01 Jan 1970 00:00:00 GMT${isSecure ? '; Secure' : ''}`
}

interface ApiResponse<T = any> {
  success: boolean
  message?: string
  data?: T
  error?: any
  code?: string
}

async function request<T>(endpoint: string, options?: RequestInit): Promise<T | null> {
  try {
    const token = typeof window !== 'undefined' ? (getCookie('razmyar_token') || localStorage.getItem('razmyar_token')) : null
    const selectedClubId = typeof window !== 'undefined' ? localStorage.getItem('razmyar_selected_club_id') : null

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(selectedClubId && selectedClubId !== 'ALL' ? { 'x-selected-club-id': selectedClubId } : {}),
      ...(options?.headers as Record<string, string>),
    }

    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      credentials: 'include', // Ensure cookies are sent with cross-origin requests
      headers,
    })

    if (res.status === 401) {
      console.warn(`[API Auth] 401 Unauthorized on ${endpoint}. Session expired or invalid.`)
      if (typeof window !== 'undefined') {
        // Clear all authentication artifacts
        deleteCookie('razmyar_token')
        deleteCookie('razmyar_expires_at')
        deleteCookie('razmyar_role')
        localStorage.removeItem('razmyar_token')
        localStorage.removeItem('razmyar_user')
        localStorage.removeItem('razmyar_expires_at')

        window.dispatchEvent(new CustomEvent('razmyar-session-expired'))

        if (!window.location.pathname.startsWith('/login')) {
          window.location.href = '/login?expired=true'
        }
      }
      return null
    }

    if (!res.ok) {
      console.warn(`[API] ${options?.method || 'GET'} ${endpoint} failed with status ${res.status}`)
      return null
    }

    const json: ApiResponse<T> = await res.json()
    return json.data !== undefined ? json.data : null
  } catch (err) {
    console.warn(`[API Connection Note] Could not connect to backend server at ${API_BASE_URL}${endpoint}.`, err)
    return null
  }
}

export const api = {
  auth: {
    login: async (email: string, password: string) => {
      try {
        const res = await fetch(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        })
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.message || 'نام کاربری یا رمز عبور اشتباه است')
        }
        return data.data as { token: string; user: any; expiresIn: number; expiresAt: number }
      } catch (err: any) {
        throw new Error(err.message || 'خطا در برقراری ارتباط با سرور')
      }
    },
    logout: async () => {
      try {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          credentials: 'include',
        })
      } catch {
        // Ignore network errors on logout
      } finally {
        deleteCookie('razmyar_token')
        deleteCookie('razmyar_expires_at')
        deleteCookie('razmyar_role')
      }
    },
    me: async () => {
      return request<any>('/auth/me')
    },
  },

  clubs: {
    getAll: async (teamId?: string) => {
      const q = teamId ? `?teamId=${teamId}` : ''
      return request<any[]>(`/clubs${q}`)
    },
    getTeams: async () => {
      return request<any[]>('/clubs/teams')
    },
  },

  dashboard: {
    getStats: async () => {
      return request<any>('/dashboard/stats')
    },
  },

  students: {
    getAll: async (q?: string, belt?: string, status?: string) => {
      const params = new URLSearchParams()
      if (q) params.set('q', q)
      if (belt && belt !== 'همه') params.set('belt', belt)
      if (status && status !== 'همه') params.set('status', status)
      const queryStr = params.toString() ? `?${params.toString()}` : ''
      return request<any[]>(`/students${queryStr}`)
    },
    getById: async (id: string) => {
      return request<any>(`/students/${id}`)
    },
    create: async (data: any) => {
      return request<any>('/students', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    },
    update: async (id: string, data: any) => {
      return request<any>(`/students/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      })
    },
    delete: async (id: string) => {
      return request<any>(`/students/${id}`, {
        method: 'DELETE',
      })
    },
    getAnalysis: async (id: string) => {
      return request<any>(`/students/${id}/analysis`)
    },
    addNote: async (id: string, note: { title?: string; content: string; category?: string; author?: string }) => {
      return request<any>(`/students/${id}/notes`, {
        method: 'POST',
        body: JSON.stringify(note),
      })
    },
    addAttendance: async (id: string, data: { title?: string; dateText?: string; timeText?: string; status?: string; note?: string }) => {
      return request<any>(`/students/${id}/attendance`, {
        method: 'POST',
        body: JSON.stringify(data),
      })
    },
  },

  assessments: {
    getAll: async (q?: string, belt?: string, type?: string, status?: string) => {
      const params = new URLSearchParams()
      if (q) params.set('q', q)
      if (belt && belt !== 'همه کمربندها') params.set('belt', belt)
      if (type && type !== 'همه ارزیابیها') params.set('type', type)
      if (status && status !== 'همه وضعیتها') params.set('status', status)
      const queryStr = params.toString() ? `?${params.toString()}` : ''
      return request<any[]>(`/assessments${queryStr}`)
    },
    getById: async (id: string) => {
      return request<any>(`/assessments/${id}`)
    },
    create: async (data: any) => {
      return request<any>('/assessments', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    },
  },

  progression: {
    getBelts: async (discipline = 'taekwondo') => {
      return request<any[]>(`/progression/belts?discipline=${discipline}`)
    },
    updateBelts: async (belts: any[]) => {
      return request<any[]>('/progression/belts', {
        method: 'PUT',
        body: JSON.stringify({ belts }),
      })
    },
    getStudents: async () => {
      return request<any[]>('/progression/students')
    },
  },

  competitions: {
    getAll: async () => {
      return request<any[]>('/competitions')
    },
    getById: async (id: string) => {
      return request<any>(`/competitions/${id}`)
    },
    create: async (data: any) => {
      return request<any>('/competitions', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    },
    addParticipant: async (competitionId: string, data: any) => {
      return request<any>(`/competitions/${competitionId}/participants`, {
        method: 'POST',
        body: JSON.stringify(data),
      })
    },
    updateMatchResult: async (competitionId: string, matchId: string, data: any) => {
      return request<any>(`/competitions/${competitionId}/matches/${matchId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      })
    },
  },

  settings: {
    get: async () => {
      return request<any>('/settings')
    },
    update: async (data: any) => {
      return request<any>('/settings', {
        method: 'PUT',
        body: JSON.stringify(data),
      })
    },
  },
}
