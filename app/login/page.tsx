'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  Eye,
  EyeOff,
  LockKeyhole,
  User,
  ShieldCheck,
  Sparkles,
  Clock,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'

function LoginFormContent() {
  const searchParams = useSearchParams()
  const { login, switchMockUser } = useAuth()

  const [username, setUsername] = useState('coach_fajr')
  const [password, setPassword] = useState('123456')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<{ username?: string; password?: string }>({})

  const isExpired = searchParams?.get('expired') === 'true'
  const isUnauthorized = searchParams?.get('unauthorized') === 'true'
  const redirectTarget = searchParams?.get('redirect') || '/dashboard'

  // Clear query error messages when user types
  useEffect(() => {
    setErrorMsg(null)
  }, [username, password])

  const validateForm = (): boolean => {
    const errors: { username?: string; password?: string } = {}

    if (!username || username.trim().length < 3) {
      errors.username = 'نام کاربری یا ایمیل باید حداقل ۳ کاراکتر باشد'
    }

    if (!password || password.length < 6) {
      errors.password = 'رمز عبور باید حداقل ۶ کاراکتر باشد'
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const res = await login(username.trim(), password)
      setLoading(false)

      if (res.success) {
        window.location.href = redirectTarget
      } else {
        setErrorMsg(res.message || 'نام کاربری یا رمز عبور اشتباه است')
      }
    } catch {
      setLoading(false)
      setErrorMsg('خطا در ورود به سامانه. لطفاً دوباره تلاش کنید.')
    }
  }

  const handleQuickLogin = async (type: 'super_admin' | 'fajr_admin' | 'teamx_admin' | 'user') => {
    setLoading(true)
    setErrorMsg(null)
    const success = await switchMockUser(type)
    setLoading(false)

    if (success) {
      window.location.href = redirectTarget
    } else {
      setErrorMsg('خطا در ورود به حساب آزمایشی')
    }
  }

  return (
    <div className="flex flex-col justify-center p-6 sm:p-12">
      <div className="mb-6">
        <div className="flex items-center gap-2 lg:hidden mb-4">
          <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-bold">
            ر
          </span>
          <span className="text-lg font-bold">رزمیار</span>
        </div>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">ورود به سامانه</h2>
          <div className="flex items-center gap-1.5 rounded-full bg-cyan-500/10 px-2.5 py-1 text-[11px] font-semibold text-cyan-400 border border-cyan-500/20">
            <Clock className="size-3" />
            <span>نشست ۱۰ دقیقه‌ای</span>
          </div>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          نام کاربری و گذرواژه خود را برای دسترسی امن به پنل وارد نمایید.
        </p>
      </div>

      {/* Session Expired Banner */}
      {isExpired && (
        <div className="mb-4 flex items-start gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-300">
          <AlertTriangle className="size-5 shrink-0 text-amber-400 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-amber-200">نشست کاربری شما منقضی شد</p>
            <p className="text-[11px] leading-relaxed text-amber-300/90">
              مدت اعتبار نشست شما (۱۰ دقیقه) به پایان رسید و جهت امنیت کوکی‌ها پاکسازی شدند. لطفاً مجدداً وارد شوید.
            </p>
          </div>
        </div>
      )}

      {/* Unauthorized Access Banner */}
      {isUnauthorized && (
        <div className="mb-4 flex items-start gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs text-rose-300">
          <AlertTriangle className="size-5 shrink-0 text-rose-400 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-rose-200">عدم دسترسی مجاز</p>
            <p className="text-[11px] leading-relaxed text-rose-300/90">
              حساب کاربری شما اجازه دسترسی به این بخش را ندارد.
            </p>
          </div>
        </div>
      )}

      {/* General Error Message */}
      {errorMsg && (
        <div className="mb-4 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive font-medium">
          {errorMsg}
        </div>
      )}

      {/* Standard Form */}
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5 text-xs font-medium text-foreground">
          نام کاربری یا ایمیل
          <div className="relative">
            <User className="absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              dir="ltr"
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value)
                if (fieldErrors.username) setFieldErrors({ ...fieldErrors, username: undefined })
              }}
              placeholder="coach_fajr یا owner@razmyar.ir"
              required
              className={`h-11 w-full rounded-xl border ${
                fieldErrors.username ? 'border-destructive ring-1 ring-destructive' : 'border-input'
              } bg-background pr-10 pl-3 text-xs outline-none transition focus:border-primary focus:ring-1 focus:ring-primary`}
            />
          </div>
          {fieldErrors.username && (
            <span className="text-[11px] text-destructive">{fieldErrors.username}</span>
          )}
        </label>

        <label className="flex flex-col gap-1.5 text-xs font-medium text-foreground">
          رمز عبور
          <div className="relative">
            <LockKeyhole className="absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              dir="ltr"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: undefined })
              }}
              placeholder="••••••••"
              required
              className={`h-11 w-full rounded-xl border ${
                fieldErrors.password ? 'border-destructive ring-1 ring-destructive' : 'border-input'
              } bg-background pr-10 pl-11 text-xs outline-none transition focus:border-primary focus:ring-1 focus:ring-primary`}
            />
            <button
              type="button"
              aria-label={showPassword ? 'پنهان کردن رمز' : 'نمایش رمز'}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {fieldErrors.password && (
            <span className="text-[11px] text-destructive">{fieldErrors.password}</span>
          )}
        </label>

        <div className="flex items-center justify-between text-xs pt-1">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <CheckCircle2 className="size-3.5 text-emerald-400" />
            <span className="text-[11px]">احراز هویت رمزنگاری‌شده JWT</span>
          </div>
          <Link href="/help" className="text-xs text-primary hover:underline">
            راهنمای ورود
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 h-11 rounded-xl bg-primary text-xs font-bold text-primary-foreground transition hover:opacity-90 disabled:cursor-wait disabled:opacity-60 shadow-md shadow-primary/20"
        >
          {loading ? 'در حال بررسی اعتبار و صدور نشست...' : 'ورود امن به سامانه'}
        </button>
      </form>

      {/* Quick Role-Based Testing Accounts */}
      <div className="mt-8 rounded-2xl border border-border/80 bg-muted/40 p-4 space-y-2.5">
        <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
          <Sparkles className="size-3.5 text-amber-400" />
          <span>ورود سریع آزمایشی با نقش‌های کاربری:</span>
        </div>
        <p className="text-[11px] text-muted-foreground">
          هر حساب با نشست مستقل ۱۰ دقیقه‌ای و دسترسی‌های اختصاصی فعال می‌شود:
        </p>
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={() => handleQuickLogin('fajr_admin')}
            className="flex items-center justify-between rounded-xl border border-border bg-card p-2.5 text-right text-xs font-medium hover:border-primary/50 hover:bg-accent transition"
          >
            <div>
              <span className="block font-bold text-foreground">ادمین تیم فجر</span>
              <span className="block text-[10px] text-muted-foreground">۳ باشگاه (پرتو و...)</span>
            </div>
            <span className="text-[10px] text-primary font-mono font-bold">TEAM_ADMIN</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickLogin('super_admin')}
            className="flex items-center justify-between rounded-xl border border-border bg-card p-2.5 text-right text-xs font-medium hover:border-primary/50 hover:bg-accent transition"
          >
            <div>
              <span className="block font-bold text-foreground">مالک کل پلتفرم</span>
              <span className="block text-[10px] text-muted-foreground">دسترسی به تمام تیم‌ها</span>
            </div>
            <span className="text-[10px] text-amber-400 font-mono font-bold">SUPER_ADMIN</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickLogin('teamx_admin')}
            className="flex items-center justify-between rounded-xl border border-border bg-card p-2.5 text-right text-xs font-medium hover:border-primary/50 hover:bg-accent transition"
          >
            <div>
              <span className="block font-bold text-foreground">ادمین تیم X</span>
              <span className="block text-[10px] text-muted-foreground">باشگاه‌های X1 و X2</span>
            </div>
            <span className="text-[10px] text-primary font-mono font-bold">TEAM_ADMIN</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickLogin('user')}
            className="flex items-center justify-between rounded-xl border border-border bg-card p-2.5 text-right text-xs font-medium hover:border-primary/50 hover:bg-accent transition"
          >
            <div>
              <span className="block font-bold text-foreground">هنرجوی رزمی</span>
              <span className="block text-[10px] text-muted-foreground">مشاهده پرونده فردی</span>
            </div>
            <span className="text-[10px] text-muted-foreground font-mono font-bold">USER</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4 sm:p-6" dir="rtl">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-border bg-card shadow-2xl lg:grid-cols-[1fr_1.1fr]">
        {/* Visual Brand Column */}
        <div className="hidden min-h-[640px] flex-col justify-between bg-gradient-to-br from-card via-accent/30 to-background p-10 lg:flex border-l border-border">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-bold shadow-lg shadow-cyan-500/20">
                ر
              </span>
              <span className="text-xl font-extrabold tracking-tight text-foreground">رزمیار</span>
            </div>

            <div className="mt-20 max-w-sm">
              <p className="mb-2 text-xs font-bold text-primary">امنیت و کنترل دسترسی پیشرفته</p>
              <h1 className="text-3xl font-extrabold leading-snug text-foreground">
                احراز هویت هوشمند و مدیریت نشست کاربری
              </h1>
              <p className="mt-4 text-xs leading-7 text-muted-foreground">
                بهره‌مندی از توکن‌های استاندارد با مدت انقضای ۱۰ دقیقه، حفاظت خودکار کوکی‌ها در برابر نشت اطلاعات و تفکیک کامل سطوح دسترسی مدیران، مربیان و هنرجویان.
              </p>
            </div>
          </div>

          <div className="space-y-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-emerald-400" />
              <span>انقضای خودکار نشست پس از ۱۰ دقیقه عدم فعالیت یا مرور</span>
            </div>
            <p className="text-[11px] text-muted-foreground/80">
              پاکسازی خودکار کوکی و ذخیره‌ساز محلی جهت تضمین امنیت حساب‌ها
            </p>
          </div>
        </div>

        {/* Login Form Column */}
        <Suspense fallback={<div className="p-12 text-center text-xs">در حال بارگذاری فرم...</div>}>
          <LoginFormContent />
        </Suspense>
      </div>
    </main>
  )
}
