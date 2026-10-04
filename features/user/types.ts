export interface ChecklistItem {
  id: string
  title: string
  completed: boolean
}

export interface PersonalTask {
  id: string
  title: string
  description?: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
  status: 'PENDING' | 'COMPLETED'
  dueDate: string
  reminder?: string
  repeat: 'NONE' | 'DAILY' | 'WEEKLY'
  checklist: ChecklistItem[]
}

export interface PersonalWorkoutExercise {
  name: string
  sets: number
  reps: string
  completed: boolean
  record?: string
}

export interface PersonalWorkout {
  id: string
  title: string
  coach: string
  assignedDate: string
  status: 'PENDING' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED'
  durationMinutes: number
  exercises: PersonalWorkoutExercise[]
  userNotes?: string
  completedAt?: string
}

export interface PersonalReminder {
  id: string
  title: string
  dateTime: string
  category: 'WORKOUT' | 'SUPPLEMENT' | 'EXAM' | 'GENERAL'
  active: boolean
}

export interface PersonalProfile {
  name: string
  phone: string
  avatar: string
  belt: string
  targetBelt: string
  clubName: string
  coachName: string
  language: 'fa' | 'en'
  theme: 'dark' | 'light'
  notifications: {
    sms: boolean
    push: boolean
    reminderWorkout: boolean
  }
}
