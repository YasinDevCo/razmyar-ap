'use client'

import { useState } from 'react'
import {
  CheckSquare,
  Plus,
  Search,
  CheckCircle2,
  Trash2,
  Edit2,
  Clock,
  RotateCcw,
  Calendar,
  X,
  Tag,
  ListTodo,
} from 'lucide-react'
import { useUserStore } from '../store'
import { PersonalTask } from '../types'

export function UserTasksView() {
  const { tasks, addTask, toggleTask, toggleChecklistItem, deleteTask } = useUserStore()

  const [search, setSearch] = useState('')
  const [filterPriority, setFilterPriority] = useState('ALL')
  const [filterStatus, setFilterStatus] = useState('ALL')
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Form State
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<PersonalTask['priority']>('MEDIUM')
  const [dueDate, setDueDate] = useState('امروز، ساعت ۱۸:۰۰')
  const [repeat, setRepeat] = useState<PersonalTask['repeat']>('NONE')
  const [checklistInputs, setChecklistInputs] = useState<string[]>([''])

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const handleAddChecklistField = () => {
    setChecklistInputs([...checklistInputs, ''])
  }

  const handleChecklistChange = (index: number, val: string) => {
    const next = [...checklistInputs]
    next[index] = val
    setChecklistInputs(next)
  }

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    const checklist = checklistInputs
      .filter((c) => c.trim().length > 0)
      .map((c, i) => ({ id: 'c-' + Date.now() + '-' + i, title: c.trim(), completed: false }))

    addTask({
      title: title.trim(),
      description: description.trim(),
      priority,
      dueDate,
      repeat,
      checklist,
    })

    setIsAddOpen(false)
    setTitle('')
    setDescription('')
    setChecklistInputs([''])
    showToast('وظیفه شخصی جدید با موفقیت اضافه شد.')
  }

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase().trim())
    const matchesPriority = filterPriority === 'ALL' || t.priority === filterPriority
    const matchesStatus = filterStatus === 'ALL' || t.status === filterStatus
    return matchesSearch && matchesPriority && matchesStatus
  })

  return (
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
            <span className="rounded-md bg-purple-500/10 px-2 py-0.5 text-xs font-bold text-purple-500">
              مدیریت فردی
            </span>
            <span className="text-xs text-muted-foreground">· وظایف و اهداف من</span>
          </div>
          <h2 className="text-xl font-bold text-foreground">وظایف و چک‌لیست‌های من</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            برنامه‌ریزی کارهای روزمره ورزشی، تمرینات انفرادی و یادآورها
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-2.5 text-xs sm:text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 transition"
        >
          <Plus className="size-4" />
          <span>وظیفه جدید</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute right-3.5 top-3 size-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جستجوی عنوان وظیفه..."
            className="w-full rounded-2xl border border-input bg-card pr-10 pl-4 py-2.5 text-xs sm:text-sm outline-none placeholder:text-muted-foreground focus:border-primary"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-2xl border border-input bg-card px-3 py-2.5 outline-none text-foreground font-semibold"
          >
            <option value="ALL">وضعیت: همه</option>
            <option value="PENDING">در حال انجام</option>
            <option value="COMPLETED">تکمیل شده</option>
          </select>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="rounded-2xl border border-input bg-card px-3 py-2.5 outline-none text-foreground font-semibold"
          >
            <option value="ALL">اولویت: همه</option>
            <option value="HIGH">فوری / مهم</option>
            <option value="MEDIUM">عادی</option>
            <option value="LOW">کم</option>
          </select>
        </div>
      </div>

      {/* Task Cards List */}
      <div className="space-y-3">
        {filteredTasks.map((task) => {
          const isDone = task.status === 'COMPLETED'
          return (
            <div
              key={task.id}
              className={`rounded-3xl border p-4 sm:p-5 transition space-y-3 ${
                isDone
                  ? 'border-border/50 bg-muted/20 opacity-70'
                  : 'border-border bg-card hover:border-primary/40 shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`mt-1 flex size-5 shrink-0 items-center justify-center rounded-lg border transition ${
                      isDone
                        ? 'border-emerald-500 bg-emerald-500 text-white'
                        : 'border-muted-foreground/40 hover:border-primary'
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

                      <span
                        className={`rounded-md px-2 py-0.5 text-[9px] font-bold ${
                          task.priority === 'HIGH'
                            ? 'bg-rose-500/10 text-rose-500'
                            : task.priority === 'MEDIUM'
                            ? 'bg-amber-500/10 text-amber-500'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {task.priority === 'HIGH' ? 'فوری' : task.priority === 'MEDIUM' ? 'عادی' : 'پایین'}
                      </span>

                      {task.repeat !== 'NONE' && (
                        <span className="flex items-center gap-1 rounded-md bg-accent px-2 py-0.5 text-[9px] font-bold text-muted-foreground">
                          <RotateCcw className="size-2.5" />
                          {task.repeat === 'DAILY' ? 'روزانه' : 'هفتگی'}
                        </span>
                      )}
                    </div>

                    {task.description && (
                      <p className="text-xs text-muted-foreground leading-relaxed">{task.description}</p>
                    )}

                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-mono pt-1">
                      <Calendar className="size-3" />
                      <span>موعد: {task.dueDate}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => {
                      deleteTask(task.id)
                      showToast('وظیفه حذف شد.')
                    }}
                    className="rounded-xl border border-border p-2 text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500 transition"
                    title="حذف وظیفه"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>

              {/* Sub-checklist */}
              {task.checklist && task.checklist.length > 0 && (
                <div className="mr-8 space-y-1.5 pt-2 border-t border-border/50 text-xs">
                  <span className="text-[10px] font-bold text-muted-foreground block mb-1">
                    چک‌لیست مراحل انجام:
                  </span>
                  {task.checklist.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => toggleChecklistItem(task.id, item.id)}
                      className="flex items-center gap-2.5 text-muted-foreground cursor-pointer hover:text-foreground transition"
                    >
                      <input
                        type="checkbox"
                        readOnly
                        checked={item.completed}
                        className="size-3.5 text-primary rounded"
                      />
                      <span className={item.completed ? 'line-through text-muted-foreground/60' : 'font-medium'}>
                        {item.title}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}

        {filteredTasks.length === 0 && (
          <div className="rounded-3xl border border-dashed border-border py-12 text-center text-sm text-muted-foreground">
            هیچ وظیفه‌ای برای نمایش وجود ندارد
          </div>
        )}
      </div>

      {/* MODAL: Add Personal Task */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-foreground">ثبت وظیفه شخصی جدید</h3>
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
                  placeholder="مثلاً: تمرین ضربات پا روی کش"
                  className="w-full rounded-xl border border-input bg-muted/40 p-2.5 outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="font-bold text-foreground block mb-1">توضیحات</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="نکات مهم و اهداف این تمرین..."
                  className="w-full rounded-xl border border-input bg-muted/40 p-2.5 outline-none focus:border-primary"
                />
              </div>

              <div className="grid gap-3 grid-cols-2">
                <div>
                  <label className="font-bold text-foreground block mb-1">اولویت</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full rounded-xl border border-input bg-muted/40 p-2.5 outline-none font-semibold text-foreground"
                  >
                    <option value="HIGH">فوری / بالا</option>
                    <option value="MEDIUM">عادی</option>
                    <option value="LOW">کم</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-foreground block mb-1">تکرار</label>
                  <select
                    value={repeat}
                    onChange={(e) => setRepeat(e.target.value as any)}
                    className="w-full rounded-xl border border-input bg-muted/40 p-2.5 outline-none font-semibold text-foreground"
                  >
                    <option value="NONE">بدون تکرار</option>
                    <option value="DAILY">روزانه</option>
                    <option value="WEEKLY">هفتگی</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-foreground block mb-1">موعد انجام</label>
                <input
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  placeholder="امروز، ساعت ۱۸:۰۰"
                  className="w-full rounded-xl border border-input bg-muted/40 p-2.5 outline-none focus:border-primary"
                />
              </div>

              {/* Checklist builder */}
              <div className="space-y-2 pt-2 border-t border-border">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-foreground block">مراحل و چک‌لیست (اختیاری):</label>
                  <button
                    type="button"
                    onClick={handleAddChecklistField}
                    className="text-[11px] font-bold text-primary hover:underline flex items-center gap-1"
                  >
                    <Plus className="size-3" />
                    افزودن مرحله
                  </button>
                </div>

                {checklistInputs.map((val, idx) => (
                  <input
                    key={idx}
                    value={val}
                    onChange={(e) => handleChecklistChange(idx, e.target.value)}
                    placeholder={`مرحله ${idx + 1}...`}
                    className="w-full rounded-xl border border-input bg-muted/40 p-2 text-xs outline-none focus:border-primary"
                  />
                ))}
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
                  افزودن وظیفه
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
