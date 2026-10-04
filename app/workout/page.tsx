'use client'

import { useState } from 'react'
import {
  Dumbbell,
  Flame,
  Trophy,
  Calendar,
  Clock,
  CheckCircle2,
  Play,
  Plus,
  X,
  ChevronLeft,
  Award,
  FileText,
  Activity,
  History,
  Sparkles,
} from 'lucide-react'
import { RazmyarShell } from '@/components/razmyar-shell'
import { RoleGuard } from '@/features/auth/guards'
import { useUserStore } from '@/features/user/store'
import { PersonalWorkout, PersonalWorkoutExercise } from '@/features/user/types'

export default function WorkoutPage() {
  const { workouts, toggleExercise, completeWorkout, addWorkout, profile } = useUserStore()

  const [activeTab, setActiveTab] = useState<'ACTIVE' | 'HISTORY'>('ACTIVE')
  const [completeModalWorkout, setCompleteModalWorkout] = useState<PersonalWorkout | null>(null)
  const [completionNotes, setCompletionNotes] = useState('')
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Custom Workout Modal
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newDuration, setNewDuration] = useState(45)
  const [newExercises, setNewExercises] = useState<Array<{ name: string; sets: number; reps: string }>>([
    { name: '', sets: 3, reps: '۱۰ تکرار' },
  ])

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const activeWorkouts = workouts.filter(
    (w) => w.status === 'PENDING' || w.status === 'ASSIGNED' || w.status === 'IN_PROGRESS'
  )
  const completedWorkouts = workouts.filter((w) => w.status === 'COMPLETED')

  const handleFinishWorkout = (workout: PersonalWorkout) => {
    completeWorkout(workout.id, completionNotes)
    setCompleteModalWorkout(null)
    setCompletionNotes('')
    showToast('جلسه تمرینی با موفقیت در کارنامه ورزشی ثبت شد! خسته نباشید!')
  }

  const handleAddExerciseRow = () => {
    setNewExercises([...newExercises, { name: '', sets: 3, reps: '۱۰ تکرار' }])
  }

  const handleExerciseChange = (idx: number, field: string, val: any) => {
    const updated = [...newExercises]
    updated[idx] = { ...updated[idx], [field]: val }
    setNewExercises(updated)
  }

  const handleCreateCustomWorkout = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim()) return

    const validExercises: PersonalWorkoutExercise[] = newExercises
      .filter((ex) => ex.name.trim().length > 0)
      .map((ex) => ({
        name: ex.name.trim(),
        sets: Number(ex.sets) || 3,
        reps: ex.reps.trim() || '۱۰ تکرار',
        completed: false,
      }))

    addWorkout({
      title: newTitle.trim(),
      coach: 'تمرین انفرادی ' + profile.name,
      assignedDate: 'امروز',
      durationMinutes: newDuration,
      exercises: validExercises.length > 0 ? validExercises : [
        { name: 'گرم کردن عمومی و کشش', sets: 1, reps: '۱۰ دقیقه', completed: false },
        { name: 'تکنیک‌های سرعتی', sets: 3, reps: '۱۵ تکرار', completed: false }
      ],
      userNotes: '',
    })

    setIsAddOpen(false)
    setNewTitle('')
    setNewDuration(45)
    setNewExercises([{ name: '', sets: 3, reps: '۱۰ تکرار' }])
    showToast('تمرین انفرادی جدید ثبت شد.')
  }

  return (
    <RoleGuard allowedRoles={['USER', 'TEAM_ADMIN', 'SUPER_ADMIN']}>
      <RazmyarShell title="برنامه و تمرینات ورزشی">
        <div className="space-y-6 pb-12">
          {/* Toast */}
          {toastMessage && (
            <div className="fixed bottom-6 left-6 z-50 flex items-center gap-2 rounded-2xl bg-foreground px-4 py-3 text-xs font-bold text-background shadow-2xl animate-in slide-in-from-bottom-5">
              <CheckCircle2 className="size-4 text-emerald-400" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* Top Banner Stats */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-border bg-gradient-to-br from-amber-500/10 via-card to-card p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-500">زنجیره استمرار (Streak)</span>
                <div className="flex size-9 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500">
                  <Flame className="size-5" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-3xl font-black text-foreground">۱۲</span>
                <span className="mr-1 text-xs text-muted-foreground">روز پیاپی تمرین</span>
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">عالی پیش رفتی، رکورد هفته قبل ۱۰ روز بود!</p>
            </div>

            <div className="rounded-3xl border border-border bg-gradient-to-br from-emerald-500/10 via-card to-card p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-500">جلسات تکمیل شده ماه</span>
                <div className="flex size-9 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500">
                  <Trophy className="size-5" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-3xl font-black text-foreground">{completedWorkouts.length + 12}</span>
                <span className="mr-1 text-xs text-muted-foreground">جلسه موفق</span>
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">هدف ماهانه: ۱۶ جلسه (پیشرفت ۸۵٪)</p>
            </div>

            <div className="rounded-3xl border border-border bg-gradient-to-br from-primary/10 via-card to-card p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-primary">سطح و ارتقا کمربند</span>
                <div className="flex size-9 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Award className="size-5" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-2xl font-black text-foreground">کمربند {profile.belt}</span>
                <span className="mr-1 text-xs text-primary font-bold">← {profile.targetBelt}</span>
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">آزمون بعدی: ۲ هفته دیگر در {profile.clubName}</p>
            </div>
          </div>

          {/* Section Header & Tabs */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('ACTIVE')}
                className={`flex items-center gap-2 rounded-2xl px-4 py-2 text-xs sm:text-sm font-bold transition ${
                  activeTab === 'ACTIVE'
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'bg-card text-muted-foreground hover:text-foreground'
                }`}
              >
                <Play className="size-4" />
                <span>برنامه‌های فعال و امروز ({activeWorkouts.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('HISTORY')}
                className={`flex items-center gap-2 rounded-2xl px-4 py-2 text-xs sm:text-sm font-bold transition ${
                  activeTab === 'HISTORY'
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'bg-card text-muted-foreground hover:text-foreground'
                }`}
              >
                <History className="size-4" />
                <span>تاریخچه و جلسات گذشته ({completedWorkouts.length})</span>
              </button>
            </div>

            <button
              onClick={() => setIsAddOpen(true)}
              className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-card px-4 py-2 text-xs font-bold text-foreground hover:border-primary hover:bg-primary/5 transition"
            >
              <Plus className="size-4 text-primary" />
              <span>ثبت تمرین انفرادی جدید</span>
            </button>
          </div>

          {/* TAB 1: ACTIVE WORKOUTS */}
          {activeTab === 'ACTIVE' && (
            <div className="space-y-6">
              {activeWorkouts.map((workout) => {
                const totalExercises = workout.exercises.length
                const completedCount = workout.exercises.filter((e) => e.completed).length
                const percent = Math.round((completedCount / (totalExercises || 1)) * 100)

                return (
                  <div
                    key={workout.id}
                    className="rounded-3xl border border-border bg-card p-5 sm:p-6 shadow-sm hover:border-primary/30 transition space-y-5"
                  >
                    {/* Header */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          <span className="rounded-lg bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                            مربی: {workout.coach}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="size-3.5" />
                            {workout.durationMinutes} دقیقه
                          </span>
                          <span className="text-xs text-muted-foreground">· تاریخ انتساب: {workout.assignedDate}</span>
                        </div>
                        <h3 className="text-lg font-bold text-foreground">{workout.title}</h3>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-left sm:text-right">
                          <div className="text-xs font-semibold text-muted-foreground">میزان پیشرفت</div>
                          <div className="text-sm font-black text-primary">{percent}٪ ({completedCount} از {totalExercises})</div>
                        </div>
                        <button
                          onClick={() => setCompleteModalWorkout(workout)}
                          className="flex items-center gap-2 rounded-2xl bg-emerald-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition"
                        >
                          <CheckCircle2 className="size-4" />
                          <span>ثبت پایان جلسه</span>
                        </button>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full bg-gradient-to-l from-primary to-emerald-400 transition-all duration-300"
                        style={{ width: `${percent}%` }}
                      />
                    </div>

                    {/* Exercises Checklist */}
                    <div className="space-y-2.5">
                      <h4 className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                        <Activity className="size-3.5 text-primary" />
                        حرکات و آیتم‌های تمرینی (روی تیک هر آیتم کلیک کنید):
                      </h4>

                      <div className="grid gap-2.5 sm:grid-cols-2">
                        {workout.exercises.map((exercise, idx) => (
                          <div
                            key={idx}
                            onClick={() => toggleExercise(workout.id, idx)}
                            className={`flex cursor-pointer items-center justify-between rounded-2xl border p-3.5 transition ${
                              exercise.completed
                                ? 'border-emerald-500/40 bg-emerald-500/5'
                                : 'border-border bg-muted/20 hover:border-primary/40 hover:bg-card'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`flex size-6 shrink-0 items-center justify-center rounded-xl border transition ${
                                  exercise.completed
                                    ? 'border-emerald-500 bg-emerald-500 text-white'
                                    : 'border-muted-foreground/30 bg-card'
                                }`}
                              >
                                {exercise.completed && <CheckCircle2 className="size-4" />}
                              </div>
                              <div>
                                <h5
                                  className={`text-xs font-bold ${
                                    exercise.completed ? 'line-through text-muted-foreground' : 'text-foreground'
                                  }`}
                                >
                                  {exercise.name}
                                </h5>
                                <div className="text-[11px] text-muted-foreground mt-0.5">
                                  <span>{exercise.sets} ست</span> · <span>{exercise.reps}</span>
                                </div>
                              </div>
                            </div>

                            {exercise.record && (
                              <span className="rounded-lg bg-amber-500/10 px-2 py-1 text-[10px] font-bold text-amber-500">
                                رکورد: {exercise.record}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })}

              {activeWorkouts.length === 0 && (
                <div className="rounded-3xl border border-dashed border-border p-12 text-center">
                  <Sparkles className="size-10 text-emerald-400 mx-auto mb-3" />
                  <h4 className="text-sm font-bold text-foreground">تمام تمرین‌های امروز انجام شده‌اند!</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    جلسه فعالی در صف انتظار نیست. می‌توانید یک تمرین انفرادی جدید ثبت کنید یا تاریخچه تمرین‌ها را ببینید.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: COMPLETED WORKOUTS HISTORY */}
          {activeTab === 'HISTORY' && (
            <div className="space-y-4">
              {completedWorkouts.map((workout) => (
                <div
                  key={workout.id}
                  className="rounded-3xl border border-border/70 bg-card p-5 space-y-3 opacity-90"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="rounded-lg bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-500 flex items-center gap-1">
                          <CheckCircle2 className="size-3" />
                          تکمیل شده
                        </span>
                        <span className="text-xs text-muted-foreground">· مربی: {workout.coach}</span>
                        {workout.completedAt && (
                          <span className="text-xs text-muted-foreground">· زمان ثبت: {workout.completedAt}</span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-foreground">{workout.title}</h4>
                    </div>

                    <span className="text-xs text-muted-foreground font-semibold">
                      {workout.durationMinutes} دقیقه · {workout.exercises.length} حرکت
                    </span>
                  </div>

                  {/* Exercises summary */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {workout.exercises.map((ex, i) => (
                      <span
                        key={i}
                        className="rounded-xl border border-border bg-muted/40 px-2.5 py-1 text-[11px] text-muted-foreground flex items-center gap-1"
                      >
                        <CheckCircle2 className="size-3 text-emerald-500" />
                        {ex.name} ({ex.sets}×{ex.reps})
                      </span>
                    ))}
                  </div>

                  {workout.userNotes && (
                    <div className="rounded-2xl bg-muted/30 p-3 text-xs text-muted-foreground flex items-start gap-2">
                      <FileText className="size-4 shrink-0 text-primary mt-0.5" />
                      <span><strong>یادداشت هنرجو:</strong> {workout.userNotes}</span>
                    </div>
                  )}
                </div>
              ))}

              {completedWorkouts.length === 0 && (
                <div className="rounded-3xl border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
                  هنوز جلسه‌ای تکمیل و ثبت نشده است.
                </div>
              )}
            </div>
          )}

          {/* MODAL: COMPLETE WORKOUT */}
          {completeModalWorkout && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div className="flex items-center gap-2">
                    <Trophy className="size-5 text-emerald-400" />
                    <h3 className="text-base font-bold text-foreground">ثبت پایان جلسه تمرینی</h3>
                  </div>
                  <button
                    onClick={() => setCompleteModalWorkout(null)}
                    className="rounded-full p-1 text-muted-foreground hover:bg-muted"
                  >
                    <X className="size-5" />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <p className="text-muted-foreground">
                    جلسه: <strong className="text-foreground">{completeModalWorkout.title}</strong>
                  </p>
                  <p className="text-muted-foreground">
                    با ثبت این جلسه، تمامی حرکات با موفقیت علامت خورده و آمار تمرینی شما در باشگاه ثبت خواهد شد.
                  </p>

                  <div>
                    <label className="font-bold text-foreground block mb-1">
                      یادداشت یا احساس بدنی پس از تمرین (اختیاری):
                    </label>
                    <textarea
                      rows={3}
                      value={completionNotes}
                      onChange={(e) => setCompletionNotes(e.target.value)}
                      placeholder="مثلاً: تکنیک‌های پا روان بود، مقداری احساس خستگی در عضلات دوقلو..."
                      className="w-full rounded-xl border border-input bg-muted/40 p-2.5 text-xs outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                  <button
                    onClick={() => setCompleteModalWorkout(null)}
                    className="rounded-xl border border-border px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted"
                  >
                    انصراف
                  </button>
                  <button
                    onClick={() => handleFinishWorkout(completeModalWorkout)}
                    className="rounded-xl bg-emerald-500 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-600 shadow-md shadow-emerald-500/20"
                  >
                    تأیید و ثبت در کارنامه
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* MODAL: ADD CUSTOM WORKOUT */}
          {isAddOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <h3 className="text-base font-bold text-foreground">تعریف برنامه تمرین انفرادی</h3>
                  <button
                    onClick={() => setIsAddOpen(false)}
                    className="rounded-full p-1 text-muted-foreground hover:bg-muted"
                  >
                    <X className="size-5" />
                  </button>
                </div>

                <form onSubmit={handleCreateCustomWorkout} className="space-y-3.5 text-xs">
                  <div>
                    <label className="font-bold text-foreground block mb-1">عنوان تمرین *</label>
                    <input
                      required
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="مثلاً: تمرین کششی و انعطاف‌پذیری ۱۸۰ درجه"
                      className="w-full rounded-xl border border-input bg-muted/40 p-2.5 outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-foreground block mb-1">مدت زمان تقریبی (دقیقه)</label>
                    <input
                      type="number"
                      value={newDuration}
                      onChange={(e) => setNewDuration(Number(e.target.value))}
                      className="w-full rounded-xl border border-input bg-muted/40 p-2.5 outline-none focus:border-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-foreground block">حرکات تمرین</label>
                      <button
                        type="button"
                        onClick={handleAddExerciseRow}
                        className="text-[11px] font-bold text-primary hover:underline flex items-center gap-1"
                      >
                        <Plus className="size-3" />
                        افزودن حرکت
                      </button>
                    </div>

                    {newExercises.map((ex, idx) => (
                      <div key={idx} className="grid grid-cols-12 gap-2">
                        <input
                          value={ex.name}
                          onChange={(e) => handleExerciseChange(idx, 'name', e.target.value)}
                          placeholder={`نام حرکت ${idx + 1}...`}
                          className="col-span-6 rounded-xl border border-input bg-muted/40 p-2 outline-none focus:border-primary text-xs"
                        />
                        <input
                          type="number"
                          value={ex.sets}
                          onChange={(e) => handleExerciseChange(idx, 'sets', e.target.value)}
                          placeholder="ست"
                          className="col-span-2 rounded-xl border border-input bg-muted/40 p-2 outline-none focus:border-primary text-xs text-center"
                        />
                        <input
                          value={ex.reps}
                          onChange={(e) => handleExerciseChange(idx, 'reps', e.target.value)}
                          placeholder="تکرار"
                          className="col-span-4 rounded-xl border border-input bg-muted/40 p-2 outline-none focus:border-primary text-xs"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                    <button
                      type="button"
                      onClick={() => setIsAddOpen(false)}
                      className="rounded-xl border border-border px-4 py-2 font-semibold text-muted-foreground hover:bg-muted"
                    >
                      انصراف
                    </button>
                    <button
                      type="submit"
                      className="rounded-xl bg-primary px-5 py-2 font-bold text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20"
                    >
                      ثبت برنامه تمرین
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </RazmyarShell>
    </RoleGuard>
  )
}
