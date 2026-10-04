'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Building2,
  Users,
  CreditCard,
  CheckSquare,
  Dumbbell,
  DollarSign,
  Plus,
  ArrowUpRight,
  ShieldCheck,
  AlertTriangle,
  ChevronLeft,
  X,
  CheckCircle2,
  Clock,
  Activity,
  Layers,
  Sparkles,
} from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { useTeamAdminStore } from '../store'

export function TeamAdminDashboard() {
  const { teamId, teamName, selectedClubId, setSelectedClubId } = useAuth()
  const {
    teamClubs,
    activeScopedClubs,
    scopedPlayers,
    scopedTasks,
    scopedWorkouts,
    scopedFinances,
    scopedActivities,
    metrics,
    addClub,
    toggleTaskStatus,
    requestUpgrade,
  } = useTeamAdminStore(teamId || 'FAJR', selectedClubId)

  // Add Club Modal State
  const [isAddClubOpen, setIsAddClubOpen] = useState(false)
  const [newClubName, setNewClubName] = useState('')
  const [newClubCode, setNewClubCode] = useState('')
  const [newContactName, setNewContactName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newAddress, setNewAddress] = useState('')
  const [newNotes, setNewNotes] = useState('')
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Upgrade Modal State
  const [upgradeModalClub, setUpgradeModalClub] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  const handleCreateClub = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newClubName.trim()) return

    addClub({
      name: newClubName.trim(),
      code: newClubCode.trim() || newClubName.trim().toUpperCase(),
      contactName: newContactName.trim() || 'مدیر سالن',
      phone: newPhone.trim() || '۰۹۱۲۰۰۰۰۰۰۰',
      email: newEmail.trim() || 'club@example.com',
      address: newAddress.trim() || 'ثبت نشده',
      status: 'ACTIVE',
      subPlan: 'BASIC',
      subStatus: 'ACTIVE',
      subExpiration: '۱۴۰۶/۰۱/۰۱',
      notes: newNotes.trim(),
    })

    setIsAddClubOpen(false)
    setNewClubName('')
    setNewClubCode('')
    setNewContactName('')
    setNewPhone('')
    setNewEmail('')
    setNewAddress('')
    setNewNotes('')
    showToast(`باشگاه «${newClubName}» با موفقیت ایجاد و به تیم ${teamName} اضافه شد.`)
  }

  const handleUpgradeSubmit = (clubId: string) => {
    requestUpgrade(clubId, 'PRO')
    setUpgradeModalClub(null)
    showToast('درخواست ارتقای اشتراک برای مدیریت پلتفرم ارسال شد.')
  }

  const selectedClub = teamClubs.find((c) => c.id === selectedClubId) || null

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 flex items-center gap-2 rounded-2xl bg-foreground px-4 py-3 text-xs font-bold text-background shadow-2xl animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="size-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner: Management Identity & Scope */}
      <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-l from-primary/15 via-card to-card p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/20 px-3 py-1 text-xs font-bold text-primary">
                <ShieldCheck className="size-3.5" />
                پنل مدیریت ارشد تیم (TEAM_ADMIN)
              </span>
              <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                کد تیم: {teamId}
              </span>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
              مدیریت {teamName}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
              {selectedClub ? (
                <>
                  در حال حاضر باشگاه <strong className="text-foreground">{selectedClub.name}</strong> انتخاب شده است. داده‌ها و عملیات زیر مربوط به این باشگاه است.
                </>
              ) : (
                <>
                  در حالت <strong className="text-foreground">«همه باشگاه‌ها»</strong> هستید. آمار و عملکردهای زیر به صورت تجمیعی از تمامی {teamClubs.length} باشگاه زیرمجموعه {teamName} نمایش داده می‌شوند.
                </>
              )}
            </p>
          </div>

          {/* Top Quick Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsAddClubOpen(true)}
              className="flex items-center gap-2 rounded-2xl bg-primary px-4 py-2.5 text-xs sm:text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="size-4" />
              <span>ایجاد باشگاه جدید</span>
            </button>
            <Link
              href="/clubs"
              className="flex items-center gap-1.5 rounded-2xl border border-border bg-card/80 px-4 py-2.5 text-xs sm:text-sm font-semibold text-foreground transition-colors hover:bg-muted"
            >
              <Building2 className="size-4 text-primary" />
              <span>فهرست باشگاه‌ها ({teamClubs.length})</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 1. Team Management KPI Overview */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-bold text-muted-foreground flex items-center gap-2">
            <Layers className="size-4 text-primary" />
            شاخص‌های کلیدی مدیریت تیم
          </h3>
          {selectedClub && (
            <button
              onClick={() => setSelectedClubId(null)}
              className="text-xs text-primary font-semibold hover:underline"
            >
              مشاهده تجمیعی همه باشگاه‌ها
            </button>
          )}
        </div>

        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {/* Total Clubs */}
          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">باشگاه‌های تحت مدیریت</span>
              <div className="rounded-xl bg-blue-500/10 p-2 text-blue-500">
                <Building2 className="size-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-foreground">{metrics.totalClubsCount}</div>
              <div className="text-[11px] font-semibold text-emerald-500 mt-0.5">
                {metrics.activeClubsCount} باشگاه فعال
              </div>
            </div>
          </div>

          {/* Total Players */}
          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">
                {selectedClub ? `هنرجویان ${selectedClub.name}` : 'کل هنرجویان تیم'}
              </span>
              <div className="rounded-xl bg-indigo-500/10 p-2 text-indigo-500">
                <Users className="size-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-foreground">{metrics.totalPlayersCount} نفر</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">
                {scopedPlayers.filter((p) => p.status === 'READY_FOR_TEST').length} نفر آماده ارتقای کمربند
              </div>
            </div>
          </div>

          {/* Subscriptions */}
          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">وضعیت اشتراک‌ها</span>
              <div className="rounded-xl bg-amber-500/10 p-2 text-amber-500">
                <CreditCard className="size-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-foreground">
                {metrics.activeSubscriptionsCount} <span className="text-xs font-normal text-muted-foreground">فعال</span>
              </div>
              <div className="text-[11px] font-bold text-amber-500 mt-0.5">
                {metrics.expiringSubscriptionsCount > 0
                  ? `${metrics.expiringSubscriptionsCount} اشتراک در حال انقضا`
                  : 'همه اشتراک‌ها معتبر'}
              </div>
            </div>
          </div>

          {/* Pending Tasks */}
          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">وظایف معلق باشگاه</span>
              <div className="rounded-xl bg-purple-500/10 p-2 text-purple-500">
                <CheckSquare className="size-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-foreground">{metrics.pendingTasksCount} مورد</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">نیازمند اقدام یا پیگیری</div>
            </div>
          </div>

          {/* Upcoming Workouts */}
          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">برنامه‌های تمرینی فعال</span>
              <div className="rounded-xl bg-teal-500/10 p-2 text-teal-500">
                <Dumbbell className="size-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-foreground">{metrics.upcomingWorkoutsCount} برنامه</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">سازماندهی شده بر اساس تاتامی</div>
            </div>
          </div>

          {/* Finance Summary */}
          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">تراز مالی ثبت‌شده</span>
              <div className="rounded-xl bg-emerald-500/10 p-2 text-emerald-500">
                <DollarSign className="size-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-xl font-black text-emerald-500">
                {metrics.netBalance.toLocaleString('fa-IR')}
              </div>
              <div className="text-[10px] text-muted-foreground mt-0.5">تومان (خالص درآمد)</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Club Overview Table / Cards */}
      <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <Building2 className="size-5 text-primary" />
              {selectedClub ? `جزئیات باشگاه ${selectedClub.name}` : `باشگاه‌های زیرمجموعه ${teamName}`}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              مدیریت دسترسی‌ها، پلن‌های اشتراک، مربیان و سوئیچ سریع بین باشگاه‌ها
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddClubOpen(true)}
              className="flex items-center gap-1.5 rounded-xl border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary/20 transition"
            >
              <Plus className="size-3.5" />
              افزودن باشگاه
            </button>
          </div>
        </div>

        {/* Clubs Grid/Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="border-b border-border/80 bg-muted/40 text-[11px] font-bold text-muted-foreground">
              <tr>
                <th className="p-3">نام باشگاه و کد</th>
                <th className="p-3">مربی / مسئول</th>
                <th className="p-3">هنرجویان</th>
                <th className="p-3">پلن اشتراک</th>
                <th className="p-3">وضعیت لایسنس</th>
                <th className="p-3">تاریخ انقضا</th>
                <th className="p-3">وضعیت سالن</th>
                <th className="p-3 text-left">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {teamClubs.map((club) => {
                const isCurrent = selectedClubId === club.id
                return (
                  <tr
                    key={club.id}
                    className={`transition-colors hover:bg-muted/30 ${
                      isCurrent ? 'bg-primary/5 font-semibold' : ''
                    }`}
                  >
                    <td className="p-3 font-bold text-foreground">
                      <div className="flex items-center gap-2">
                        <span
                          className={`size-2 rounded-full ${
                            club.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-rose-500'
                          }`}
                        />
                        <span>{club.name}</span>
                        {isCurrent && (
                          <span className="rounded-md bg-primary/20 px-1.5 py-0.5 text-[9px] font-bold text-primary">
                            انتخاب‌شده
                          </span>
                        )}
                      </div>
                      <span className="block text-[10px] text-muted-foreground font-mono mt-0.5">
                        کد: {club.code}
                      </span>
                    </td>
                    <td className="p-3 text-muted-foreground">
                      <div>{club.contactName}</div>
                      <div className="text-[10px] text-muted-foreground/80">{club.phone}</div>
                    </td>
                    <td className="p-3">
                      <span className="rounded-lg bg-accent px-2 py-1 font-bold text-foreground">
                        {club.playersCount} نفر
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="font-bold text-primary">{club.subPlan}</span>
                    </td>
                    <td className="p-3">
                      {club.subStatus === 'ACTIVE' && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-500">
                          <CheckCircle2 className="size-3" />
                          فعال (Active)
                        </span>
                      )}
                      {club.subStatus === 'EXPIRING' && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-500">
                          <AlertTriangle className="size-3" />
                          در حال انقضا (Expiring Soon)
                        </span>
                      )}
                      {club.subStatus === 'NO_SUB' && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-bold text-destructive">
                          فاقد اشتراک (No Plan)
                        </span>
                      )}
                    </td>
                    <td className="p-3 font-mono text-[11px] text-muted-foreground">
                      {club.subExpiration}
                    </td>
                    <td className="p-3">
                      <span
                        className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-bold ${
                          club.status === 'ACTIVE'
                            ? 'bg-emerald-500/10 text-emerald-500'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {club.status === 'ACTIVE' ? 'فعال' : 'غیرفعال'}
                      </span>
                    </td>
                    <td className="p-3 text-left">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedClubId(club.id)}
                          className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition ${
                            isCurrent
                              ? 'bg-primary text-primary-foreground'
                              : 'border border-border hover:bg-muted text-foreground'
                          }`}
                        >
                          {isCurrent ? 'باشگاه فعال' : 'انتخاب'}
                        </button>
                        {club.subStatus !== 'ACTIVE' && (
                          <button
                            onClick={() => setUpgradeModalClub(club.id)}
                            className="rounded-lg bg-amber-500/10 px-2.5 py-1 text-[10px] font-bold text-amber-500 hover:bg-amber-500/20"
                          >
                            ارتقا
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Operational Sections: Tasks & Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Pending Club Tasks */}
        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <CheckSquare className="size-4 text-purple-500" />
                وظایف و پیگیری‌های باشگاه
              </h3>
              <Link href="/tasks" className="text-xs text-primary hover:underline font-semibold">
                مدیریت وظایف
              </Link>
            </div>

            <div className="space-y-2.5">
              {scopedTasks.slice(0, 4).map((task) => {
                const isDone = task.status === 'COMPLETED'
                return (
                  <div
                    key={task.id}
                    className={`flex items-start justify-between rounded-2xl border p-3 transition-all ${
                      isDone
                        ? 'border-border/50 bg-muted/20 opacity-60'
                        : 'border-border bg-accent/20 hover:border-primary/40'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <button
                        onClick={() => toggleTaskStatus(task.id)}
                        className={`mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-md border transition ${
                          isDone
                            ? 'border-emerald-500 bg-emerald-500 text-white'
                            : 'border-muted-foreground/40 hover:border-primary'
                        }`}
                      >
                        {isDone && <CheckCircle2 className="size-3.5" />}
                      </button>
                      <div>
                        <p className={`text-xs font-bold ${isDone ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                          {task.title}
                        </p>
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-1">
                          <span>مسئول: {task.assignedTo}</span>
                          <span>·</span>
                          <span>موعد: {task.dueDate}</span>
                        </div>
                      </div>
                    </div>
                    <span
                      className={`rounded-md px-1.5 py-0.5 text-[9px] font-bold ${
                        task.priority === 'HIGH'
                          ? 'bg-rose-500/10 text-rose-500'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {task.priority === 'HIGH' ? 'فوری' : 'عادی'}
                    </span>
                  </div>
                )
              })}

              {scopedTasks.length === 0 && (
                <div className="py-8 text-center text-xs text-muted-foreground">
                  وظیفه معوقه‌ای وجود ندارد
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-border flex justify-end">
            <Link
              href="/tasks"
              className="flex items-center gap-1 text-xs font-bold text-primary hover:underline"
            >
              ثبت وظیفه جدید
              <ChevronLeft className="size-3.5" />
            </Link>
          </div>
        </div>

        {/* Team Activity Feed */}
        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Activity className="size-4 text-cyan-500" />
                جریان فعالیت‌های {teamName}
              </h3>
              <Link href="/activity" className="text-xs text-primary hover:underline font-semibold">
                مشاهده همه
              </Link>
            </div>

            <div className="space-y-3">
              {scopedActivities.slice(0, 4).map((act) => (
                <div key={act.id} className="flex items-start gap-3 text-xs">
                  <div className="mt-0.5 rounded-full bg-primary/10 p-1.5 text-primary">
                    <Clock className="size-3" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground">
                      <span className="text-primary font-bold">{act.who}:</span> {act.action}
                    </p>
                    <p className="text-[11px] text-muted-foreground truncate">{act.target}</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground shrink-0">{act.date}</span>
                </div>
              ))}

              {scopedActivities.length === 0 && (
                <div className="py-8 text-center text-xs text-muted-foreground">
                  هنوز فعالیتی ثبت نشده است
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-border flex justify-end">
            <Link
              href="/activity"
              className="flex items-center gap-1 text-xs font-bold text-primary hover:underline"
            >
              مشاهده گزارش کامل فعالیت‌ها
              <ChevronLeft className="size-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* MODAL: Add Club */}
      {isAddClubOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="text-lg font-bold text-foreground">ایجاد باشگاه جدید</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  افزودن باشگاه زیرمجموعه {teamName}
                </p>
              </div>
              <button
                onClick={() => setIsAddClubOpen(false)}
                className="rounded-full p-1 text-muted-foreground hover:bg-muted"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleCreateClub} className="space-y-3.5 text-xs">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="font-bold text-foreground block mb-1">نام باشگاه *</label>
                  <input
                    required
                    value={newClubName}
                    onChange={(e) => setNewClubName(e.target.value)}
                    placeholder="مثلاً: باشگاه بهارستان"
                    className="w-full rounded-xl border border-input bg-muted/40 p-2.5 outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="font-bold text-foreground block mb-1">کد شناسایی (Slug)</label>
                  <input
                    value={newClubCode}
                    onChange={(e) => setNewClubCode(e.target.value)}
                    placeholder="مثلاً: BAHAR"
                    className="w-full rounded-xl border border-input bg-muted/40 p-2.5 font-mono outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="font-bold text-foreground block mb-1">نام مربی / مسئول سالن</label>
                  <input
                    value={newContactName}
                    onChange={(e) => setNewContactName(e.target.value)}
                    placeholder="استاد ..."
                    className="w-full rounded-xl border border-input bg-muted/40 p-2.5 outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="font-bold text-foreground block mb-1">شماره تماس</label>
                  <input
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="۰۹۱۲..."
                    className="w-full rounded-xl border border-input bg-muted/40 p-2.5 outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-foreground block mb-1">ایمیل باشگاه</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="contact@club.ir"
                  className="w-full rounded-xl border border-input bg-muted/40 p-2.5 outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="font-bold text-foreground block mb-1">آدرس سالن</label>
                <input
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  placeholder="شهر، خیابان، سالن ورزشی..."
                  className="w-full rounded-xl border border-input bg-muted/40 p-2.5 outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="font-bold text-foreground block mb-1">یادداشت‌های مدیریتی</label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="مشخصات سالن، ساعت‌های تمرین..."
                  className="w-full rounded-xl border border-input bg-muted/40 p-2.5 outline-none focus:border-primary"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsAddClubOpen(false)}
                  className="rounded-xl border border-border px-4 py-2 font-semibold text-muted-foreground hover:bg-muted"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-primary px-5 py-2 font-bold text-primary-foreground hover:bg-primary/90"
                >
                  ثبت و ایجاد باشگاه
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Upgrade Request */}
      {upgradeModalClub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <Sparkles className="size-4 text-amber-500" />
                درخواست ارتقای اشتراک باشگاه
              </h3>
              <button
                onClick={() => setUpgradeModalClub(null)}
                className="rounded-full p-1 text-muted-foreground hover:bg-muted"
              >
                <X className="size-4" />
              </button>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              شما در حال ارسال درخواست ارتقای اشتراک برای این باشگاه به پلن <strong className="text-foreground">PRO</strong> هستید. تیم پشتیبانی و سوپرادمین پس از بررسی، فاکتور ارتقا را ارسال خواهند کرد.
            </p>
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-xs text-amber-600 dark:text-amber-400">
              ویژگی‌های پلن PRO: ظرفیت تا ۵۰۰ هنرجو، ماژول کامل مالی، گزارش‌های پیشرفته و پشتیبانی ویژه.
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setUpgradeModalClub(null)}
                className="rounded-xl border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-muted"
              >
                انصراف
              </button>
              <button
                onClick={() => handleUpgradeSubmit(upgradeModalClub)}
                className="rounded-xl bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground hover:bg-primary/90"
              >
                تایید و ارسال درخواست
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
