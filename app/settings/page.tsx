'use client'

import { SettingsPageContent } from '@/components/razmyar-pages'
import { RazmyarShell } from '@/components/razmyar-shell'
import { RoleGuard } from '@/features/auth/guards'
import { useAuth } from '@/lib/auth-context'
import { TeamSettingsView } from '@/features/team-admin/components/team-settings-view'

export default function SettingsPage() {
  const { role } = useAuth()

  return (
    <RoleGuard allowedRoles={['TEAM_ADMIN', 'SUPER_ADMIN']}>
      <RazmyarShell title="تنظیمات سامانه">
        {role === 'TEAM_ADMIN' ? <TeamSettingsView /> : <SettingsPageContent />}
      </RazmyarShell>
    </RoleGuard>
  )
}
