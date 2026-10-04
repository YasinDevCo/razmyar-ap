'use client'

import { useState, useEffect, useCallback } from 'react'
import { PersonalTask, PersonalWorkout, PersonalReminder, PersonalProfile } from './types'

const STORAGE_KEY_USER_TASKS = 'razmyar_user_tasks_v1'
const STORAGE_KEY_USER_WORKOUTS = 'razmyar_user_workouts_v1'
const STORAGE_KEY_USER_REMINDERS = 'razmyar_user_reminders_v1'
const STORAGE_KEY_USER_PROFILE = 'razmyar_user_profile_v1'

const INITIAL_TASKS: PersonalTask[] = [
  {
    id: 'ut-1',
    title: 'تمرین کششی و انعطاف‌پذیری پا',
    description: 'آمادگی عضلات همسترینگ برای ضربه تی‌چاگی',
    priority: 'HIGH',
    status: 'PENDING',
    dueDate: 'امروز، ساعت ۱۶:۰۰',
    repeat: 'DAILY',
    checklist: [
      { id: 'c1', title: 'گرم کردن عمومی ۵ دقیقه', completed: true },
      { id: 'c2', title: 'کشش همسترینگ و کشاله ران ۱۰ دقیقه', completed: false },
      { id: 'c3', title: 'تمرین باز کردن پا ۱۸۰ درجه ۵ دقیقه', completed: false },
    ],
  },
  {
    id: 'ut-2',
    title: 'مرور فرم شماره ۳ (پومسه ته‌گوک سام‌جانگ)',
    description: 'اصلاح زاویه چرخش در تکنیک آپ‌چاگی و موم‌تونگ ماکی',
    priority: 'MEDIUM',
    status: 'PENDING',
    dueDate: 'فردا، ساعت ۱۸:۰۰',
    repeat: 'NONE',
    checklist: [
      { id: 'c4', title: 'مشاهده ویدئوی آموزشی فرم ۳', completed: true },
      { id: 'c5', title: '۳ بار اجرای کامل بدون وقفه', completed: false },
    ],
  },
  {
    id: 'ut-3',
    title: 'خرید ساق‌بند و روپایی استاندارد مسابقه',
    description: 'تجهیزات مورد تایید فدراسیون برای مسابقات ماه آینده',
    priority: 'LOW',
    status: 'COMPLETED',
    dueDate: 'دیروز',
    repeat: 'NONE',
    checklist: [],
  },
]

const INITIAL_WORKOUTS: PersonalWorkout[] = [
  {
    id: 'uw-1',
    title: 'تمرین ضربات سرعتی و استقامت تاتامی',
    coach: 'استاد امینی (باشگاه پرتو)',
    assignedDate: 'امروز، ۱۴ شهریور',
    status: 'ASSIGNED',
    durationMinutes: 60,
    exercises: [
      { name: 'میت‌زنی سرعتی دولیو چاگی', sets: 4, reps: '۲۰ ضربه هر پا', completed: false, record: '۳۵ ثانیه' },
      { name: 'حرکت پای سرعتی (Stepping) و فرار', sets: 3, reps: '۲ دقیقه ممتد', completed: false },
      { name: 'تمرین مبارزه سایه‌ای (Shadow Sparring)', sets: 3, reps: '۳ دقیقه', completed: false },
    ],
    userNotes: '',
  },
  {
    id: 'uw-2',
    title: 'آمادگی جسمانی پایه و تقویت میان‌تنه',
    coach: 'استاد امینی',
    assignedDate: '۲ روز پیش',
    status: 'COMPLETED',
    durationMinutes: 45,
    exercises: [
      { name: 'پلانک شکم', sets: 3, reps: '۶۰ ثانیه', completed: true, record: '۶۵ ثانیه' },
      { name: 'شنا سوئدی انفجاری', sets: 4, reps: '۱۵ تکرار', completed: true, record: '۱۵' },
      { name: 'بورپی و پرش ارتفاع', sets: 3, reps: '۱۲ تکرار', completed: true, record: '۱۲' },
    ],
    userNotes: 'تمرین عالی بود، تنفس و رکورد پلانک بهبود یافت.',
    completedAt: 'دیروز، ساعت ۱۸:۳۰',
  },
]

const INITIAL_REMINDERS: PersonalReminder[] = [
  {
    id: 'ur-1',
    title: 'کلاس تمرین نوجوانان الف در باشگاه پرتو',
    dateTime: 'امروز، ساعت ۱۷:۰۰',
    category: 'WORKOUT',
    active: true,
  },
  {
    id: 'ur-2',
    title: 'مصرف مکمل تقویتی و آب کافی قبل تمرین',
    dateTime: 'امروز، ساعت ۱۶:۰۰',
    category: 'SUPPLEMENT',
    active: true,
  },
  {
    id: 'ur-3',
    title: 'آزمون ارتقای کمربند به رنگ قرمز',
    dateTime: 'جمعه آینده، ساعت ۰۹:۰۰',
    category: 'EXAM',
    active: true,
  },
]

const INITIAL_PROFILE: PersonalProfile = {
  name: 'علی رضایی',
  phone: '۰۹۱۲۳۴۵۶۷۸۹',
  avatar: 'ع',
  belt: 'آبی',
  targetBelt: 'قرمز',
  clubName: 'باشگاه پرتو',
  coachName: 'استاد امینی',
  language: 'fa',
  theme: 'dark',
  notifications: {
    sms: true,
    push: true,
    reminderWorkout: true,
  },
}

function getStored<T>(key: string, defaultData: T): T {
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

function setStored<T>(key: string, data: T) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify(data))
    window.dispatchEvent(new Event('user-store-updated'))
  } catch (e) {
    console.error('Failed to save to local storage', e)
  }
}

export function useUserStore() {
  const [tasks, setTasks] = useState<PersonalTask[]>([])
  const [workouts, setWorkouts] = useState<PersonalWorkout[]>([])
  const [reminders, setReminders] = useState<PersonalReminder[]>([])
  const [profile, setProfile] = useState<PersonalProfile>(INITIAL_PROFILE)
  const [refresh, setRefresh] = useState(0)

  useEffect(() => {
    setTasks(getStored<PersonalTask[]>(STORAGE_KEY_USER_TASKS, INITIAL_TASKS))
    setWorkouts(getStored<PersonalWorkout[]>(STORAGE_KEY_USER_WORKOUTS, INITIAL_WORKOUTS))
    setReminders(getStored<PersonalReminder[]>(STORAGE_KEY_USER_REMINDERS, INITIAL_REMINDERS))
    setProfile(getStored<PersonalProfile>(STORAGE_KEY_USER_PROFILE, INITIAL_PROFILE))
  }, [refresh])

  useEffect(() => {
    const handleSync = () => setRefresh((p) => p + 1)
    window.addEventListener('user-store-updated', handleSync)
    return () => window.removeEventListener('user-store-updated', handleSync)
  }, [])

  // TASKS
  const addTask = useCallback((taskData: Omit<PersonalTask, 'id' | 'status'>) => {
    const newTask: PersonalTask = {
      ...taskData,
      id: 'ut-' + Date.now(),
      status: 'PENDING',
    }
    const current = getStored<PersonalTask[]>(STORAGE_KEY_USER_TASKS, INITIAL_TASKS)
    setStored(STORAGE_KEY_USER_TASKS, [newTask, ...current])
    return newTask
  }, [])

  const toggleTask = useCallback((taskId: string) => {
    const current = getStored<PersonalTask[]>(STORAGE_KEY_USER_TASKS, INITIAL_TASKS)
    const updated = current.map((t) =>
      t.id === taskId
        ? { ...t, status: (t.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED') as PersonalTask['status'] }
        : t
    )
    setStored(STORAGE_KEY_USER_TASKS, updated)
  }, [])

  const toggleChecklistItem = useCallback((taskId: string, itemId: string) => {
    const current = getStored<PersonalTask[]>(STORAGE_KEY_USER_TASKS, INITIAL_TASKS)
    const updated = current.map((t) => {
      if (t.id !== taskId) return t
      const nextChecklist = (t.checklist || []).map((c) =>
        c.id === itemId ? { ...c, completed: !c.completed } : c
      )
      return { ...t, checklist: nextChecklist }
    })
    setStored(STORAGE_KEY_USER_TASKS, updated)
  }, [])

  const deleteTask = useCallback((taskId: string) => {
    const current = getStored<PersonalTask[]>(STORAGE_KEY_USER_TASKS, INITIAL_TASKS)
    setStored(
      STORAGE_KEY_USER_TASKS,
      current.filter((t) => t.id !== taskId)
    )
  }, [])

  // WORKOUTS
  const toggleExercise = useCallback((workoutId: string, exerciseIndex: number) => {
    const current = getStored<PersonalWorkout[]>(STORAGE_KEY_USER_WORKOUTS, INITIAL_WORKOUTS)
    const updated = current.map((w) => {
      if (w.id !== workoutId) return w
      const nextExercises = [...w.exercises]
      nextExercises[exerciseIndex] = {
        ...nextExercises[exerciseIndex],
        completed: !nextExercises[exerciseIndex].completed,
      }
      return { ...w, exercises: nextExercises }
    })
    setStored(STORAGE_KEY_USER_WORKOUTS, updated)
  }, [])

  const completeWorkout = useCallback((workoutId: string, notes?: string) => {
    const current = getStored<PersonalWorkout[]>(STORAGE_KEY_USER_WORKOUTS, INITIAL_WORKOUTS)
    const updated = current.map((w) =>
      w.id === workoutId
        ? {
            ...w,
            status: 'COMPLETED' as PersonalWorkout['status'],
            userNotes: notes || w.userNotes,
            completedAt: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
            exercises: w.exercises.map((e) => ({ ...e, completed: true })),
          }
        : w
    )
    setStored(STORAGE_KEY_USER_WORKOUTS, updated)
  }, [])

  const addWorkout = useCallback((data: Omit<PersonalWorkout, 'id' | 'status'>) => {
    const newWorkout: PersonalWorkout = {
      ...data,
      id: 'uw-' + Date.now(),
      status: 'PENDING',
    }
    const current = getStored<PersonalWorkout[]>(STORAGE_KEY_USER_WORKOUTS, INITIAL_WORKOUTS)
    setStored(STORAGE_KEY_USER_WORKOUTS, [newWorkout, ...current])
    return newWorkout
  }, [])

  // REMINDERS
  const addReminder = useCallback((data: Omit<PersonalReminder, 'id' | 'active'>) => {
    const newRem: PersonalReminder = {
      ...data,
      id: 'ur-' + Date.now(),
      active: true,
    }
    const current = getStored<PersonalReminder[]>(STORAGE_KEY_USER_REMINDERS, INITIAL_REMINDERS)
    setStored(STORAGE_KEY_USER_REMINDERS, [newRem, ...current])
    return newRem
  }, [])

  const toggleReminder = useCallback((id: string) => {
    const current = getStored<PersonalReminder[]>(STORAGE_KEY_USER_REMINDERS, INITIAL_REMINDERS)
    setStored(
      STORAGE_KEY_USER_REMINDERS,
      current.map((r) => (r.id === id ? { ...r, active: !r.active } : r))
    )
  }, [])

  const deleteReminder = useCallback((id: string) => {
    const current = getStored<PersonalReminder[]>(STORAGE_KEY_USER_REMINDERS, INITIAL_REMINDERS)
    setStored(
      STORAGE_KEY_USER_REMINDERS,
      current.filter((r) => r.id !== id)
    )
  }, [])

  // PROFILE
  const updateProfile = useCallback((updates: Partial<PersonalProfile>) => {
    const current = getStored<PersonalProfile>(STORAGE_KEY_USER_PROFILE, INITIAL_PROFILE)
    const next = { ...current, ...updates }
    setStored(STORAGE_KEY_USER_PROFILE, next)
  }, [])

  return {
    tasks,
    workouts,
    reminders,
    profile,
    addTask,
    toggleTask,
    toggleChecklistItem,
    deleteTask,
    addWorkout,
    toggleExercise,
    completeWorkout,
    addReminder,
    toggleReminder,
    deleteReminder,
    updateProfile,
  }
}
