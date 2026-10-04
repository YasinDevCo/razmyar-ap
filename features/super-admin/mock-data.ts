export const MOCK_TEAMS = [
  { id: 't1', name: 'تیم فجر', code: 'FAJR', status: 'ACTIVE', contactName: 'استاد فجری', contactPhone: '09121111111', contactEmail: 'fajr@example.com', clubsCount: 3, usersCount: 15, plan: 'PRO', subStatus: 'ACTIVE', subExp: '1403/12/29' },
  { id: 't2', name: 'تیم X', code: 'TEAM_X', status: 'ACTIVE', contactName: 'مربی ایکس', contactPhone: '09122222222', contactEmail: 'x@example.com', clubsCount: 2, usersCount: 8, plan: 'BASIC', subStatus: 'EXPIRING', subExp: '1402/07/01' },
  { id: 't3', name: 'تیم قهرمانان', code: 'CHAMPS', status: 'SUSPENDED', contactName: 'علی دایی', contactPhone: '09123333333', contactEmail: 'champ@example.com', clubsCount: 1, usersCount: 5, plan: 'PRO', subStatus: 'SUSPENDED', subExp: '1403/01/01' },
]

export const MOCK_CLUBS = [
  { id: 'c1', name: 'باشگاه پرتو', teamId: 't1', teamName: 'تیم فجر', code: 'PARTO', status: 'ACTIVE', subStatus: 'ACTIVE', plan: 'PRO', startDate: '1402/01/01', expDate: '1403/12/29', playersCount: 50, usersCount: 3 },
  { id: 'c2', name: 'باشگاه سروستان', teamId: 't1', teamName: 'تیم فجر', code: 'SARVESTAN', status: 'ACTIVE', subStatus: 'EXPIRING', plan: 'BASIC', startDate: '1402/02/01', expDate: '1402/07/15', playersCount: 30, usersCount: 2 },
  { id: 'c3', name: 'باشگاه حجاب', teamId: 't1', teamName: 'تیم فجر', code: 'HEJAB', status: 'INACTIVE', subStatus: 'NO_SUB', plan: '-', startDate: '-', expDate: '-', playersCount: 10, usersCount: 1 },
  { id: 'c4', name: 'باشگاه پیروزی X1', teamId: 't2', teamName: 'تیم X', code: 'X1', status: 'ACTIVE', subStatus: 'ACTIVE', plan: 'BASIC', startDate: '1402/05/01', expDate: '1403/05/01', playersCount: 20, usersCount: 1 },
]

export const MOCK_PLANS = [
  { id: 'p1', name: 'BASIC', description: 'مناسب باشگاه‌های کوچک', price: '۵۰۰,۰۰۰ تومان', cycle: 'ماهانه', maxClubs: 1, maxUsers: 2, maxPlayers: 50, storage: '1GB', features: { workout: true, finance: false, reports: false, reminders: false, journal: false }, status: 'ACTIVE' },
  { id: 'p2', name: 'PRO', description: 'مناسب تیم‌های حرفه‌ای', price: '۲,۰۰۰,۰۰۰ تومان', cycle: 'ماهانه', maxClubs: 5, maxUsers: 10, maxPlayers: 500, storage: '10GB', features: { workout: true, finance: true, reports: true, reminders: true, journal: true }, status: 'ACTIVE' },
]

export const MOCK_SUBSCRIPTIONS = [
  { id: 's1', teamId: 'FAJR', teamName: 'تیم فجر', plan: 'PRO', status: 'ACTIVE', start: '2026/01/01', exp: '2027/01/01', autoRenew: true, paymentStatus: 'PAID', clubsCovered: 3 },
  { id: 's2', teamId: 'TEAM_X', teamName: 'تیم X', plan: 'BASIC', status: 'ACTIVE', start: '2026/05/01', exp: '2027/05/01', autoRenew: true, paymentStatus: 'PAID', clubsCovered: 2 },
  { id: 's3', teamId: 'CHAMPS', teamName: 'تیم قهرمانان', plan: 'PRO', status: 'SUSPENDED', start: '2025/01/01', exp: '2026/01/01', autoRenew: false, paymentStatus: 'FAILED', clubsCovered: 1 },
]

export const MOCK_USERS = [
  { id: 'u1', name: 'مدیر کل پلتفرم', email: 'owner@razmyar.ir', role: 'SUPER_ADMIN', teamName: '-', clubName: '-', status: 'ACTIVE' },
  { id: 'u2', name: 'ادمین تیم فجر', email: 'coach_fajr', role: 'TEAM_ADMIN', teamName: 'تیم فجر', clubName: '-', status: 'ACTIVE' },
  { id: 'u3', name: 'هنرجوی عادی', email: 'user@razmyar.ir', role: 'USER', teamName: 'تیم فجر', clubName: 'باشگاه پرتو', status: 'ACTIVE' },
]

export const MOCK_ACTIVITY = [
  { id: 'a1', who: 'Platform Owner', action: 'فعال‌سازی اشتراک', target: 'باشگاه پرتو', team: 'تیم فجر', club: 'پرتو', date: '۱۴۰۲/۰۶/۲۵ ۱۰:۱۵', status: 'SUCCESS' },
  { id: 'a2', who: 'Platform Owner', action: 'ایجاد تیم جدید', target: 'تیم X', team: 'تیم X', club: '-', date: '۱۴۰۲/۰۶/۲۴ ۱۶:۳۰', status: 'SUCCESS' },
  { id: 'a3', who: 'System', action: 'هشدار پایان اشتراک', target: 'باشگاه سروستان', team: 'تیم فجر', club: 'سروستان', date: '۱۴۰۲/۰۶/۲۳ ۰۸:۰۰', status: 'WARNING' },
]
