'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Flame,
  Award,
  CheckSquare,
  Dumbbell,
  Bell,
  Clock,
  Plus,
  CheckCircle2,
  ChevronLeft,
  Calendar,
  Sparkles,
  ArrowRight,
  TrendingUp,
  User,
  Zap,
} from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { useUserStore } from '../store'

export function UserDashboard() {
  const { user } = useAuth()
  const {
    tasks,
    workouts,
    reminders,
    profile,
    toggleTask,
    toggleChecklistItem,
    toggleExercise,
    completeWorkout,
  } = useUserStore()

  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [workoutModalOpen, setWorkoutModalOpen] = useState(false)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const todayWorkout = workouts.find((w) => w.status === 'ASSIGNED') || workouts[0]
  const pendingTasks = tasks.filter((t) => t.status === 'PENDING')
  const completedTasks = tasks.filter((t) => t.status === 'COMPLETED')
  const activeReminders = reminders.filter((r) => r.active)

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 flex items-center gap-2 rounded-2xl bg-foreground px-4 py-3 text-xs font-bold text-background shadow-2xl animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="size-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Personalized Motivational Greeting Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-l from-primary/15 via-card to-card p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-primary/20 px-3 py-1 text-xs font-bold text-primary flex items-center gap-1.5">
                <Flame className="size-3.5 text-amber-500" />
                <span>روز عالی برای تمرین و رکوردشکنی</span>
              </span>
              <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                {profile.clubName}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              سلام {user?.name || profile.name} عزیز!
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl leading-relaxed">
              تمرین امروز شما توسط <strong className="text-foreground">{profile.coachName}</strong> ثبت شده است. با انگیزه ادامه بده تا به کمربند {profile.targetBelt} برسی!
            </p>
          </div>

          {/* Belt Progression Indicator */}
          <div className="rounded-2xl border border-border bg-card/80 p-4 min-w-[240px] space-y-2.5 backdrop-blur-xs">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-muted-foreground flex items-center gap-1">
                <Award className="size-4 text-primary" />
                مسیر ترفیع کمربند
              </span>
              <span className="text-primary font-mono">۷۵٪ آمادگی</span>
            </div>

            <div className="flex items-center justify-between text-xs font-bold">
              <span className="rounded-md bg-blue-500/10 px-2 py-0.5 text-blue-500">
                کمربند {profile.belt}
              </span>
              <span className="text-muted-foreground text-[10px]">← هدف:</span>
              <span className="rounded-md bg-rose-500/10 px-2 py-0.5 text-rose-500">
                کمربند {profile.targetBelt}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-rose-500 w-[75%]" />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Personal Quick Stat Cards */}
      <div className="grid gap-3.5 grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground">وظایف در انتظار</span>
            <div className="rounded-xl bg-purple-500/10 p-2 text-purple-500">
              <CheckSquare className="size-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-foreground">{pendingTasks.length} مورد</div>
            <div className="text-[11px] text-emerald-500 font-semibold mt-0.5">
              {completedTasks.length} وظیفه تکمیل‌شده
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground">حضور در کلاس‌ها</span>
            <div className="rounded-xl bg-blue-500/10 p-2 text-blue-500">
              <Calendar className="size-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-foreground">۹۲٪</div>
            <div className="text-[11px] text-muted-foreground mt-0.5">۱۲ جلسه در ماه جاری</div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground">تمرین امروز</span>
            <div className="rounded-xl bg-teal-500/10 p-2 text-teal-500">
              <Dumbbell className="size-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-foreground">
              {todayWorkout?.status === 'COMPLETED' ? 'انجام شد' : 'آماده اجرا'}
            </div>
            <div className="text-[11px] text-primary font-semibold mt-0.5 truncate">
              {todayWorkout?.title}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground">یادآورهای فعال</span>
            <div className="rounded-xl bg-amber-500/10 p-2 text-amber-500">
              <Bell className="size-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-foreground">{activeReminders.length} یادآور</div>
            <div className="text-[11px] text-muted-foreground mt-0.5 truncate">
              {activeReminders[0]?.title || 'بدون یادآور نزدیک'}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Grid: Today's Workout & Today's Tasks */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Today's Workout Card */}
        {todayWorkout && (
          <div className="rounded-3xl border border-border bg-card p-5 shadow-sm space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary">
                    برنامه تمرینی محول‌شده
                  </span>
                  <h3 className="text-base font-bold text-foreground mt-1.5">{todayWorkout.title}</h3>
                  <p className="text-xs text-muted-foreground">
                    مربی: {todayWorkout.coach} · مدت زمان: {todayWorkout.durationMinutes} دقیقه
                  </p>
                </div>

                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                    todayWorkout.status === 'COMPLETED'
                      ? 'bg-emerald-500/10 text-emerald-500'
                      : 'bg-primary/15 text-primary'
                  }`}
                >
                  {todayWorkout.status === 'COMPLETED' ? 'تکمیل شد' : 'امروز'}
                </span>
              </div>

              {/* Exercises Checklist */}
              <div className="mt-4 space-y-2">
                <span className="text-xs font-bold text-foreground block">حرکات و سرفصل‌ها:</span>
                {todayWorkout.exercises.map((ex, i) => (
                  <div
                    key={i}
                    onClick={() => toggleExercise(todayWorkout.id, i)}
                    className="flex items-center justify-between rounded-2xl border border-border bg-accent/30 p-2.5 text-xs cursor-pointer hover:border-primary/40 transition"
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`flex size-4 items-center justify-center rounded-md border transition ${
                          ex.completed
                            ? 'border-emerald-500 bg-emerald-500 text-white'
                            : 'border-muted-foreground/40'
                        }`}
                      >
                        {ex.completed && <CheckCircle2 className="size-3.5" />}
                      </div>
                      <span className={ex.completed ? 'line-through text-muted-foreground' : 'font-semibold text-foreground'}>
                        {ex.name}
                      </span>
                    </div>

                    <div className="text-[11px] text-muted-foreground font-mono">
                      {ex.sets} ست × {ex.reps}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-3 border-t border-border flex items-center justify-between">
              <Link href="/workout" className="text-xs text-primary font-semibold hover:underline">
                مشاهده تاریخچه تمرینات
              </Link>
              {todayWorkout.status !== 'COMPLETED' ? (
                <button
                  onClick={() => {
                    completeWorkout(todayWorkout.id)
                    showToast('آفرین! تمرین امروز با موفقیت تکمیل و ثبت شد.')
                  }}
                  className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20 transition"
                >
                  <CheckCircle2 className="size-4" />
                  <span>ثبت اتمام تمرین</span>
                </button>
              ) : (
                <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                  <CheckCircle2 className="size-4" />
                  تمرین امروز ثبت شد
                </span>
              )}
            </div>
          </div>
        )}

        {/* Today's Tasks & Checklists */}
        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                  <CheckSquare className="size-4 text-purple-500" />
                  وظایف و برنامه‌های من
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">چک‌لیست فردی و اهداف روزانه</p>
              </div>
              <Link href="/tasks" className="text-xs font-semibold text-primary hover:underline">
                مدیریت وظایف
              </Link>
            </div>

            <div className="mt-4 space-y-2.5">
              {tasks.slice(0, 3).map((t) => {
                const isDone = t.status === 'COMPLETED'
                return (
                  <div
                    key={t.id}
                    className={`rounded-2xl border p-3 transition space-y-2 ${
                      isDone
                        ? 'border-border/50 bg-muted/20 opacity-70'
                        : 'border-border bg-accent/20 hover:border-primary/40'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-2.5">
                        <button
                          onClick={() => toggleTask(t.id)}
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
                            {t.title}
                          </p>
                          <span className="text-[10px] text-muted-foreground mt-0.5 block">
                            موعد: {t.dueDate}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`rounded-md px-1.5 py-0.5 text-[9px] font-bold ${
                          t.priority === 'HIGH' ? 'bg-rose-500/10 text-rose-500' : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {t.priority === 'HIGH' ? 'مهم' : 'عادی'}
                      </span>
                    </div>

                    {/* Sub-checklist */}
                    {t.checklist && t.checklist.length > 0 && (
                      <div className="mr-6 space-y-1 pt-1 border-t border-border/40 text-[11px]">
                        {t.checklist.map((c) => (
                          <div
                            key={c.id}
                            onClick={() => toggleChecklistItem(t.id, c.id)}
                            className="flex items-center gap-2 text-muted-foreground cursor-pointer hover:text-foreground"
                          >
                            <input
                              type="checkbox"
                              readOnly
                              checked={c.completed}
                              className="size-3 text-primary rounded"
                            />
                            <span className={c.completed ? 'line-through text-muted-foreground/70' : ''}>
                              {c.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-border flex justify-end">
            <Link
              href="/tasks"
              className="flex items-center gap-1 text-xs font-bold text-primary hover:underline"
            >
              افزودن وظیفه جدید
              <ChevronLeft className="size-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* 4. Bottom Row: Reminders & Personal Actions */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upcoming Reminders */}
        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Bell className="size-4 text-amber-500" />
              یادآورهای پیش‌رو
            </h3>
            <Link href="/reminders" className="text-xs font-semibold text-primary hover:underline">
              مشاهده همه
            </Link>
          </div>

          <div className="space-y-2">
            {activeReminders.map((rem) => (
              <div
                key={rem.id}
                className="flex items-center justify-between rounded-2xl border border-border bg-accent/20 p-3 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className="rounded-xl bg-amber-500/10 p-1.5 text-amber-500">
                    <Clock className="size-3.5" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground">{rem.title}</p>
                    <span className="text-[10px] text-muted-foreground">{rem.dateTime}</span>
                  </div>
                </div>
                <span className="rounded-md bg-accent px-2 py-0.5 text-[9px] font-bold text-muted-foreground">
                  فعال
                </span>
              </div>
            ))}

            {activeReminders.length === 0 && (
              <div className="py-6 text-center text-xs text-muted-foreground">
                یادآور فعالی ثبت نشده است
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions & Recent Progress */}
        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Sparkles className="size-4 text-primary" />
            دسترس‌های سریع و سوابق شخصی
          </h3>

          <div className="grid grid-cols-2 gap-2.5 text-xs">
            <Link
              href="/workout"
              className="flex items-center gap-2.5 rounded-2xl border border-border bg-accent/30 p-3 font-bold text-foreground hover:border-primary/40 hover:bg-accent/60 transition"
            >
              <Dumbbell className="size-4 text-primary" />
              <span>تمرینات ورزشی من</span>
            </Link>

            <Link
              href="/tasks"
              className="flex items-center gap-2.5 rounded-2xl border border-border bg-accent/30 p-3 font-bold text-foreground hover:border-primary/40 hover:bg-accent/60 transition"
            >
              <CheckSquare className="size-4 text-purple-500" />
              <span>ایجاد وظیفه روزانه</span>
            </Link>

            <Link
              href="/reminders"
              className="flex items-center gap-2.5 rounded-2xl border border-border bg-accent/30 p-3 font-bold text-foreground hover:border-primary/40 hover:bg-accent/60 transition"
            >
              <Bell className="size-4 text-amber-500" />
              <span>تنظیم یادآور جدید</span>
            </Link>

            <Link
              href="/profile"
              className="flex items-center gap-2.5 rounded-2xl border border-border bg-accent/30 p-3 font-bold text-foreground hover:border-primary/40 hover:bg-accent/60 transition"
            >
              <User className="size-4 text-emerald-500" />
              <span>ویرایش پروفایل فردی</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
