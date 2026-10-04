'use client'

import { useState, useEffect, useCallback } from 'react'
import { TeamClub, TeamPlayer, TeamTask, TeamWorkout, TeamTransaction, TeamActivity } from './types'

const STORAGE_KEY_CLUBS = 'razmyar_team_clubs_v2'
const STORAGE_KEY_PLAYERS = 'razmyar_team_players_v2'
const STORAGE_KEY_TASKS = 'razmyar_team_tasks_v2'
const STORAGE_KEY_WORKOUTS = 'razmyar_team_workouts_v2'
const STORAGE_KEY_FINANCE = 'razmyar_team_finance_v2'
const STORAGE_KEY_ACTIVITY = 'razmyar_team_activity_v2'

// Initial Seed Data
const INITIAL_CLUBS: TeamClub[] = [
  // Team Fajr
  {
    id: 'PARTO',
    teamId: 'FAJR',
    name: 'باشگاه پرتو',
    code: 'PARTO',
    contactName: 'استاد امینی',
    phone: '۰۹۱۲۱۱۱۱۱۱۱',
    email: 'parto@fajr.ir',
    address: 'تهران، میدان انقلاب، خیابان کارگر شمالی',
    status: 'ACTIVE',
    playersCount: 48,
    notes: 'باشگاه مرکزی تیم فجر، مجهز به ۳ تاتامی استاندارد',
  },
  {
    id: 'SARVESTAN',
    teamId: 'FAJR',
    name: 'باشگاه سروستان',
    code: 'SARVESTAN',
    contactName: 'استاد رحیمی',
    phone: '۰۹۱۲۲۲۲۲۲۲۲',
    email: 'sarvestan@fajr.ir',
    address: 'تهران، سعادت‌آباد، خیابان سرو غربی',
    status: 'ACTIVE',
    playersCount: 26,
    notes: 'شعبه شمال غرب، تحت پوشش اشتراک تیم فجر',
  },
  {
    id: 'HEJAB',
    teamId: 'FAJR',
    name: 'باشگاه حجاب',
    code: 'HEJAB',
    contactName: 'استاد کریمی',
    phone: '۰۹۱۲۳۳۳۳۳۳۳',
    email: 'hejab@fajr.ir',
    address: 'تهران، بلوار کشاورز، خیابان حجاب',
    status: 'ACTIVE',
    playersCount: 10,
    notes: 'سالن تمرین اختصاصی بانوان، تحت پوشش اشتراک تیم فجر',
  },

  // Team X
  {
    id: 'CLUB_X1',
    teamId: 'TEAM_X',
    name: 'باشگاه پیروزی X1',
    code: 'X1',
    contactName: 'مربی ایکس',
    phone: '۰۹۱۲۴۴۴۴۴۴۴',
    email: 'x1@teamx.ir',
    address: 'اصفهان، خیابان ارتش',
    status: 'ACTIVE',
    subPlan: 'BASIC',
    subStatus: 'ACTIVE',
    subExpiration: '۱۴۰۵/۰۸/۱۰',
    playersCount: 20,
  },
  {
    id: 'CLUB_X2',
    teamId: 'TEAM_X',
    name: 'باشگاه امید X2',
    code: 'X2',
    contactName: 'مربی حسینی',
    phone: '۰۹۱۲۵۵۵۵۵۵۵',
    email: 'x2@teamx.ir',
    address: 'اصفهان، خیابان نظر',
    status: 'ACTIVE',
    subPlan: 'BASIC',
    subStatus: 'ACTIVE',
    subExpiration: '۱۴۰۵/۱۰/۱۱',
    playersCount: 15,
  },
]

const INITIAL_PLAYERS: TeamPlayer[] = [
  // Team Fajr - Parto
  {
    id: 'p101',
    teamId: 'FAJR',
    clubId: 'PARTO',
    name: 'علی رضایی',
    phone: '۰۹۱۲۳۴۵۶۷۸۹',
    age: 15,
    belt: 'آبی',
    targetBelt: 'قرمز',
    status: 'READY_FOR_TEST',
    attendance: 92,
    className: 'نوجوانان الف',
    joinedDate: '۱۴۰۲/۰۲/۱۰',
    history: [
      { id: 'h1', date: '۱۴۰۲/۰۲/۱۰', action: 'عضویت در باشگاه پرتو' },
      { id: 'h2', date: '۱۴۰۲/۱۰/۱۵', action: 'ارتقای کمربند به آبی' },
    ],
  },
  {
    id: 'p102',
    teamId: 'FAJR',
    clubId: 'PARTO',
    name: 'سارا کریمی',
    phone: '۰۹۱۹۸۷۶۵۴۳۲',
    age: 14,
    belt: 'سبز',
    targetBelt: 'آبی',
    status: 'ACTIVE',
    attendance: 95,
    className: 'بانوان و نوجوانان',
    joinedDate: '۱۴۰۲/۰۴/۱۵',
    history: [{ id: 'h3', date: '۱۴۰۲/۰۴/۱۵', action: 'عضویت در باشگاه پرتو' }],
  },
  {
    id: 'p103',
    teamId: 'FAJR',
    clubId: 'PARTO',
    name: 'محمد احمدی',
    phone: '۰۹۳۵۱۲۳۴۵۶۷',
    age: 17,
    belt: 'قرمز',
    targetBelt: 'مشکی دان ۱',
    status: 'NEEDS_PRACTICE',
    attendance: 78,
    className: 'جوانان مبارزه',
    joinedDate: '۱۴۰۱/۰۷/۰۱',
    history: [{ id: 'h4', date: '۱۴۰۱/۰۷/۰۱', action: 'عضویت در باشگاه پرتو' }],
  },
  {
    id: 'p104',
    teamId: 'FAJR',
    clubId: 'PARTO',
    name: 'پارسا یوسفی',
    phone: '۰۹۱۸۱۱۱۲۲۳۳',
    age: 16,
    belt: 'مشکی',
    targetBelt: 'دان ۲',
    status: 'READY_FOR_TEST',
    attendance: 98,
    className: 'تیم قهرمانی الف',
    joinedDate: '۱۴۰۰/۰۵/۲۰',
    history: [{ id: 'h5', date: '۱۴۰۰/۰۵/۲۰', action: 'عضویت در باشگاه پرتو' }],
  },

  // Team Fajr - Sarvestan
  {
    id: 'p201',
    teamId: 'FAJR',
    clubId: 'SARVESTAN',
    name: 'نگار کریمی',
    phone: '۰۹۱۲۷۷۷۸۸۹۹',
    age: 13,
    belt: 'زرد',
    targetBelt: 'سبز',
    status: 'ACTIVE',
    attendance: 88,
    className: 'نونهالان و نوجوانان',
    joinedDate: '۱۴۰۲/۰۸/۰۱',
    history: [{ id: 'h6', date: '۱۴۰۲/۰۸/۰۱', action: 'عضویت در باشگاه سروستان' }],
  },
  {
    id: 'p202',
    teamId: 'FAJR',
    clubId: 'SARVESTAN',
    name: 'رضا مرادی',
    phone: '۰۹۳۰۵۵۵۶۶۷۷',
    age: 15,
    belt: 'سبز',
    targetBelt: 'آبی',
    status: 'NEEDS_PRACTICE',
    attendance: 82,
    className: 'نوجوانان عمومی',
    joinedDate: '۱۴۰۲/۰۹/۱۰',
    history: [{ id: 'h7', date: '۱۴۰۲/۰۹/۱۰', action: 'عضویت در باشگاه سروستان' }],
  },

  // Team Fajr - Hejab
  {
    id: 'p301',
    teamId: 'FAJR',
    clubId: 'HEJAB',
    name: 'مریم اکبری',
    phone: '۰۹۱۲۰۹۸۷۶۵۴',
    age: 16,
    belt: 'آبی',
    targetBelt: 'قرمز',
    status: 'ACTIVE',
    attendance: 90,
    className: 'بانوان حجاب',
    joinedDate: '۱۴۰۳/۰۱/۱۵',
    history: [{ id: 'h8', date: '۱۴۰۳/۰۱/۱۵', action: 'عضویت در باشگاه حجاب' }],
  },

  // Team X - X1
  {
    id: 'px1',
    teamId: 'TEAM_X',
    clubId: 'CLUB_X1',
    name: 'حسین اصفهانی',
    phone: '۰۹۱۳۱۱۱۰۰۰۰',
    age: 16,
    belt: 'آبی',
    targetBelt: 'قرمز',
    status: 'ACTIVE',
    attendance: 85,
    className: 'تیم X1 نوجوانان',
    joinedDate: '۱۴۰۲/۰۶/۰۱',
    history: [{ id: 'hx1', date: '۱۴۰۲/۰۶/۰۱', action: 'عضویت در باشگاه X1' }],
  },
]

const INITIAL_TASKS: TeamTask[] = [
  {
    id: 't1',
    teamId: 'FAJR',
    clubId: 'PARTO',
    title: 'ارزیابی نهایی برای آزمون ارتقای کمربند',
    description: 'بررسی آمادگی ۴ هنرجوی آماده ارتقا در باشگاه پرتو',
    assignedTo: 'استاد امینی',
    category: 'آزمون',
    priority: 'HIGH',
    status: 'PENDING',
    dueDate: '۱۴۰۵/۰۷/۰۱',
  },
  {
    id: 't2',
    teamId: 'FAJR',
    clubId: 'SARVESTAN',
    title: 'تمدید اشتراک باشگاه سروستان',
    description: 'تماس با پشتیبانی پلتفرم جهت تمدید اشتراک پایه پیش از انقضا',
    assignedTo: 'استاد فجری (مدیر تیم)',
    category: 'مالی',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    dueDate: '۱۴۰۵/۰۷/۰۵',
  },
  {
    id: 't3',
    teamId: 'FAJR',
    clubId: 'HEJAB',
    title: 'تکمیل مدارک بیمه هنرجویان جدید',
    description: 'دریافت فرم رضایت‌نامه و بیمه ورزشی سالن حجاب',
    assignedTo: 'استاد کریمی',
    category: 'اداری',
    priority: 'MEDIUM',
    status: 'PENDING',
    dueDate: '۱۴۰۵/۰۷/۱۰',
  },
  {
    id: 't4',
    teamId: 'FAJR',
    clubId: 'PARTO',
    title: 'آماده‌سازی تاتامی ۲ برای مسابقات جام فجر',
    description: 'سرویس سیستم صوتی و مانیتور نمایش امتیاز',
    assignedTo: 'مسئول فنی سالن',
    category: 'تجهیزات',
    priority: 'LOW',
    status: 'COMPLETED',
    dueDate: '۱۴۰۵/۰۶/۲۸',
  },
]

const INITIAL_WORKOUTS: TeamWorkout[] = [
  {
    id: 'w1',
    teamId: 'FAJR',
    clubId: 'PARTO',
    title: 'برنامه تخصصی ضربات چرخشی و سرعتی',
    targetGroup: 'نوجوانان الف (پرتو)',
    schedule: 'روزهای زوج - ۱۶:۰۰ الی ۱۸:۰۰',
    exercises: ['میت‌زنی سرعتی ۳ ست ۳ دقیقه‌ای', 'تمرین ضربات تی‌چاگی و دولیو', 'مبارزه کنترلی با هوگو الکترونیک'],
    participantsCount: 18,
  },
  {
    id: 'w2',
    teamId: 'FAJR',
    clubId: 'SARVESTAN',
    title: 'دوره پایه استقامت قلبی عروقی و تعادل',
    targetGroup: 'عمومی و نونهالان (سروستان)',
    schedule: 'روزهای فرد - ۱۷:۳۰ الی ۱۹:۰۰',
    exercises: ['طناب‌زنی و دوی اینتروال', 'فرم ۱ تا ۳ تکواندو', 'تمرینات انعطاف‌پذیری پا'],
    participantsCount: 14,
  },
  {
    id: 'w3',
    teamId: 'FAJR',
    clubId: 'HEJAB',
    title: 'تمرینات فرم و چابکی بانوان',
    targetGroup: 'بانوان حجاب',
    schedule: 'روزهای زوج - ۱۰:۰۰ الی ۱۱:۳۰',
    exercises: ['آمادگی جسمانی تیمی', 'پومسه ته‌گوک ۴ و ۵', 'دفاع شخصی پایه'],
    participantsCount: 10,
  },
]

const INITIAL_FINANCE: TeamTransaction[] = [
  {
    id: 'f1',
    teamId: 'FAJR',
    clubId: 'PARTO',
    title: 'شهریه ماهانه ۱۵ هنرجو',
    type: 'INCOME',
    category: 'شهریه',
    amount: 15000000,
    date: '۱۴۰۵/۰۶/۲۵',
    status: 'SETTLED',
  },
  {
    id: 'f2',
    teamId: 'FAJR',
    clubId: 'PARTO',
    title: 'خرید ۵ ست میت و محافظ ساق',
    type: 'EXPENSE',
    category: 'تجهیزات',
    amount: 4500000,
    date: '۱۴۰۵/۰۶/۲۰',
    status: 'SETTLED',
  },
  {
    id: 'f3',
    teamId: 'FAJR',
    clubId: 'SARVESTAN',
    title: 'شهریه ۸ هنرجو سروستان',
    type: 'INCOME',
    category: 'شهریه',
    amount: 7200000,
    date: '۱۴۰۵/۰۶/۲۲',
    status: 'SETTLED',
  },
  {
    id: 'f4',
    teamId: 'FAJR',
    clubId: 'SARVESTAN',
    title: 'اجاره ماهانه سالن سروستان',
    type: 'EXPENSE',
    category: 'اجاره سالن',
    amount: 8000000,
    date: '۱۴۰۵/۰۶/۰۱',
    status: 'SETTLED',
  },
  {
    id: 'f5',
    teamId: 'FAJR',
    clubId: 'HEJAB',
    title: 'شهریه دوره پاییزه بانوان',
    type: 'INCOME',
    category: 'شهریه',
    amount: 5000000,
    date: '۱۴۰۵/۰۶/۱۵',
    status: 'SETTLED',
  },
]

const INITIAL_ACTIVITY: TeamActivity[] = [
  {
    id: 'act1',
    teamId: 'FAJR',
    clubId: 'PARTO',
    who: 'مدیر تیم فجر',
    action: 'تخصیص برنامه تمرینی جدید',
    target: 'برنامه تخصصی نوجوانان الف',
    date: 'امروز، ساعت ۱۰:۳۰',
    type: 'WORKOUT',
  },
  {
    id: 'act2',
    teamId: 'FAJR',
    clubId: 'SARVESTAN',
    who: 'مدیر تیم فجر',
    action: 'ثبت وظیفه پیگیری اشتراک',
    target: 'باشگاه سروستان',
    date: 'دیروز، ساعت ۱۶:۲۰',
    type: 'SUBSCRIPTION',
  },
  {
    id: 'act3',
    teamId: 'FAJR',
    clubId: 'PARTO',
    who: 'استاد امینی',
    action: 'ثبت ارزیابی مثبت',
    target: 'علی رضایی (آماده آزمون)',
    date: '۲ روز پیش',
    type: 'PLAYER',
  },
]

// Helper to get from local storage or fallback to seed
function getStorageData<T>(key: string, defaultData: T): T {
  if (typeof window === 'undefined') return defaultData
  try {
    const item = localStorage.getItem(key)
    if (!item) {
      localStorage.setItem(key, JSON.stringify(defaultData))
      return defaultData
    }
    return JSON.parse(item)
  } catch {
    return defaultData
  }
}

function setStorageData<T>(key: string, data: T) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify(data))
    window.dispatchEvent(new Event('team-admin-store-updated'))
  } catch (e) {
    console.error('Failed to save to local storage', e)
  }
}

export function useTeamAdminStore(teamId: string | null = 'FAJR', selectedClubId: string | null = null) {
  const [clubs, setClubs] = useState<TeamClub[]>([])
  const [players, setPlayers] = useState<TeamPlayer[]>([])
  const [tasks, setTasks] = useState<TeamTask[]>([])
  const [workouts, setWorkouts] = useState<TeamWorkout[]>([])
  const [finances, setFinances] = useState<TeamTransaction[]>([])
  const [activities, setActivities] = useState<TeamActivity[]>([])
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  // Load from local storage
  useEffect(() => {
    setClubs(getStorageData<TeamClub[]>(STORAGE_KEY_CLUBS, INITIAL_CLUBS))
    setPlayers(getStorageData<TeamPlayer[]>(STORAGE_KEY_PLAYERS, INITIAL_PLAYERS))
    setTasks(getStorageData<TeamTask[]>(STORAGE_KEY_TASKS, INITIAL_TASKS))
    setWorkouts(getStorageData<TeamWorkout[]>(STORAGE_KEY_WORKOUTS, INITIAL_WORKOUTS))
    setFinances(getStorageData<TeamTransaction[]>(STORAGE_KEY_FINANCE, INITIAL_FINANCE))
    setActivities(getStorageData<TeamActivity[]>(STORAGE_KEY_ACTIVITY, INITIAL_ACTIVITY))
  }, [refreshTrigger])

  // Listen to cross-component sync events
  useEffect(() => {
    const handleSync = () => {
      setRefreshTrigger((prev) => prev + 1)
    }
    window.addEventListener('team-admin-store-updated', handleSync)
    return () => window.removeEventListener('team-admin-store-updated', handleSync)
  }, [])

  // STRICT TEAM SCOPING
  const teamClubs = clubs.filter((c) => c.teamId === teamId)
  
  // Scoped Club filtering
  const activeScopedClubs = selectedClubId
    ? teamClubs.filter((c) => c.id === selectedClubId)
    : teamClubs

  const scopedPlayers = players.filter((p) => {
    if (p.teamId !== teamId) return false
    if (selectedClubId) return p.clubId === selectedClubId
    return true
  })

  const scopedTasks = tasks.filter((t) => {
    if (t.teamId !== teamId) return false
    if (selectedClubId) return t.clubId === selectedClubId || t.clubId === 'ALL'
    return true
  })

  const scopedWorkouts = workouts.filter((w) => {
    if (w.teamId !== teamId) return false
    if (selectedClubId) return w.clubId === selectedClubId
    return true
  })

  const scopedFinances = finances.filter((f) => {
    if (f.teamId !== teamId) return false
    if (selectedClubId) return f.clubId === selectedClubId
    return true
  })

  const scopedActivities = activities.filter((a) => a.teamId === teamId)

  // ACTIONS
  const logActivity = useCallback(
    (action: string, target: string, type: TeamActivity['type'], clubId?: string) => {
      if (!teamId) return
      const newAct: TeamActivity = {
        id: 'act-' + Date.now(),
        teamId,
        clubId: clubId || selectedClubId || undefined,
        who: 'مدیر تیم',
        action,
        target,
        date: 'هم‌اکنون',
        type,
      }
      const updated = [newAct, ...getStorageData<TeamActivity[]>(STORAGE_KEY_ACTIVITY, INITIAL_ACTIVITY)]
      setStorageData(STORAGE_KEY_ACTIVITY, updated)
    },
    [teamId, selectedClubId]
  )

  // 1. Add Club
  const addClub = useCallback(
    (clubData: Omit<TeamClub, 'id' | 'teamId' | 'playersCount'>) => {
      if (!teamId) return
      const newClubId = 'CLUB_' + Date.now().toString().slice(-4)
      const newClub: TeamClub = {
        ...clubData,
        id: newClubId,
        teamId,
        playersCount: 0,
      }

      const allClubs = getStorageData<TeamClub[]>(STORAGE_KEY_CLUBS, INITIAL_CLUBS)
      const updatedClubs = [...allClubs, newClub]
      setStorageData(STORAGE_KEY_CLUBS, updatedClubs)

      // Also update AuthContext user's available clubs so the header selector reflects immediately
      try {
        const rawUser = localStorage.getItem('razmyar_user')
        if (rawUser) {
          const user = JSON.parse(rawUser)
          if (user.teamId === teamId) {
            user.availableClubs = [
              ...(user.availableClubs || []),
              { id: newClub.id, teamId, name: newClub.name, coachName: newClub.contactName },
            ]
            localStorage.setItem('razmyar_user', JSON.stringify(user))
            window.dispatchEvent(new Event('club-changed'))
          }
        }
      } catch (e) {
        console.error(e)
      }

      logActivity('ایجاد باشگاه جدید', newClub.name, 'CLUB', newClub.id)
      return newClub
    },
    [teamId, logActivity]
  )

  // 2. Update Club
  const updateClub = useCallback(
    (clubId: string, updates: Partial<TeamClub>) => {
      const allClubs = getStorageData<TeamClub[]>(STORAGE_KEY_CLUBS, INITIAL_CLUBS)
      const updatedClubs = allClubs.map((c) => (c.id === clubId ? { ...c, ...updates } : c))
      setStorageData(STORAGE_KEY_CLUBS, updatedClubs)
      logActivity('ویرایش اطلاعات باشگاه', updates.name || clubId, 'CLUB', clubId)
    },
    [logActivity]
  )

  // 3. Toggle Club Status
  const toggleClubStatus = useCallback(
    (clubId: string) => {
      const allClubs = getStorageData<TeamClub[]>(STORAGE_KEY_CLUBS, INITIAL_CLUBS)
      const target = allClubs.find((c) => c.id === clubId)
      if (!target) return
      const nextStatus = target.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
      const updatedClubs = allClubs.map((c) => (c.id === clubId ? { ...c, status: nextStatus } : c))
      setStorageData(STORAGE_KEY_CLUBS, updatedClubs)
      logActivity(
        nextStatus === 'ACTIVE' ? 'فعال‌سازی باشگاه' : 'غیرفعال‌سازی باشگاه',
        target.name,
        'CLUB',
        clubId
      )
    },
    [logActivity]
  )

  // 4. Move Player Between Clubs in the SAME Team
  const movePlayer = useCallback(
    (playerId: string, targetClubId: string) => {
      const allPlayers = getStorageData<TeamPlayer[]>(STORAGE_KEY_PLAYERS, INITIAL_PLAYERS)
      const player = allPlayers.find((p) => p.id === playerId)
      if (!player) return false

      // Target club must belong to same team
      const allClubs = getStorageData<TeamClub[]>(STORAGE_KEY_CLUBS, INITIAL_CLUBS)
      const sourceClub = allClubs.find((c) => c.id === player.clubId)
      const targetClub = allClubs.find((c) => c.id === targetClubId && c.teamId === teamId)
      if (!targetClub) {
        console.error('Target club not in same team or does not exist')
        return false
      }

      const fromName = sourceClub?.name || player.clubId
      const toName = targetClub.name

      const historyEntry = {
        id: 'h-' + Date.now(),
        date: new Date().toLocaleDateString('fa-IR'),
        action: `انتقال باشگاه از ${fromName} به ${toName}`,
        fromClub: fromName,
        toClub: toName,
      }

      const updatedPlayers = allPlayers.map((p) =>
        p.id === playerId
          ? {
              ...p,
              clubId: targetClubId,
              history: [historyEntry, ...(p.history || [])],
            }
          : p
      )
      setStorageData(STORAGE_KEY_PLAYERS, updatedPlayers)

      // Update player counts in clubs
      const updatedClubs = allClubs.map((c) => {
        if (c.id === player.clubId) return { ...c, playersCount: Math.max(0, c.playersCount - 1) }
        if (c.id === targetClubId) return { ...c, playersCount: c.playersCount + 1 }
        return c
      })
      setStorageData(STORAGE_KEY_CLUBS, updatedClubs)

      logActivity(
        'انتقال هنرجو بین باشگاه‌های تیم',
        `${player.name} از «${fromName}» به «${toName}»`,
        'PLAYER',
        targetClubId
      )
      return true
    },
    [teamId, logActivity]
  )

  // 5. Add Player
  const addPlayer = useCallback(
    (playerData: Omit<TeamPlayer, 'id' | 'teamId' | 'history'>) => {
      if (!teamId) return
      const newPlayer: TeamPlayer = {
        ...playerData,
        id: 'p-' + Date.now().toString().slice(-4),
        teamId,
        history: [{ id: 'h-' + Date.now(), date: new Date().toLocaleDateString('fa-IR'), action: `عضویت اولیه` }],
      }

      const allPlayers = getStorageData<TeamPlayer[]>(STORAGE_KEY_PLAYERS, INITIAL_PLAYERS)
      setStorageData(STORAGE_KEY_PLAYERS, [newPlayer, ...allPlayers])

      // Update club count
      const allClubs = getStorageData<TeamClub[]>(STORAGE_KEY_CLUBS, INITIAL_CLUBS)
      const updatedClubs = allClubs.map((c) =>
        c.id === newPlayer.clubId ? { ...c, playersCount: c.playersCount + 1 } : c
      )
      setStorageData(STORAGE_KEY_CLUBS, updatedClubs)

      logActivity('افزودن هنرجوی جدید', newPlayer.name, 'PLAYER', newPlayer.clubId)
      return newPlayer
    },
    [teamId, logActivity]
  )

  // 6. Tasks
  const addTask = useCallback(
    (taskData: Omit<TeamTask, 'id' | 'teamId' | 'status'>) => {
      if (!teamId) return
      const newTask: TeamTask = {
        ...taskData,
        id: 't-' + Date.now().toString().slice(-4),
        teamId,
        status: 'PENDING',
      }
      const allTasks = getStorageData<TeamTask[]>(STORAGE_KEY_TASKS, INITIAL_TASKS)
      setStorageData(STORAGE_KEY_TASKS, [newTask, ...allTasks])
      logActivity('ایجاد وظیفه جدید', newTask.title, 'TASK', newTask.clubId)
      return newTask
    },
    [teamId, logActivity]
  )

  const toggleTaskStatus = useCallback(
    (taskId: string) => {
      const allTasks = getStorageData<TeamTask[]>(STORAGE_KEY_TASKS, INITIAL_TASKS)
      const target = allTasks.find((t) => t.id === taskId)
      if (!target) return
      const nextStatus = target.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED'
      const updatedTasks = allTasks.map((t) => (t.id === taskId ? { ...t, status: nextStatus } : t))
      setStorageData(STORAGE_KEY_TASKS, updatedTasks)
      logActivity(
        nextStatus === 'COMPLETED' ? 'تکمیل وظیفه' : 'بازگشایی وظیفه',
        target.title,
        'TASK',
        target.clubId
      )
    },
    [logActivity]
  )

  // 7. Finance
  const addTransaction = useCallback(
    (txData: Omit<TeamTransaction, 'id' | 'teamId'>) => {
      if (!teamId) return
      const newTx: TeamTransaction = {
        ...txData,
        id: 'f-' + Date.now().toString().slice(-4),
        teamId,
      }
      const allFinance = getStorageData<TeamTransaction[]>(STORAGE_KEY_FINANCE, INITIAL_FINANCE)
      setStorageData(STORAGE_KEY_FINANCE, [newTx, ...allFinance])
      logActivity('ثبت تراکنش مالی', `${newTx.title} (${newTx.amount.toLocaleString('fa-IR')} تومان)`, 'FINANCE', newTx.clubId)
      return newTx
    },
    [teamId, logActivity]
  )

  // 8. Request Upgrade for Club
  const requestUpgrade = useCallback(
    (clubId: string, requestedPlan: 'PRO' | 'ENTERPRISE' = 'PRO') => {
      const targetClub = teamClubs.find((c) => c.id === clubId)
      logActivity(
        'درخواست ارتقای اشتراک',
        `ارتقای باشگاه «${targetClub?.name || clubId}» به پلن ${requestedPlan} ثبت شد`,
        'SUBSCRIPTION',
        clubId
      )
    },
    [teamClubs, logActivity]
  )

  // Aggregated KPIs
  const totalClubsCount = teamClubs.length
  const activeClubsCount = teamClubs.filter((c) => c.status === 'ACTIVE').length
  const totalPlayersCount = scopedPlayers.length
  const activeSubscriptionsCount = teamClubs.filter((c) => c.subStatus === 'ACTIVE').length
  const expiringSubscriptionsCount = teamClubs.filter((c) => c.subStatus === 'EXPIRING').length
  const pendingTasksCount = scopedTasks.filter((t) => t.status === 'PENDING').length
  const upcomingWorkoutsCount = scopedWorkouts.length

  const totalIncome = scopedFinances
    .filter((f) => f.type === 'INCOME')
    .reduce((sum, f) => sum + f.amount, 0)
  const totalExpense = scopedFinances
    .filter((f) => f.type === 'EXPENSE')
    .reduce((sum, f) => sum + f.amount, 0)
  const netBalance = totalIncome - totalExpense

  return {
    // Scoped Data
    teamClubs,
    activeScopedClubs,
    scopedPlayers,
    scopedTasks,
    scopedWorkouts,
    scopedFinances,
    scopedActivities,

    // Aggregated Metrics
    metrics: {
      totalClubsCount,
      activeClubsCount,
      totalPlayersCount,
      activeSubscriptionsCount,
      expiringSubscriptionsCount,
      pendingTasksCount,
      upcomingWorkoutsCount,
      totalIncome,
      totalExpense,
      netBalance,
    },

    // Actions
    addClub,
    updateClub,
    toggleClubStatus,
    movePlayer,
    addPlayer,
    addTask,
    toggleTaskStatus,
    addTransaction,
    requestUpgrade,
    logActivity,
  }
}
