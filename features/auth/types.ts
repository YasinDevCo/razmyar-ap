export type UserRole = 'SUPER_ADMIN' | 'TEAM_ADMIN' | 'USER'

export interface Club {
  id: string
  teamId: string
  name: string
  coachName?: string
  phone?: string
  mainDiscipline?: string
  status?: string
}

export interface Team {
  id: string
  name: string
  status?: string
}

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  teamId?: string | null
  team?: Team | null
  availableClubs?: Club[]
}
