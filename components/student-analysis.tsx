'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Award,
  CalendarCheck,
  CheckCircle2,
  ChevronLeft,
  Clock,
  Dumbbell,
  Flame,
  Layers,
  Medal,
  Plus,
  Printer,
  Shield,
  Sparkles,
  Swords,
  Target,
  TrendingUp,
  Trophy,
  UserCheck,
  Zap,
} from 'lucide-react'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts'
import { aliRezaei, fa, students } from '@/lib/razmyar-domain'
import { generateStudentInsights, StudentAnalysisReport } from '@/lib/razmyar-intelligence'
import { BELT_STYLES } from '@/lib/razmyar-assessment'
import { api } from '@/lib/api'

interface StudentAnalysisProps {
  studentId?: string
}

export function StudentAnalysis({ studentId = '1024' }: StudentAnalysisProps) {
  // Find student or fallback to aliRezaei
  const currentStudent =
    students.find((s) => s.id === studentId || (studentId === 'ali-rezaei' && s.id === '1024')) ||
    aliRezaei

  const [insight, setInsight] = useState<StudentAnalysisReport>(() => generateStudentInsights(currentStudent))
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  useEffect(() => {
    async function loadAnalysis() {
      const normalizedId = studentId === 'ali-rezaei' ? '1024' : studentId
      const apiData = await api.students.getAnalysis(normalizedId)
      if (apiData) {
        setInsight(apiData)
      }
    }
    loadAnalysis()
  }, [studentId])

  const handleCreateTrainingPlan = () => {
    setToastMessage('برنامه تمرینی ایجاد شد.')
    setTimeout(() => {
      setToastMessage(null)
    }, 4000)
  }

  const beltStyle = BELT_STYLES[insight.belt] || BELT_STYLES['آبی']
  const targetBeltStyle = BELT_STYLES[insight.nextBelt] || BELT_STYLES['قرمز']

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6" dir="rtl">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-950/95 px-5 py-4 text-emerald-200 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="size-5 text-emerald-400" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* BACK NAVIGATION */}
      <div className="flex items-center justify-between">
        <Link
          href={`/students/${insight.studentId}`}
          className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowRight className="size-4" />
          <span>بازگشت به پروفایل شاگرد</span>
        </Link>
        <span className="text-xs text-muted-foreground">
          شاگردان / پروفایل / تحلیل هوشمند
        </span>
      </div>

      {/* PAGE HEADER & STUDENT BADGE */}
      <div className="flex flex-col justify-between gap-5 rounded-3xl border border-border bg-card p-6 shadow-sm md:flex-row md:items-center">
        <div className="flex items-center gap-4">
          <span className="flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-2xl font-bold text-white shadow-md">
            {insight.avatar}
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">{insight.studentName}</h1>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${beltStyle.bg} ${beltStyle.text} ${beltStyle.border}`}
              >
                <span className={`size-1.5 rounded-full ${beltStyle.dot}`} />
                کمربند {insight.belt}
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {insight.className} · {fa(insight.age)} سال · شماره شاگرد: {fa(Number(insight.studentId))}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/assessments?student=${insight.studentId}&new=true`}
            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-md shadow-primary/10 hover:bg-primary/90 transition-all"
          >
            <Plus className="size-4" />
            <span>ثبت ارزیابی جدید</span>
          </Link>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 rounded-xl border border-border bg-muted/40 px-3.5 py-2.5 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
          >
            <Printer className="size-4" />
            <span>چاپ گزارش</span>
          </button>
        </div>
      </div>

      {/* HERO INSIGHT CARD */}
      <section className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-accent/40 via-card to-card p-6 shadow-lg md:p-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="flex-1 space-y-3">
            {/* Subtle AI-style honest status badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Sparkles className="size-3.5" />
              <span>تحلیل بر اساس آخرین ارزیابی‌ها</span>
            </div>

            <div>
              <span className="text-xs font-medium text-muted-foreground">
                {insight.heroSummary.label}
              </span>
              <h2 className="mt-1 text-xl font-bold tracking-tight md:text-2xl text-foreground">
                {insight.heroSummary.status}
              </h2>
            </div>

            <p className="max-w-3xl text-sm leading-8 text-muted-foreground">
              {insight.heroSummary.text}
            </p>
          </div>

          {/* Main Score Gauge */}
          <div className="flex shrink-0 flex-col items-center justify-center rounded-2xl border border-primary/20 bg-card/80 p-5 shadow-inner">
            <div className="flex size-28 items-center justify-center rounded-full border-4 border-primary text-3xl font-black text-primary shadow-sm">
              {fa(insight.heroSummary.score)}٪
            </div>
            <span className="mt-3 text-xs font-bold text-muted-foreground">
              امتیاز میانگین عملکرد
            </span>
          </div>
        </div>
      </section>

      {/* STRENGTHS & WEAKNESSES GRID */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* STRENGTH ANALYSIS */}
        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400">
                <CheckCircle2 className="size-4" />
              </span>
              <h2 className="text-base font-bold text-emerald-300">نقاط قوت</h2>
            </div>
            <span className="text-xs text-muted-foreground">۳ مهارت با بالاترین امتیاز</span>
          </div>

          <div className="mt-5 flex flex-col gap-3.5">
            {insight.strengths.map((s) => (
              <div
                key={s.name}
                className="flex flex-col gap-2 rounded-2xl border border-border bg-muted/20 p-4 transition-colors hover:border-emerald-500/40"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-foreground">{s.name}</h3>
                    <span className="text-[11px] text-muted-foreground">
                      دسته: {s.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${s.badgeClass}`}
                    >
                      {s.status}
                    </span>
                    <b className="text-base font-bold text-foreground">{fa(s.score)}٪</b>
                  </div>
                </div>

                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                    style={{ width: `${s.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* WEAKNESS ANALYSIS */}
        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400">
                <AlertCircle className="size-4" />
              </span>
              <h2 className="text-base font-bold text-amber-300">نیازمند بهبود</h2>
            </div>
            <span className="text-xs text-muted-foreground">۳ مهارت نیازمند اولویت تمرینی</span>
          </div>

          <div className="mt-5 flex flex-col gap-3.5">
            {insight.weaknesses.map((w) => (
              <div
                key={w.name}
                className="flex flex-col gap-2 rounded-2xl border border-border bg-muted/20 p-4 transition-colors hover:border-amber-500/40"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-foreground">{w.name}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">{w.explanation}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${w.badgeClass}`}
                    >
                      {w.status}
                    </span>
                    <b className="text-base font-bold text-foreground">{fa(w.score)}٪</b>
                  </div>
                </div>

                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-amber-500 transition-all duration-500"
                    style={{ width: `${w.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* COACHING RECOMMENDATIONS */}
      <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <Target className="size-4" />
            </span>
            <h2 className="text-base font-bold">پیشنهادهای مربیگری</h2>
          </div>
          <span className="text-xs text-muted-foreground">راهکارهای عملی برای جلسات تمرین</span>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {insight.recommendations.map((rec) => (
            <div
              key={rec.id}
              className="flex flex-col justify-between rounded-2xl border border-border/80 bg-muted/20 p-5 transition-all hover:border-primary/40 hover:bg-muted/40"
            >
              <div>
                <span className="inline-flex rounded-lg bg-primary/15 px-2.5 py-1 text-[11px] font-bold text-primary">
                  پیشنهاد {fa(rec.id)}
                </span>
                <h3 className="mt-3 font-bold text-sm text-foreground">{rec.title}</h3>
                <p className="mt-2 text-xs leading-6 text-muted-foreground">{rec.text}</p>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <Shield className="size-3 text-primary" />
                <span>دسته: {rec.category}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TRAINING PLAN SECTION */}
      <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-400">
              <Dumbbell className="size-4" />
            </span>
            <div>
              <h2 className="text-base font-bold">{insight.trainingPlan.title}</h2>
              <p className="text-xs text-muted-foreground">
                برنامه ۳ جلسه‌ای هدفمند برای برطرف کردن نقاط ضعف
              </p>
            </div>
          </div>

          <button
            onClick={handleCreateTrainingPlan}
            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-md shadow-primary/10 hover:bg-primary/90 transition-all"
          >
            <Plus className="size-4" />
            <span>ایجاد برنامه تمرینی</span>
          </button>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {insight.trainingPlan.sessions.map((session) => (
            <div
              key={session.sessionNumber}
              className="flex flex-col justify-between rounded-2xl border border-border bg-muted/20 p-5 transition-colors hover:border-primary/30"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-primary">{session.sessionNumber}</span>
                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${session.intensityClass}`}
                  >
                    شدت: {session.intensity}
                  </span>
                </div>

                <div className="mt-4">
                  <span className="text-xs text-muted-foreground">تمرکز تمرین:</span>
                  <h3 className="mt-1 text-sm font-extrabold text-foreground">{session.focus}</h3>
                </div>

                <p className="mt-3 text-xs leading-6 text-muted-foreground">
                  {session.description}
                </p>
              </div>

              <div className="mt-4 flex items-center gap-2 border-t border-border/60 pt-3 text-xs text-muted-foreground">
                <Clock className="size-3.5 text-primary" />
                <span>مدت زمان: {session.duration}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BELT READINESS & PROGRESS TREND GRID */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* BELT READINESS ANALYSIS */}
        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <Award className="size-4" />
              </span>
              <h2 className="text-base font-bold">تحلیل آمادگی ارتقا</h2>
            </div>
            <span className="text-xs text-primary font-bold">
              {fa(insight.beltReadiness.score)}٪
            </span>
          </div>

          <div className="mt-4 flex items-center justify-between rounded-2xl border border-primary/20 bg-accent/20 p-4">
            <div className="text-center">
              <span className="text-[11px] text-muted-foreground">کمربند فعلی</span>
              <div className="mt-1">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${beltStyle.bg} ${beltStyle.text} ${beltStyle.border}`}
                >
                  <span className={`size-1.5 rounded-full ${beltStyle.dot}`} />
                  {insight.beltReadiness.currentBelt}
                </span>
              </div>
            </div>

            <ChevronLeft className="size-5 text-primary animate-pulse" />

            <div className="text-center">
              <span className="text-[11px] text-muted-foreground">کمربند هدف</span>
              <div className="mt-1">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${targetBeltStyle.bg} ${targetBeltStyle.text} ${targetBeltStyle.border}`}
                >
                  <span className={`size-1.5 rounded-full ${targetBeltStyle.dot}`} />
                  {insight.beltReadiness.targetBelt}
                </span>
              </div>
            </div>
          </div>

          {/* Category score bars */}
          <div className="mt-5 flex flex-col gap-3.5">
            {insight.beltReadiness.categoryScores.map((cat) => (
              <div key={cat.name} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold">{cat.name}</span>
                  <span className="font-bold text-foreground">{fa(cat.value)}٪</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500"
                    style={{ width: `${cat.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Verdict Text & Progression Link */}
          <div className="mt-5 rounded-2xl border border-border bg-muted/30 p-4">
            <div className="flex items-center gap-2 text-xs font-bold text-foreground">
              <CheckCircle2 className="size-4 text-emerald-400" />
              <span>{insight.beltReadiness.status}</span>
            </div>
            <p className="mt-1 text-xs leading-6 text-muted-foreground">
              {insight.beltReadiness.text}
            </p>
            <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-3">
              <span className="text-xs text-muted-foreground">مشاهده الزامات و سوابق آزمون:</span>
              <Link href="/progression" className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
                <span>سیستم پیشرفت کمربند</span>
                <ChevronLeft className="size-3" />
              </Link>
            </div>
          </div>
        </section>

        {/* PROGRESS TREND */}
        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <TrendingUp className="size-4" />
              </span>
              <h2 className="text-base font-bold">{insight.progressTrend.title}</h2>
            </div>
            <span className="inline-flex rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-bold text-emerald-300">
              {insight.progressTrend.growth}
            </span>
          </div>

          <p className="mt-1 text-xs text-muted-foreground">
            تغییرات میانگین امتیازات مهارتی در ۶ ماه گذشته
          </p>

          <div className="mt-5 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={insight.progressTrend.data}>
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
                <YAxis
                  domain={[50, 100]}
                  tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
                />
                <Tooltip
                  formatter={(value) => [`${value}٪`, 'امتیاز مهارتی']}
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    borderColor: 'var(--border)',
                    borderRadius: '0.75rem',
                    color: 'var(--foreground)',
                    direction: 'rtl',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="var(--primary)"
                  strokeWidth={3}
                  dot={{ r: 5, fill: 'var(--primary)' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      {/* ATTENDANCE & COMPETITION INSIGHTS */}
      <div className="grid gap-6 sm:grid-cols-2">
        {/* ATTENDANCE INSIGHT */}
        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-xl bg-blue-500/15 text-blue-400">
                <CalendarCheck className="size-4" />
              </span>
              <h2 className="text-base font-bold">تحلیل حضور</h2>
            </div>
            <b className="text-xl font-black text-foreground">
              {fa(insight.attendanceInsight.rate)}٪
            </b>
          </div>

          <p className="mt-4 text-xs leading-7 text-muted-foreground">
            {insight.attendanceInsight.text}
          </p>
        </section>

        {/* COMPETITION INSIGHT */}
        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400">
                <Trophy className="size-4" />
              </span>
              <h2 className="text-base font-bold">عملکرد مسابقات</h2>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-foreground">
              <span>{fa(insight.competitionInsight.competitionsCount)} مسابقه</span>
              <span className="text-muted-foreground">·</span>
              <span className="text-amber-400">{fa(insight.competitionInsight.medalsCount)} مدال</span>
            </div>
          </div>

          <p className="mt-4 text-xs leading-7 text-muted-foreground">
            {insight.competitionInsight.text}
          </p>
        </section>
      </div>

      {/* OVERALL COACHING SUMMARY (BOTTOM EXECUTIVE CARD) */}
      <section className="rounded-3xl border border-primary/20 bg-accent/20 p-6 md:p-8 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary/20 text-primary">
            <Sparkles className="size-5" />
          </div>
          <h2 className="text-lg font-bold">جمع‌بندی برای مربی</h2>
        </div>

        <blockquote className="mt-4 rounded-2xl border border-border bg-card/60 p-5 text-sm leading-8 text-muted-foreground">
          {insight.overallCoachingSummary}
        </blockquote>
      </section>
    </div>
  )
}
