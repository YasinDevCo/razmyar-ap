'use client'

import { useEffect } from 'react'
import {
  Sparkles,
  Plus,
  Lightbulb,
  Search,
  CalendarClock,
  PlayCircle,
  CheckCircle2,
  SlidersHorizontal,
} from 'lucide-react'
import { usePlatformOptimization } from '../store/use-platform-optimization'
import { IdeaCard } from '../components/idea-card'
import { IdeaFilters } from '../components/idea-filters'
import { CreateIdeaModal } from '../components/create-idea-modal'
import { EditIdeaModal } from '../components/edit-idea-modal'
import { IdeaDetailModal } from '../components/idea-detail-modal'

export function PlatformOptimizationScreen() {
  const {
    fetchIdeas,
    getFilteredIdeas,
    getMetrics,
    openCreate,
    openDetail,
    isLoading,
  } = usePlatformOptimization()

  useEffect(() => {
    fetchIdeas()
  }, [fetchIdeas])

  const filteredIdeas = getFilteredIdeas()
  const metrics = getMetrics()

  return (
    <div className="space-y-6 pb-12" dir="rtl">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary shadow-sm border border-primary/20">
            <Sparkles className="size-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <h2 className="text-xl font-black text-foreground">بهینه‌سازی پلتفرم (Platform Optimization)</h2>
              <span className="rounded-md bg-purple-500/10 px-2 py-0.5 text-[10px] font-bold text-purple-500 border border-purple-500/20">
                ویژه مدیر ارشد
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              ایده‌ها و پیشنهادهای بهبود سیستم، تجربه کاربری، سرعت، امنیت و توسعه‌های آتی رزمیار
            </p>
          </div>
        </div>

        <button
          onClick={openCreate}
          className="flex items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-2.5 text-xs sm:text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 transition"
        >
          <Plus className="size-4" />
          <span>ثبت ایده جدید</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 text-xs">
        <div className="rounded-3xl border border-border bg-card p-4 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground font-semibold">
            <span>کل ایده‌ها</span>
            <Sparkles className="size-4 text-primary" />
          </div>
          <div className="text-2xl font-black text-foreground">{metrics.total}</div>
          <p className="text-[10px] text-muted-foreground">ایده و پیشنهاد ثبت‌شده</p>
        </div>

        <div className="rounded-3xl border border-border bg-card p-4 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground font-semibold">
            <span>ایده‌های اولیه</span>
            <Lightbulb className="size-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-blue-500">{metrics.ideasCount}</div>
          <p className="text-[10px] text-muted-foreground">در صف ارزیابی اولیه</p>
        </div>

        <div className="rounded-3xl border border-border bg-card p-4 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground font-semibold">
            <span>در حال بررسی</span>
            <Search className="size-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black text-purple-500">{metrics.inReview}</div>
          <p className="text-[10px] text-muted-foreground">در دست تحلیل فنی</p>
        </div>

        <div className="rounded-3xl border border-border bg-card p-4 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground font-semibold">
            <span>برنامه‌ریزی شده</span>
            <CalendarClock className="size-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-500">{metrics.planned}</div>
          <p className="text-[10px] text-muted-foreground">تایید شده برای اسپرینت‌ها</p>
        </div>

        <div className="rounded-3xl border border-border bg-card p-4 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground font-semibold">
            <span>در حال اجرا</span>
            <PlayCircle className="size-4 text-cyan-500" />
          </div>
          <div className="text-2xl font-black text-cyan-500">{metrics.inProgress}</div>
          <p className="text-[10px] text-muted-foreground">در حال کدنویسی و تست</p>
        </div>

        <div className="rounded-3xl border border-border bg-card p-4 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground font-semibold">
            <span>انجام شده</span>
            <CheckCircle2 className="size-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-500">{metrics.done}</div>
          <p className="text-[10px] text-muted-foreground">مستقر در پلتفرم</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <IdeaFilters />

      {/* Ideas Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredIdeas.map((idea) => (
          <IdeaCard key={idea.id} idea={idea} onClick={() => openDetail(idea)} />
        ))}
      </div>

      {/* Empty State */}
      {filteredIdeas.length === 0 && !isLoading && (
        <div className="rounded-3xl border border-dashed border-border py-16 text-center space-y-3">
          <div className="flex size-14 items-center justify-center rounded-3xl bg-muted mx-auto text-muted-foreground">
            <Lightbulb className="size-7" />
          </div>
          <h4 className="text-base font-bold text-foreground">ایده‌ای با این مشخصات یافت نشد</h4>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            می‌توانید فیلترها را تغییر داده یا با استفاده از دکمه زیر یک ایده جدید بهینه‌سازی ثبت کنید.
          </p>
          <button
            onClick={openCreate}
            className="rounded-2xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition shadow-sm"
          >
            + ثبت اولین ایده در این دسته‌بندی
          </button>
        </div>
      )}

      {/* Modals */}
      <CreateIdeaModal />
      <EditIdeaModal />
      <IdeaDetailModal />
    </div>
  )
}
