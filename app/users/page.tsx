'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { RoleGuard } from '@/features/auth/guards'
import { RazmyarShell } from '@/components/razmyar-shell'

export default function UsersPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/super-admin/users')
  }, [router])

  return (
    <RoleGuard allowedRoles={['SUPER_ADMIN']}>
      <RazmyarShell title="مدیریت کاربران">
        <div className="p-8 text-center text-sm text-muted-foreground">در حال انتقال به پنل کاربران...</div>
      </RazmyarShell>
    </RoleGuard>
  )
}
