'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import {
  Users,
  Building2,
  ShieldAlert,
  CreditCard,
  DollarSign,
  Activity,
  AlertCircle,
  Sparkles,
  Plus,
  ArrowLeft,
  Search,
  CalendarClock,
  PlayCircle,
  CheckCircle2,
  ChevronLeft,
} from 'lucide-react'
import { usePlatformOptimization } from './platform-optimization/store/use-platform-optimization'
import { IdeaStatusBadge } from './platform-optimization/components/idea-status-badge'
import { IdeaPriorityBadge } from './platform-optimization/components/idea-priority-badge'
import { CreateIdeaModal } from './platform-optimization/components/create-idea-modal'

export function SuperAdminDashboard() {
  const { ideas, fetchIdeas, getMetrics, openCreate } = usePlatformOptimization()

  useEffect(() => {
    fetchIdeas()
  }, [fetchIdeas])

  const metrics = getMetrics()
  const latestIdeas = ideas.slice(0, 4)

  const stats = [
    { label: 'کل تیم‌ها', value: '۱۲', sub: '۸ فعال', icon: ShieldAlert, color: 'text-blue-500' },
    { label: 'کل باشگاه‌ها', value: '۴۵', sub: '۳۸ فعال', icon: Building2, color: 'text-indigo-500' },
    { label: 'کل کاربران', value: '۱,۲۵۰', sub: 'فعال: ۱,۱۰۰', icon: Users, color: 'text-emerald-500' },
    { label: 'اشتراک‌های فعال', value: '۳۵', sub: '۴ در حال انقضا', icon: CreditCard, color: 'text-amber-500' },
    { label: 'درآمد ماهانه', value: '۲۵M', sub: 'تومان', icon: DollarSign, color: 'text-green-500' },
    { label: 'وضعیت سیستم', value: 'سالم', sub: 'بدون قطعی', icon: Activity, color: 'text-cyan-500' },
  ]

  return (
    <div className="space-y-6 pb-12" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-foreground">نمای کلی پلتفرم (Platform Overview)</h2>
          <p className="text-xs text-muted-foreground mt-0.5">پایش سلامت سیستم، آمار کلان و ماژول‌های توسعه سامانه رزمیار</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {stats.map((stat, i) => (
          <div key={i} className="rounded-3xl border border-border bg-card p-4 shadow-xs flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">{stat.label}</span>
              <stat.icon className={`size-4 ${stat.color}`} />
            </div>
            <div>
              <div className="text-2xl font-black text-foreground">{stat.value}</div>
              <p className="text-[10px] text-muted-foreground">{stat.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* PLATFORM OPTIMIZATION DEDICATED CARD / SECTION */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary border border-primary/20">
              <Sparkles className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-foreground">بهینه‌سازی پلتفرم</h3>
                <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                  مدیریت ایده‌ها و بهبودها
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">ایده‌ها و پیشنهادهای بهبود سیستم</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={openCreate}
              className="flex items-center gap-1.5 rounded-2xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90 transition"
            >
              <Plus className="size-4" />
              <span>ثبت ایده جدید</span>
            </button>

            <Link
              href="/super-admin/optimization"
              className="flex items-center gap-1 rounded-2xl border border-border bg-card px-3.5 py-2 text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted transition"
            >
              <span>مشاهده همه</span>
              <ChevronLeft className="size-4" />
            </Link>
          </div>
        </div>

        {/* Metrics Sub-grid */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5 text-xs">
          <div className="rounded-2xl border border-border/70 bg-muted/20 p-3">
            <span className="text-[11px] text-muted-foreground block font-semibold">کل ایده‌ها</span>
            <div className="text-lg font-black text-foreground mt-0.5">{metrics.total}</div>
          </div>
          <div className="rounded-2xl border border-border/70 bg-muted/20 p-3">
            <span className="text-[11px] text-muted-foreground block font-semibold">در حال بررسی</span>
            <div className="text-lg font-black text-purple-500 mt-0.5">{metrics.inReview}</div>
          </div>
          <div className="rounded-2xl border border-border/70 bg-muted/20 p-3">
            <span className="text-[11px] text-muted-foreground block font-semibold">برنامه‌ریزی شده</span>
            <div className="text-lg font-black text-amber-500 mt-0.5">{metrics.planned}</div>
          </div>
          <div className="rounded-2xl border border-border/70 bg-muted/20 p-3">
            <span className="text-[11px] text-muted-foreground block font-semibold">در حال اجرا</span>
            <div className="text-lg font-black text-cyan-500 mt-0.5">{metrics.inProgress}</div>
          </div>
          <div className="rounded-2xl border border-border/70 bg-muted/20 p-3 col-span-2 sm:col-span-1">
            <span className="text-[11px] text-muted-foreground block font-semibold">تکمیل شده</span>
            <div className="text-lg font-black text-emerald-500 mt-0.5">{metrics.done}</div>
          </div>
        </div>

        {/* Latest Ideas List */}
        <div className="space-y-2.5">
          <div className="text-xs font-bold text-muted-foreground">آخرین ایده‌ها و پیشنهادات ثبت‌شده:</div>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {latestIdeas.map((idea) => (
              <Link
                key={idea.id}
                href="/super-admin/optimization"
                className="flex items-center justify-between rounded-2xl border border-border/70 bg-muted/10 p-3.5 hover:border-primary/40 hover:bg-muted/30 transition group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                      {idea.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                    <span>{idea.createdBy}</span>
                    <span>·</span>
                    <span>{idea.createdAt}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <IdeaPriorityBadge priority={idea.priority} />
                  <IdeaStatusBadge status={idea.status} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* System Health */}
        <div className="rounded-3xl border border-border bg-card p-5 shadow-xs">
          <h3 className="text-sm font-bold flex items-center gap-2 mb-4">
            <Activity className="size-4 text-primary" />
            سلامت سیستم (System Health)
          </h3>
          <div className="space-y-4 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-border">
              <span className="text-muted-foreground">وضعیت اپلیکیشن</span>
              <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-emerald-500 font-bold">آنلاین (Online)</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-border">
              <span className="text-muted-foreground">وضعیت سرویس محلی</span>
              <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-emerald-500 font-bold">فعال (Active)</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-border">
              <span className="text-muted-foreground">پوشش لایسنس تیمی</span>
              <span className="text-foreground font-semibold">۱۰۰٪ باشگاه‌های فعال</span>
            </div>
            <div className="flex items-center gap-2 text-amber-500 bg-amber-500/10 p-2.5 rounded-2xl">
              <AlertCircle className="size-4 shrink-0" />
              <span>توجه: اشتراک تیم قهرمانان به دلیل عدم تمدید در حالت معلق (SUSPENDED) قرار دارد.</span>
            </div>
          </div>
        </div>

        {/* Quick Actions / Alerts */}
        <div className="rounded-3xl border border-border bg-card p-5 shadow-xs">
          <h3 className="text-sm font-bold flex items-center gap-2 mb-4">
            <AlertCircle className="size-4 text-amber-500" />
            هشدارهای مهم سازمانی
          </h3>
          <div className="space-y-3 text-xs">
            <div className="rounded-2xl border border-border p-3 flex justify-between items-center hover:bg-muted transition cursor-pointer">
              <div>
                <p className="text-xs font-bold text-foreground">انقضای اشتراک: تیم X</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">پوشش ۲ باشگاه تحت نظر این تیم تا ۳۰ روز دیگر به پایان می‌رسد.</p>
              </div>
              <Link
                href="/super-admin/subscriptions"
                className="text-[10px] bg-primary text-primary-foreground px-3 py-1.5 rounded-xl font-bold"
              >
                بررسی
              </Link>
            </div>
            <div className="rounded-2xl border border-border p-3 flex justify-between items-center hover:bg-muted transition cursor-pointer">
              <div>
                <p className="text-xs font-bold text-foreground">لایسنس معلق: تیم قهرمانان</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">وضعیت اشتراک در حالت SUSPENDED ثبت گردیده است.</p>
              </div>
              <Link
                href="/super-admin/subscriptions"
                className="text-[10px] bg-primary text-primary-foreground px-3 py-1.5 rounded-xl font-bold"
              >
                پیگیری
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Modal instance for Dashboard */}
      <CreateIdeaModal />
    </div>
  )
}
