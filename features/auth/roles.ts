import { UserRole } from './types'
import { Permission } from './permissions'

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  SUPER_ADMIN: [
    'MANAGE_TEAMS',
    'CREATE_TEAM',
    'EDIT_TEAM',
    'TOGGLE_TEAM_STATUS',
    'MANAGE_CLUBS',
    'CREATE_CLUB',
    'EDIT_CLUB',
    'MANAGE_USERS',
    'MANAGE_PLANS',
    'MANAGE_SUBSCRIPTIONS',
    'MANAGE_PAYMENTS',
    'VIEW_GLOBAL_REPORTS',
    'VIEW_SYSTEM_HEALTH',
  ],
  TEAM_ADMIN: [
    'MANAGE_TEAM_CLUBS',
    'MANAGE_TEAM_USERS',
    'MANAGE_ASSESSMENTS',
    'MANAGE_COMPETITIONS',
    'VIEW_TEAM_REPORTS',
  ],
  USER: [
    'VIEW_OWN_PROFILE',
    'VIEW_OWN_ASSESSMENTS',
    'VIEW_OWN_PROGRESSION',
  ],
}

export const hasPermission = (role: UserRole, permission: Permission): boolean => {
  return ROLE_PERMISSIONS[role]?.includes(permission) || false
}
