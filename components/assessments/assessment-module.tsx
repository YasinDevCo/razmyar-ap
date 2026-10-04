'use client'

import React, { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import {
  Award,
  CalendarCheck,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Filter,
  Flame,
  Info,
  Layers,
  Medal,
  Plus,
  Printer,
  RotateCcw,
  Search,
  Sliders,
  Sparkles,
  Swords,
  Target,
  Trophy,
  TrendingUp,
  UserCheck,
  Users,
  X,
  AlertTriangle,
  Zap,
} from 'lucide-react'
import { fa } from '@/lib/razmyar-domain'
import {
  Assessment,
  AssessmentCategoryType,
  AssessmentStudent,
  AssessmentType,
  ASSESSABLE_STUDENTS,
  ASSESSMENT_CATEGORIES,
  BELT_PROGRESSION_MAP,
  BELT_STYLES,
  calculateAssessmentMetrics,
  createDefaultSkillsForStudent,
  getScoreInterpretation,
  INITIAL_ASSESSMENTS,
  SkillAssessment,
} from '@/lib/razmyar-assessment'
import { api } from '@/lib/api'

export function AssessmentModule() {
  const searchParams = useSearchParams()
  const initialStudentId = searchParams.get('student')
  const openNewParam = searchParams.get('new')

  // Main State
  const [assessments, setAssessments] = useState<Assessment[]>(INITIAL_ASSESSMENTS)

  // Load from API on mount
  useEffect(() => {
    async function loadAssessments() {
      const data = await api.assessments.getAll()
      if (data && data.length > 0) {
        setAssessments(data)
      }
    }
    loadAssessments()
  }, [])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBeltFilter, setSelectedBeltFilter] = useState('همه کمربندها')
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('همه ارزیابیها')
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('همه وضعیتها')

  // Modals & Workspaces
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [selectedAssessmentDetail, setSelectedAssessmentDetail] = useState<Assessment | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Assessment Creation Form State
  const [selectedStudent, setSelectedStudent] = useState<AssessmentStudent>(() => {
    if (initialStudentId) {
      const found = ASSESSABLE_STUDENTS.find((s) => s.id === initialStudentId)
      if (found) return found
    }
    return ASSESSABLE_STUDENTS[0]
  })
  const [assessmentType, setAssessmentType] = useState<AssessmentType>('ارزیابی کمربند')
  const [activeCategoryTab, setActiveCategoryTab] = useState<AssessmentCategoryType>('تکنیک‌ها')
  const [currentSkills, setCurrentSkills] = useState<SkillAssessment[]>(() =>
    createDefaultSkillsForStudent(ASSESSABLE_STUDENTS[0].name)
  )
  const [coachNotes, setCoachNotes] = useState('')
  const [studentSearchInModal, setStudentSearchInModal] = useState('')
  const [isStudentDropdownOpen, setIsStudentDropdownOpen] = useState(false)

  // Trigger new assessment modal from URL if requested
  useEffect(() => {
    if (openNewParam === 'true' || initialStudentId) {
      setIsCreateOpen(true)
      if (initialStudentId) {
        const found = ASSESSABLE_STUDENTS.find((s) => s.id === initialStudentId)
        if (found) {
          setSelectedStudent(found)
          setCurrentSkills(createDefaultSkillsForStudent(found.name))
        }
      }
    }
  }, [openNewParam, initialStudentId])

  // Toast Auto Dismiss
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null)
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [toastMessage])

  // Handle Student Selection in Create Form
  const handleStudentSelect = (student: AssessmentStudent) => {
    setSelectedStudent(student)
    setCurrentSkills(createDefaultSkillsForStudent(student.name))
    setIsStudentDropdownOpen(false)
  }

  // Handle Skill Score Change
  const handleScoreChange = (skillName: string, newScore: number) => {
    const clampedScore = Math.max(0, Math.min(100, newScore))
    setCurrentSkills((prev) =>
      prev.map((s) => (s.name === skillName ? { ...s, score: clampedScore } : s))
    )
  }

  // Live Metrics during assessment creation
  const liveMetrics = useMemo(() => {
    return calculateAssessmentMetrics(currentSkills, assessmentType)
  }, [currentSkills, assessmentType])

  // Filtered Assessments List
  const filteredAssessments = useMemo(() => {
    return assessments.filter((item) => {
      const matchesSearch =
        !searchQuery.trim() ||
        item.studentName.includes(searchQuery.trim()) ||
        item.studentClass.includes(searchQuery.trim()) ||
        item.evaluator.includes(searchQuery.trim())

      const matchesBelt =
        selectedBeltFilter === 'همه کمربندها' ||
        item.belt === selectedBeltFilter ||
        item.studentBelt === selectedBeltFilter

      const matchesType =
        selectedTypeFilter === 'همه ارزیابیها' ||
        item.type.includes(selectedTypeFilter.replace('ارزیابی ', '')) ||
        item.type === selectedTypeFilter

      const matchesStatus =
        selectedStatusFilter === 'همه وضعیتها' || item.status === selectedStatusFilter

      return matchesSearch && matchesBelt && matchesType && matchesStatus
    })
  }, [assessments, searchQuery, selectedBeltFilter, selectedTypeFilter, selectedStatusFilter])

  // Save new assessment
  const handleSaveAssessment = async () => {
    const payload = {
      studentId: selectedStudent.id,
      type: assessmentType,
      belt: selectedStudent.belt,
      evaluator: 'مربی امینی',
      skills: currentSkills,
      notes: coachNotes || 'ارزیابی جامع با ثبت عملکرد مهارتی و فنی در سالن تمرین انجام شد.',
    }

    const created = await api.assessments.create(payload)

    const newAssessment: Assessment = created || {
      id: `asm-${Date.now()}`,
      studentId: selectedStudent.id,
      studentName: selectedStudent.name,
      studentAvatar: selectedStudent.avatar,
      studentBelt: selectedStudent.belt,
      targetBelt: selectedStudent.nextBelt,
      studentClass: selectedStudent.className,
      type: assessmentType,
      belt: selectedStudent.belt,
      score: liveMetrics.overallScore,
      date: 'امروز، ' + fa(14) + ' شهریور ۱۴۰۵',
      evaluator: 'مربی امینی',
      status: liveMetrics.status,
      categoryScores: liveMetrics.categoryAverages,
      skills: [...currentSkills],
      notes: coachNotes || 'ارزیابی جامع با ثبت عملکرد مهارتی و فنی در سالن تمرین انجام شد.',
      beltReadiness: liveMetrics.beltReadiness,
      recommendations: liveMetrics.recommendations,
    }

    setAssessments((prev) => [newAssessment, ...prev])
    setIsCreateOpen(false)
    setToastMessage('ارزیابی با موفقیت ثبت شد.')
    setCoachNotes('')
  }

  // Quick preset tag click for coach notes
  const handleAddNoteTag = (tag: string) => {
    setCoachNotes((prev) => (prev ? `${prev} · ${tag}` : tag))
  }

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedBeltFilter !== 'همه کمربندها' ||
    selectedTypeFilter !== 'همه ارزیابیها' ||
    selectedStatusFilter !== 'همه وضعیتها'

  const resetFilters = () => {
    setSearchQuery('')
    setSelectedBeltFilter('همه کمربندها')
    setSelectedTypeFilter('همه ارزیابیها')
    setSelectedStatusFilter('همه وضعیتها')
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6" dir="rtl">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-950/90 px-5 py-4 text-emerald-200 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="size-5 text-emerald-400" />
          <span className="text-sm font-semibold">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="mr-2 text-emerald-400 hover:text-emerald-200"
          >
            <X className="size-4" />
          </button>
        </div>
      )}

      {/* PAGE HEADER */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-primary">
            <Award className="size-4" />
            <span>سیستم مربیگری و ارزیابی رزمیار</span>
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">ارزیابی مهارتها</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            عملکرد و پیشرفت مهارتی شاگردان را ارزیابی کنید.
          </p>
        </div>

        <button
          onClick={() => {
            setIsCreateOpen(true)
          }}
          className="flex w-fit items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="size-5" />
          <span>+ ارزیابی جدید</span>
        </button>
      </div>

      {/* SUMMARY CARDS (4 CARDS) */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <div className="rounded-2xl border border-border bg-card p-4 transition-all hover:border-primary/40 md:p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground md:text-sm">
              ارزیابیهای این ماه
            </span>
            <span className="flex size-9 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-400">
              <CalendarCheck className="size-4" />
            </span>
          </div>
          <p className="mt-4 text-2xl font-extrabold tracking-tight md:text-3xl">۲۸</p>
          <p className="mt-2 flex items-center gap-1 text-[11px] text-cyan-400 md:text-xs">
            <TrendingUp className="size-3" />
            <span>+۳ ارزیابی نسبت به ماه قبل</span>
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 transition-all hover:border-primary/40 md:p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground md:text-sm">
              میانگین امتیاز
            </span>
            <span className="flex size-9 items-center justify-center rounded-xl bg-blue-500/15 text-blue-400">
              <Zap className="size-4" />
            </span>
          </div>
          <p className="mt-4 text-2xl font-extrabold tracking-tight md:text-3xl">۸۱٪</p>
          <p className="mt-2 flex items-center gap-1 text-[11px] text-blue-400 md:text-xs">
            <TrendingUp className="size-3" />
            <span>+۴٪ رشد در مهارت‌های فنی</span>
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 transition-all hover:border-primary/40 md:p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground md:text-sm">
              آماده ارتقا
            </span>
            <span className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400">
              <Trophy className="size-4" />
            </span>
          </div>
          <p className="mt-4 text-2xl font-extrabold tracking-tight md:text-3xl">۷ نفر</p>
          <p className="mt-2 flex items-center gap-1 text-[11px] text-emerald-400 md:text-xs">
            <CheckCircle2 className="size-3" />
            <span>واجد شرایط آزمون کمربند بعدی</span>
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 transition-all hover:border-primary/40 md:p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground md:text-sm">
              نیازمند ارزیابی
            </span>
            <span className="flex size-9 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400">
              <AlertTriangle className="size-4" />
            </span>
          </div>
          <p className="mt-4 text-2xl font-extrabold tracking-tight md:text-3xl">۵ نفر</p>
          <p className="mt-2 flex items-center gap-1 text-[11px] text-amber-400 md:text-xs">
            <span>بیش از ۳۰ روز بدون ثبت رکورد</span>
          </p>
        </div>
      </div>

      {/* FILTERS & SEARCH SECTION */}
      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {/* Search Box */}
          <div className="relative sm:col-span-2 lg:col-span-2">
            <Search className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجوی نام شاگرد..."
              className="w-full rounded-xl border border-input bg-muted/40 py-2.5 pr-9 pl-4 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:bg-background"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          {/* Belt Filter */}
          <div>
            <select
              value={selectedBeltFilter}
              onChange={(e) => setSelectedBeltFilter(e.target.value)}
              className="w-full appearance-none rounded-xl border border-input bg-muted/40 px-3 py-2.5 text-xs font-medium text-foreground outline-none transition-all focus:border-primary focus:bg-background"
            >
              <option value="همه کمربندها">همه کمربندها</option>
              <option value="سفید">کمربند سفید</option>
              <option value="زرد">کمربند زرد</option>
              <option value="سبز">کمربند سبز</option>
              <option value="آبی">کمربند آبی</option>
              <option value="قرمز">کمربند قرمز</option>
              <option value="مشکی">کمربند مشکی</option>
            </select>
          </div>

          {/* Assessment Type Filter */}
          <div>
            <select
              value={selectedTypeFilter}
              onChange={(e) => setSelectedTypeFilter(e.target.value)}
              className="w-full appearance-none rounded-xl border border-input bg-muted/40 px-3 py-2.5 text-xs font-medium text-foreground outline-none transition-all focus:border-primary focus:bg-background"
            >
              <option value="همه ارزیابیها">همه ارزیابیها</option>
              <option value="ارزیابی فنی">ارزیابی فنی</option>
              <option value="ارزیابی مبارزه">ارزیابی مبارزه</option>
              <option value="ارزیابی آمادگی جسمانی">ارزیابی آمادگی جسمانی</option>
              <option value="ارزیابی کمربند">ارزیابی کمربند</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="w-full appearance-none rounded-xl border border-input bg-muted/40 px-3 py-2.5 text-xs font-medium text-foreground outline-none transition-all focus:border-primary focus:bg-background"
            >
              <option value="همه وضعیتها">همه وضعیتها</option>
              <option value="تکمیل شده">تکمیل شده</option>
              <option value="در حال بررسی">در حال بررسی</option>
              <option value="نیازمند توجه">نیازمند توجه</option>
              <option value="آماده ارتقا">آماده ارتقا</option>
            </select>
          </div>
        </div>

        {/* Filter status tags if active */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/60 pt-3 text-xs text-muted-foreground">
            <div className="flex flex-wrap items-center gap-2">
              <span>فیلترهای فعال:</span>
              {searchQuery && (
                <span className="rounded-lg bg-accent px-2.5 py-1 text-primary">
                  نام: {searchQuery}
                </span>
              )}
              {selectedBeltFilter !== 'همه کمربندها' && (
                <span className="rounded-lg bg-accent px-2.5 py-1 text-primary">
                  کمربند: {selectedBeltFilter}
                </span>
              )}
              {selectedTypeFilter !== 'همه ارزیابیها' && (
                <span className="rounded-lg bg-accent px-2.5 py-1 text-primary">
                  نوع: {selectedTypeFilter}
                </span>
              )}
              {selectedStatusFilter !== 'همه وضعیتها' && (
                <span className="rounded-lg bg-accent px-2.5 py-1 text-primary">
                  وضعیت: {selectedStatusFilter}
                </span>
              )}
            </div>
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 font-semibold text-rose-400 hover:underline"
            >
              <RotateCcw className="size-3" />
              <span>پاک کردن فیلترها</span>
            </button>
          </div>
        )}
      </div>

      {/* RECENT ASSESSMENTS TABLE / LIST */}
      <section className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border p-4 sm:p-5">
          <div>
            <h2 className="text-base font-bold">لیست ارزیابی‌های اخیر</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              نمایش {fa(filteredAssessments.length)} ارزیابی ثبت‌شده
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden text-xs text-muted-foreground md:inline">
              مرتب‌سازی بر اساس جدیدترین
            </span>
          </div>
        </div>

        {filteredAssessments.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
              <Search className="size-6" />
            </div>
            <h3 className="mt-4 text-base font-semibold">ارزیابی با این مشخصات یافت نشد</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              فیلترهای جستجو را تغییر دهید یا ارزیابی جدیدی ثبت کنید.
            </p>
            <button
              onClick={resetFilters}
              className="mt-4 rounded-xl border border-border px-4 py-2 text-xs font-semibold text-primary hover:bg-muted"
            >
              بازنشانی فیلترها
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead className="border-b border-border bg-muted/30 text-xs text-muted-foreground">
                <tr>
                  <th className="px-4 py-3.5 font-semibold sm:px-6">شاگرد</th>
                  <th className="px-4 py-3.5 font-semibold">نوع ارزیابی</th>
                  <th className="px-4 py-3.5 font-semibold">کمربند</th>
                  <th className="px-4 py-3.5 font-semibold">امتیاز</th>
                  <th className="hidden px-4 py-3.5 font-semibold md:table-cell">تاریخ</th>
                  <th className="hidden px-4 py-3.5 font-semibold lg:table-cell">ارزیاب</th>
                  <th className="px-4 py-3.5 font-semibold">وضعیت</th>
                  <th className="px-4 py-3.5 font-semibold text-left">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredAssessments.map((item) => {
                  const scoreInterp = getScoreInterpretation(item.score)
                  const beltStyle = BELT_STYLES[item.belt] || BELT_STYLES['آبی']
                  const isPromotionReady = item.status === 'آماده ارتقا'

                  return (
                    <tr
                      key={item.id}
                      onClick={() => setSelectedAssessmentDetail(item)}
                      className="group cursor-pointer transition-colors hover:bg-muted/40"
                    >
                      {/* شاگرد */}
                      <td className="px-4 py-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-sm font-bold text-white shadow-sm">
                            {item.studentAvatar}
                          </span>
                          <div>
                            <span className="block font-semibold group-hover:text-primary transition-colors">
                              {item.studentName}
                            </span>
                            <span className="block text-xs text-muted-foreground">
                              {item.studentClass}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* نوع ارزیابی */}
                      <td className="px-4 py-4">
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-accent/60 px-2.5 py-1 text-xs font-medium text-foreground">
                          {item.type}
                        </span>
                      </td>

                      {/* کمربند */}
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${beltStyle.bg} ${beltStyle.text} ${beltStyle.border}`}
                        >
                          <span className={`size-1.5 rounded-full ${beltStyle.dot}`} />
                          {item.belt}
                        </span>
                      </td>

                      {/* امتیاز */}
                      <td className="px-4 py-4">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold">{fa(item.score)}٪</span>
                            <span
                              className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold border ${scoreInterp.badgeClass}`}
                            >
                              {scoreInterp.label}
                            </span>
                          </div>
                          <div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
                            <div
                              className={`h-full rounded-full ${scoreInterp.barClass}`}
                              style={{ width: `${item.score}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* تاریخ */}
                      <td className="hidden px-4 py-4 text-xs text-muted-foreground md:table-cell">
                        {item.date}
                      </td>

                      {/* ارزیاب */}
                      <td className="hidden px-4 py-4 text-xs font-medium lg:table-cell">
                        {item.evaluator}
                      </td>

                      {/* وضعیت */}
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                            isPromotionReady
                              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                              : item.status === 'نیازمند توجه'
                              ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                              : item.status === 'در حال بررسی'
                              ? 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
                              : 'bg-accent text-accent-foreground'
                          }`}
                        >
                          {isPromotionReady && <Trophy className="size-3" />}
                          {item.status}
                        </span>
                      </td>

                      {/* عملیات */}
                      <td className="px-4 py-4 text-left">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedAssessmentDetail(item)
                          }}
                          className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
                        >
                          <span>مشاهده</span>
                          <ChevronLeft className="size-3.5" />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* CREATE ASSESSMENT WORKSPACE / MODAL */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-3 backdrop-blur-md sm:p-6 overflow-y-auto">
          <div
            className="relative flex max-h-[92vh] w-full max-w-5xl flex-col rounded-3xl border border-border bg-card shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            dir="rtl"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border bg-muted/20 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
                  <Award className="size-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">ارزیابی جدید</h2>
                  <p className="text-xs text-muted-foreground">
                    فرم ارزیابی تخصصی مهارت‌ها و آمادگی ارتقای کمربند
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="rounded-xl p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Modal Body - 2 Columns on Desktop */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
              <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
                {/* Left Column: Form Steps */}
                <div className="flex flex-col gap-6">
                  {/* STEP 1: SELECT STUDENT */}
                  <div className="rounded-2xl border border-border bg-card/60 p-4">
                    <label className="mb-2 block text-xs font-bold text-muted-foreground">
                      مرحله ۱ — انتخاب شاگرد
                    </label>

                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setIsStudentDropdownOpen(!isStudentDropdownOpen)}
                        className="flex w-full items-center justify-between rounded-xl border border-input bg-muted/40 p-3 text-right text-sm transition-all hover:border-primary"
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`flex size-10 items-center justify-center rounded-xl bg-gradient-to-br ${selectedStudent.avatarColor} text-sm font-bold text-white shadow-sm`}
                          >
                            {selectedStudent.avatar}
                          </span>
                          <div>
                            <span className="block font-bold">{selectedStudent.name}</span>
                            <span className="block text-xs text-muted-foreground">
                              کمربند {selectedStudent.belt} · {selectedStudent.className}
                            </span>
                          </div>
                        </div>
                        <ChevronDown className="size-4 text-muted-foreground" />
                      </button>

                      {/* Dropdown list */}
                      {isStudentDropdownOpen && (
                        <div className="absolute top-full right-0 z-30 mt-2 w-full rounded-2xl border border-border bg-popover p-2 shadow-2xl">
                          <div className="relative mb-2">
                            <Search className="absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                            <input
                              type="text"
                              value={studentSearchInModal}
                              onChange={(e) => setStudentSearchInModal(e.target.value)}
                              placeholder="نام شاگرد را جستجو کنید..."
                              className="w-full rounded-lg border border-input bg-muted/40 py-1.5 pr-8 pl-3 text-xs outline-none focus:border-primary"
                            />
                          </div>
                          <div className="max-h-56 overflow-y-auto space-y-1">
                            {ASSESSABLE_STUDENTS.filter(
                              (s) =>
                                !studentSearchInModal ||
                                s.name.includes(studentSearchInModal) ||
                                s.className.includes(studentSearchInModal)
                            ).map((student) => (
                              <button
                                key={student.id}
                                type="button"
                                onClick={() => handleStudentSelect(student)}
                                className={`flex w-full items-center gap-3 rounded-xl p-2 text-right text-xs transition-colors hover:bg-muted ${
                                  selectedStudent.id === student.id ? 'bg-accent text-primary' : ''
                                }`}
                              >
                                <span
                                  className={`flex size-8 items-center justify-center rounded-lg bg-gradient-to-br ${student.avatarColor} text-xs font-bold text-white`}
                                >
                                  {student.avatar}
                                </span>
                                <div className="flex-1">
                                  <span className="block font-semibold">{student.name}</span>
                                  <span className="block text-[11px] text-muted-foreground">
                                    کمربند {student.belt} · {student.className}
                                  </span>
                                </div>
                                {selectedStudent.id === student.id && (
                                  <CheckCircle2 className="size-4 text-primary" />
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* STEP 2: ASSESSMENT TYPE */}
                  <div className="rounded-2xl border border-border bg-card/60 p-4">
                    <label className="mb-2 block text-xs font-bold text-muted-foreground">
                      مرحله ۲ — نوع ارزیابی
                    </label>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {[
                        { id: 'ارزیابی کمربند', label: 'ارزیابی کمربند', icon: Award },
                        { id: 'ارزیابی فنی', label: 'ارزیابی فنی', icon: Target },
                        { id: 'ارزیابی مبارزه', label: 'ارزیابی مبارزه', icon: Swords },
                        { id: 'ارزیابی آمادگی جسمانی', label: 'ارزیابی آمادگی جسمانی', icon: Zap },
                      ].map((item) => {
                        const Icon = item.icon
                        const isSelected = assessmentType === item.id
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setAssessmentType(item.id as AssessmentType)}
                            className={`flex flex-col items-center justify-center gap-2 rounded-xl border p-3 text-center transition-all ${
                              isSelected
                                ? 'border-primary bg-accent/70 text-primary shadow-sm ring-1 ring-primary'
                                : 'border-border bg-muted/20 text-muted-foreground hover:bg-muted hover:text-foreground'
                            }`}
                          >
                            <Icon className="size-5" />
                            <span className="text-xs font-semibold">{item.label}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* STEP 3: BELT PROGRESSION BANNER */}
                  <div className="rounded-2xl border border-border bg-card/60 p-4">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-muted-foreground">
                        مرحله ۳ — مسیر ارتقای کمربند
                      </label>
                      <span className="text-xs text-primary font-semibold">
                        آمادگی: {fa(liveMetrics.beltReadiness)}٪
                      </span>
                    </div>

                    <div className="mt-3 flex items-center justify-around rounded-xl border border-primary/20 bg-accent/20 p-3">
                      <div className="text-center">
                        <span className="block text-[11px] text-muted-foreground">کمربند فعلی</span>
                        <span
                          className={`mt-1 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${
                            BELT_STYLES[selectedStudent.belt]?.bg || ''
                          } ${BELT_STYLES[selectedStudent.belt]?.text || ''} ${
                            BELT_STYLES[selectedStudent.belt]?.border || ''
                          }`}
                        >
                          <span
                            className={`size-2 rounded-full ${
                              BELT_STYLES[selectedStudent.belt]?.dot || ''
                            }`}
                          />
                          {selectedStudent.belt}
                        </span>
                      </div>

                      <div className="flex flex-col items-center justify-center px-4">
                        <ChevronLeft className="size-6 text-primary animate-pulse" />
                        <span className="text-[10px] text-muted-foreground">مسیر آزمون</span>
                      </div>

                      <div className="text-center">
                        <span className="block text-[11px] text-muted-foreground">کمربند هدف</span>
                        <span
                          className={`mt-1 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${
                            BELT_STYLES[selectedStudent.nextBelt]?.bg || ''
                          } ${BELT_STYLES[selectedStudent.nextBelt]?.text || ''} ${
                            BELT_STYLES[selectedStudent.nextBelt]?.border || ''
                          }`}
                        >
                          <span
                            className={`size-2 rounded-full ${
                              BELT_STYLES[selectedStudent.nextBelt]?.dot || ''
                            }`}
                          />
                          {selectedStudent.nextBelt}
                        </span>
                      </div>
                    </div>

                    <div className="mt-2.5 flex items-center justify-end">
                      <Link
                        href="/progression"
                        target="_blank"
                        className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline font-semibold"
                      >
                        <span>مشاهده نقشه راه و الزامات کمربندها</span>
                        <ChevronLeft className="size-3" />
                      </Link>
                    </div>
                  </div>

                  {/* STEP 4: SKILL CATEGORIES & SCORES */}
                  <div className="rounded-2xl border border-border bg-card/60 p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <label className="text-xs font-bold text-muted-foreground">
                        مرحله ۴ — امتیازدهی به مهارت‌ها
                      </label>
                      <span className="text-xs text-muted-foreground">
                        نمره از ۰ تا ۱۰۰ (اسلایدر یا دکمه‌های سریع)
                      </span>
                    </div>

                    {/* Category Tabs */}
                    <div className="mb-4 grid grid-cols-2 gap-1.5 rounded-xl border border-border bg-muted/40 p-1 sm:grid-cols-4">
                      {ASSESSMENT_CATEGORIES.map((cat) => {
                        const isTabActive = activeCategoryTab === cat.name
                        const avg = liveMetrics.categoryAverages[cat.name]
                        return (
                          <button
                            key={cat.name}
                            type="button"
                            onClick={() => setActiveCategoryTab(cat.name)}
                            className={`flex items-center justify-between rounded-lg px-3 py-2 text-xs transition-all ${
                              isTabActive
                                ? 'bg-card text-foreground font-bold shadow-sm'
                                : 'text-muted-foreground hover:bg-muted/60'
                            }`}
                          >
                            <span>{cat.name}</span>
                            <span
                              className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                                avg >= 85
                                  ? 'bg-emerald-500/20 text-emerald-300'
                                  : avg < 70
                                  ? 'bg-amber-500/20 text-amber-300'
                                  : 'bg-primary/20 text-primary'
                              }`}
                            >
                              {fa(avg)}٪
                            </span>
                          </button>
                        )
                      })}
                    </div>

                    {/* Skills list for the active category */}
                    <div className="space-y-4">
                      {currentSkills
                        .filter((s) => s.category === activeCategoryTab)
                        .map((skill) => {
                          const interp = getScoreInterpretation(skill.score)
                          const presets = [0, 20, 40, 60, 80, 100]

                          return (
                            <div
                              key={skill.name}
                              className="flex flex-col gap-2.5 rounded-xl border border-border bg-card p-3.5 transition-colors hover:border-primary/40"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-sm">{skill.name}</span>
                                  <span
                                    className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${interp.badgeClass}`}
                                  >
                                    {interp.label}
                                  </span>
                                </div>

                                <div className="flex items-center gap-2">
                                  <span className="text-base font-bold text-foreground">
                                    {fa(skill.score)}٪
                                  </span>
                                </div>
                              </div>

                              {/* Progress bar visual indicator */}
                              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                                <div
                                  className={`h-full rounded-full transition-all duration-300 ${interp.barClass}`}
                                  style={{ width: `${skill.score}%` }}
                                />
                              </div>

                              {/* Slider + Segmented Presets */}
                              <div className="flex flex-col gap-2 pt-1 sm:flex-row sm:items-center">
                                <input
                                  type="range"
                                  min="0"
                                  max="100"
                                  step="1"
                                  value={skill.score}
                                  onChange={(e) =>
                                    handleScoreChange(skill.name, parseInt(e.target.value, 10))
                                  }
                                  className="flex-1 accent-primary cursor-pointer"
                                />

                                {/* Segmented Score Control */}
                                <div className="flex items-center justify-between gap-1 sm:justify-start">
                                  {presets.map((scorePreset) => (
                                    <button
                                      key={scorePreset}
                                      type="button"
                                      onClick={() => handleScoreChange(skill.name, scorePreset)}
                                      className={`rounded-lg px-2 py-1 text-[11px] font-medium transition-all ${
                                        skill.score === scorePreset
                                          ? 'bg-primary text-primary-foreground font-bold shadow-sm'
                                          : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
                                      }`}
                                    >
                                      {fa(scorePreset)}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )
                        })}
                    </div>
                  </div>

                  {/* COACH NOTES */}
                  <div className="rounded-2xl border border-border bg-card/60 p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <label className="text-xs font-bold text-muted-foreground">
                        یادداشت مربی
                      </label>
                      <span className="text-[11px] text-muted-foreground">
                        پیشنهادهای سریع را کلیک کنید
                      </span>
                    </div>

                    {/* Quick Preset Tags */}
                    <div className="mb-3 flex flex-wrap gap-1.5">
                      {[
                        'سرعت و چابکی عالی',
                        'نیازمند تقویت گارد دفاعی',
                        'تعادل در ضربات چاگی عالی',
                        'تمرکز بیشتر روی فرم تایگوک',
                        'آمادگی کامل برای کمربند بعدی',
                      ].map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => handleAddNoteTag(tag)}
                          className="rounded-lg border border-border bg-muted/40 px-2.5 py-1 text-[11px] text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors"
                        >
                          + {tag}
                        </button>
                      ))}
                    </div>

                    <textarea
                      rows={3}
                      value={coachNotes}
                      onChange={(e) => setCoachNotes(e.target.value)}
                      placeholder="نکات مهم این ارزیابی را بنویسید..."
                      className="w-full rounded-xl border border-input bg-muted/30 p-3 text-xs outline-none transition-all focus:border-primary focus:bg-background placeholder:text-muted-foreground"
                    />
                  </div>
                </div>

                {/* Right Column: Live Calculated Dashboard & Recommendations */}
                <div className="flex flex-col gap-6">
                  {/* Overall Score Box */}
                  <div className="flex flex-col items-center justify-center rounded-2xl border border-primary/30 bg-gradient-to-b from-accent/40 to-card p-6 text-center shadow-lg">
                    <span className="text-xs font-semibold text-muted-foreground">
                      امتیاز کلی ارزیابی
                    </span>
                    <div className="mt-3 flex size-28 items-center justify-center rounded-full border-4 border-primary/30 bg-background/80 shadow-inner">
                      <span className="text-3xl font-black text-primary">
                        {fa(liveMetrics.overallScore)}٪
                      </span>
                    </div>
                    <span
                      className={`mt-3 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${
                        getScoreInterpretation(liveMetrics.overallScore).badgeClass
                      }`}
                    >
                      {getScoreInterpretation(liveMetrics.overallScore).label}
                    </span>
                  </div>

                  {/* Category Summary Scores */}
                  <div className="rounded-2xl border border-border bg-card p-5">
                    <h3 className="text-sm font-bold">میانگین دسته‌ها</h3>
                    <div className="mt-4 flex flex-col gap-3">
                      {ASSESSMENT_CATEGORIES.map((cat) => {
                        const score = liveMetrics.categoryAverages[cat.name]
                        const interp = getScoreInterpretation(score)
                        return (
                          <div key={cat.name} className="flex flex-col gap-1.5">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-semibold">{cat.name}</span>
                              <span className="font-bold text-foreground">{fa(score)}٪</span>
                            </div>
                            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                              <div
                                className={`h-full rounded-full transition-all duration-300 ${interp.barClass}`}
                                style={{ width: `${score}%` }}
                              />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* RECOMMENDATIONS (FOCUS ON LOWEST 3 SKILLS) */}
                  <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5">
                    <div className="flex items-center gap-2 text-amber-300">
                      <Sparkles className="size-5" />
                      <h3 className="font-bold text-sm">تمرکز پیشنهادی</h3>
                    </div>
                    <p className="mt-2 text-xs leading-6 text-amber-200/90">
                      {liveMetrics.recommendations.text}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {liveMetrics.recommendations.focusSkills.map((skillName) => (
                        <span
                          key={skillName}
                          className="rounded-lg border border-amber-500/30 bg-amber-500/20 px-2.5 py-1 text-xs font-bold text-amber-300"
                        >
                          {skillName}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* TOP STRENGTHS */}
                  <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5">
                    <div className="flex items-center gap-2 text-emerald-300">
                      <CheckCircle2 className="size-5" />
                      <h3 className="font-bold text-sm">نقاط قوت شاگرد</h3>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {liveMetrics.recommendations.strengths.map((skillName) => (
                        <span
                          key={skillName}
                          className="rounded-lg border border-emerald-500/30 bg-emerald-500/20 px-2.5 py-1 text-xs font-bold text-emerald-300"
                        >
                          {skillName}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between border-t border-border bg-muted/30 px-6 py-4">
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="rounded-xl border border-border px-5 py-2.5 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                انصراف
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleSaveAssessment}
                  className="flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-xs font-bold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90"
                >
                  <CheckCircle2 className="size-4" />
                  <span>ثبت ارزیابی</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ASSESSMENT DETAIL MODAL / VIEW */}
      {selectedAssessmentDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-3 backdrop-blur-md sm:p-6 overflow-y-auto">
          <div
            className="relative flex max-h-[92vh] w-full max-w-4xl flex-col rounded-3xl border border-border bg-card shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            dir="rtl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border bg-muted/20 px-6 py-4">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-sm font-bold text-white shadow-sm">
                  {selectedAssessmentDetail.studentAvatar}
                </span>
                <div>
                  <h2 className="text-lg font-bold">{selectedAssessmentDetail.studentName}</h2>
                  <p className="text-xs text-muted-foreground">
                    {selectedAssessmentDetail.studentClass} · {selectedAssessmentDetail.date}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="hidden sm:flex items-center gap-1.5 rounded-xl border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <Printer className="size-3.5" />
                  <span>چاپ کارنامه</span>
                </button>
                <button
                  onClick={() => setSelectedAssessmentDetail(null)}
                  className="rounded-xl p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <X className="size-5" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-thin space-y-6">
              {/* Overall Summary Card */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="flex flex-col justify-center rounded-2xl border border-primary/30 bg-accent/30 p-5">
                  <span className="text-xs text-muted-foreground">امتیاز نهایی ارزیابی</span>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-3xl font-black text-primary">
                      {fa(selectedAssessmentDetail.score)}٪
                    </span>
                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ${
                        getScoreInterpretation(selectedAssessmentDetail.score).badgeClass
                      }`}
                    >
                      {getScoreInterpretation(selectedAssessmentDetail.score).label}
                    </span>
                  </div>
                  <span className="mt-2 text-xs text-muted-foreground">
                    نوع ارزیابی: {selectedAssessmentDetail.type}
                  </span>
                </div>

                <div className="flex flex-col justify-center rounded-2xl border border-border bg-card p-5">
                  <span className="text-xs text-muted-foreground">مسیر کمربند</span>
                  <div className="mt-2 flex items-center gap-2 font-bold">
                    <span>کمربند {selectedAssessmentDetail.belt}</span>
                    <ChevronLeft className="size-4 text-primary" />
                    <span className="text-primary">{selectedAssessmentDetail.targetBelt}</span>
                  </div>
                  <span className="mt-2 text-xs text-emerald-400 font-medium">
                    آمادگی ارتقا: {fa(selectedAssessmentDetail.beltReadiness)}٪
                  </span>
                </div>

                <div className="flex flex-col justify-center rounded-2xl border border-border bg-card p-5">
                  <span className="text-xs text-muted-foreground">ارزیاب و تاریخ</span>
                  <p className="mt-2 font-bold">{selectedAssessmentDetail.evaluator}</p>
                  <span className="mt-2 text-xs text-muted-foreground">
                    {selectedAssessmentDetail.date}
                  </span>
                </div>
              </div>

              {/* Category Breakdown */}
              <div className="rounded-2xl border border-border bg-card p-5">
                <h3 className="text-sm font-bold">خلاصه امتیازات در ۴ بخش اصلی</h3>
                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {Object.entries(selectedAssessmentDetail.categoryScores).map(([catName, score]) => {
                    const interp = getScoreInterpretation(score)
                    return (
                      <div key={catName} className="rounded-xl border border-border/80 bg-muted/20 p-3.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold">{catName}</span>
                          <span className="font-bold text-foreground">{fa(score)}٪</span>
                        </div>
                        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                          <div
                            className={`h-full rounded-full ${interp.barClass}`}
                            style={{ width: `${score}%` }}
                          />
                        </div>
                        <span className={`mt-2 block text-[10px] font-medium ${interp.textClass}`}>
                          {interp.label}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* All Skills Matrix */}
              <div className="rounded-2xl border border-border bg-card p-5">
                <h3 className="text-sm font-bold">ریز نمرات مهارت‌ها</h3>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {selectedAssessmentDetail.skills.map((skill) => {
                    const interp = getScoreInterpretation(skill.score)
                    return (
                      <div
                        key={skill.name}
                        className="flex items-center justify-between rounded-xl border border-border bg-muted/20 p-3"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold">{skill.name}</span>
                            <span className="text-[10px] text-muted-foreground">({skill.category})</span>
                          </div>
                          <span className={`text-[10px] font-semibold ${interp.textClass}`}>
                            {interp.label}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted sm:w-20">
                            <div
                              className={`h-full rounded-full ${interp.barClass}`}
                              style={{ width: `${skill.score}%` }}
                            />
                          </div>
                          <span className="text-xs font-bold">{fa(skill.score)}٪</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Coach Notes */}
              <div className="rounded-2xl border border-border bg-card p-5">
                <h3 className="text-sm font-bold">یادداشت مربی</h3>
                <p className="mt-2 rounded-xl bg-muted/40 p-4 text-xs leading-7 text-muted-foreground">
                  {selectedAssessmentDetail.notes}
                </p>
              </div>

              {/* Focus Recommendations & Strengths */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4">
                  <div className="flex items-center gap-2 text-amber-300">
                    <Sparkles className="size-4" />
                    <h4 className="text-xs font-bold">تمرکز پیشنهادی برای جلسات بعد</h4>
                  </div>
                  <p className="mt-1 text-[11px] text-amber-200/80">
                    {selectedAssessmentDetail.recommendations.text}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {selectedAssessmentDetail.recommendations.focusSkills.map((s) => (
                      <span
                        key={s}
                        className="rounded-lg border border-amber-500/30 bg-amber-500/20 px-2 py-0.5 text-xs font-bold text-amber-300"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                  <div className="flex items-center gap-2 text-emerald-300">
                    <CheckCircle2 className="size-4" />
                    <h4 className="text-xs font-bold">نقاط قوت برجسته</h4>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {selectedAssessmentDetail.recommendations.strengths.map((s) => (
                      <span
                        key={s}
                        className="rounded-lg border border-emerald-500/30 bg-emerald-500/20 px-2 py-0.5 text-xs font-bold text-emerald-300"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-border bg-muted/20 px-6 py-4">
              <Link
                href={`/students/${selectedAssessmentDetail.studentId}`}
                className="text-xs text-primary hover:underline font-semibold"
              >
                مشاهده پروفایل کامل شاگرد ←
              </Link>

              <button
                onClick={() => setSelectedAssessmentDetail(null)}
                className="rounded-xl bg-primary px-5 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90"
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
