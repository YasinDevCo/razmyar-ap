'use client'

import React, { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import {
  Trophy,
  Users,
  Calendar,
  MapPin,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Swords,
  ChevronRight,
  Medal,
  Award,
  Filter,
  X,
  Share2,
  Printer,
  ChevronLeft,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  Flame,
} from 'lucide-react'
import {
  Competition,
  CompetitionCategory,
  CompetitionParticipant,
  CompetitionStatus,
  CompetitionType,
  AgeCategory,
  GenderCategory,
  WeightCategory,
  Match,
  MedalWinner,
  INITIAL_COMPETITIONS,
  ACADEMY_STUDENTS_LIST,
  AcademyStudentOption,
  STATUS_STYLES,
  fa,
} from '@/lib/razmyar-competitions'
import { api } from '@/lib/api'

export function CompetitionModule() {
  // Main state
  const [competitions, setCompetitions] = useState<Competition[]>(INITIAL_COMPETITIONS)

  // Load from API on mount
  useEffect(() => {
    async function loadCompetitions() {
      const data = await api.competitions.getAll()
      if (data && data.length > 0) {
        setCompetitions(data)
      }
    }
    loadCompetitions()
  }, [])
  const [activeCompetitionId, setActiveCompetitionId] = useState<string | null>(null)
  const [activeDetailTab, setActiveDetailTab] = useState<
    'overview' | 'participants' | 'categories' | 'bracket' | 'results'
  >('overview')

  // Main list filters
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isAddParticipantModalOpen, setIsAddParticipantModalOpen] = useState(false)
  const [isMatchDetailModalOpen, setIsMatchDetailModalOpen] = useState(false)
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null)

  // Match edit state
  const [matchScore1, setMatchScore1] = useState<number>(0)
  const [matchScore2, setMatchScore2] = useState<number>(0)
  const [matchWinnerId, setMatchWinnerId] = useState<string | null>(null)
  const [matchTimeText, setMatchTimeText] = useState<string>('راند ۳ · پایان مسابقه')
  const [matchStatus, setMatchStatus] = useState<'در انتظار' | 'در حال برگزاری' | 'پایان یافته'>('پایان یافته')

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage(null)
    }, 3500)
  }

  // Create competition form state
  const [newTitle, setNewTitle] = useState('')
  const [newDate, setNewDate] = useState('۳۰ آبان ۱۴۰۵')
  const [newLocation, setNewLocation] = useState('تهران، سالن فدراسیون')
  const [newDescription, setNewDescription] = useState('')
  const [newType, setNewType] = useState<CompetitionType>('درون باشگاهی')
  const [newCategories, setNewCategories] = useState<CompetitionCategory[]>([
    {
      id: 'cat-new-1',
      title: 'نوجوانان - ۴۵ تا ۵۵ کیلو (مردان)',
      ageGroup: 'نوجوانان',
      gender: 'مردان',
      weight: '۴۵ تا ۵۵ کیلو',
      participantsCount: 0,
    },
  ])

  // Category builder sub-state in Create Modal
  const [catAge, setCatAge] = useState<AgeCategory>('نوجوانان')
  const [catGender, setCatGender] = useState<GenderCategory>('مردان')
  const [catWeight, setCatWeight] = useState<WeightCategory>('۴۵ تا ۵۵ کیلو')

  // Add Participant search state
  const [participantSearchQuery, setParticipantSearchQuery] = useState('')

  // Active competition data
  const activeCompetition = useMemo(() => {
    return competitions.find((c) => c.id === activeCompetitionId) || null
  }, [competitions, activeCompetitionId])

  // Filtered competitions list
  const filteredCompetitions = useMemo(() => {
    return competitions.filter((c) => {
      const matchSearch =
        !searchQuery.trim() ||
        c.title.includes(searchQuery.trim()) ||
        c.location.includes(searchQuery.trim()) ||
        c.description.includes(searchQuery.trim())

      const matchStatus = statusFilter === 'all' || c.status === statusFilter
      const matchType = typeFilter === 'all' || c.type === typeFilter

      return matchSearch && matchStatus && matchType
    })
  }, [competitions, searchQuery, statusFilter, typeFilter])

  // Summary Metrics
  const summaryMetrics = useMemo(() => {
    const upcomingCount = competitions.filter(
      (c) => c.status === 'پیش‌رو' || c.status === 'ثبت‌نام در حال انجام'
    ).length
    const totalParticipants = competitions.reduce((acc, c) => acc + c.participantsCount, 0)
    const completedCount = competitions.filter((c) => c.status === 'به پایان رسیده').length
    const totalMedals = competitions.reduce((acc, c) => acc + c.medals.length, 0)

    return {
      upcomingCount: fa(upcomingCount || 3),
      totalParticipants: fa(totalParticipants || 42),
      completedCount: fa(completedCount || 12),
      totalMedals: fa(totalMedals || 28),
    }
  }, [competitions])

  // Add Category Handler in Create Modal
  const handleAddCategory = () => {
    const title = `${catAge} ${catGender} - ${catWeight}`
    const alreadyExists = newCategories.some((cat) => cat.title === title)
    if (alreadyExists) {
      showToast('این دسته‌بندی قبلاً اضافه شده است.')
      return
    }

    const newCat: CompetitionCategory = {
      id: `cat-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title,
      ageGroup: catAge,
      gender: catGender,
      weight: catWeight,
      participantsCount: 0,
    }

    setNewCategories([...newCategories, newCat])
    showToast('دسته با موفقیت اضافه شد.')
  }

  const handleRemoveCategory = (id: string) => {
    setNewCategories(newCategories.filter((cat) => cat.id !== id))
  }

  // Handle Create Competition Form Submission
  const handleCreateCompetition = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim()) {
      showToast('لطفاً نام مسابقه را وارد کنید.')
      return
    }

    const payload = {
      title: newTitle.trim(),
      dateText: newDate.trim() || '۱۵ آذر ۱۴۰۵',
      location: newLocation.trim() || 'تهران، سالن ورزشی آزادی',
      description: newDescription.trim() || 'مسابقات قهرمانی تکواندو باشگاه رزمیار.',
      type: newType,
      categories: newCategories,
    }

    const createdApi = await api.competitions.create(payload)

    const created: Competition = createdApi || {
      id: `comp-${Date.now()}`,
      title: newTitle.trim(),
      date: newDate.trim() || '۱۵ آذر ۱۴۰۵',
      location: newLocation.trim() || 'تهران، سالن ورزشی آزادی',
      description: newDescription.trim() || 'مسابقات قهرمانی تکواندو باشگاه رزمیار.',
      type: newType,
      status: 'ثبت‌نام در حال انجام',
      participantsCount: 0,
      categories:
        newCategories.length > 0
          ? newCategories
          : [
              {
                id: `cat-default-${Date.now()}`,
                title: 'آزاد عمومی',
                ageGroup: 'نوجوانان',
                gender: 'مردان',
                weight: 'زیر ۴۵ کیلو',
                participantsCount: 0,
              },
            ],
      participants: [],
      matches: [],
      medals: [],
    }

    setCompetitions([created, ...competitions])
    setIsCreateModalOpen(false)
    setNewTitle('')
    setNewDescription('')
    showToast('مسابقه جدید با موفقیت ایجاد شد.')
  }

  // Open Match Modal
  const handleOpenMatchModal = (match: Match) => {
    setSelectedMatch(match)
    setMatchScore1(match.score1)
    setMatchScore2(match.score2)
    setMatchWinnerId(match.winnerId)
    setMatchTimeText(match.timeText || 'راند ۲ · ۰۱:۴۵')
    setMatchStatus(match.status)
    setIsMatchDetailModalOpen(true)
  }

  // Save Match Result
  const handleSaveMatchResult = async () => {
    if (!activeCompetition || !selectedMatch) return

    const p1 = selectedMatch.participant1
    const p2 = selectedMatch.participant2

    // Determine winner based on scores if not manually set
    let winnerId = matchWinnerId
    if (!winnerId && p1 && p2) {
      if (matchScore1 > matchScore2) winnerId = p1.studentId
      else if (matchScore2 > matchScore1) winnerId = p2.studentId
    }

    const winnerObj = winnerId === p1?.studentId ? p1 : winnerId === p2?.studentId ? p2 : null

    // Call API to persist match result
    await api.competitions.updateMatchResult(activeCompetition.id, selectedMatch.id, {
      score1: matchScore1,
      score2: matchScore2,
      winnerId,
      status: matchStatus,
      timeText: matchTimeText,
    })

    // Update matches list
    const updatedMatches = activeCompetition.matches.map((m) => {
      if (m.id === selectedMatch.id) {
        return {
          ...m,
          score1: matchScore1,
          score2: matchScore2,
          winnerId,
          status: matchStatus,
          timeText: matchTimeText,
          participant1: p1 ? { ...p1, score: matchScore1, isWinner: winnerId === p1.studentId } : null,
          participant2: p2 ? { ...p2, score: matchScore2, isWinner: winnerId === p2.studentId } : null,
        }
      }
      return m
    })

    // Advance winner to next match if specified
    if (selectedMatch.nextMatchId && winnerObj) {
      const nextMatchIndex = updatedMatches.findIndex((m) => m.id === selectedMatch.nextMatchId)
      if (nextMatchIndex !== -1) {
        const nextMatch = updatedMatches[nextMatchIndex]
        const slot = selectedMatch.nextMatchSlot || 1
        const updatedNextParticipant = {
          id: `p-${winnerObj.studentId}`,
          studentId: winnerObj.studentId,
          name: winnerObj.name,
          belt: winnerObj.belt,
          avatar: winnerObj.avatar,
          score: 0,
        }

        if (slot === 1) {
          nextMatch.participant1 = updatedNextParticipant
        } else {
          nextMatch.participant2 = updatedNextParticipant
        }
        updatedMatches[nextMatchIndex] = { ...nextMatch }
      }
    }

    // Check if this was the Final (roundIndex === 2 or max round) to update medals
    let updatedMedals = [...activeCompetition.medals]
    if (selectedMatch.roundIndex === 2 && winnerObj && p1 && p2) {
      const runnerUp = winnerId === p1.studentId ? p2 : p1
      updatedMedals = [
        {
          rank: 1,
          medalType: 'طلا',
          studentId: winnerObj.studentId,
          studentName: winnerObj.name,
          belt: winnerObj.belt,
          categoryTitle: activeCompetition.categories[0]?.title || 'رده وزنی استاندارد',
        },
        {
          rank: 2,
          medalType: 'نقره',
          studentId: runnerUp.studentId,
          studentName: runnerUp.name,
          belt: runnerUp.belt,
          categoryTitle: activeCompetition.categories[0]?.title || 'رده وزنی استاندارد',
        },
        {
          rank: 3,
          medalType: 'برنز',
          studentId: '1026',
          studentName: 'محمد احمدی',
          belt: 'قرمز',
          categoryTitle: activeCompetition.categories[0]?.title || 'رده وزنی استاندارد',
        },
      ]
    }

    // Update active competition
    const updatedCompetition: Competition = {
      ...activeCompetition,
      matches: updatedMatches,
      medals: updatedMedals,
    }

    setCompetitions(competitions.map((c) => (c.id === updatedCompetition.id ? updatedCompetition : c)))
    setIsMatchDetailModalOpen(false)
    showToast('نتیجه مسابقه با موفقیت ذخیره و جدول به‌روزرسانی شد.')
  }

  // Handle Add Participant to Competition
  const handleAddParticipant = (student: AcademyStudentOption) => {
    if (!activeCompetition) return

    const alreadyIn = activeCompetition.participants.some((p) => p.studentId === student.id)
    if (alreadyIn) {
      showToast(`${student.name} در این مسابقه ثبت‌نام کرده است.`)
      return
    }

    const newParticipant: CompetitionParticipant = {
      id: `cp-${Date.now()}`,
      studentId: student.id,
      name: student.name,
      age: student.age,
      belt: student.belt,
      weight: student.weight,
      ageGroup: student.ageGroup,
      gender: student.gender,
      status: 'وزن‌کشی شده',
      avatar: student.avatar,
      categoryId: activeCompetition.categories[0]?.id || 'cat-1',
    }

    const updatedParticipants = [...activeCompetition.participants, newParticipant]
    const updatedComp: Competition = {
      ...activeCompetition,
      participants: updatedParticipants,
      participantsCount: activeCompetition.participantsCount + 1,
    }

    setCompetitions(competitions.map((c) => (c.id === updatedComp.id ? updatedComp : c)))
    showToast('شاگرد به مسابقه اضافه شد.')
  }

  // Available students to add (not yet in active competition)
  const availableStudentsToAdd = useMemo(() => {
    if (!activeCompetition) return []
    const registeredIds = new Set(activeCompetition.participants.map((p) => p.studentId))
    return ACADEMY_STUDENTS_LIST.filter(
      (s) =>
        !registeredIds.has(s.id) &&
        (!participantSearchQuery.trim() ||
          s.name.includes(participantSearchQuery.trim()) ||
          s.belt.includes(participantSearchQuery.trim()))
    )
  }, [activeCompetition, participantSearchQuery])

  // ==========================================================================
  // VIEW: COMPETITION DETAIL WORKSPACE
  // ==========================================================================
  if (activeCompetition) {
    const statusCfg = STATUS_STYLES[activeCompetition.status]

    return (
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 left-6 z-50 flex items-center gap-3 rounded-2xl border border-primary/30 bg-card/95 px-5 py-3.5 text-sm font-semibold text-foreground shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-5">
            <CheckCircle2 className="size-5 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Back navigation & Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            onClick={() => setActiveCompetitionId(null)}
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowRight className="size-4" />
            <span>بازگشت به لیست مسابقات</span>
          </button>

          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${statusCfg.badge}`}
            >
              <span className={`size-2 rounded-full ${statusCfg.dot}`} />
              {statusCfg.text}
            </span>
            <span className="rounded-full bg-accent/60 border border-border px-3 py-1 text-xs text-muted-foreground">
              {activeCompetition.type}
            </span>
          </div>
        </div>

        {/* Competition Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-card via-card/90 to-primary/5 p-6 shadow-sm sm:p-8">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/15 text-primary shadow-inner">
                  <Trophy className="size-6" />
                </span>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                    {activeCompetition.title}
                  </h1>
                  <p className="text-sm text-muted-foreground">{activeCompetition.description}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-5 pt-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Calendar className="size-4 text-primary" />
                  <span>تاریخ برگزاری: {activeCompetition.date}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="size-4 text-primary" />
                  <span>محل: {activeCompetition.location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="size-4 text-primary" />
                  <span>{fa(activeCompetition.participantsCount)} شرکت‌کننده ثبت‌شده</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setIsAddParticipantModalOpen(true)}
                className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90 transition-all active:scale-[0.98]"
              >
                <Plus className="size-4" />
                افزودن شاگرد به مسابقه
              </button>
              <button
                onClick={() => {
                  setActiveDetailTab('bracket')
                  showToast('به بخش جدول مسابقات هدایت شدید.')
                }}
                className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
              >
                <Swords className="size-4 text-primary" />
                مشاهده جدول حذفی
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1.5 overflow-x-auto rounded-2xl border border-border bg-card p-1.5 shadow-sm">
          {[
            { id: 'overview', label: 'اطلاعات مسابقه', icon: Calendar },
            { id: 'participants', label: 'شرکت‌کنندگان', icon: Users, count: activeCompetition.participants.length },
            { id: 'categories', label: 'دسته‌بندی‌ها', icon: ShieldCheck, count: activeCompetition.categories.length },
            { id: 'bracket', label: 'جدول مسابقات (براکت)', icon: Swords },
            { id: 'results', label: 'نتایج و مدال‌ها', icon: Medal, count: activeCompetition.medals.length },
          ].map((tab) => {
            const Icon = tab.icon
            const isActive = activeDetailTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveDetailTab(tab.id as any)}
                className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                }`}
              >
                <Icon className="size-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] ${
                      isActive ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {fa(tab.count)}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeDetailTab === 'overview' && (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                  <ShieldCheck className="size-5 text-primary" />
                  مشخصات و زمان‌بندی مسابقه
                </h3>
                <p className="text-sm text-muted-foreground leading-7">
                  {activeCompetition.description} این مسابقات بر اساس آخرین قوانین استاندارد فدراسیون تکواندو و با سیستم
                  داوری الکترونیکی برگزار می‌گردد. تمامی شرکت‌کنندگان موظف به حضور در مراسم وزن‌کشی رسمی می‌باشند.
                </p>

                <div className="grid gap-4 pt-2 sm:grid-cols-2">
                  <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-1">
                    <span className="text-xs text-muted-foreground">نوع رویداد</span>
                    <p className="text-sm font-bold text-foreground">{activeCompetition.type}</p>
                  </div>
                  <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-1">
                    <span className="text-xs text-muted-foreground">محل و سالن مسابقه</span>
                    <p className="text-sm font-bold text-foreground">{activeCompetition.location}</p>
                  </div>
                  <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-1">
                    <span className="text-xs text-muted-foreground">تاریخ وزن‌کشی رسمی</span>
                    <p className="text-sm font-bold text-foreground">یک روز قبل از مسابقات · ساعت ۱۶:۰۰</p>
                  </div>
                  <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-1">
                    <span className="text-xs text-muted-foreground">کادر داوری</span>
                    <p className="text-sm font-bold text-foreground">داوران رسمی هیئت استان تهران</p>
                  </div>
                </div>
              </div>

              {/* Quick overview of categories */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-foreground">دسته‌بندی‌های فعال در این مسابقه</h3>
                  <button
                    onClick={() => setActiveDetailTab('categories')}
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    مدیریت دسته‌ها ←
                  </button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {activeCompetition.categories.map((cat) => (
                    <div
                      key={cat.id}
                      className="flex items-center justify-between rounded-xl border border-border/80 bg-accent/20 p-3.5"
                    >
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-foreground">{cat.title}</span>
                        <span className="block text-[11px] text-muted-foreground">
                          {cat.gender} · {cat.weight}
                        </span>
                      </div>
                      <span className="rounded-lg bg-card px-2.5 py-1 text-xs font-semibold text-primary border border-border">
                        {fa(cat.participantsCount || activeCompetition.participants.filter(p => p.categoryId === cat.id).length)} نفر
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Side Status & Action Box */}
            <div className="space-y-6">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-5">
                <h3 className="text-base font-bold text-foreground">آمار سریع ثبت‌نام</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">ظرفیت کل جدول:</span>
                    <span className="font-bold text-foreground">۳۲ شرکت‌کننده</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">ثبت‌نام شده:</span>
                    <span className="font-bold text-primary">{fa(activeCompetition.participantsCount)} نفر</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">وزن‌کشی تأیید شده:</span>
                    <span className="font-bold text-emerald-400">
                      {fa(activeCompetition.participants.filter((p) => p.status === 'وزن‌کشی شده').length || 4)} نفر
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-2 rounded-full bg-primary transition-all"
                      style={{
                        width: `${Math.min(100, Math.round((activeCompetition.participantsCount / 32) * 100))}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setIsAddParticipantModalOpen(true)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-xs font-bold text-primary-foreground shadow hover:bg-primary/90"
                  >
                    <Plus className="size-4" />
                    ثبت‌نام شاگرد جدید
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5 space-y-3">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <AlertCircle className="size-4" />
                  <span>نکات مهم برای مربیان</span>
                </div>
                <ul className="list-disc list-inside space-y-1.5 text-xs text-muted-foreground leading-6">
                  <li>همراه داشتن کارت بیمه ورزشی معتبر الزامی است.</li>
                  <li>تجهیزات هوگو و ساق‌بند باید مطابق استاندارد باشند.</li>
                  <li>نتایج بلافاصله پس از هر بازی در پروفایل شاگرد ثبت می‌شود.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PARTICIPANTS */}
        {activeDetailTab === 'participants' && (
          <div className="space-y-5">
            <div className="flex flex-col justify-between gap-4 rounded-2xl border border-border bg-card p-5 sm:flex-row sm:items-center">
              <div>
                <h3 className="text-base font-bold text-foreground">لیست شرکت‌کنندگان در مسابقه</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  شاگردان ثبت‌نام شده از آکادمی برای رده‌های سنی و وزنی مختلف
                </p>
              </div>

              <button
                onClick={() => setIsAddParticipantModalOpen(true)}
                className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow hover:bg-primary/90"
              >
                <Plus className="size-4" />
                + افزودن شاگرد
              </button>
            </div>

            {/* Participants Table */}
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="border-b border-border bg-muted/40 text-muted-foreground">
                    <tr>
                      <th className="px-5 py-3.5 font-bold">شاگرد</th>
                      <th className="px-5 py-3.5 font-bold">سن</th>
                      <th className="px-5 py-3.5 font-bold">کمربند</th>
                      <th className="px-5 py-3.5 font-bold">وزن</th>
                      <th className="px-5 py-3.5 font-bold">رده سنی</th>
                      <th className="px-5 py-3.5 font-bold">وضعیت ثبت‌نام</th>
                      <th className="px-5 py-3.5 font-bold">عملیات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {activeCompetition.participants.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-muted-foreground">
                          هنوز شاگردی برای این مسابقه اضافه نشده است. با زدن دکمه «+ افزودن شاگرد» شروع کنید.
                        </td>
                      </tr>
                    ) : (
                      activeCompetition.participants.map((p) => (
                        <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <span className="flex size-9 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                                {p.avatar || p.name[0]}
                              </span>
                              <div>
                                <span className="font-bold text-foreground block">{p.name}</span>
                                <span className="text-[10px] text-muted-foreground">کد: {fa(p.studentId)}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4 font-semibold text-foreground">{fa(p.age)} سال</td>
                          <td className="px-5 py-4">
                            <span className="inline-block rounded-full bg-accent px-2.5 py-0.5 font-semibold text-foreground">
                              کمربند {p.belt}
                            </span>
                          </td>
                          <td className="px-5 py-4 font-semibold text-foreground">{fa(p.weight)} کیلوگرم</td>
                          <td className="px-5 py-4 text-muted-foreground">{p.ageGroup}</td>
                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                                p.status === 'وزن‌کشی شده'
                                  ? 'bg-emerald-500/15 text-emerald-400'
                                  : p.status === 'تأیید شده'
                                    ? 'bg-primary/15 text-primary'
                                    : 'bg-amber-500/15 text-amber-400'
                              }`}
                            >
                              {p.status}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <Link
                              href="/students/1024"
                              className="text-xs font-bold text-primary hover:underline"
                            >
                              پروفایل شاگرد
                            </Link>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CATEGORIES */}
        {activeDetailTab === 'categories' && (
          <div className="space-y-6">
            <div className="flex flex-col justify-between gap-4 rounded-2xl border border-border bg-card p-5 sm:flex-row sm:items-center">
              <div>
                <h3 className="text-base font-bold text-foreground">دسته‌بندی‌های سنی و وزنی</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  تفکیک جدول‌های مسابقه بر اساس اوزان، جنسیت و رده سنی شاگردان
                </p>
              </div>

              <button
                onClick={() => {
                  setActiveDetailTab('overview')
                  setIsCreateModalOpen(true)
                }}
                className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow hover:bg-primary/90"
              >
                <Plus className="size-4" />
                + افزودن دسته جدید
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {activeCompetition.categories.map((cat) => (
                <div
                  key={cat.id}
                  className="relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4 hover:border-primary/40 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-foreground text-sm">{cat.title}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        رده: {cat.ageGroup} · {cat.gender}
                      </p>
                    </div>
                    <span className="rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                      {cat.weight}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-t border-border pt-4 text-xs">
                    <span className="text-muted-foreground">شرکت‌کنندگان این دسته:</span>
                    <span className="font-bold text-foreground">
                      {fa(
                        activeCompetition.participants.filter((p) => p.categoryId === cat.id).length ||
                          cat.participantsCount
                      )}{' '}
                      نفر
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: TOURNAMENT BRACKET */}
        {activeDetailTab === 'bracket' && (
          <div className="space-y-6">
            <div className="flex flex-col justify-between gap-4 rounded-2xl border border-border bg-card p-5 sm:flex-row sm:items-center">
              <div>
                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                  <Swords className="size-5 text-primary" />
                  جدول حذفی مسابقات (براکت)
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  روی هر مسابقه کلیک کنید تا امتیازات، زمان و برنده بازی را ثبت یا ویرایش نمایید.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="inline-flex items-center gap-1 text-emerald-400">
                  <span className="size-2 rounded-full bg-emerald-400" />
                  برنده بازی
                </span>
                <span className="text-muted-foreground">|</span>
                <span className="text-muted-foreground">وزن: ۴۵ تا ۵۵ کیلوگرم (نوجوانان)</span>
              </div>
            </div>

            {/* Visual Tournament Bracket */}
            <div className="overflow-x-auto rounded-3xl border border-border bg-card/60 p-6 sm:p-8">
              <div className="min-w-[700px] flex items-center justify-between gap-12">
                {/* ROUND 1 */}
                <div className="flex-1 space-y-8">
                  <div className="flex items-center justify-between border-b border-border pb-2">
                    <span className="text-xs font-bold text-primary">مرحله اول (یک‌چهارم / نیمه‌نهایی)</span>
                    <span className="text-[11px] text-muted-foreground">۲ مسابقه</span>
                  </div>

                  {activeCompetition.matches
                    .filter((m) => m.roundIndex === 1)
                    .map((match) => (
                      <div
                        key={match.id}
                        onClick={() => handleOpenMatchModal(match)}
                        className="group relative cursor-pointer overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-sm transition-all hover:border-primary hover:shadow-md hover:scale-[1.01]"
                      >
                        <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-3">
                          <span className="font-semibold">بازی #{fa(match.matchNumber)}</span>
                          <span className="rounded-md bg-muted px-2 py-0.5 text-[10px]">{match.timeText}</span>
                        </div>

                        {/* Fighter 1 */}
                        <div
                          className={`flex items-center justify-between rounded-xl p-2.5 transition-colors ${
                            match.participant1?.isWinner
                              ? 'bg-emerald-500/15 text-emerald-300 font-bold border border-emerald-500/30'
                              : 'bg-muted/40 text-foreground'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="flex size-7 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                              {match.participant1?.avatar || '؟'}
                            </span>
                            <span className="text-xs">{match.participant1?.name || 'در انتظار مشخص شدن'}</span>
                          </div>
                          <span className="text-xs font-extrabold">{fa(match.score1)}</span>
                        </div>

                        <div className="my-1 text-center text-[10px] font-bold text-muted-foreground tracking-wider">
                          در برابر
                        </div>

                        {/* Fighter 2 */}
                        <div
                          className={`flex items-center justify-between rounded-xl p-2.5 transition-colors ${
                            match.participant2?.isWinner
                              ? 'bg-emerald-500/15 text-emerald-300 font-bold border border-emerald-500/30'
                              : 'bg-muted/40 text-foreground'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="flex size-7 items-center justify-center rounded-full bg-rose-500/20 text-xs font-bold text-rose-400">
                              {match.participant2?.avatar || '؟'}
                            </span>
                            <span className="text-xs">{match.participant2?.name || 'در انتظار مشخص شدن'}</span>
                          </div>
                          <span className="text-xs font-extrabold">{fa(match.score2)}</span>
                        </div>

                        <div className="mt-3 flex items-center justify-between text-[10px] text-primary group-hover:underline">
                          <span>ثبت یا تغییر نتیجه</span>
                          <ChevronLeft className="size-3" />
                        </div>
                      </div>
                    ))}
                </div>

                {/* BRACKET CONNECTOR LINE */}
                <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground/40">
                  <div className="h-16 w-0.5 bg-border" />
                  <span className="text-[10px] font-bold text-muted-foreground bg-muted px-2 py-1 rounded-full">
                    صعود برنده
                  </span>
                  <div className="h-16 w-0.5 bg-border" />
                </div>

                {/* FINAL ROUND */}
                <div className="flex-1 space-y-8">
                  <div className="flex items-center justify-between border-b border-border pb-2">
                    <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                      <Trophy className="size-3.5" />
                      فینال مسابقات
                    </span>
                    <span className="text-[11px] text-muted-foreground">تعیین قهرمان</span>
                  </div>

                  {activeCompetition.matches
                    .filter((m) => m.roundIndex === 2)
                    .map((match) => (
                      <div
                        key={match.id}
                        onClick={() => handleOpenMatchModal(match)}
                        className="group relative cursor-pointer overflow-hidden rounded-2xl border-2 border-amber-500/30 bg-gradient-to-br from-card to-amber-500/5 p-5 shadow-lg transition-all hover:border-amber-500 hover:scale-[1.01]"
                      >
                        <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-3">
                          <span className="font-bold text-amber-400">مسابقه نهایی</span>
                          <span className="rounded-md bg-amber-500/15 text-amber-300 px-2 py-0.5 text-[10px] font-bold">
                            {match.timeText}
                          </span>
                        </div>

                        {/* Final Fighter 1 */}
                        <div
                          className={`flex items-center justify-between rounded-xl p-3 transition-colors ${
                            match.participant1?.isWinner
                              ? 'bg-amber-500/20 text-amber-200 font-bold border border-amber-500/40'
                              : 'bg-muted/40 text-foreground'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="flex size-8 items-center justify-center rounded-full bg-amber-500/30 text-sm font-bold text-amber-300">
                              {match.participant1?.avatar || '؟'}
                            </span>
                            <div>
                              <span className="text-xs block font-bold">{match.participant1?.name}</span>
                              <span className="text-[10px] text-muted-foreground">کمربند {match.participant1?.belt}</span>
                            </div>
                          </div>
                          <span className="text-sm font-black text-amber-300">{fa(match.score1)}</span>
                        </div>

                        <div className="my-2 text-center text-xs font-black text-amber-400/80 tracking-wider">
                          🏆 رقابت قهرمانی 🏆
                        </div>

                        {/* Final Fighter 2 */}
                        <div
                          className={`flex items-center justify-between rounded-xl p-3 transition-colors ${
                            match.participant2?.isWinner
                              ? 'bg-amber-500/20 text-amber-200 font-bold border border-amber-500/40'
                              : 'bg-muted/40 text-foreground'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="flex size-8 items-center justify-center rounded-full bg-muted text-sm font-bold text-foreground">
                              {match.participant2?.avatar || '؟'}
                            </span>
                            <div>
                              <span className="text-xs block font-bold">{match.participant2?.name}</span>
                              <span className="text-[10px] text-muted-foreground">کمربند {match.participant2?.belt}</span>
                            </div>
                          </div>
                          <span className="text-sm font-black">{fa(match.score2)}</span>
                        </div>

                        <div className="mt-4 flex items-center justify-between text-xs font-bold text-amber-400 group-hover:underline">
                          <span>ثبت امتیاز و تعیین قهرمان</span>
                          <ChevronLeft className="size-4" />
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: RESULTS & MEDALS */}
        {activeDetailTab === 'results' && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <Medal className="size-5 text-amber-400" />
                سکوی قهرمانی و مدال‌آوران
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                مدال‌ها و رتبه‌های کسب شده در این مسابقه که مستقیماً در پرونده و پروفایل شاگرد ثبت گردیده است.
              </p>
            </div>

            {/* Podium Cards */}
            <div className="grid gap-5 sm:grid-cols-3">
              {/* GOLD */}
              <div className="relative overflow-hidden rounded-3xl border-2 border-amber-500/40 bg-gradient-to-b from-amber-500/15 via-card to-card p-6 text-center shadow-lg">
                <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-amber-500 text-2xl font-black text-amber-950 shadow-md">
                  🥇
                </div>
                <h4 className="mt-4 text-base font-black text-amber-400">مقام اول (مدال طلا)</h4>
                <div className="mt-3 space-y-1">
                  <p className="text-lg font-bold text-foreground">
                    {activeCompetition.medals.find((m) => m.rank === 1)?.studentName || 'علی رضایی'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    کمربند {activeCompetition.medals.find((m) => m.rank === 1)?.belt || 'آبی'} · نوجوانان
                  </p>
                </div>
                <div className="mt-4 rounded-xl bg-amber-500/10 py-1.5 text-xs font-bold text-amber-300">
                  قهرمان وزن ۴۵ تا ۵۵ کیلو
                </div>
              </div>

              {/* SILVER */}
              <div className="relative overflow-hidden rounded-3xl border-2 border-zinc-400/40 bg-gradient-to-b from-zinc-400/15 via-card to-card p-6 text-center shadow-md">
                <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-zinc-300 text-2xl font-black text-zinc-950 shadow-md">
                  🥈
                </div>
                <h4 className="mt-4 text-base font-black text-zinc-300">مقام دوم (مدال نقره)</h4>
                <div className="mt-3 space-y-1">
                  <p className="text-lg font-bold text-foreground">
                    {activeCompetition.medals.find((m) => m.rank === 2)?.studentName || 'رضا مرادی'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    کمربند {activeCompetition.medals.find((m) => m.rank === 2)?.belt || 'سبز'} · نوجوانان
                  </p>
                </div>
                <div className="mt-4 rounded-xl bg-zinc-400/10 py-1.5 text-xs font-bold text-zinc-300">
                  نایب قهرمان
                </div>
              </div>

              {/* BRONZE */}
              <div className="relative overflow-hidden rounded-3xl border-2 border-amber-700/40 bg-gradient-to-b from-amber-700/15 via-card to-card p-6 text-center shadow-md">
                <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-amber-700 text-2xl font-black text-amber-100 shadow-md">
                  🥉
                </div>
                <h4 className="mt-4 text-base font-black text-amber-600">مقام سوم (مدال برنز)</h4>
                <div className="mt-3 space-y-1">
                  <p className="text-lg font-bold text-foreground">
                    {activeCompetition.medals.find((m) => m.rank === 3)?.studentName || 'محمد احمدی'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    کمربند {activeCompetition.medals.find((m) => m.rank === 3)?.belt || 'قرمز'} · نوجوانان
                  </p>
                </div>
                <div className="mt-4 rounded-xl bg-amber-700/10 py-1.5 text-xs font-bold text-amber-500">
                  مقام سوم مشترک
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: MATCH DETAIL & SCORING */}
        {isMatchDetailModalOpen && selectedMatch && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-md animate-in fade-in">
            <div className="relative w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <Swords className="size-5 text-primary" />
                    ثبت نتیجه مسابقه #{fa(selectedMatch.matchNumber)}
                  </h3>
                  <p className="text-xs text-muted-foreground">{selectedMatch.roundTitle}</p>
                </div>
                <button
                  onClick={() => setIsMatchDetailModalOpen(false)}
                  className="rounded-lg p-1 text-muted-foreground hover:bg-muted"
                >
                  <X className="size-5" />
                </button>
              </div>

              {/* Fighter VS Fighter Box */}
              <div className="grid grid-cols-2 gap-4">
                {/* Fighter 1 */}
                <div
                  onClick={() => setMatchWinnerId(selectedMatch.participant1?.studentId || null)}
                  className={`cursor-pointer rounded-2xl border p-4 text-center transition-all ${
                    matchWinnerId === selectedMatch.participant1?.studentId
                      ? 'border-emerald-500 bg-emerald-500/15 shadow-sm'
                      : 'border-border bg-muted/30 hover:border-primary/50'
                  }`}
                >
                  <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/20 text-base font-bold text-primary">
                    {selectedMatch.participant1?.avatar || '؟'}
                  </span>
                  <p className="mt-2 font-bold text-sm text-foreground">
                    {selectedMatch.participant1?.name || 'بازیکن اول'}
                  </p>
                  <span className="text-[11px] text-muted-foreground">
                    کمربند {selectedMatch.participant1?.belt}
                  </span>

                  <div className="mt-3">
                    <label className="text-[11px] text-muted-foreground block mb-1">امتیاز:</label>
                    <input
                      type="number"
                      value={matchScore1}
                      onChange={(e) => setMatchScore1(parseInt(e.target.value, 10) || 0)}
                      className="w-20 mx-auto rounded-xl border border-input bg-background py-1.5 text-center text-base font-bold text-foreground outline-none focus:border-primary"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setMatchWinnerId(selectedMatch.participant1?.studentId || null)
                      showToast(`${selectedMatch.participant1?.name} برنده انتخاب شد.`)
                    }}
                    className={`mt-3 w-full rounded-xl py-1.5 text-xs font-bold transition-all ${
                      matchWinnerId === selectedMatch.participant1?.studentId
                        ? 'bg-emerald-500 text-white'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {selectedMatch.participant1?.name} برنده شد
                  </button>
                </div>

                {/* Fighter 2 */}
                <div
                  onClick={() => setMatchWinnerId(selectedMatch.participant2?.studentId || null)}
                  className={`cursor-pointer rounded-2xl border p-4 text-center transition-all ${
                    matchWinnerId === selectedMatch.participant2?.studentId
                      ? 'border-emerald-500 bg-emerald-500/15 shadow-sm'
                      : 'border-border bg-muted/30 hover:border-primary/50'
                  }`}
                >
                  <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-rose-500/20 text-base font-bold text-rose-400">
                    {selectedMatch.participant2?.avatar || '؟'}
                  </span>
                  <p className="mt-2 font-bold text-sm text-foreground">
                    {selectedMatch.participant2?.name || 'بازیکن دوم'}
                  </p>
                  <span className="text-[11px] text-muted-foreground">
                    کمربند {selectedMatch.participant2?.belt}
                  </span>

                  <div className="mt-3">
                    <label className="text-[11px] text-muted-foreground block mb-1">امتیاز:</label>
                    <input
                      type="number"
                      value={matchScore2}
                      onChange={(e) => setMatchScore2(parseInt(e.target.value, 10) || 0)}
                      className="w-20 mx-auto rounded-xl border border-input bg-background py-1.5 text-center text-base font-bold text-foreground outline-none focus:border-primary"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setMatchWinnerId(selectedMatch.participant2?.studentId || null)
                      showToast(`${selectedMatch.participant2?.name} برنده انتخاب شد.`)
                    }}
                    className={`mt-3 w-full rounded-xl py-1.5 text-xs font-bold transition-all ${
                      matchWinnerId === selectedMatch.participant2?.studentId
                        ? 'bg-emerald-500 text-white'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {selectedMatch.participant2?.name} برنده شد
                  </button>
                </div>
              </div>

              {/* Match Details & Status */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">زمان یا راند مسابقه</label>
                  <input
                    type="text"
                    value={matchTimeText}
                    onChange={(e) => setMatchTimeText(e.target.value)}
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground outline-none focus:border-primary"
                    placeholder="راند ۳ · پایان مسابقه"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">وضعیت مسابقه</label>
                  <select
                    value={matchStatus}
                    onChange={(e) => setMatchStatus(e.target.value as any)}
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground outline-none focus:border-primary"
                  >
                    <option value="در انتظار">در انتظار</option>
                    <option value="در حال برگزاری">در حال برگزاری</option>
                    <option value="پایان یافته">پایان یافته</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleSaveMatchResult}
                  className="flex-1 rounded-xl bg-primary py-2.5 text-xs font-bold text-primary-foreground shadow hover:bg-primary/90 transition-all"
                >
                  ثبت نتیجه و ارتقای برنده
                </button>
                <button
                  type="button"
                  onClick={() => setIsMatchDetailModalOpen(false)}
                  className="rounded-xl border border-border px-4 py-2.5 text-xs font-semibold text-muted-foreground hover:bg-muted"
                >
                  انصراف
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: ADD PARTICIPANT TO COMPETITION */}
        {isAddParticipantModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-md animate-in fade-in">
            <div className="relative w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <Users className="size-5 text-primary" />
                    افزودن شاگرد به {activeCompetition.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    شاگرد مورد نظر را جستجو و به لیست مسابقه اضافه کنید.
                  </p>
                </div>
                <button
                  onClick={() => setIsAddParticipantModalOpen(false)}
                  className="rounded-lg p-1 text-muted-foreground hover:bg-muted"
                >
                  <X className="size-5" />
                </button>
              </div>

              {/* Search input */}
              <div className="relative">
                <Search className="absolute right-3.5 top-3 size-4 text-muted-foreground" />
                <input
                  type="text"
                  value={participantSearchQuery}
                  onChange={(e) => setParticipantSearchQuery(e.target.value)}
                  placeholder="جستجوی شاگرد بر اساس نام یا کمربند..."
                  className="w-full rounded-xl border border-input bg-background pr-10 pl-3 py-2.5 text-xs text-foreground outline-none focus:border-primary"
                />
              </div>

              {/* Students list */}
              <div className="max-h-64 space-y-2.5 overflow-y-auto pr-1">
                {availableStudentsToAdd.length === 0 ? (
                  <p className="p-6 text-center text-xs text-muted-foreground">
                    شاگردی با این مشخصات یافت نشد یا تمام شاگردان ثبت‌نام شده‌اند.
                  </p>
                ) : (
                  availableStudentsToAdd.map((student) => (
                    <div
                      key={student.id}
                      className="flex items-center justify-between rounded-xl border border-border bg-muted/20 p-3 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex size-9 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                          {student.avatar}
                        </span>
                        <div>
                          <span className="text-xs font-bold text-foreground block">{student.name}</span>
                          <span className="text-[11px] text-muted-foreground">
                            {fa(student.age)} سال · کمربند {student.belt} · {fa(student.weight)} کیلوگرم
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleAddParticipant(student)}
                        className="rounded-xl bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary/90"
                      >
                        افزودن به مسابقه
                      </button>
                    </div>
                  ))
                )}
              </div>

              <div className="pt-2 border-t border-border flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsAddParticipantModalOpen(false)}
                  className="rounded-xl border border-border px-5 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted"
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

  // ==========================================================================
  // VIEW: MAIN COMPETITIONS LIST
  // ==========================================================================
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 flex items-center gap-3 rounded-2xl border border-primary/30 bg-card/95 px-5 py-3.5 text-sm font-semibold text-foreground shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="size-5 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* PAGE HEADER */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">مسابقات</h1>
          <p className="mt-1 text-sm text-muted-foreground">مدیریت مسابقات و عملکرد شاگردان</p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90 transition-all active:scale-[0.98]"
        >
          <Plus className="size-4" />
          + ایجاد مسابقه
        </button>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">مسابقات پیش رو</span>
            <Calendar className="size-4 text-primary" />
          </div>
          <p className="text-2xl font-black text-foreground">{summaryMetrics.upcomingCount}</p>
          <span className="block text-[11px] text-muted-foreground">در ماه جاری و آینده</span>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">شرکت‌کنندگان</span>
            <Users className="size-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-foreground">{summaryMetrics.totalParticipants}</p>
          <span className="block text-[11px] text-emerald-400">ثبت‌نام فعال از آکادمی</span>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">مسابقات برگزارشده</span>
            <Trophy className="size-4 text-sky-400" />
          </div>
          <p className="text-2xl font-black text-foreground">{summaryMetrics.completedCount}</p>
          <span className="block text-[11px] text-muted-foreground">در طول فصل جاری</span>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">مدال‌های کسب‌شده</span>
            <Medal className="size-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-foreground">{summaryMetrics.totalMedals}</p>
          <span className="block text-[11px] text-amber-400">طلا، نقره و برنز</span>
        </div>
      </div>

      {/* FILTERS & SEARCH */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute right-3 top-3 size-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجوی مسابقه..."
              className="w-full rounded-xl border border-input bg-background pr-10 pl-4 py-2 text-xs text-foreground outline-none focus:border-primary transition-colors"
            />
          </div>

          {/* Status Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground outline-none focus:border-primary"
            >
              <option value="all">همه وضعیت‌ها</option>
              <option value="پیش‌رو">پیش‌رو</option>
              <option value="ثبت‌نام در حال انجام">ثبت‌نام در حال انجام</option>
              <option value="در حال برگزاری">در حال برگزاری</option>
              <option value="به پایان رسیده">به پایان رسیده</option>
            </select>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground outline-none focus:border-primary"
            >
              <option value="all">همه نوع‌ها</option>
              <option value="درون باشگاهی">درون باشگاهی</option>
              <option value="بین باشگاهی">بین باشگاهی</option>
              <option value="استانی">استانی</option>
            </select>

            {(searchQuery || statusFilter !== 'all' || typeFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('')
                  setStatusFilter('all')
                  setTypeFilter('all')
                }}
                className="rounded-xl border border-border px-3 py-2 text-xs text-muted-foreground hover:text-foreground"
              >
                پاک کردن فیلترها
              </button>
            )}
          </div>
        </div>
      </div>

      {/* UPCOMING COMPETITIONS LIST */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Trophy className="size-5 text-primary" />
            لیست مسابقات
          </h2>
          <span className="text-xs text-muted-foreground">
            {fa(filteredCompetitions.length)} رویداد پیدا شد
          </span>
        </div>

        {filteredCompetitions.length === 0 ? (
          /* EMPTY STATE */
          <div className="rounded-3xl border border-dashed border-border bg-card p-12 text-center space-y-4">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
              <Trophy className="size-7" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">هنوز مسابقه‌ای ایجاد نشده</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                اولین مسابقه باشگاه خود را ایجاد کنید یا فیلترهای جستجو را بازنشانی نمایید.
              </p>
            </div>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground shadow hover:bg-primary/90"
            >
              <Plus className="size-4" />+ ایجاد مسابقه
            </button>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filteredCompetitions.map((comp) => {
              const statusCfg = STATUS_STYLES[comp.status]
              return (
                <div
                  key={comp.id}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:border-primary/50 hover:shadow-md"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${statusCfg.badge}`}
                      >
                        <span className={`size-1.5 rounded-full ${statusCfg.dot}`} />
                        {statusCfg.text}
                      </span>
                      <span className="rounded-full bg-muted px-2.5 py-0.5 text-[10px] text-muted-foreground">
                        {comp.type}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                        {comp.title}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground leading-6">
                        {comp.description}
                      </p>
                    </div>

                    <div className="space-y-1.5 border-t border-border/80 pt-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="size-3.5 text-primary" />
                        <span>{comp.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="size-3.5 text-primary" />
                        <span>{comp.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="size-3.5 text-primary" />
                        <span>{fa(comp.participantsCount)} شرکت‌کننده</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center gap-2 border-t border-border pt-4">
                    <button
                      onClick={() => {
                        setActiveCompetitionId(comp.id)
                        setActiveDetailTab('overview')
                      }}
                      className="flex-1 rounded-xl bg-primary/10 py-2 text-center text-xs font-bold text-primary hover:bg-primary hover:text-primary-foreground transition-all"
                    >
                      مشاهده
                    </button>
                    <button
                      onClick={() => {
                        setActiveCompetitionId(comp.id)
                        setActiveDetailTab('bracket')
                      }}
                      className="flex-1 rounded-xl border border-border py-2 text-center text-xs font-semibold text-foreground hover:bg-muted transition-colors"
                    >
                      مدیریت
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* CREATE COMPETITION MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Trophy className="size-5 text-primary" />
                  ایجاد مسابقه جدید
                </h3>
                <p className="text-xs text-muted-foreground">
                  مشخصات رویداد و دسته‌بندی‌های وزنی/سنی را تعیین کنید.
                </p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-muted"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCompetition} className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-medium text-foreground block mb-1">
                    نام مسابقه <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="مثال: جام پاییز رزمیار"
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-foreground block mb-1">نوع مسابقه</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as CompetitionType)}
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground outline-none focus:border-primary"
                  >
                    <option value="درون باشگاهی">درون باشگاهی</option>
                    <option value="بین باشگاهی">بین باشگاهی</option>
                    <option value="استانی">استانی</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-foreground block mb-1">تاریخ برگزاری</label>
                  <input
                    type="text"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    placeholder="مثال: ۲۵ شهریور ۱۴۰۵"
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-foreground block mb-1">محل برگزاری</label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="مثال: تهران، سالن آزادی"
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-foreground block mb-1">توضیحات مسابقه</label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="توضیحات مربوط به شرایط حضور، قوانین و جوایز..."
                  className="w-full rounded-xl border border-input bg-background p-3 text-xs text-foreground outline-none focus:border-primary"
                />
              </div>

              {/* CATEGORY BUILDER */}
              <div className="rounded-2xl border border-border bg-muted/30 p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">سازنده دسته‌بندی‌های مسابقه</span>
                  <span className="text-[11px] text-muted-foreground">
                    {fa(newCategories.length)} دسته اضافه شده
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] text-muted-foreground block mb-1">رده سنی</label>
                    <select
                      value={catAge}
                      onChange={(e) => setCatAge(e.target.value as AgeCategory)}
                      className="w-full rounded-lg border border-input bg-background px-2 py-1.5 text-xs text-foreground outline-none"
                    >
                      <option value="نونهالان">نونهالان</option>
                      <option value="نوجوانان">نوجوانان</option>
                      <option value="جوانان">جوانان</option>
                      <option value="بزرگسالان">بزرگسالان</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-muted-foreground block mb-1">جنسیت</label>
                    <select
                      value={catGender}
                      onChange={(e) => setCatGender(e.target.value as GenderCategory)}
                      className="w-full rounded-lg border border-input bg-background px-2 py-1.5 text-xs text-foreground outline-none"
                    >
                      <option value="مردان">مردان</option>
                      <option value="زنان">زنان</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-muted-foreground block mb-1">رده وزنی</label>
                    <select
                      value={catWeight}
                      onChange={(e) => setCatWeight(e.target.value as WeightCategory)}
                      className="w-full rounded-lg border border-input bg-background px-2 py-1.5 text-xs text-foreground outline-none"
                    >
                      <option value="زیر ۴۵ کیلو">زیر ۴۵ کیلو</option>
                      <option value="۴۵ تا ۵۵ کیلو">۴۵ تا ۵۵ کیلو</option>
                      <option value="۵۵ تا ۶۵ کیلو">۵۵ تا ۶۵ کیلو</option>
                      <option value="بالای ۶۵ کیلو">بالای ۶۵ کیلو</option>
                    </select>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAddCategory}
                  className="flex items-center gap-1.5 rounded-xl border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary/20"
                >
                  <Plus className="size-3.5" />+ افزودن دسته
                </button>

                {/* Added categories badges */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {newCategories.map((c) => (
                    <span
                      key={c.id}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1 text-xs text-foreground"
                    >
                      <span>{c.title}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveCategory(c.id)}
                        className="text-muted-foreground hover:text-rose-400"
                      >
                        <X className="size-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-primary py-2.5 text-xs font-bold text-primary-foreground shadow hover:bg-primary/90 transition-all"
                >
                  ذخیره و ایجاد مسابقه
                </button>
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="rounded-xl border border-border px-5 py-2.5 text-xs font-semibold text-muted-foreground hover:bg-muted"
                >
                  انصراف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
