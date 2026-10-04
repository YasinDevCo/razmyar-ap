'use client'

import { TeamStudentsPage } from '@/features/team-admin/components/team-students-page'
import { RazmyarShell } from '@/components/razmyar-shell'
import { RoleGuard } from '@/features/auth/guards'

export default function Page() {
  return (
    <RoleGuard allowedRoles={['SUPER_ADMIN', 'TEAM_ADMIN']}>
      <RazmyarShell title="بازیکنان و هنرجویان">
        <TeamStudentsPage />
      </RazmyarShell>
    </RoleGuard>
  )
}
