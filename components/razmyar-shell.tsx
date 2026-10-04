'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  Bell,
  BookOpen,
  ChevronDown,
  CircleHelp,
  Menu,
  Search,
  Settings,
  Users,
  X,
  LogOut,
  Award,
  Trophy,
  Gauge,
  Building2,
  Dumbbell,
  CheckSquare,
  DollarSign,
  ShieldAlert,
  Server,
  CreditCard,
  UserCheck,
  Sparkles,
  Clock,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/auth-context'
import { UserRole } from '@/features/auth/types'
import { ClubSelector } from './navigation/club-selector'

export function RazmyarShell({ children, title = 'داشبورد' }: { children: React.ReactNode; title?: string }) {
  const pathname = usePathname()
  const { user, role, teamName, switchMockUser, logout, remainingSeconds, isLoading } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [globalSearch, setGlobalSearch] = useState('')

  // Format remaining time for 10-minute session
  const mins = Math.floor(remainingSeconds / 60)
  const secs = remainingSeconds % 60
  const timeDisplay = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`

  // Dynamic Navigation Items based on Role
  const getNavItems = () => {
    if (role === 'SUPER_ADMIN') {
      return [
        { href: '/dashboard', label: 'داشبورد پلتفرم', icon: Gauge },
        { href: '/super-admin/teams', label: 'مدیریت تیم‌ها', icon: ShieldAlert },
        { href: '/super-admin/clubs', label: 'مدیریت باشگاه‌ها', icon: Building2 },
        { href: '/super-admin/plans', label: 'مدیریت پلن‌ها', icon: CreditCard },
        { href: '/super-admin/subscriptions', label: 'مدیریت اشتراک‌ها', icon: DollarSign },
        { href: '/super-admin/users', label: 'مدیریت کاربران', icon: Users },
        { href: '/super-admin/optimization', label: 'بهینه‌سازی پلتفرم', icon: Sparkles },
        { href: '/super-admin/activity', label: 'گزارش فعالیت‌ها', icon: Server },
        { href: '/settings', label: 'تنظیمات پلتفرم', icon: Settings },
      ]
    }

    if (role === 'USER') {
      return [
        { href: '/dashboard', label: 'داشبورد من', icon: Gauge },
        { href: '/tasks', label: 'وظایف من', icon: CheckSquare },
        { href: '/workout', label: 'تمرینات من', icon: Dumbbell },
        { href: '/reminders', label: 'یادآورها', icon: Bell },
        { href: '/profile', label: 'پروفایل کاربری', icon: UserCheck },
      ]
    }

    // Default: TEAM_ADMIN
    return [
      { href: '/dashboard', label: 'داشبورد تیم', icon: Gauge },
      { href: '/clubs', label: 'مدیریت باشگاه‌ها', icon: Building2 },
      { href: '/students', label: 'بازیکنان و هنرجویان', icon: Users },
      { href: '/assessments', label: 'تمرینات و ارزیابی', icon: Dumbbell },
      { href: '/tasks', label: 'وظایف و تسک‌ها', icon: CheckSquare },
      { href: '/finance', label: 'امور مالی باشگاه', icon: DollarSign },
      { href: '/subscriptions', label: 'وضعیت اشتراک‌ها', icon: CreditCard },
      { href: '/reports', label: 'گزارش‌ها و مقایسه', icon: BookOpen },
      { href: '/activity', label: 'فعالیت‌های تیم', icon: Server },
      { href: '/settings', label: 'تنظیمات تیم', icon: Settings },
    ]
  }

  const navItems = getNavItems()

  return (
    <div className="min-h-screen bg-background text-foreground" dir="rtl">
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <button
          aria-label="بستن منو"
          className="fixed inset-0 z-30 bg-background/70 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 right-0 z-40 flex w-72 flex-col border-l border-border bg-card transition-transform md:translate-x-0',
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Brand Header */}
        <div className="flex h-20 items-center justify-between border-b border-border px-6">
          <Link href="/dashboard" className="flex items-center gap-3" onClick={() => setMobileOpen(false)}>
            <span className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-bold shadow-lg shadow-cyan-500/20">
              ر
            </span>
            <div>
              <span className="block text-lg font-bold tracking-tight">رزمیار</span>
              <span className="block text-[11px] text-muted-foreground">
                {role === 'SUPER_ADMIN' ? 'پنل سوپر ادمین' : role === 'TEAM_ADMIN' ? `پنل ${teamName}` : 'پنل هنرجو'}
              </span>
            </div>
          </Link>
          <button
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted md:hidden"
            aria-label="بستن"
            onClick={() => setMobileOpen(false)}
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-1 flex-col gap-1 p-4 overflow-y-auto" aria-label="ناوبری اصلی">
          <div className="mb-2 px-3 flex items-center justify-between text-xs font-semibold text-muted-foreground">
            <span>
              {role === 'SUPER_ADMIN' ? 'مدیریت کل پلتفرم' : role === 'TEAM_ADMIN' ? `مدیریت ${teamName}` : 'بخش‌های من'}
            </span>
            <span className="rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] text-primary font-bold">
              {role}
            </span>
          </div>

          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                  active ? 'bg-primary/15 font-semibold text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <Icon className="size-4" />
                {label}
              </Link>
            )
          })}

          {role !== 'USER' && (
            <>
              <p className="mb-2 mt-6 px-3 text-xs font-semibold text-muted-foreground">تنظیمات و دسترسی</p>
              <Link
                href="/settings"
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                  pathname === '/settings' ? 'bg-primary/15 font-semibold text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <Settings className="size-4" />
                تنظیمات
              </Link>
            </>
          )}
          <Link
            href="/help"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground mt-1"
          >
            <CircleHelp className="size-4" />
            راهنما و پشتیبانی
          </Link>
        </nav>

        {/* Scope Info Widget */}
        <div className="m-4 rounded-2xl border border-border bg-muted/40 p-3.5 space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-foreground flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
              {role === 'SUPER_ADMIN'
                ? 'سطح: مالک پلتفرم'
                : role === 'TEAM_ADMIN'
                ? `دامنه: ${teamName}`
                : 'حساب: کاربری هنرجو'}
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-5">
            {role === 'SUPER_ADMIN'
              ? 'دسترسی کامل به تمام تیم‌ها و باشگاه‌ها'
              : role === 'TEAM_ADMIN'
              ? 'دسترسی به باشگاه‌های زیرمجموعه تیم فعلی'
              : 'دسترسی اختصاصی به برنامه‌ها و وظایف شخصی'}
          </p>
        </div>
      </aside>

      {/* Main Layout Area */}
      <div className="md:mr-72">
        <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-border bg-background/90 px-4 backdrop-blur-md md:px-8">
          {/* Header Right: Menu toggle & Context Selector */}
          <div className="flex items-center gap-3">
            <button
              className="rounded-lg p-2 hover:bg-muted md:hidden"
              aria-label="باز کردن منو"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="size-5" />
            </button>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                {role === 'TEAM_ADMIN' && (
                  <div className="flex items-center gap-1 rounded-lg border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                    <span className="text-[11px] font-normal text-muted-foreground">تیم:</span>
                    <span>{teamName}</span>
                  </div>
                )}
                {role === 'SUPER_ADMIN' && (
                  <span className="rounded-lg bg-purple-500/10 px-2.5 py-1 text-xs font-bold text-purple-500 border border-purple-500/20">
                    مدیریت کل سیستم
                  </span>
                )}
                {role === 'USER' && (
                  <span className="rounded-lg bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-500 border border-emerald-500/20">
                    پنل فردی هنرجو
                  </span>
                )}
                {/* CLUB SELECTOR IN HEADER */}
                {role !== 'USER' && <ClubSelector />}
              </div>
              <h1 className="text-base sm:text-lg font-bold text-foreground">{title}</h1>
            </div>
          </div>

          {/* Header Left: Search, Notifications, Profile */}
          <div className="flex items-center gap-2 md:gap-3">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                if (globalSearch.trim()) window.location.href = `/students?q=${encodeURIComponent(globalSearch.trim())}`
              }}
              className="hidden items-center gap-2 rounded-xl border border-input bg-muted/40 px-3 py-1.5 sm:flex"
            >
              <Search className="size-3.5 text-muted-foreground" />
              <input
                aria-label="جست‌وجو"
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                placeholder="جستجو در سامانه..."
                className="w-36 bg-transparent text-xs outline-none placeholder:text-muted-foreground"
              />
            </form>

            {/* 10-Minute Session Countdown Indicator */}
            <div
              className={cn(
                'flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-mono border transition-all',
                remainingSeconds < 60
                  ? 'border-rose-500/40 bg-rose-500/15 text-rose-300 animate-pulse font-bold'
                  : remainingSeconds < 180
                  ? 'border-amber-500/40 bg-amber-500/15 text-amber-300'
                  : 'border-border/80 bg-muted/50 text-muted-foreground'
              )}
              title="مدت زمان باقی‌مانده از اعتبار نشست (حداکثر ۱۰ دقیقه). پس از پایان، جهت امنیت اطلاعات به صورت خودکار کوکی پاک شده و خارج می‌شوید."
            >
              <Clock className={cn('size-3.5', remainingSeconds < 60 ? 'text-rose-400' : 'text-primary')} />
              <span>{timeDisplay}</span>
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen)
                  setProfileOpen(false)
                }}
                aria-label="اعلان‌ها"
                className="relative rounded-xl border border-border p-2 text-muted-foreground hover:bg-muted"
              >
                <Bell className="size-4" />
                <span className="absolute right-1 top-1 size-2 rounded-full bg-primary" />
              </button>
              {notificationsOpen && (
                <div className="absolute left-0 top-12 w-80 rounded-2xl border border-border bg-card p-4 shadow-2xl z-50 space-y-3">
                  <div className="flex items-center justify-between border-b border-border pb-2">
                    <span className="text-xs font-bold text-foreground">اعلان‌های اخیر</span>
                    <span className="text-[10px] text-primary">۳ پیام جدید</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="rounded-xl bg-accent/40 p-2.5 space-y-1">
                      <p className="font-semibold text-foreground">ثبت‌نام مسابقه جام فجر آغاز شد</p>
                      <span className="text-[10px] text-muted-foreground">امروز، ۰۹:۱۵</span>
                    </div>
                    <div className="rounded-xl bg-muted/50 p-2.5 space-y-1">
                      <p className="font-semibold text-foreground">ارزیابی مهارتی باشگاه پرتو ذخیره شد</p>
                      <span className="text-[10px] text-muted-foreground">دیروز، ۱۸:۳۰</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown with Fast Mock Switcher */}
            <div className="relative">
              <button
                onClick={() => {
                  setProfileOpen(!profileOpen)
                  setNotificationsOpen(false)
                }}
                className="flex items-center gap-2 rounded-xl p-1.5 hover:bg-muted border border-border/60"
              >
                <span className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 text-xs font-bold text-white">
                  {user?.name?.[0] || 'م'}
                </span>
                <span className="hidden text-right md:block">
                  <span className="block text-xs font-semibold leading-tight">{user?.name}</span>
                  <span className="block text-[10px] text-muted-foreground">{role}</span>
                </span>
                <ChevronDown className="hidden size-3.5 text-muted-foreground md:block" />
              </button>

              {profileOpen && (
                <div className="absolute left-0 top-12 w-64 rounded-2xl border border-border bg-card p-2 shadow-2xl z-50 space-y-1">
                  <div className="px-3 py-2 border-b border-border">
                    <p className="text-xs font-bold text-foreground">{user?.name}</p>
                    <p className="text-[10px] text-muted-foreground">{user?.email}</p>
                    <span className="mt-1 inline-block rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold text-primary">
                      نقش فعال: {role}
                    </span>
                  </div>

                  {/* Fast Mock Switcher for Easy Testing */}
                  <div className="p-2 space-y-1">
                    <p className="text-[10px] font-bold text-muted-foreground px-1 flex items-center gap-1">
                      <Sparkles className="size-3 text-amber-400" />
                      تغییر سریع کاربر تستی (Mock Switch):
                    </p>
                    <button
                      onClick={() => {
                        switchMockUser('super_admin')
                        setProfileOpen(false)
                      }}
                      className={cn(
                        'w-full text-right rounded-lg px-2 py-1.5 text-xs transition-colors',
                        role === 'SUPER_ADMIN' ? 'bg-primary/15 font-bold text-primary' : 'hover:bg-muted text-muted-foreground'
                      )}
                    >
                      👑 مدیر کل (SUPER_ADMIN)
                    </button>
                    <button
                      onClick={() => {
                        switchMockUser('fajr_admin')
                        setProfileOpen(false)
                      }}
                      className={cn(
                        'w-full text-right rounded-lg px-2 py-1.5 text-xs transition-colors',
                        role === 'TEAM_ADMIN' && user?.teamId === 'FAJR'
                          ? 'bg-primary/15 font-bold text-primary'
                          : 'hover:bg-muted text-muted-foreground'
                      )}
                    >
                      🥋 ادمین تیم فجر (TEAM_ADMIN)
                    </button>
                    <button
                      onClick={() => {
                        switchMockUser('teamx_admin')
                        setProfileOpen(false)
                      }}
                      className={cn(
                        'w-full text-right rounded-lg px-2 py-1.5 text-xs transition-colors',
                        role === 'TEAM_ADMIN' && user?.teamId === 'TEAM_X'
                          ? 'bg-primary/15 font-bold text-primary'
                          : 'hover:bg-muted text-muted-foreground'
                      )}
                    >
                      🥊 ادمین تیم X (TEAM_ADMIN)
                    </button>
                    <button
                      onClick={() => {
                        switchMockUser('user')
                        setProfileOpen(false)
                      }}
                      className={cn(
                        'w-full text-right rounded-lg px-2 py-1.5 text-xs transition-colors',
                        role === 'USER' ? 'bg-primary/15 font-bold text-primary' : 'hover:bg-muted text-muted-foreground'
                      )}
                    >
                      👤 کاربر عادی (USER)
                    </button>
                  </div>

                  <div className="border-t border-border pt-1">
                    <Link
                      href="/settings"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs text-foreground hover:bg-muted"
                    >
                      <Settings className="size-3.5 text-muted-foreground" />
                      تنظیمات حساب
                    </Link>
                    <Link
                      href="/login"
                      onClick={() => {
                        logout()
                        setProfileOpen(false)
                      }}
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs text-destructive hover:bg-destructive/10"
                    >
                      <LogOut className="size-3.5 text-destructive" />
                      خروج از حساب
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content Container */}
        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  )
}
