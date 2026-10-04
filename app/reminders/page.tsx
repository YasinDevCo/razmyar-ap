'use client'

import { useState } from 'react'
import {
  Bell,
  Plus,
  Search,
  CheckCircle2,
  Trash2,
  Clock,
  Calendar,
  X,
  Dumbbell,
  Apple,
  Award,
  Info,
  Sparkles,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react'
import { RazmyarShell } from '@/components/razmyar-shell'
import { RoleGuard } from '@/features/auth/guards'
import { useUserStore } from '@/features/user/store'
import { PersonalReminder } from '@/features/user/types'

export default function RemindersPage() {
  const { reminders, addReminder, toggleReminder, deleteReminder } = useUserStore()

  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('ALL')
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Form State
  const [title, setTitle] = useState('')
  const [dateTime, setDateTime] = useState('امروز، ساعت ۱۸:۰۰')
  const [category, setCategory] = useState<PersonalReminder['category']>('WORKOUT')

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const handleCreateReminder = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    addReminder({
      title: title.trim(),
      dateTime: dateTime.trim() || 'فردا، ساعت ۱۸:۰۰',
      category,
    })

    setIsAddOpen(false)
    setTitle('')
    setDateTime('امروز، ساعت ۱۸:۰۰')
    setCategory('WORKOUT')
    showToast('یادآور جدید با موفقیت تنظیم شد.')
  }

  const filteredReminders = reminders.filter((r) => {
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase().trim())
    const matchCategory = filterCategory === 'ALL' || r.category === filterCategory
    return matchSearch && matchCategory
  })

  const getCategoryMeta = (cat: PersonalReminder['category']) => {
    switch (cat) {
      case 'WORKOUT':
        return {
          label: 'تمرین و باشگاه',
          icon: <Dumbbell className="size-4 text-emerald-500" />,
          bg: 'bg-emerald-500/10 text-emerald-500',
        }
      case 'SUPPLEMENT':
        return {
          label: 'مکمل و تغذیه',
          icon: <Apple className="size-4 text-amber-500" />,
          bg: 'bg-amber-500/10 text-amber-500',
        }
      case 'EXAM':
        return {
          label: 'آزمون و ارتقا',
          icon: <Award className="size-4 text-primary" />,
          bg: 'bg-primary/10 text-primary',
        }
      default:
        return {
          label: 'عمومی',
          icon: <Info className="size-4 text-muted-foreground" />,
          bg: 'bg-muted text-muted-foreground',
        }
    }
  }

  const activeCount = reminders.filter((r) => r.active).length

  return (
    <RoleGuard allowedRoles={['USER', 'TEAM_ADMIN', 'SUPER_ADMIN']}>
      <RazmyarShell title="یادآورهای شخصی">
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
                <span className="rounded-lg bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary flex items-center gap-1">
                  <Bell className="size-3.5" />
                  {activeCount} یادآور فعال
                </span>
              </div>
              <h2 className="text-xl font-bold text-foreground">مدیریت یادآورهای ورزشی و روزمره</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                تنظیم آلارم برای ساعت شروع کلاس، وعده مکمل، آزمون کمربند یا برنامه‌های شخصی
              </p>
            </div>

            <button
              onClick={() => setIsAddOpen(true)}
              className="flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-2.5 text-xs sm:text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 transition"
            >
              <Plus className="size-4" />
              <span>تنظیم یادآور جدید</span>
            </button>
          </div>

          {/* Filters & Search */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute right-3.5 top-3 size-4 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="جستجوی یادآور..."
                className="w-full rounded-2xl border border-input bg-card pr-10 pl-4 py-2.5 text-xs sm:text-sm outline-none placeholder:text-muted-foreground focus:border-primary"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <button
                onClick={() => setFilterCategory('ALL')}
                className={`rounded-2xl border px-3.5 py-2 font-bold transition ${
                  filterCategory === 'ALL'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-input bg-card text-muted-foreground hover:text-foreground'
                }`}
              >
                همه ({reminders.length})
              </button>
              <button
                onClick={() => setFilterCategory('WORKOUT')}
                className={`rounded-2xl border px-3.5 py-2 font-bold transition ${
                  filterCategory === 'WORKOUT'
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500'
                    : 'border-input bg-card text-muted-foreground hover:text-foreground'
                }`}
              >
                تمرین
              </button>
              <button
                onClick={() => setFilterCategory('SUPPLEMENT')}
                className={`rounded-2xl border px-3.5 py-2 font-bold transition ${
                  filterCategory === 'SUPPLEMENT'
                    ? 'border-amber-500 bg-amber-500/10 text-amber-500'
                    : 'border-input bg-card text-muted-foreground hover:text-foreground'
                }`}
              >
                مکمل / تغذیه
              </button>
              <button
                onClick={() => setFilterCategory('EXAM')}
                className={`rounded-2xl border px-3.5 py-2 font-bold transition ${
                  filterCategory === 'EXAM'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-input bg-card text-muted-foreground hover:text-foreground'
                }`}
              >
                آزمون کمربند
              </button>
            </div>
          </div>

          {/* Reminders List */}
          <div className="space-y-3">
            {filteredReminders.map((reminder) => {
              const meta = getCategoryMeta(reminder.category)

              return (
                <div
                  key={reminder.id}
                  className={`rounded-3xl border p-4 sm:p-5 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    reminder.active
                      ? 'border-border bg-card shadow-sm hover:border-primary/40'
                      : 'border-border/40 bg-muted/20 opacity-60'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex size-9 shrink-0 items-center justify-center rounded-2xl bg-card border border-border shadow-xs">
                      {meta.icon}
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className={`text-sm font-bold ${reminder.active ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {reminder.title}
                        </h4>
                        <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${meta.bg}`}>
                          {meta.label}
                        </span>
                        {!reminder.active && (
                          <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                            غیرفعال
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="size-3.5 text-primary" />
                        <span>زمان اعلان:</span>
                        <strong className="text-foreground">{reminder.dateTime}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 shrink-0">
                    <button
                      onClick={() => toggleReminder(reminder.id)}
                      className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                        reminder.active
                          ? 'bg-primary/10 text-primary hover:bg-primary/20'
                          : 'border border-border text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      {reminder.active ? (
                        <>
                          <ToggleRight className="size-4" />
                          <span>فعال</span>
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="size-4" />
                          <span>غیرفعال</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        deleteReminder(reminder.id)
                        showToast('یادآور حذف شد.')
                      }}
                      className="rounded-xl p-2 text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500 transition"
                      title="حذف یادآور"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              )
            })}

            {filteredReminders.length === 0 && (
              <div className="rounded-3xl border border-dashed border-border py-12 text-center text-sm text-muted-foreground">
                هیچ یادآوری در این دسته‌بندی یافت نشد
              </div>
            )}
          </div>

          {/* MODAL: ADD REMINDER */}
          {isAddOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <h3 className="text-base font-bold text-foreground">تنظیم یادآور جدید</h3>
                  <button
                    onClick={() => setIsAddOpen(false)}
                    className="rounded-full p-1 text-muted-foreground hover:bg-muted"
                  >
                    <X className="size-5" />
                  </button>
                </div>

                <form onSubmit={handleCreateReminder} className="space-y-3.5 text-xs">
                  <div>
                    <label className="font-bold text-foreground block mb-1">عنوان یادآور *</label>
                    <input
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="مثلاً: شروع سانس تمرین باشگاه پرتو"
                      className="w-full rounded-xl border border-input bg-muted/40 p-2.5 outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-foreground block mb-1">دسته‌بندی</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full rounded-xl border border-input bg-muted/40 p-2.5 outline-none font-semibold text-foreground"
                    >
                      <option value="WORKOUT">تمرین و کلاس باشگاه</option>
                      <option value="SUPPLEMENT">مکمل ورزشی و تغذیه</option>
                      <option value="EXAM">آزمون کمربند و ارتقای درجه</option>
                      <option value="GENERAL">عمومی / یادداشت</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-foreground block mb-1">زمان اعلان</label>
                    <input
                      value={dateTime}
                      onChange={(e) => setDateTime(e.target.value)}
                      placeholder="امروز، ساعت ۱۸:۰۰ یا جمعه ساعت ۰۹:۰۰"
                      className="w-full rounded-xl border border-input bg-muted/40 p-2.5 outline-none focus:border-primary"
                    />
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
                      ثبت یادآور
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
