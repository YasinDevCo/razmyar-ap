'use client'

import React, { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import {
  AlertCircle,
  AlertTriangle,
  Award,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Dumbbell,
  Edit3,
  ExternalLink,
  Flame,
  Info,
  Layers,
  Medal,
  Plus,
  RotateCcw,
  Settings,
  Shield,
  Sparkles,
  Swords,
  Target,
  Trash2,
  Trophy,
  Users,
  X,
  Zap,
} from 'lucide-react'
import { fa } from '@/lib/razmyar-domain'
import {
  BeltLevelConfig,
  BeltRequirementItem,
  DEFAULT_TAEKWONDO_BELTS,
  DISCIPLINES,
  getReadinessLevel,
  MartialArtDiscipline,
  PROGRESSION_STUDENTS,
  StudentProgressionProfile,
} from '@/lib/razmyar-progression'
import { api } from '@/lib/api'

export function ProgressionModule() {
  // State
  const [disciplines, setDisciplines] = useState<MartialArtDiscipline[]>(DISCIPLINES)
  const [activeDisciplineId, setActiveDisciplineId] = useState<string>('taekwondo')
  const [belts, setBelts] = useState<BeltLevelConfig[]>(DEFAULT_TAEKWONDO_BELTS)
  const [selectedBelt, setSelectedBelt] = useState<BeltLevelConfig>(DEFAULT_TAEKWONDO_BELTS[4]) // Default to Red belt inspection
  const [selectedStudent, setSelectedStudent] = useState<StudentProgressionProfile>(
    PROGRESSION_STUDENTS[0] // Ali Rezaei
  )
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [expandedCategory, setExpandedCategory] = useState<string | null>('تکنیک‌ها')

  // Load from API on mount
  useEffect(() => {
    async function loadProgression() {
      const dbBelts = await api.progression.getBelts(activeDisciplineId)
      if (dbBelts && dbBelts.length > 0) {
        setBelts(dbBelts)
        setEditableBelts(dbBelts)
      }
    }
    loadProgression()
  }, [activeDisciplineId])

  // Settings form state
  const [editableBelts, setEditableBelts] = useState<BeltLevelConfig[]>(DEFAULT_TAEKWONDO_BELTS)
  const [newBeltName, setNewBeltName] = useState('')
  const [newBeltMinScore, setNewBeltMinScore] = useState(75)

  // Current active discipline
  const activeDiscipline = useMemo(
    () => disciplines.find((d) => d.id === activeDisciplineId) || disciplines[0],
    [disciplines, activeDisciplineId]
  )

  // Handle student selection from readiness list
  const handleSelectStudent = (student: StudentProgressionProfile) => {
    setSelectedStudent(student)
    // Find student's target belt
    const target = belts.find((b) => b.name === student.targetBelt)
    if (target) {
      setSelectedBelt(target)
    }
  }

  // Handle saving belt settings
  const handleSaveSettings = async () => {
    setBelts([...editableBelts])
    setIsSettingsOpen(false)
    await api.progression.updateBelts(editableBelts)
    setToastMessage('تنظیمات کمربندها با موفقیت ذخیره شد.')
    setTimeout(() => setToastMessage(null), 4000)
  }

  // Handle adding a new belt level
  const handleAddNewBelt = () => {
    if (!newBeltName.trim()) return
    const newBelt: BeltLevelConfig = {
      id: `belt-${Date.now()}`,
      name: newBeltName.trim(),
      order: editableBelts.length + 1,
      color: '#3b82f6',
      bgColor: 'bg-blue-500/15',
      textColor: 'text-blue-300',
      borderColor: 'border-blue-500/30',
      dotColor: 'bg-blue-400',
      minimumOverallScore: newBeltMinScore,
      studentCount: 0,
      nearPromotionCount: 0,
      categoryRequirements: [
        { category: 'تکنیک‌ها', minimumScore: newBeltMinScore },
        { category: 'فرم', minimumScore: newBeltMinScore },
        { category: 'مبارزه', minimumScore: newBeltMinScore - 5 },
        { category: 'آمادگی جسمانی', minimumScore: newBeltMinScore - 5 },
      ],
      skillRequirements: [
        { id: `sk-${Date.now()}-1`, category: 'تکنیک‌ها', name: 'تکنیک‌های پایه', minimumScore: newBeltMinScore },
        { id: `sk-${Date.now()}-2`, category: 'فرم', name: 'فرم استاندارد', minimumScore: newBeltMinScore },
      ],
    }
    setEditableBelts([...editableBelts, newBelt])
    setNewBeltName('')
  }

  // Handle switching discipline
  const handleSwitchDiscipline = (dispId: string) => {
    setActiveDisciplineId(dispId)
    const found = disciplines.find((d) => d.id === dispId)
    if (found) {
      setBelts(found.belts)
      setEditableBelts(found.belts)
      setSelectedBelt(found.belts[Math.min(4, found.belts.length - 1)])
    }
  }

  const studentReadiness = getReadinessLevel(selectedStudent.readinessScore)

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6" dir="rtl">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-950/95 px-5 py-4 text-emerald-200 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="size-5 text-emerald-400" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* PAGE HEADER */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-primary">
            <Award className="size-4" />
            <span>سیستم پیشرفت و آزمون کمربند</span>
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">پیشرفت کمربند</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            مدیریت مسیر پیشرفت و آمادگی شاگردان برای ارتقا
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Discipline Switcher */}
          <div className="flex items-center rounded-xl border border-border bg-card p-1">
            {disciplines.map((d) => (
              <button
                key={d.id}
                onClick={() => handleSwitchDiscipline(d.id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  activeDisciplineId === d.id
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {d.name}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              setEditableBelts([...belts])
              setIsSettingsOpen(true)
            }}
            className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-bold text-foreground hover:border-primary/50 hover:bg-muted transition-all"
          >
            <Settings className="size-4 text-primary" />
            <span>تنظیمات کمربندها</span>
          </button>
        </div>
      </div>

      {/* BELT ROADMAP (HORIZONTAL ON DESKTOP, VERTICAL ON MOBILE) */}
      <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-base font-bold">نقشه راه ارتقای کمربندها</h2>
            <p className="text-xs text-muted-foreground">
              مسیر پیشرفت برای شاگرد انتخابی:{' '}
              <b className="text-foreground">{selectedStudent.name}</b> (کمربند فعلی:{' '}
              <span className="text-primary">{selectedStudent.currentBelt}</span> ← هدف:{' '}
              <span className="text-primary">{selectedStudent.targetBelt}</span>)
            </p>
          </div>
          <span className="text-xs text-muted-foreground">
            برای بررسی شرایط روی هر کمربند کلیک کنید
          </span>
        </div>

        {/* Roadmap Items */}
        <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-2">
          {belts.map((belt, idx) => {
            const isSelected = selectedBelt.id === belt.id
            const isStudentCurrent = selectedStudent.currentBelt === belt.name
            const isStudentTarget = selectedStudent.targetBelt === belt.name

            return (
              <React.Fragment key={belt.id}>
                <button
                  type="button"
                  onClick={() => setSelectedBelt(belt)}
                  className={`group relative flex flex-1 flex-col items-center justify-center rounded-2xl border p-4 text-center transition-all ${
                    isSelected
                      ? 'border-primary bg-accent/40 shadow-md ring-2 ring-primary/40'
                      : 'border-border bg-muted/20 hover:border-primary/40 hover:bg-muted/40'
                  }`}
                >
                  {/* Indicator badging */}
                  {isStudentCurrent && (
                    <span className="absolute -top-2.5 rounded-full bg-blue-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
                      کمربند فعلی
                    </span>
                  )}
                  {isStudentTarget && (
                    <span className="absolute -top-2.5 rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm animate-pulse">
                      هدف ارتقا
                    </span>
                  )}

                  {/* Belt Visual */}
                  <div
                    className="flex h-3 w-16 items-center justify-center rounded-full shadow-inner"
                    style={{ backgroundColor: belt.color }}
                  />

                  <h3 className="mt-3 text-sm font-bold text-foreground">{belt.name}</h3>
                  <span className="mt-1 text-[11px] text-muted-foreground">
                    مرحله {fa(belt.order)} · {fa(belt.studentCount)} شاگرد
                  </span>

                  <span className="mt-2 text-[10px] font-semibold text-primary">
                    حداقل {fa(belt.minimumOverallScore)}٪
                  </span>
                </button>

                {idx < belts.length - 1 && (
                  <div className="hidden shrink-0 items-center justify-center md:flex">
                    <ChevronLeft className="size-5 text-muted-foreground" />
                  </div>
                )}
              </React.Fragment>
            )
          })}
        </div>
      </section>

      {/* BELT OVERVIEW CARDS */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {belts.map((b) => (
          <div
            key={b.id}
            onClick={() => setSelectedBelt(b)}
            className={`cursor-pointer rounded-2xl border p-4 transition-all ${
              selectedBelt.id === b.id
                ? 'border-primary bg-accent/30 shadow-md'
                : 'border-border bg-card hover:border-primary/40'
            }`}
          >
            <div className="flex items-center justify-between">
              <span
                className={`size-3 rounded-full shadow-sm`}
                style={{ backgroundColor: b.color }}
              />
              <span className="text-[10px] font-medium text-muted-foreground">
                سطح {fa(b.order)}
              </span>
            </div>
            <h4 className="mt-2 font-bold text-sm">{b.name}</h4>
            <p className="mt-1 text-xs text-muted-foreground">{fa(b.studentCount)} شاگرد</p>
            {b.nearPromotionCount > 0 ? (
              <span className="mt-2 block text-[10px] font-semibold text-emerald-400">
                {fa(b.nearPromotionCount)} نفر نزدیک به ارتقا
              </span>
            ) : (
              <span className="mt-2 block text-[10px] text-muted-foreground">
                بدون متقاضی آماده
              </span>
            )}
          </div>
        ))}
      </div>

      {/* STUDENT READINESS SECTION & PROMOTION WORKSPACE GRID */}
      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        {/* RIGHT COLUMN: STUDENT READINESS TABLE */}
        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold">شاگردان آماده ارتقا</h2>
              <p className="text-xs text-muted-foreground">
                شاگردانی که در آستانه آزمون کمربند بعدی قرار دارند
              </p>
            </div>
            <span className="rounded-xl bg-primary/15 px-3 py-1 text-xs font-bold text-primary">
              {fa(PROGRESSION_STUDENTS.length)} شاگرد
            </span>
          </div>

          <div className="mt-5 space-y-3">
            {PROGRESSION_STUDENTS.map((student) => {
              const rLevel = getReadinessLevel(student.readinessScore)
              const isSelected = selectedStudent.studentId === student.studentId

              return (
                <div
                  key={student.studentId}
                  onClick={() => handleSelectStudent(student)}
                  className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                    isSelected
                      ? 'border-primary bg-accent/40 shadow-md ring-1 ring-primary/40'
                      : 'border-border bg-muted/20 hover:border-primary/40 hover:bg-muted/40'
                  }`}
                >
                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    {/* Student Info */}
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex size-10 items-center justify-center rounded-xl bg-gradient-to-br ${student.avatarColor} text-sm font-bold text-white shadow-sm`}
                      >
                        {student.avatar}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-sm text-foreground">{student.name}</h3>
                          <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                            کمربند {student.currentBelt}
                          </span>
                        </div>
                        <span className="text-[11px] text-muted-foreground">
                          ضعف اصلی: {student.weakestCategory} · آخرین ارزیابی:{' '}
                          {student.lastAssessmentDate}
                        </span>
                      </div>
                    </div>

                    {/* Score & Action */}
                    <div className="flex items-center justify-between gap-3 sm:justify-end">
                      <div className="text-left">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-foreground">
                            {fa(student.readinessScore)}٪
                          </span>
                          <span
                            className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${rLevel.badgeClass}`}
                          >
                            {rLevel.level}
                          </span>
                        </div>
                        <div className="mt-1 h-1.5 w-24 overflow-hidden rounded-full bg-muted">
                          <div
                            className={`h-full rounded-full ${rLevel.barColor}`}
                            style={{ width: `${student.readinessScore}%` }}
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleSelectStudent(student)
                        }}
                        className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:border-primary hover:text-primary transition-colors"
                      >
                        مشاهده
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* LEFT COLUMN: SELECTED STUDENT PROMOTION READINESS CARD */}
        <div className="flex flex-col gap-6">
          {/* PROMOTION READINESS CARD */}
          <section className="rounded-3xl border border-primary/30 bg-gradient-to-br from-accent/30 via-card to-card p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-muted-foreground">
                  آمادگی ارتقای {selectedStudent.name}
                </span>
                <h2 className="mt-1 text-lg font-bold">آمادگی ارتقا</h2>
              </div>
              <span
                className={`rounded-full border px-3 py-1 text-xs font-bold ${studentReadiness.badgeClass}`}
              >
                {studentReadiness.level}
              </span>
            </div>

            <div className="mt-4 flex items-center justify-between rounded-2xl border border-border bg-card/80 p-4">
              <div className="text-center">
                <span className="text-[11px] text-muted-foreground">کمربند فعلی</span>
                <p className="mt-1 text-sm font-bold text-foreground">
                  {selectedStudent.currentBelt}
                </p>
              </div>

              <div className="flex flex-col items-center">
                <span className="text-2xl font-black text-primary">
                  {fa(selectedStudent.readinessScore)}٪
                </span>
                <span className="text-[10px] text-muted-foreground">میانگین امتیاز</span>
              </div>

              <div className="text-center">
                <span className="text-[11px] text-muted-foreground">کمربند هدف</span>
                <p className="mt-1 text-sm font-bold text-primary">
                  {selectedStudent.targetBelt}
                </p>
              </div>
            </div>

            {/* 3 Items Requiring Practice */}
            <div className="mt-5">
              <span className="text-xs font-bold text-amber-300">
                ۳ مورد نیازمند تمرین برای ارتقا:
              </span>
              <div className="mt-2 space-y-2">
                {selectedStudent.weakSkills.map((ws) => (
                  <div
                    key={ws.name}
                    className="flex items-center justify-between rounded-xl border border-amber-500/20 bg-amber-500/10 px-3.5 py-2 text-xs"
                  >
                    <span className="font-semibold text-foreground">{ws.name}</span>
                    <span className="font-bold text-amber-300">{fa(ws.score)}٪</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <Link
              href={`/assessments?student=${selectedStudent.studentId}&new=true`}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-xs font-bold text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90 transition-all"
            >
              <Award className="size-4" />
              <span>شروع ارزیابی نهایی</span>
            </Link>
          </section>

          {/* PROMOTION HISTORY */}
          <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold">سوابق ارتقای کمربند {selectedStudent.name}</h2>
              <Clock className="size-4 text-muted-foreground" />
            </div>

            <div className="mt-4 divide-y divide-border">
              {selectedStudent.promotionHistory.map((hist, i) => (
                <div key={hist.beltName} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-2.5">
                    <span className="size-2 rounded-full bg-primary" />
                    <div>
                      <h4 className="text-xs font-bold text-foreground">{hist.beltName}</h4>
                      <span className="text-[10px] text-muted-foreground">
                        ثبت شده توسط {hist.evaluator || 'مربی امینی'}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{hist.date}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* BELT REQUIREMENTS COMPARISON (EXPANDABLE DETAIL) */}
      <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-3 border-b border-border pb-5 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <Shield className="size-5 text-primary" />
              <h2 className="text-base font-bold">
                الزامات و شرایط آزمون کمربند «{selectedBelt.name}»
              </h2>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              شاگرد برای ارتقا باید حداقل امتیاز مورد نیاز در بخش‌های اصلی را کسب کند.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-muted-foreground">
              حداقل میانگین کل:
            </span>
            <span className="rounded-lg bg-primary/15 px-3 py-1 text-xs font-bold text-primary">
              {fa(selectedBelt.minimumOverallScore)}٪
            </span>
          </div>
        </div>

        {/* Category Requirements Summary */}
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {selectedBelt.categoryRequirements.map((cat) => {
            const studentCatScore =
              selectedStudent.studentCategoryScores[cat.category] || 75
            const isMet = studentCatScore >= cat.minimumScore

            return (
              <div
                key={cat.category}
                className="flex flex-col justify-between rounded-2xl border border-border bg-muted/20 p-4"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold">{cat.category}</span>
                  <span className="text-muted-foreground">
                    حداقل: {fa(cat.minimumScore)}٪
                  </span>
                </div>

                <div className="mt-3">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground">نمره شاگرد:</span>
                    <b className={isMet ? 'text-emerald-400' : 'text-amber-400'}>
                      {fa(studentCatScore)}٪
                    </b>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full ${
                        isMet ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${studentCatScore}%` }}
                    />
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-1.5 text-[10px]">
                  {isMet ? (
                    <>
                      <CheckCircle2 className="size-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-semibold">تکمیل شده</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="size-3.5 text-amber-400" />
                      <span className="text-amber-400 font-semibold">نیازمند تمرین</span>
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Individual Skill Requirements Detail */}
        <div className="mt-6 space-y-3">
          <h3 className="text-sm font-bold">ریز مهارت‌های مورد آزمون</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {selectedBelt.skillRequirements.map((sk) => {
              const studentSkillScore =
                selectedStudent.studentSkillScores[sk.name] ||
                (sk.name.includes('آپ چاگی') ? 92 : 75)
              const isMet = studentSkillScore >= sk.minimumScore

              return (
                <div
                  key={sk.id}
                  className="flex items-center justify-between rounded-xl border border-border bg-muted/20 p-3.5"
                >
                  <div>
                    <h4 className="font-semibold text-xs text-foreground">{sk.name}</h4>
                    <span className="text-[10px] text-muted-foreground">
                      دسته: {sk.category} · حداقل امتیاز: {fa(sk.minimumScore)}٪
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-left">
                      <span className="text-xs font-bold text-foreground">
                        {fa(studentSkillScore)}٪
                      </span>
                    </div>
                    <span
                      className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${
                        isMet
                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                          : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                      }`}
                    >
                      {isMet ? 'تکمیل شده' : 'نیازمند تمرین'}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* BELT SETTINGS MODAL */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-3 backdrop-blur-md sm:p-6 overflow-y-auto">
          <div
            className="relative flex max-h-[92vh] w-full max-w-3xl flex-col rounded-3xl border border-border bg-card shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            dir="rtl"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border bg-muted/20 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
                  <Settings className="size-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">تنظیمات کمربندها و الزامات</h2>
                  <p className="text-xs text-muted-foreground">
                    سفارشی‌سازی نام، ترتیب و حداقل امتیاز مورد نیاز برای هر کمربند
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="rounded-xl p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-thin space-y-6">
              {/* Belts List Form */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-muted-foreground">لیست کمربندهای فعال</h3>
                {editableBelts.map((belt, index) => (
                  <div
                    key={belt.id}
                    className="flex flex-col gap-3 rounded-2xl border border-border bg-muted/20 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-muted-foreground">
                        #{fa(index + 1)}
                      </span>
                      <div
                        className="size-4 rounded-full"
                        style={{ backgroundColor: belt.color }}
                      />
                      <input
                        type="text"
                        value={belt.name}
                        onChange={(e) => {
                          const updated = editableBelts.map((b) =>
                            b.id === belt.id ? { ...b, name: e.target.value } : b
                          )
                          setEditableBelts(updated)
                        }}
                        className="rounded-lg border border-input bg-background px-2.5 py-1 text-xs font-bold outline-none focus:border-primary"
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 text-xs">
                        <span className="text-muted-foreground">حداقل امتیاز:</span>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={belt.minimumOverallScore}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10) || 0
                            const updated = editableBelts.map((b) =>
                              b.id === belt.id ? { ...b, minimumOverallScore: val } : b
                            )
                            setEditableBelts(updated)
                          }}
                          className="w-16 rounded-lg border border-input bg-background px-2 py-1 text-xs font-bold text-center outline-none focus:border-primary"
                        />
                        <span>٪</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (editableBelts.length <= 2) return
                          setEditableBelts(editableBelts.filter((b) => b.id !== belt.id))
                        }}
                        className="rounded-lg p-1 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Belt Input */}
              <div className="rounded-2xl border border-dashed border-border bg-muted/10 p-4">
                <h4 className="text-xs font-bold text-foreground">افزودن کمربند جدید</h4>
                <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
                  <input
                    type="text"
                    value={newBeltName}
                    onChange={(e) => setNewBeltName(e.target.value)}
                    placeholder="نام کمربند (مثال: بنفش، قهوه‌ای)..."
                    className="flex-1 rounded-xl border border-input bg-background px-3 py-2 text-xs outline-none focus:border-primary"
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">حداقل نمره:</span>
                    <input
                      type="number"
                      value={newBeltMinScore}
                      onChange={(e) => setNewBeltMinScore(parseInt(e.target.value, 10) || 70)}
                      className="w-16 rounded-xl border border-input bg-background px-2 py-2 text-xs text-center outline-none focus:border-primary font-bold"
                    />
                    <button
                      type="button"
                      onClick={handleAddNewBelt}
                      className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90"
                    >
                      + افزودن
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between border-t border-border bg-muted/30 px-6 py-4">
              <button
                type="button"
                onClick={() => setIsSettingsOpen(false)}
                className="rounded-xl border border-border px-5 py-2.5 text-xs font-semibold text-muted-foreground hover:bg-muted"
              >
                انصراف
              </button>

              <button
                type="button"
                onClick={handleSaveSettings}
                className="flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-xs font-bold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90"
              >
                <CheckCircle2 className="size-4" />
                <span>ذخیره تغییرات</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
