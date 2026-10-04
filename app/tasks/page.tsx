'use client'

import { useState } from 'react'
import {
  CheckSquare,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  X,
  Building2,
  Calendar,
  UserCheck,
  Tag,
  Trash2,
} from 'lucide-react'
import { RazmyarShell } from '@/components/razmyar-shell'
import { RoleGuard } from '@/features/auth/guards'
import { useAuth } from '@/lib/auth-context'
import { useTeamAdminStore } from '@/features/team-admin/store'
import { TeamTask } from '@/features/team-admin/types'

import { UserTasksView } from '@/features/user/components/user-tasks-view'

export default function TasksPage() {
  const { role, teamId, teamName, selectedClubId } = useAuth()
  const { teamClubs, scopedTasks, addTask, toggleTaskStatus } = useTeamAdminStore(teamId || 'FAJR', selectedClubId)

  // If user role is USER, render personal athlete tasks
  if (role === 'USER') {
    return (
      <RoleGuard allowedRoles={['USER', 'TEAM_ADMIN', 'SUPER_ADMIN']}>
        <RazmyarShell title="وظایف شخصی">
          <UserTasksView />
        </RazmyarShell>
      </RoleGuard>
    )
  }

  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('همه')
  const [selectedStatus, setSelectedStatus] = useState('همه')
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Form State
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [assignedTo, setAssignedTo] = useState('')
  const [category, setCategory] = useState<TeamTask['category']>('اداری')
  const [priority, setPriority] = useState<TeamTask['priority']>('MEDIUM')
  const [dueDate, setDueDate] = useState('۱۴۰۵/۰۷/۱۰')
  const [targetClub, setTargetClub] = useState(selectedClubId || teamClubs[0]?.id || 'PARTO')

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    addTask({
      title: title.trim(),
      description: description.trim(),
      assignedTo: assignedTo.trim() || 'مدیر تیم',
      category,
      priority,
      dueDate,
      clubId: targetClub,
    })

    setIsAddOpen(false)
    setTitle('')
    setDescription('')
    setAssignedTo('')
    showToast('وظیفه جدید با موفقیت ثبت شد.')
  }

  const filteredTasks = scopedTasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(search.toLowerCase().trim()) ||
      t.assignedTo.toLowerCase().includes(search.toLowerCase().trim())
    const matchesCategory = selectedCategory === 'همه' || t.category === selectedCategory
    const matchesStatus = selectedStatus === 'همه' || t.status === selectedStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

  const selectedClub = teamClubs.find((c) => c.id === selectedClubId)

  return (
    <RoleGuard allowedRoles={['TEAM_ADMIN', 'SUPER_ADMIN']}>
      <RazmyarShell title="وظایف و پیگیری‌ها">
        <div className="space-y-6 pb-12">
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
                  · {selectedClub ? selectedClub.name : 'تمامی باشگاه‌ها'}
                </span>
              </div>
              <h2 className="text-xl font-bold text-foreground">مدیریت وظایف باشگاهی</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                تعریف وظایف، انتساب به مربیان یا کادر اجرایی و پیگیری وضعیت اجرا
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
              <span>ثبت وظیفه جدید</span>
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute right-3.5 top-3 size-4 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="جستجوی وظیفه یا مسئول پیگیری..."
                className="w-full rounded-2xl border border-input bg-card pr-10 pl-4 py-2.5 text-xs sm:text-sm outline-none placeholder:text-muted-foreground focus:border-primary"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="rounded-2xl border border-input bg-card px-3 py-2.5 outline-none text-foreground font-semibold"
              >
                <option value="همه">دسته‌بندی: همه</option>
                <option value="آزمون">آزمون</option>
                <option value="مسابقات">مسابقات</option>
                <option value="اداری">اداری</option>
                <option value="مالی">مالی</option>
                <option value="تجهیزات">تجهیزات</option>
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="rounded-2xl border border-input bg-card px-3 py-2.5 outline-none text-foreground font-semibold"
              >
                <option value="همه">وضعیت: همه</option>
                <option value="PENDING">در انتظار اقدام</option>
                <option value="IN_PROGRESS">در حال انجام</option>
                <option value="COMPLETED">تکمیل شده</option>
              </select>
            </div>
          </div>

          {/* Tasks List */}
          <div className="space-y-3">
            {filteredTasks.map((task) => {
              const isDone = task.status === 'COMPLETED'
              const club = teamClubs.find((c) => c.id === task.clubId)
              return (
                <div
                  key={task.id}
                  className={`rounded-3xl border p-4 sm:p-5 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isDone
                      ? 'border-border/50 bg-muted/20 opacity-70'
                      : 'border-border bg-card hover:border-primary/40 shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => toggleTaskStatus(task.id)}
                      className={`mt-1 flex size-5 shrink-0 items-center justify-center rounded-lg border transition ${
                        isDone
                          ? 'border-emerald-500 bg-emerald-500 text-white'
                          : 'border-muted-foreground/40 hover:border-primary hover:bg-primary/10'
                      }`}
                    >
                      {isDone && <CheckCircle2 className="size-4" />}
                    </button>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4
                          className={`text-sm font-bold ${
                            isDone ? 'line-through text-muted-foreground' : 'text-foreground'
                          }`}
                        >
                          {task.title}
                        </h4>
                        <span className="rounded-md bg-accent px-2 py-0.5 text-[10px] font-bold text-foreground">
                          {task.category}
                        </span>
                        <span
                          className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                            task.priority === 'HIGH'
                              ? 'bg-rose-500/10 text-rose-500'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {task.priority === 'HIGH' ? 'اولویت بالا' : 'عادی'}
                        </span>
                      </div>

                      {task.description && (
                        <p className="text-xs text-muted-foreground">{task.description}</p>
                      )}

                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground pt-1">
                        <span className="flex items-center gap-1 font-semibold text-primary">
                          <Building2 className="size-3" />
                          {club?.name || (task.clubId === 'ALL' ? 'همه باشگاه‌ها' : task.clubId)}
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <UserCheck className="size-3" />
                          مسئول: <strong className="text-foreground">{task.assignedTo}</strong>
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1 font-mono">
                          <Calendar className="size-3" />
                          مهلت: {task.dueDate}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 shrink-0">
                    <button
                      onClick={() => toggleTaskStatus(task.id)}
                      className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                        isDone
                          ? 'border border-border text-muted-foreground hover:bg-muted'
                          : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'
                      }`}
                    >
                      {isDone ? 'بازگشایی مجدد' : 'علامت به عنوان انجام شده'}
                    </button>
                  </div>
                </div>
              )
            })}

            {filteredTasks.length === 0 && (
              <div className="rounded-3xl border border-dashed border-border py-12 text-center text-sm text-muted-foreground">
                هیچ وظیفه‌ای با این مشخصات یافت نشد
              </div>
            )}
          </div>
        </div>

        {/* MODAL: Add Task */}
        {isAddOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="text-base font-bold text-foreground">ثبت وظیفه جدید</h3>
                <button
                  onClick={() => setIsAddOpen(false)}
                  className="rounded-full p-1 text-muted-foreground hover:bg-muted"
                >
                  <X className="size-5" />
                </button>
              </div>

              <form onSubmit={handleCreateTask} className="space-y-3.5 text-xs">
                <div>
                  <label className="font-bold text-foreground block mb-1">عنوان وظیفه *</label>
                  <input
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="مثلاً: برگزاری جلسه توجیهی مربیان"
                    className="w-full rounded-xl border border-input bg-muted/40 p-2.5 outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="font-bold text-foreground block mb-1">توضیحات تکمیلی</label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="شرح جزئیات اقدام مورد نیاز..."
                    className="w-full rounded-xl border border-input bg-muted/40 p-2.5 outline-none focus:border-primary"
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="font-bold text-foreground block mb-1">باشگاه مربوطه</label>
                    <select
                      value={targetClub}
                      onChange={(e) => setTargetClub(e.target.value)}
                      className="w-full rounded-xl border border-input bg-muted/40 p-2.5 outline-none font-semibold text-foreground"
                    >
                      <option value="ALL">همه باشگاه‌های {teamName}</option>
                      {teamClubs.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-foreground block mb-1">مسئول اجرا / پیگیری</label>
                    <input
                      value={assignedTo}
                      onChange={(e) => setAssignedTo(e.target.value)}
                      placeholder="استاد امینی، مسئول سالن..."
                      className="w-full rounded-xl border border-input bg-muted/40 p-2.5 outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div>
                    <label className="font-bold text-foreground block mb-1">دسته‌بندی</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full rounded-xl border border-input bg-muted/40 p-2.5 outline-none font-semibold text-foreground"
                    >
                      <option value="اداری">اداری</option>
                      <option value="آزمون">آزمون</option>
                      <option value="مسابقات">مسابقات</option>
                      <option value="مالی">مالی</option>
                      <option value="تجهیزات">تجهیزات</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-foreground block mb-1">اولویت</label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as any)}
                      className="w-full rounded-xl border border-input bg-muted/40 p-2.5 outline-none font-semibold text-foreground"
                    >
                      <option value="LOW">پایین</option>
                      <option value="MEDIUM">عادی</option>
                      <option value="HIGH">فوری / بالا</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-foreground block mb-1">موعد انجام</label>
                    <input
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      placeholder="۱۴۰۵/۰۷/۱۰"
                      className="w-full rounded-xl border border-input bg-muted/40 p-2.5 outline-none focus:border-primary"
                    />
                  </div>
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
                    ثبت وظیفه
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </RazmyarShell>
    </RoleGuard>
  )
}
