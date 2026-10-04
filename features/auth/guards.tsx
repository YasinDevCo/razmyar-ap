'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { ShieldAlert, ArrowRight, Home, Lock } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { UserRole } from './types'

export function AccessDenied({ requiredRoles }: { requiredRoles?: UserRole[] }) {
  const { role } = useAuth()

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md rounded-3xl border border-destructive/20 bg-card p-6 sm:p-8 shadow-2xl text-center space-y-5 animate-in zoom-in-95 duration-200">
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive shadow-sm">
          <ShieldAlert className="size-8" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-destructive/10 px-3 py-1 text-xs font-bold text-destructive">
            <Lock className="size-3.5" />
            <span>خطای سطح دسترسی (Access Denied)</span>
          </div>
          <h2 className="text-xl font-black text-foreground sm:text-2xl">
            شما اجازه دسترسی به این بخش را ندارید
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            این صفحه متعلق به پنل‌های مدیریتی (مدیر کل یا مدیر تیم) است. حساب کاربری شما با نقش{' '}
            <strong className="text-foreground">«{role === 'USER' ? 'کاربر عادی (USER)' : role}»</strong> دسترسی لازم برای مشاهده یا مدیریت این اطلاعات را ندارد.
          </p>
        </div>

        {requiredRoles && (
          <div className="rounded-2xl bg-muted/40 p-3 text-[11px] text-muted-foreground">
            نقش‌های مجاز: {requiredRoles.join(' ، ')}
          </div>
        )}

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 transition"
          >
            <Home className="size-4" />
            <span>بازگشت به داشبورد شخصی</span>
          </Link>
          <Link
            href="/tasks"
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl border border-border bg-card px-4 py-2.5 text-xs font-semibold text-muted-foreground hover:bg-muted transition"
          >
            <span>وظایف من</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

interface RoleGuardProps {
  children: React.ReactNode
  allowedRoles: UserRole[]
  redirectTo?: string
}

export function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const { role, isLoading } = useAuth()
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)

  useEffect(() => {
    if (!isLoading) {
      if (allowedRoles.includes(role)) {
        setIsAuthorized(true)
      } else {
        setIsAuthorized(false)
      }
    }
  }, [isLoading, role, allowedRoles])

  if (isLoading || isAuthorized === null) {
    return (
      <div className="flex items-center justify-center min-h-screen text-xs text-muted-foreground">
        در حال بررسی دسترسی...
      </div>
    )
  }

  if (!isAuthorized) {
    return <AccessDenied requiredRoles={allowedRoles} />
  }

  return <>{children}</>
}
