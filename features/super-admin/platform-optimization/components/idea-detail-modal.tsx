'use client'

import { useState } from 'react'
import {
  X,
  Edit2,
  Trash2,
  Calendar,
  User,
  Clock,
  ArrowRight,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lightbulb,
  Search,
  CalendarClock,
  PlayCircle,
  Sparkles,
} from 'lucide-react'
import { usePlatformOptimization } from '../store/use-platform-optimization'
import { IdeaStatus, IdeaPriority } from '../types'
import { IdeaStatusBadge } from './idea-status-badge'
import { IdeaPriorityBadge } from './idea-priority-badge'
import { getCategoryMeta } from './idea-card'

export function IdeaDetailModal() {
  const {
    selectedIdea,
    isEditOpen,
    closeDetail,
    openEdit,
    deleteIdea,
    changeStatus,
    changePriority,
  } = usePlatformOptimization()

  const [confirmDelete, setConfirmDelete] = useState(false)

  if (!selectedIdea || isEditOpen) return null

  const cat = getCategoryMeta(selectedIdea.category)
  const CatIcon = cat.icon

  const WORKFLOW_STEPS: Array<{ status: IdeaStatus; label: string }> = [
    { status: 'IDEA', label: 'ایده اولیه' },
    { status: 'REVIEWING', label: 'در حال بررسی' },
    { status: 'PLANNED', label: 'برنامه‌ریزی شده' },
    { status: 'IN_PROGRESS', label: 'در حال اجرا' },
    { status: 'DONE', label: 'انجام شد' },
  ]

  const handleDelete = async () => {
    await deleteIdea(selectedIdea.id)
    setConfirmDelete(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" dir="rtl">
      <div className="w-full max-w-2xl rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-border pb-4">
          <div className="space-y-1.5 flex-1 pr-1">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-0.5 text-xs font-bold ${cat.color}`}
              >
                <CatIcon className="size-3.5" />
                <span>{cat.label}</span>
              </span>
              <IdeaPriorityBadge priority={selectedIdea.priority} />
              <IdeaStatusBadge status={selectedIdea.status} />
            </div>

            <h3 className="text-lg font-black text-foreground pt-1">
              {selectedIdea.title}
            </h3>
          </div>

          <button
            onClick={closeDetail}
            className="rounded-full p-1.5 text-muted-foreground hover:bg-muted shrink-0"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Workflow Progression Stepper */}
        <div className="rounded-2xl border border-border bg-muted/20 p-4 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-foreground flex items-center gap-1.5">
              <Sparkles className="size-3.5 text-primary" />
              مراحل چرخه حیات و پیشرفت ایده (Workflow Status):
            </span>
            <span className="text-[11px] text-muted-foreground">کلیک جهت تغییر وضعیت</span>
          </div>

          <div className="grid grid-cols-5 gap-1.5 pt-1">
            {WORKFLOW_STEPS.map((step, idx) => {
              const isActive = selectedIdea.status === step.status
              return (
                <button
                  key={step.status}
                  onClick={() => changeStatus(selectedIdea.id, step.status)}
                  className={`flex flex-col items-center justify-center rounded-xl p-2 text-center text-[10px] font-bold transition ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/20 scale-[1.02]'
                      : 'bg-card border border-border/70 text-muted-foreground hover:border-primary/40 hover:text-foreground'
                  }`}
                >
                  <span className="opacity-70 mb-0.5">مرحله {idx + 1}</span>
                  <span className="line-clamp-1">{step.label}</span>
                </button>
              )
            })}
          </div>

          {/* Alternative: Reject button */}
          <div className="flex justify-end pt-1">
            <button
              onClick={() => changeStatus(selectedIdea.id, 'REJECTED')}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition flex items-center gap-1 ${
                selectedIdea.status === 'REJECTED'
                  ? 'bg-rose-500 text-white'
                  : 'text-rose-500 hover:bg-rose-500/10'
              }`}
            >
              <XCircle className="size-3" />
              <span>علامت به عنوان رد شده (Rejected)</span>
            </button>
          </div>
        </div>

        {/* Details Content */}
        <div className="space-y-4 text-xs">
          {/* Description */}
          {selectedIdea.description && (
            <div className="space-y-1">
              <h5 className="font-bold text-muted-foreground">شرح ایده:</h5>
              <div className="rounded-2xl border border-border/80 bg-muted/10 p-3.5 text-foreground leading-relaxed text-xs">
                {selectedIdea.description}
              </div>
            </div>
          )}

          {/* Notes */}
          {selectedIdea.notes && (
            <div className="space-y-1">
              <h5 className="font-bold text-muted-foreground">یادداشت‌های فنی و اجرایی:</h5>
              <div className="rounded-2xl border border-border/80 bg-muted/10 p-3.5 text-foreground leading-relaxed text-xs font-mono">
                {selectedIdea.notes}
              </div>
            </div>
          )}

          {/* Metadata Grid */}
          <div className="grid gap-3 sm:grid-cols-3 border-t border-border pt-3 text-[11px]">
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="size-4 text-primary" />
              <span>ثبت توسط: <strong className="text-foreground">{selectedIdea.createdBy}</strong></span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground font-mono">
              <Calendar className="size-4 text-primary" />
              <span>تاریخ ثبت: <strong className="text-foreground">{selectedIdea.createdAt}</strong></span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground font-mono">
              <Clock className="size-4 text-primary" />
              <span>آخرین به‌روزرسانی: <strong className="text-foreground">{selectedIdea.updatedAt}</strong></span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-border pt-4">
          <div className="flex items-center gap-2">
            {!confirmDelete ? (
              <button
                onClick={() => setConfirmDelete(true)}
                className="flex items-center gap-1 rounded-xl px-3 py-2 text-xs font-bold text-rose-500 hover:bg-rose-500/10 transition"
              >
                <Trash2 className="size-4" />
                <span>حذف ایده</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 animate-in fade-in">
                <span className="text-xs text-rose-500 font-bold">آیا مطمئن هستید؟</span>
                <button
                  onClick={handleDelete}
                  className="rounded-xl bg-rose-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-rose-600 transition"
                >
                  بله، حذف کن
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="rounded-xl border border-border px-2.5 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-muted"
                >
                  انصراف
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => openEdit(selectedIdea)}
              className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2 text-xs font-bold text-foreground hover:bg-muted transition"
            >
              <Edit2 className="size-3.5 text-primary" />
              <span>ویرایش جزئیات</span>
            </button>
            <button
              onClick={closeDetail}
              className="rounded-xl bg-primary px-5 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition shadow-sm shadow-primary/20"
            >
              بستن
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
