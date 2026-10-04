'use client'

import { Search, RotateCcw, Filter, ArrowUpDown } from 'lucide-react'
import { usePlatformOptimization } from '../store/use-platform-optimization'
import { IdeaStatus, IdeaCategory, IdeaPriority, IdeaSortOption } from '../types'

export function IdeaFilters() {
  const {
    filters,
    setSearch,
    setStatusFilter,
    setCategoryFilter,
    setPriorityFilter,
    setSortBy,
    resetFilters,
  } = usePlatformOptimization()

  const hasActiveFilters =
    filters.search !== '' ||
    filters.status !== 'ALL' ||
    filters.category !== 'ALL' ||
    filters.priority !== 'ALL' ||
    filters.sortBy !== 'NEWEST'

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="absolute right-3.5 top-3 size-4 text-muted-foreground" />
          <input
            value={filters.search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جستجو در عنوان، شرح یا یادداشت‌های ایده..."
            className="w-full rounded-2xl border border-input bg-card pr-10 pl-4 py-2.5 text-xs sm:text-sm outline-none placeholder:text-muted-foreground focus:border-primary transition shadow-xs"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Status */}
          <select
            value={filters.status}
            onChange={(e) => setStatusFilter(e.target.value as IdeaStatus | 'ALL')}
            className="rounded-2xl border border-input bg-card px-3 py-2.5 outline-none font-semibold text-foreground"
          >
            <option value="ALL">وضعیت: همه</option>
            <option value="IDEA">ایده اولیه (Idea)</option>
            <option value="REVIEWING">در حال بررسی (Reviewing)</option>
            <option value="PLANNED">برنامه‌ریزی شده (Planned)</option>
            <option value="IN_PROGRESS">در حال اجرا (In Progress)</option>
            <option value="DONE">انجام شد (Done)</option>
            <option value="REJECTED">رد شده (Rejected)</option>
          </select>

          {/* Category */}
          <select
            value={filters.category}
            onChange={(e) => setCategoryFilter(e.target.value as IdeaCategory | 'ALL')}
            className="rounded-2xl border border-input bg-card px-3 py-2.5 outline-none font-semibold text-foreground"
          >
            <option value="ALL">دسته‌بندی: همه</option>
            <option value="FEATURE">قابلیت جدید (Feature)</option>
            <option value="UX">تجربه کاربری (UX)</option>
            <option value="PERFORMANCE">کارایی و سرعت (Performance)</option>
            <option value="SECURITY">امنیت (Security)</option>
            <option value="BUSINESS">کسب‌وکار و مالی (Business)</option>
            <option value="BUG">رفع باگ (Bug)</option>
            <option value="OTHER">سایر (Other)</option>
          </select>

          {/* Priority */}
          <select
            value={filters.priority}
            onChange={(e) => setPriorityFilter(e.target.value as IdeaPriority | 'ALL')}
            className="rounded-2xl border border-input bg-card px-3 py-2.5 outline-none font-semibold text-foreground"
          >
            <option value="ALL">اولویت: همه</option>
            <option value="CRITICAL">بحرانی (Critical)</option>
            <option value="HIGH">بالا (High)</option>
            <option value="MEDIUM">عادی (Medium)</option>
            <option value="LOW">پایین (Low)</option>
          </select>

          {/* Sort */}
          <div className="flex items-center gap-1.5 rounded-2xl border border-input bg-card px-2.5 py-1 text-xs">
            <ArrowUpDown className="size-3.5 text-muted-foreground" />
            <select
              value={filters.sortBy}
              onChange={(e) => setSortBy(e.target.value as IdeaSortOption)}
              className="bg-transparent py-1.5 outline-none font-semibold text-foreground cursor-pointer"
            >
              <option value="NEWEST">جدیدترین</option>
              <option value="OLDEST">قدیمی‌ترین</option>
              <option value="PRIORITY">بیشترین اولویت</option>
            </select>
          </div>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 rounded-2xl border border-border px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted transition"
            >
              <RotateCcw className="size-3.5" />
              <span>پاک‌سازی فیلترها</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
