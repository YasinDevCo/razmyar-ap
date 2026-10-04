'use client'

import { ReportsPageContent } from '@/components/razmyar-pages'
import { RazmyarShell } from '@/components/razmyar-shell'
import { RoleGuard } from '@/features/auth/guards'
import { useAuth } from '@/lib/auth-context'
import { TeamReportsView } from '@/features/team-admin/components/team-reports-view'

export default function ReportsPage() {
  const { role } = useAuth()

  return (
    <RoleGuard allowedRoles={['TEAM_ADMIN', 'SUPER_ADMIN']}>
      <RazmyarShell title="گزارش‌ها">
        {role === 'TEAM_ADMIN' ? <TeamReportsView /> : <ReportsPageContent />}
      </RazmyarShell>
    </RoleGuard>
  )
}
