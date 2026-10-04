'use client'

import { TeamAdminDashboard } from '@/features/team-admin/components/team-admin-dashboard'
import { RazmyarShell } from '@/components/razmyar-shell'
import { useAuth } from '@/lib/auth-context'
import { RoleGuard } from '@/features/auth/guards'
import { SuperAdminDashboard } from '@/features/super-admin/dashboard'
import { UserDashboard } from '@/features/user/components/user-dashboard'

export default function DashboardPage() {
  const { role } = useAuth()

  return (
    <RoleGuard allowedRoles={['SUPER_ADMIN', 'TEAM_ADMIN', 'USER']}>
      <RazmyarShell title={role === 'USER' ? 'داشبورد من' : 'داشبورد'}>
        {role === 'SUPER_ADMIN' && <SuperAdminDashboard />}
        {role === 'TEAM_ADMIN' && <TeamAdminDashboard />}
        {role === 'USER' && <UserDashboard />}
      </RazmyarShell>
    </RoleGuard>
  )
}
