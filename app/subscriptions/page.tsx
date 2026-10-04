'use client'

import { useState, useEffect } from 'react'
import {
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  PhoneCall,
  X,
  Building2,
  Shield,
  Calendar,
  Check,
  Zap,
  HelpCircle,
  Clock,
  ArrowUpRight,
} from 'lucide-react'
import { RazmyarShell } from '@/components/razmyar-shell'
import { RoleGuard } from '@/features/auth/guards'
import { useAuth } from '@/lib/auth-context'
import { useTeamAdminStore } from '@/features/team-admin/store'
import {
  getTeamSubscription,
  getCoveredClubs,
  MOCK_PLANS,
} from '@/features/subscriptions/subscription-service'

export default function SubscriptionsPage() {
  const { teamId, teamName, selectedClubId } = useAuth()
  const { teamClubs } = useTeamAdminStore(teamId || 'FAJR', selectedClubId)

  // Resolve team-level subscription
  const currentTeamId = teamId || 'FAJR'
  const subscription = getTeamSubscription(currentTeamId)
  const plan = subscription
    ? MOCK_PLANS.find((p) => p.id === subscription.planId) || MOCK_PLANS[1]
    : MOCK_PLANS[1]

  // Covered clubs inherit the team subscription
  const coveredClubs = getCoveredClubs(currentTeamId)
  const displayClubs = coveredClubs.length > 0 ? coveredClubs : teamClubs

  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false)
  const [isSupportOpen, setIsSupportOpen] = useState(false)
  const [selectedPlanUpgrade, setSelectedPlanUpgrade] = useState('PLAN_PRO')
  const [upgradeNotes, setUpgradeNotes] = useState('')
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  const handleSendUpgradeRequest = (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpgradeOpen(false)
    setUpgradeNotes('')
    showToast('درخواست ارتقای پلن تیم به مدیریت کل پلتفرم ارسال شد. کارشناسان ما به زودی تماس خواهند گرفت.')
  }

  return (
    <RoleGuard allowedRoles={['TEAM_ADMIN', 'SUPER_ADMIN']}>
      <RazmyarShell title="وضعیت اشتراک تیم">
        <div className="space-y-6 pb-12">
          {/* Toast */}
          {toastMessage && (
            <div className="fixed bottom-6 left-6 z-50 flex items-center gap-2 rounded-2xl bg-foreground px-4 py-3 text-xs font-bold text-background shadow-2xl animate-in slide-in-from-bottom-5">
              <CheckCircle2 className="size-4 text-emerald-400" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* Header */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                  {teamName}
                </span>
                <span className="text-xs text-muted-foreground">· اشتراک یکپارچه سازمانی تیم</span>
              </div>
              <h2 className="text-xl font-bold text-foreground">مدیریت لایسنس و اشتراک تیم</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                اشتراک رزمیار متعلق به کل تیم است و تمامی باشگاه‌های زیرمجموعه به صورت خودکار تحت پوشش قرار دارند
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsSupportOpen(true)}
                className="flex items-center gap-1.5 rounded-2xl border border-border bg-card px-4 py-2.5 text-xs font-bold text-foreground hover:bg-muted transition"
              >
                <PhoneCall className="size-4 text-muted-foreground" />
                <span>تماس با پشتیبانی</span>
              </button>

              <button
                onClick={() => setIsUpgradeOpen(true)}
                className="flex items-center gap-1.5 rounded-2xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 transition"
              >
                <Sparkles className="size-4" />
                <span>درخواست ارتقای اشتراک</span>
              </button>
            </div>
          </div>

          {/* Boundaries / Architecture Notice */}
          <div className="rounded-3xl border border-primary/20 bg-gradient-to-l from-primary/5 via-card to-card p-4 sm:p-5 text-xs text-muted-foreground flex items-start sm:items-center gap-3.5 shadow-sm">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Shield className="size-5" />
            </div>
            <div className="space-y-0.5 leading-relaxed">
              <span className="font-bold text-foreground block">
                قانون پوشش اشتراک: اشتراک در سطح تیم (Team-Level Subscription)
              </span>
              <span>
                در سیستم رزمیار نیازی به خرید اشتراک مجزا برای هر باشگاه نیست. با فعال بودن اشتراک <strong>{plan.name}</strong> برای تیم {teamName}، کلیه باشگاه‌های فعلی و حتی هر باشگاه جدیدی که ایجاد نمایید، بلافاصله و به رایگان تحت پوشش این لایسنس قرار می‌گیرند.
              </span>
            </div>
          </div>

          {/* MAIN TEAM SUBSCRIPTION CARD */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-5">
              <div className="flex items-center gap-4">
                <div className="flex size-14 items-center justify-center rounded-3xl bg-primary/10 text-primary">
                  <CreditCard className="size-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-black text-foreground">{plan.name}</h3>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-500">
                      <CheckCircle2 className="size-3.5" />
                      {subscription?.status === 'ACTIVE' ? 'فعال (Active)' : subscription?.status || 'فعال'}
                    </span>
                    {subscription?.autoRenew && (
                      <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                        تمدید خودکار: فعال
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{plan.description}</p>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <div className="text-xs text-muted-foreground">تعرفه پلن</div>
                <div className="text-lg font-black text-foreground">{plan.price}</div>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-xs">
              <div className="rounded-2xl border border-border/70 bg-muted/20 p-4 space-y-1">
                <div className="flex items-center gap-1.5 text-muted-foreground font-semibold">
                  <Calendar className="size-3.5 text-primary" />
                  <span>تاریخ شروع دوره</span>
                </div>
                <div className="text-sm font-bold text-foreground font-mono">{subscription?.startDate || '2026-01-01'}</div>
                <div className="text-[10px] text-muted-foreground">همگام با آغاز تقویم ورزشی</div>
              </div>

              <div className="rounded-2xl border border-border/70 bg-muted/20 p-4 space-y-1">
                <div className="flex items-center gap-1.5 text-muted-foreground font-semibold">
                  <Clock className="size-3.5 text-amber-500" />
                  <span>تاریخ پایان اعتبار</span>
                </div>
                <div className="text-sm font-bold text-foreground font-mono">{subscription?.endDate || '2027-01-01'}</div>
                <div className="text-[10px] text-emerald-500 font-semibold">اعتبار تا پایان سال بدون دغدغه</div>
              </div>

              <div className="rounded-2xl border border-border/70 bg-muted/20 p-4 space-y-1">
                <div className="flex items-center gap-1.5 text-muted-foreground font-semibold">
                  <Building2 className="size-3.5 text-primary" />
                  <span>تعداد سالن‌های تحت پوشش</span>
                </div>
                <div className="text-sm font-bold text-foreground">
                  {displayClubs.length} باشگاه <span className="text-muted-foreground font-normal">از حداکثر {plan.limits.maxClubs} سالن</span>
                </div>
                <div className="text-[10px] text-muted-foreground">ظرفیت باقی‌مانده: {plan.limits.maxClubs - displayClubs.length} سالن</div>
              </div>

              <div className="rounded-2xl border border-border/70 bg-muted/20 p-4 space-y-1">
                <div className="flex items-center gap-1.5 text-muted-foreground font-semibold">
                  <Zap className="size-3.5 text-primary" />
                  <span>ظرفیت کل هنرجویان</span>
                </div>
                <div className="text-sm font-bold text-foreground font-mono">تا {plan.limits.maxPlayers} هنرجو</div>
                <div className="text-[10px] text-muted-foreground">فضای ذخیره‌سازی: {plan.limits.storage}</div>
              </div>
            </div>
          </div>

          {/* COVERED CLUBS SECTION */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-border pb-4">
              <div>
                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                  <Building2 className="size-4 text-primary" />
                  باشگاه‌های تحت پوشش این اشتراک (Covered Clubs)
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  تمامی سالن‌های زیر با لایسنس مشترک تیم {teamName} فعال بوده و نیازی به پرداخت یا تمدید جداگانه ندارند:
                </p>
              </div>

              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-500 self-start sm:self-auto">
                {displayClubs.length} باشگاه کاملاً تحت پوشش
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {displayClubs.map((club) => (
                <div
                  key={club.id}
                  className="flex items-center justify-between rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4 transition hover:border-emerald-500/50 hover:bg-emerald-500/10"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white font-bold shadow-sm shadow-emerald-500/20">
                      <Check className="size-5 stroke-[3]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-foreground">{club.name}</h4>
                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                        <span>مسئول: {club.contactName}</span>
                        <span>·</span>
                        <span>{club.playersCount} هنرجو</span>
                      </div>
                    </div>
                  </div>

                  <span className="rounded-lg bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                    پوشش فعال
                  </span>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-dashed border-border p-4 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
              <Sparkles className="size-4 text-primary" />
              <span>
                با تعریف هر باشگاه جدید در بخش «مدیریت باشگاه‌ها»، نام آن به صورت آنی در این لیست قرار گرفته و تحت پوشش قرار می‌گیرد.
              </span>
            </div>
          </div>

          {/* UPGRADE MODAL */}
          {isUpgradeOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="size-5 text-primary" />
                    <h3 className="text-base font-bold text-foreground">درخواست ارتقای اشتراک تیم</h3>
                  </div>
                  <button
                    onClick={() => setIsUpgradeOpen(false)}
                    className="rounded-full p-1 text-muted-foreground hover:bg-muted"
                  >
                    <X className="size-5" />
                  </button>
                </div>

                <form onSubmit={handleSendUpgradeRequest} className="space-y-4 text-xs">
                  <p className="text-muted-foreground">
                    پلن انتخابی شما پس از بررسی توسط مدیریت کل پلتفرم، برای کلیه سالن‌های تیم <strong>{teamName}</strong> فعال خواهد شد.
                  </p>

                  <div className="space-y-2">
                    <label className="font-bold text-foreground block">انتخاب پلن مورد نظر</label>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {MOCK_PLANS.map((p) => (
                        <div
                          key={p.id}
                          onClick={() => setSelectedPlanUpgrade(p.id)}
                          className={`cursor-pointer rounded-2xl border p-3 transition ${
                            selectedPlanUpgrade === p.id
                              ? 'border-primary bg-primary/10'
                              : 'border-border bg-muted/20 hover:border-border/80'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-foreground">{p.name}</span>
                            {selectedPlanUpgrade === p.id && <Check className="size-4 text-primary" />}
                          </div>
                          <div className="text-[11px] text-primary font-bold">{p.price}</div>
                          <div className="text-[10px] text-muted-foreground mt-1">تا {p.limits.maxClubs} سالن و {p.limits.maxPlayers} بازیکن</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-foreground block mb-1">توضیحات و نیازمندی‌های اختصاصی (اختیاری)</label>
                    <textarea
                      rows={3}
                      value={upgradeNotes}
                      onChange={(e) => setUpgradeNotes(e.target.value)}
                      placeholder="تعداد سالن‌های مد نظر، نیاز به ماژول‌های حسابداری یا افزایش ظرفیت..."
                      className="w-full rounded-xl border border-input bg-muted/40 p-2.5 outline-none focus:border-primary text-xs"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                    <button
                      type="button"
                      onClick={() => setIsUpgradeOpen(false)}
                      className="rounded-xl border border-border px-4 py-2 font-semibold text-muted-foreground hover:bg-muted"
                    >
                      انصراف
                    </button>
                    <button
                      type="submit"
                      className="rounded-xl bg-primary px-5 py-2 font-bold text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20"
                    >
                      ثبت و ارسال درخواست
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* SUPPORT MODAL */}
          {isSupportOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div className="flex items-center gap-2">
                    <PhoneCall className="size-5 text-primary" />
                    <h3 className="text-base font-bold text-foreground">تماس با پشتیبانی و امور مشتریان</h3>
                  </div>
                  <button
                    onClick={() => setIsSupportOpen(false)}
                    className="rounded-full p-1 text-muted-foreground hover:bg-muted"
                  >
                    <X className="size-5" />
                  </button>
                </div>

                <div className="space-y-3 text-xs leading-relaxed">
                  <p className="text-muted-foreground">
                    تیم پشتیبانی رزمیار به صورت ۲۴/۷ پاسخگوی مدیران تیم‌ها و پاسخ به سوالات تمدید و فاکتور سازمانی است.
                  </p>

                  <div className="rounded-2xl border border-border bg-muted/30 p-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">شماره تماس پشتیبانی:</span>
                      <strong className="text-foreground font-mono">۰۲۱-۸۸۹۹۰۰۱۱</strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">ایمیل اختصاصی امور تیم‌ها:</span>
                      <strong className="text-foreground font-mono">teams@razmyar.ir</strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">شناسه تیم شما:</span>
                      <span className="rounded bg-primary/10 px-2 py-0.5 text-primary font-mono font-bold">{currentTeamId}</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2 border-t border-border">
                  <button
                    onClick={() => setIsSupportOpen(false)}
                    className="rounded-xl bg-primary px-5 py-2 font-bold text-primary-foreground hover:bg-primary/90"
                  >
                    متوجه شدم
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </RazmyarShell>
    </RoleGuard>
  )
}
