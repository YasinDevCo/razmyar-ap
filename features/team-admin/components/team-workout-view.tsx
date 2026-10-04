'use client'

import { useState } from 'react'
import {
  Dumbbell,
  Plus,
  Search,
  Building2,
  Calendar,
  Users,
  CheckCircle2,
  X,
  Target,
} from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { useTeamAdminStore } from '../store'

export function TeamWorkoutView() {
  const { teamId, teamName, selectedClubId } = useAuth()
  const { teamClubs, scopedWorkouts, logActivity } = useTeamAdminStore(teamId || 'FAJR', selectedClubId)

  const [search, setSearch] = useState('')
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // New Workout Form
  const [title, setTitle] = useState('')
  const [targetGroup, setTargetGroup] = useState('')
  const [schedule, setSchedule] = useState('')
  const [exercises, setExercises] = useState('')
  const [participantsCount, setParticipantsCount] = useState('15')
  const [targetClub, setTargetClub] = useState(selectedClubId || teamClubs[0]?.id || 'PARTO')

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    const exerciseList = exercises
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)

    logActivity('تعریف برنامه تمرینی جدید', `${title} (${targetGroup})`, 'WORKOUT', targetClub)

    setIsAddOpen(false)
    setTitle('')
    setTargetGroup('')
    setSchedule('')
    setExercises('')
    showToast(`برنامه تمرینی «${title}» با موفقیت ثبت شد.`)
  }

  const filteredWorkouts = scopedWorkouts.filter(
    (w) =>
      w.title.toLowerCase().includes(search.toLowerCase().trim()) ||
      w.targetGroup.toLowerCase().includes(search.toLowerCase().trim())
  )

  const selectedClub = teamClubs.find((c) => c.id === selectedClubId)

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 flex items-center gap-2 rounded-2xl bg-foreground px-4 py-3 text-xs font-bold text-background shadow-2xl animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="size-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
              {teamName}
            </span>
            <span className="text-xs text-muted-foreground">
              · {selectedClub ? selectedClub.name : 'همه باشگاه‌ها'}
            </span>
          </div>
          <h2 className="text-xl font-bold text-foreground">برنامه‌های تمرینی باشگاهی</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            تعریف سرفصل‌های تمرین، ساعت‌بندی کلاسی و هدایت پیشرفت هنرجویان
          </p>
        </div>

        <button
          onClick={() => {
            setTargetClub(selectedClubId || teamClubs[0]?.id || 'PARTO')
            setIsAddOpen(true)
          }}
          className="flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-2.5 text-xs sm:text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 transition"
        >
          <Plus className="size-4" />
          <span>ایجاد برنامه تمرینی</span>
        </button>
      </div>

      {/* Workouts Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredWorkouts.map((workout) => {
          const club = teamClubs.find((c) => c.id === workout.clubId)
          return (
            <div
              key={workout.id}
              className="rounded-3xl border border-border bg-card p-5 shadow-sm space-y-4 hover:border-primary/40 transition"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-bold text-primary text-xs">
                    <Building2 className="size-3.5" />
                    {club?.name || workout.clubId}
                  </span>
                  <span className="rounded-md bg-accent px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                    {workout.participantsCount} هنرجو
                  </span>
                </div>
                <h3 className="text-base font-bold text-foreground">{workout.title}</h3>
                <p className="text-xs text-muted-foreground font-semibold">{workout.targetGroup}</p>
              </div>

              <div className="rounded-2xl bg-accent/30 p-3 text-xs space-y-2">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Calendar className="size-3.5 text-primary" />
                  <span>زمان‌بندی: <strong className="text-foreground">{workout.schedule}</strong></span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs">
                <span className="font-bold text-foreground block">سرفصل‌ها و تمرینات:</span>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground pr-1 text-[11px]">
                  {workout.exercises.map((ex, i) => (
                    <li key={i}>{ex}</li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 border-t border-border flex justify-end">
                <button
                  onClick={() => showToast(`برنامه «${workout.title}» به جلسه امروز الصاق شد.`)}
                  className="rounded-xl border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary/20 transition"
                >
                  تخصیص به کلاس امروز
                </button>
              </div>
            </div>
          )
        })}

        {filteredWorkouts.length === 0 && (
          <div className="col-span-full py-12 text-center text-sm text-muted-foreground">
            برنامه تمرینی فعالی برای این باشگاه تعریف نشده است
          </div>
        )}
      </div>

      {/* MODAL: Add Workout */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-foreground">تعریف برنامه تمرینی جدید</h3>
              <button
                onClick={() => setIsAddOpen(false)}
                className="rounded-full p-1 text-muted-foreground hover:bg-muted"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-foreground block mb-1">عنوان برنامه *</label>
                <input
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="مثلاً: تمرینات چابکی و میت‌زنی پیشرفته"
                  className="w-full rounded-xl border border-input bg-muted/40 p-2.5 outline-none focus:border-primary"
                />
              </div>

              <div className="grid gap-3 grid-cols-2">
                <div>
                  <label className="font-bold text-foreground block mb-1">باشگاه سالن</label>
                  <select
                    value={targetClub}
                    onChange={(e) => setTargetClub(e.target.value)}
                    className="w-full rounded-xl border border-input bg-muted/40 p-2.5 outline-none font-semibold text-foreground"
                  >
                    {teamClubs.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-foreground block mb-1">گروه هدف</label>
                  <input
                    value={targetGroup}
                    onChange={(e) => setTargetGroup(e.target.value)}
                    placeholder="نوجوانان، بانوان، ..."
                    className="w-full rounded-xl border border-input bg-muted/40 p-2.5 outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-foreground block mb-1">برنامه زمانی و ساعات</label>
                <input
                  value={schedule}
                  onChange={(e) => setSchedule(e.target.value)}
                  placeholder="روزهای زوج - ۱۶:۰۰ الی ۱۸:۰۰"
                  className="w-full rounded-xl border border-input bg-muted/40 p-2.5 outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="font-bold text-foreground block mb-1">سرفصل تمرینات (هر تمرین در یک خط)</label>
                <textarea
                  rows={3}
                  value={exercises}
                  onChange={(e) => setExercises(e.target.value)}
                  placeholder="میت‌زنی سرعتی&#10;تمرین تکنیک ضربات چرخشی&#10;مبارزه کنترلی"
                  className="w-full rounded-xl border border-input bg-muted/40 p-2.5 outline-none focus:border-primary"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="rounded-xl border border-border px-4 py-2 font-semibold text-muted-foreground hover:bg-muted"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-primary px-5 py-2 font-bold text-primary-foreground hover:bg-primary/90"
                >
                  ثبت برنامه
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
