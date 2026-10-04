'use client'

import { RazmyarShell } from '@/components/razmyar-shell'
import { RoleGuard } from '@/features/auth/guards'
import { PlatformOptimizationScreen } from '@/features/super-admin/platform-optimization/screens/platform-optimization-screen'

export default function PlatformOptimizationPage() {
  return (
    <RoleGuard allowedRoles={['SUPER_ADMIN']}>
      <RazmyarShell title="بهینه‌سازی پلتفرم">
        <PlatformOptimizationScreen />
      </RazmyarShell>
    </RoleGuard>
  )
}
