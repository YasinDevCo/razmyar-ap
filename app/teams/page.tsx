'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { RoleGuard } from '@/features/auth/guards'
import { RazmyarShell } from '@/components/razmyar-shell'

export default function TeamsPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/super-admin/teams')
  }, [router])

  return (
    <RoleGuard allowedRoles={['SUPER_ADMIN']}>
      <RazmyarShell title="مدیریت تیم‌ها">
        <div className="p-8 text-center text-sm text-muted-foreground">در حال انتقال به پنل تیم‌ها...</div>
      </RazmyarShell>
    </RoleGuard>
  )
}
