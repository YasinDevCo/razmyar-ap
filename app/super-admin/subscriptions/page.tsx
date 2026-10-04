'use client'

import { useState, useEffect } from 'react'
import { RazmyarShell } from '@/components/razmyar-shell'
import { RoleGuard } from '@/features/auth/guards'
import {
  DollarSign,
  Search,
  MoreVertical,
  CreditCard,
  Building2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Calendar,
  X,
  Shield,
  Eye,
  Check,
} from 'lucide-react'
import { getAllTeamSubscriptionsWithCoverage } from '@/features/subscriptions/subscription-service'

export default function SubscriptionsManagementPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [selectedTeamSub, setSelectedTeamSub] = useState<any | null>(null)
  const [subscriptionsList, setSubscriptionsList] = useState<any[]>([])

  useEffect(() => {
    setSubscriptionsList(getAllTeamSubscriptionsWithCoverage())
  }, [])

  const filteredSubs = subscriptionsList.filter((item) => {
    const matchSearch =
      item.teamName.toLowerCase().includes(search.toLowerCase().trim()) ||
      item.plan.name.toLowerCase().includes(search.toLowerCase().trim())
    const matchStatus = statusFilter === 'ALL' || item.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <RoleGuard allowedRoles={['SUPER_ADMIN']}>
      <RazmyarShell title="مدیریت اشتراک‌های پلتفرم">
        <div className="space-y-6 pb-12">
          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm">
                <CreditCard className="size-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">مدیریت اشتراک‌های سازمانی تیم‌ها</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  مشاهده اشتراک‌های سطح تیم و باشگاه‌های تحت پوشش هر لایسنس
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="rounded-2xl border border-border bg-card px-3.5 py-2 text-xs font-semibold text-muted-foreground">
                مجموع اشتراک‌ها: <strong className="text-foreground">{subscriptionsList.length} تیم</strong>
              </span>
            </div>
          </div>

          {/* Architecture Reminder */}
          <div className="rounded-2xl border border-border bg-muted/30 p-4 text-xs text-muted-foreground flex items-center gap-3">
            <Shield className="size-4 text-primary shrink-0" />
            <span>
              <strong>معماری اشتراک تیم‌محور:</strong> در سیستم رزمیار، اشتراک به «تیم» تعلق دارد و تمام باشگاه‌های زیرمجموعه آن تیم را پوشش می‌دهد. برای مشاهده سالن‌های تحت پوشش هر اشتراک، روی ردیف تیم کلیک کنید.
            </span>
          </div>

          {/* Filters Bar */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute right-3.5 top-3 size-4 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="جستجو بر اساس نام تیم یا پلن..."
                className="w-full rounded-2xl border border-input bg-card pr-10 pl-4 py-2.5 text-xs sm:text-sm outline-none placeholder:text-muted-foreground focus:border-primary"
              />
            </div>

            <div className="flex items-center gap-2 text-xs">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-2xl border border-input bg-card px-3 py-2.5 outline-none font-semibold text-foreground"
              >
                <option value="ALL">وضعیت: همه</option>
                <option value="ACTIVE">فعال (Active)</option>
                <option value="EXPIRING">در حال انقضا (Expiring)</option>
                <option value="SUSPENDED">معلق (Suspended)</option>
                <option value="EXPIRED">منقضی (Expired)</option>
              </select>
            </div>
          </div>

          {/* Teams Subscription Table */}
          <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="border-b border-border bg-muted/40 text-[11px] font-bold text-muted-foreground">
                  <tr>
                    <th className="p-4">تیم (Team)</th>
                    <th className="p-4">پلن فعال (Plan)</th>
                    <th className="p-4">وضعیت اشتراک (Status)</th>
                    <th className="p-4">باشگاه‌های تحت پوشش (Covered Clubs)</th>
                    <th className="p-4">تاریخ شروع</th>
                    <th className="p-4">تاریخ انقضا</th>
                    <th className="p-4">تمدید خودکار</th>
                    <th className="p-4 text-left">عملیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredSubs.map((item) => (
                    <tr
                      key={item.subscription.id}
                      onClick={() => setSelectedTeamSub(item)}
                      className="cursor-pointer transition hover:bg-muted/30"
                    >
                      <td className="p-4">
                        <div className="font-bold text-sm text-foreground">{item.teamName}</div>
                        <div className="text-[10px] text-muted-foreground font-mono">شناسه: {item.teamId}</div>
                      </td>

                      <td className="p-4">
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                          <CreditCard className="size-3.5" />
                          <span>{item.plan.name}</span>
                        </span>
                      </td>

                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                            item.status === 'ACTIVE'
                              ? 'bg-emerald-500/10 text-emerald-500'
                              : item.status === 'EXPIRING'
                              ? 'bg-amber-500/10 text-amber-500'
                              : 'bg-rose-500/10 text-rose-500'
                          }`}
                        >
                          {item.status === 'ACTIVE' && <CheckCircle2 className="size-3" />}
                          {item.status === 'EXPIRING' && <AlertTriangle className="size-3" />}
                          {item.status === 'SUSPENDED' && <XCircle className="size-3" />}
                          <span>{item.status}</span>
                        </span>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="rounded-xl border border-border bg-muted/40 px-2.5 py-1 font-bold text-foreground">
                            {item.clubsCoveredCount} باشگاه
                          </span>
                          <span className="text-[11px] text-muted-foreground">
                            {item.coveredClubs.map((c: any) => c.name).slice(0, 2).join(' ، ')}
                            {item.coveredClubs.length > 2 && ' و...'}
                          </span>
                        </div>
                      </td>

                      <td className="p-4 font-mono text-muted-foreground">{item.startDate}</td>
                      <td className="p-4 font-mono font-bold text-foreground">{item.endDate}</td>

                      <td className="p-4">
                        <span
                          className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                            item.autoRenew
                              ? 'bg-emerald-500/10 text-emerald-500'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {item.autoRenew ? 'روشن' : 'خاموش'}
                        </span>
                      </td>

                      <td className="p-4 text-left">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedTeamSub(item)
                          }}
                          className="rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary/5 transition flex items-center gap-1 inline-flex"
                        >
                          <Eye className="size-3.5" />
                          <span>مشاهده جزئیات</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredSubs.length === 0 && (
                <div className="p-12 text-center text-xs text-muted-foreground">
                  هیچ اشتراکی با این مشخصات یافت نشد.
                </div>
              )}
            </div>
          </div>

          {/* DETAIL MODAL / DRAWER */}
          {selectedTeamSub && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="w-full max-w-2xl rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-5">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <CreditCard className="size-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-foreground">
                        جزئیات اشتراک سازمانی تیم: {selectedTeamSub.teamName}
                      </h3>
                      <p className="text-[11px] text-muted-foreground">
                        شناسه سیستمی تیم: {selectedTeamSub.teamId}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedTeamSub(null)}
                    className="rounded-full p-1 text-muted-foreground hover:bg-muted"
                  >
                    <X className="size-5" />
                  </button>
                </div>

                {/* Info Cards Grid */}
                <div className="grid gap-3 sm:grid-cols-3 text-xs">
                  <div className="rounded-2xl border border-border bg-muted/20 p-3.5 space-y-1">
                    <span className="text-muted-foreground block font-semibold">طرح فعال</span>
                    <strong className="text-sm font-bold text-primary block">{selectedTeamSub.plan.name}</strong>
                    <span className="text-[10px] text-muted-foreground">{selectedTeamSub.plan.price}</span>
                  </div>

                  <div className="rounded-2xl border border-border bg-muted/20 p-3.5 space-y-1">
                    <span className="text-muted-foreground block font-semibold">وضعیت اشتراک</span>
                    <span className="inline-block font-bold text-emerald-500 text-sm">
                      {selectedTeamSub.status === 'ACTIVE' ? 'فعال (Active)' : selectedTeamSub.status}
                    </span>
                    <span className="text-[10px] text-muted-foreground block font-mono">
                      تمدید خودکار: {selectedTeamSub.autoRenew ? 'بله' : 'خیر'}
                    </span>
                  </div>

                  <div className="rounded-2xl border border-border bg-muted/20 p-3.5 space-y-1">
                    <span className="text-muted-foreground block font-semibold">بازه اعتبار دوره</span>
                    <div className="font-mono text-[11px] text-foreground font-bold">
                      {selectedTeamSub.startDate} الی {selectedTeamSub.endDate}
                    </div>
                    <span className="text-[10px] text-muted-foreground">دوره ۱ ساله</span>
                  </div>
                </div>

                {/* COVERED CLUBS LIST */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <Building2 className="size-4 text-primary" />
                      لیست سالن‌ها و باشگاه‌های تحت پوشش این اشتراک ({selectedTeamSub.clubsCoveredCount} باشگاه):
                    </h4>
                    <span className="text-[11px] text-muted-foreground">
                      سقف مجاز پلن: {selectedTeamSub.plan.limits.maxClubs} سالن
                    </span>
                  </div>

                  <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                    {selectedTeamSub.coveredClubs.map((c: any) => (
                      <div
                        key={c.id}
                        className="flex items-center justify-between rounded-2xl border border-border bg-muted/20 p-3 text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="flex size-7 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                            <Check className="size-4" />
                          </div>
                          <div>
                            <div className="font-bold text-foreground">{c.name}</div>
                            <div className="text-[10px] text-muted-foreground">
                              {c.address || 'آدرس ثبت نشده'} · مسئول: {c.contactName || '—'}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="rounded-lg bg-card border border-border px-2 py-0.5 text-[10px] font-mono text-muted-foreground">
                            {c.playersCount} هنرجو
                          </span>
                          <span className="rounded-lg bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-500">
                            پوشش فعال
                          </span>
                        </div>
                      </div>
                    ))}

                    {selectedTeamSub.coveredClubs.length === 0 && (
                      <div className="rounded-2xl border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
                        هیچ باشگاهی برای این تیم ثبت نشده است.
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                  <button
                    onClick={() => setSelectedTeamSub(null)}
                    className="rounded-xl bg-primary px-5 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition"
                  >
                    بستن پنجره
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
