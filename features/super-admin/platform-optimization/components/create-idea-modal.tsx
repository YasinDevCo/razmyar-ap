'use client'

import { useState } from 'react'
import { X, Sparkles } from 'lucide-react'
import { usePlatformOptimization } from '../store/use-platform-optimization'
import { IdeaCategory, IdeaPriority, IdeaStatus } from '../types'

export function CreateIdeaModal() {
  const { isCreateOpen, closeCreate, createIdea } = usePlatformOptimization()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<IdeaCategory>('FEATURE')
  const [priority, setPriority] = useState<IdeaPriority>('MEDIUM')
  const [status, setStatus] = useState<IdeaStatus>('IDEA')
  const [notes, setNotes] = useState('')

  if (!isCreateOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    await createIdea({
      title: title.trim(),
      description: description.trim() || undefined,
      category,
      priority,
      status,
      notes: notes.trim() || undefined,
      createdBy: 'مدیر ارشد پلتفرم',
    })

    // Reset Form
    setTitle('')
    setDescription('')
    setCategory('FEATURE')
    setPriority('MEDIUM')
    setStatus('IDEA')
    setNotes('')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" dir="rtl">
      <div className="w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Sparkles className="size-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">ثبت ایده جدید بهینه‌سازی</h3>
              <p className="text-[11px] text-muted-foreground">ثبت پیشنهاد، فیچر، بهبود کارایی یا امنیت در پلتفرم</p>
            </div>
          </div>
          <button
            onClick={closeCreate}
            className="rounded-full p-1.5 text-muted-foreground hover:bg-muted"
          >
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="font-bold text-foreground block mb-1">عنوان ایده / بهبود *</label>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثلاً: اضافه کردن گزارش ماهانه عملکرد باشگاه‌ها"
              className="w-full rounded-2xl border border-input bg-muted/30 px-3.5 py-2.5 outline-none focus:border-primary font-semibold text-xs"
            />
          </div>

          <div>
            <label className="font-bold text-foreground block mb-1">شرح جزئیات و چرایی نیاز</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="هدف این تغییر، ارزش افزوده برای کاربران یا بهبود سیستم چیست؟"
              className="w-full rounded-2xl border border-input bg-muted/30 p-3 outline-none focus:border-primary text-xs leading-relaxed"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <label className="font-bold text-foreground block mb-1">دسته‌بندی</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as IdeaCategory)}
                className="w-full rounded-2xl border border-input bg-muted/30 p-2.5 outline-none font-semibold text-foreground text-xs"
              >
                <option value="FEATURE">قابلیت جدید (Feature)</option>
                <option value="UX">تجربه کاربری (UX)</option>
                <option value="PERFORMANCE">کارایی و سرعت</option>
                <option value="SECURITY">امنیت و مجوزها</option>
                <option value="BUSINESS">کسب‌وکار و مالی</option>
                <option value="BUG">رفع باگ</option>
                <option value="OTHER">سایر</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-foreground block mb-1">اولویت</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as IdeaPriority)}
                className="w-full rounded-2xl border border-input bg-muted/30 p-2.5 outline-none font-semibold text-foreground text-xs"
              >
                <option value="LOW">پایین (Low)</option>
                <option value="MEDIUM">عادی (Medium)</option>
                <option value="HIGH">بالا (High)</option>
                <option value="CRITICAL">بحرانی (Critical)</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-foreground block mb-1">وضعیت اولیه</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as IdeaStatus)}
                className="w-full rounded-2xl border border-input bg-muted/30 p-2.5 outline-none font-semibold text-foreground text-xs"
              >
                <option value="IDEA">ایده اولیه (Idea)</option>
                <option value="REVIEWING">در حال بررسی</option>
                <option value="PLANNED">برنامه‌ریزی شده</option>
                <option value="IN_PROGRESS">در حال اجرا</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-bold text-foreground block mb-1">یادداشت‌های فنی / منابع پیاده‌سازی (اختیاری)</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="کتابخانه‌های پیشنهادی، راهکارهای بک‌اند یا ملاحظات..."
              className="w-full rounded-2xl border border-input bg-muted/30 p-2.5 outline-none focus:border-primary text-xs"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
            <button
              type="button"
              onClick={closeCreate}
              className="rounded-xl border border-border px-4 py-2 font-semibold text-muted-foreground hover:bg-muted"
            >
              انصراف
            </button>
            <button
              type="submit"
              className="rounded-xl bg-primary px-5 py-2 font-bold text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20"
            >
              ثبت ایده
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
