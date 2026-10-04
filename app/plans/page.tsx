'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { RoleGuard } from '@/features/auth/guards'
import { RazmyarShell } from '@/components/razmyar-shell'

export default function PlansPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/super-admin/plans')
  }, [router])

  return (
    <RoleGuard allowedRoles={['SUPER_ADMIN']}>
      <RazmyarShell title="طرح‌ها و تعرفه‌ها">
        <div className="p-8 text-center text-sm text-muted-foreground">در حال انتقال به پنل تعرفه‌ها...</div>
      </RazmyarShell>
    </RoleGuard>
  )
}
