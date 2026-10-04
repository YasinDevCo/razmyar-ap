export interface TeamClub {
  id: string
  teamId: string
  name: string
  code: string
  contactName: string
  coachName?: string
  phone: string
  email: string
  address: string
  status: 'ACTIVE' | 'INACTIVE'
  playersCount: number
  notes?: string
  // Subscription is inherited from Team (resolved via getClubSubscriptionStatus)
  subPlan?: 'PRO' | 'BASIC' | 'NONE'
  subStatus?: 'ACTIVE' | 'EXPIRING' | 'EXPIRED' | 'NO_SUB'
  subExpiration?: string
}

export interface PlayerHistoryItem {
  id: string
  date: string
  action: string
  fromClub?: string
  toClub?: string
  details?: string
}

export interface TeamPlayer {
  id: string
  teamId: string
  clubId: string
  name: string
  phone: string
  age: number
  belt: string
  targetBelt: string
  status: 'ACTIVE' | 'NEEDS_PRACTICE' | 'READY_FOR_TEST' | 'INACTIVE'
  attendance: number
  className: string
  joinedDate: string
  history: PlayerHistoryItem[]
}

export interface TeamTask {
  id: string
  teamId: string
  clubId: string // specific club ID or 'ALL'
  title: string
  description?: string
  assignedTo: string
  category: 'مسابقات' | 'آزمون' | 'اداری' | 'مالی' | 'تجهیزات'
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'
  dueDate: string
}

export interface TeamWorkout {
  id: string
  teamId: string
  clubId: string
  title: string
  targetGroup: string
  schedule: string
  exercises: string[]
  participantsCount: number
}

export interface TeamTransaction {
  id: string
  teamId: string
  clubId: string
  title: string
  type: 'INCOME' | 'EXPENSE'
  category: 'شهریه' | 'تجهیزات' | 'حق‌الزحمه مربی' | 'اجاره سالن' | 'بیمه' | 'سایر'
  amount: number
  date: string
  status: 'SETTLED' | 'PENDING'
}

export interface TeamActivity {
  id: string
  teamId: string
  clubId?: string
  who: string
  action: string
  target: string
  date: string
  type: 'CLUB' | 'PLAYER' | 'WORKOUT' | 'TASK' | 'FINANCE' | 'SUBSCRIPTION'
}
