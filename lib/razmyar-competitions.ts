// ============================================================================
// RAZMYAR COMPETITION MANAGEMENT DOMAIN & DATA MODELS
// ============================================================================

export type CompetitionStatus =
  | 'پیش‌رو'
  | 'ثبت‌نام در حال انجام'
  | 'در حال برگزاری'
  | 'به پایان رسیده'

export type CompetitionType =
  | 'درون باشگاهی'
  | 'بین باشگاهی'
  | 'استانی'

export type AgeCategory =
  | 'نونهالان'
  | 'نوجوانان'
  | 'جوانان'
  | 'بزرگسالان'

export type GenderCategory =
  | 'مردان'
  | 'زنان'

export type WeightCategory =
  | 'زیر ۴۵ کیلو'
  | '۴۵ تا ۵۵ کیلو'
  | '۵۵ تا ۶۵ کیلو'
  | 'بالای ۶۵ کیلو'

export type RegistrationStatus =
  | 'تأیید شده'
  | 'در انتظار وزن‌کشی'
  | 'وزن‌کشی شده'
  | 'انصراف'

export interface CompetitionCategory {
  id: string
  title: string
  ageGroup: AgeCategory
  gender: GenderCategory
  weight: WeightCategory
  participantsCount: number
}

export interface CompetitionParticipant {
  id: string
  studentId: string
  name: string
  age: number
  belt: string
  weight: number // in kg
  ageGroup: AgeCategory
  gender: GenderCategory
  status: RegistrationStatus
  avatar?: string
  categoryId?: string
}

export interface MatchParticipant {
  id: string
  studentId: string
  name: string
  belt: string
  avatar?: string
  score: number
  isWinner?: boolean
}

export interface Match {
  id: string
  roundTitle: string // e.g. "مرحله اول", "نیمه‌نهایی", "فینال"
  roundIndex: number // 1: Round 1, 2: Semi-final, 3: Final
  matchNumber: number
  participant1: MatchParticipant | null
  participant2: MatchParticipant | null
  winnerId: string | null
  score1: number
  score2: number
  status: 'در انتظار' | 'در حال برگزاری' | 'پایان یافته'
  timeText: string // e.g. "راند ۲ · ۰۱:۴۵" یا "پایان بازی"
  nextMatchId?: string
  nextMatchSlot?: 1 | 2
}

export interface MedalWinner {
  rank: 1 | 2 | 3
  medalType: 'طلا' | 'نقره' | 'برنز'
  studentId: string
  studentName: string
  belt: string
  categoryTitle: string
}

export interface Competition {
  id: string
  title: string
  date: string // e.g. "۲۵ شهریور ۱۴۰۵"
  location: string // e.g. "تهران، سالن آزادی"
  description: string
  type: CompetitionType
  status: CompetitionStatus
  participantsCount: number
  categories: CompetitionCategory[]
  participants: CompetitionParticipant[]
  matches: Match[]
  medals: MedalWinner[]
}

// Persian numeral formatter helper
export const fa = (n: number | string) => {
  if (typeof n === 'number') {
    return n.toLocaleString('fa-IR')
  }
  return String(n).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[parseInt(d, 10)])
}

// Color and badge mapping for competition statuses
export const STATUS_STYLES: Record<
  CompetitionStatus,
  { badge: string; dot: string; text: string }
> = {
  'پیش‌رو': {
    badge: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
    dot: 'bg-sky-400',
    text: 'پیش‌رو',
  },
  'ثبت‌نام در حال انجام': {
    badge: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    dot: 'bg-amber-400',
    text: 'ثبت‌نام در حال انجام',
  },
  'در حال برگزاری': {
    badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 animate-pulse',
    dot: 'bg-emerald-400',
    text: 'در حال برگزاری',
  },
  'به پایان رسیده': {
    badge: 'bg-muted text-muted-foreground border-border',
    dot: 'bg-muted-foreground',
    text: 'به پایان رسیده',
  },
}

// Available students for adding to competitions
export interface AcademyStudentOption {
  id: string
  name: string
  age: number
  belt: string
  weight: number
  gender: GenderCategory
  ageGroup: AgeCategory
  avatar: string
  avatarColor: string
}

export const ACADEMY_STUDENTS_LIST: AcademyStudentOption[] = [
  {
    id: '1024',
    name: 'علی رضایی',
    age: 15,
    belt: 'آبی',
    weight: 52,
    gender: 'مردان',
    ageGroup: 'نوجوانان',
    avatar: 'ع',
    avatarColor: 'from-cyan-500 to-blue-600',
  },
  {
    id: '1026',
    name: 'محمد احمدی',
    age: 17,
    belt: 'قرمز',
    weight: 62,
    gender: 'مردان',
    ageGroup: 'نوجوانان',
    avatar: 'م',
    avatarColor: 'from-rose-500 to-orange-600',
  },
  {
    id: '1025',
    name: 'سارا کریمی',
    age: 14,
    belt: 'سبز',
    weight: 48,
    gender: 'زنان',
    ageGroup: 'نوجوانان',
    avatar: 'س',
    avatarColor: 'from-emerald-500 to-teal-600',
  },
  {
    id: '1027',
    name: 'نگار کریمی',
    age: 13,
    belt: 'زرد',
    weight: 42,
    gender: 'زنان',
    ageGroup: 'نونهالان',
    avatar: 'ن',
    avatarColor: 'from-amber-500 to-yellow-600',
  },
  {
    id: '1028',
    name: 'سینا کریمی',
    age: 16,
    belt: 'آبی',
    weight: 54,
    gender: 'مردان',
    ageGroup: 'نوجوانان',
    avatar: 'س',
    avatarColor: 'from-indigo-500 to-purple-600',
  },
  {
    id: '1029',
    name: 'رضا مرادی',
    age: 15,
    belt: 'سبز',
    weight: 53,
    gender: 'مردان',
    ageGroup: 'نوجوانان',
    avatar: 'ر',
    avatarColor: 'from-teal-500 to-emerald-600',
  },
  {
    id: '1030',
    name: 'پارسا یوسفی',
    age: 16,
    belt: 'قرمز',
    weight: 60,
    gender: 'مردان',
    ageGroup: 'نوجوانان',
    avatar: 'پ',
    avatarColor: 'from-blue-500 to-cyan-600',
  },
  {
    id: '1031',
    name: 'مهدی رحیمی',
    age: 18,
    belt: 'مشکی',
    weight: 68,
    gender: 'مردان',
    ageGroup: 'جوانان',
    avatar: 'م',
    avatarColor: 'from-zinc-600 to-zinc-900',
  },
]

// Initial Tournament Bracket for "جام پاییز رزمیار" (4 fighters: Ali vs Mohammad, Sina vs Reza)
export const INITIAL_BRACKET_MATCHES: Match[] = [
  {
    id: 'm-1',
    roundTitle: 'مرحله اول',
    roundIndex: 1,
    matchNumber: 1,
    participant1: {
      id: 'p-1',
      studentId: '1024',
      name: 'علی رضایی',
      belt: 'آبی',
      avatar: 'ع',
      score: 14,
      isWinner: true,
    },
    participant2: {
      id: 'p-2',
      studentId: '1026',
      name: 'محمد احمدی',
      belt: 'قرمز',
      avatar: 'م',
      score: 11,
      isWinner: false,
    },
    winnerId: '1024',
    score1: 14,
    score2: 11,
    status: 'پایان یافته',
    timeText: 'پایان مسابقه (۳ راند)',
    nextMatchId: 'm-3',
    nextMatchSlot: 1,
  },
  {
    id: 'm-2',
    roundTitle: 'مرحله اول',
    roundIndex: 1,
    matchNumber: 2,
    participant1: {
      id: 'p-3',
      studentId: '1028',
      name: 'سینا کریمی',
      belt: 'آبی',
      avatar: 'س',
      score: 8,
      isWinner: false,
    },
    participant2: {
      id: 'p-4',
      studentId: '1029',
      name: 'رضا مرادی',
      belt: 'سبز',
      avatar: 'ر',
      score: 12,
      isWinner: true,
    },
    winnerId: '1029',
    score1: 8,
    score2: 12,
    status: 'پایان یافته',
    timeText: 'پایان مسابقه (۳ راند)',
    nextMatchId: 'm-3',
    nextMatchSlot: 2,
  },
  {
    id: 'm-3',
    roundTitle: 'فینال مسابقات',
    roundIndex: 2,
    matchNumber: 3,
    participant1: {
      id: 'p-1',
      studentId: '1024',
      name: 'علی رضایی',
      belt: 'آبی',
      avatar: 'ع',
      score: 19,
      isWinner: true,
    },
    participant2: {
      id: 'p-4',
      studentId: '1029',
      name: 'رضا مرادی',
      belt: 'سبز',
      avatar: 'ر',
      score: 15,
      isWinner: false,
    },
    winnerId: '1024',
    score1: 19,
    score2: 15,
    status: 'پایان یافته',
    timeText: 'پایان فینال',
  },
]

// Initial Competitions List
export const INITIAL_COMPETITIONS: Competition[] = [
  {
    id: 'comp-101',
    title: 'جام پاییز رزمیار',
    date: '۲۵ شهریور ۱۴۰۵',
    location: 'تهران، سالن آزادی',
    description: 'مسابقات قهرمانی درون‌باشگاهی و انتخابی تیم نوجوانان برای لیگ استان تهران.',
    type: 'درون باشگاهی',
    status: 'ثبت‌نام در حال انجام',
    participantsCount: 18,
    categories: [
      {
        id: 'cat-1',
        title: 'نوجوانان پسر - ۴۵ تا ۵۵ کیلو',
        ageGroup: 'نوجوانان',
        gender: 'مردان',
        weight: '۴۵ تا ۵۵ کیلو',
        participantsCount: 8,
      },
      {
        id: 'cat-2',
        title: 'نوجوانان پسر - ۵۵ تا ۶۵ کیلو',
        ageGroup: 'نوجوانان',
        gender: 'مردان',
        weight: '۵۵ تا ۶۵ کیلو',
        participantsCount: 6,
      },
      {
        id: 'cat-3',
        title: 'نوجوانان دختر - زیر ۴۵ کیلو',
        ageGroup: 'نوجوانان',
        gender: 'زنان',
        weight: 'زیر ۴۵ کیلو',
        participantsCount: 4,
      },
    ],
    participants: [
      {
        id: 'cp-1',
        studentId: '1024',
        name: 'علی رضایی',
        age: 15,
        belt: 'آبی',
        weight: 52,
        ageGroup: 'نوجوانان',
        gender: 'مردان',
        status: 'وزن‌کشی شده',
        avatar: 'ع',
        categoryId: 'cat-1',
      },
      {
        id: 'cp-2',
        studentId: '1026',
        name: 'محمد احمدی',
        age: 17,
        belt: 'قرمز',
        weight: 62,
        ageGroup: 'نوجوانان',
        gender: 'مردان',
        status: 'وزن‌کشی شده',
        avatar: 'م',
        categoryId: 'cat-2',
      },
      {
        id: 'cp-3',
        studentId: '1028',
        name: 'سینا کریمی',
        age: 16,
        belt: 'آبی',
        weight: 54,
        ageGroup: 'نوجوانان',
        gender: 'مردان',
        status: 'وزن‌کشی شده',
        avatar: 'س',
        categoryId: 'cat-1',
      },
      {
        id: 'cp-4',
        studentId: '1029',
        name: 'رضا مرادی',
        age: 15,
        belt: 'سبز',
        weight: 53,
        ageGroup: 'نوجوانان',
        gender: 'مردان',
        status: 'تأیید شده',
        avatar: 'ر',
        categoryId: 'cat-1',
      },
      {
        id: 'cp-5',
        studentId: '1025',
        name: 'سارا کریمی',
        age: 14,
        belt: 'سبز',
        weight: 48,
        ageGroup: 'نوجوانان',
        gender: 'زنان',
        status: 'در انتظار وزن‌کشی',
        avatar: 'س',
        categoryId: 'cat-3',
      },
    ],
    matches: INITIAL_BRACKET_MATCHES,
    medals: [
      {
        rank: 1,
        medalType: 'طلا',
        studentId: '1024',
        studentName: 'علی رضایی',
        belt: 'آبی',
        categoryTitle: 'نوجوانان پسر - ۴۵ تا ۵۵ کیلو',
      },
      {
        rank: 2,
        medalType: 'نقره',
        studentId: '1029',
        studentName: 'رضا مرادی',
        belt: 'سبز',
        categoryTitle: 'نوجوانان پسر - ۴۵ تا ۵۵ کیلو',
      },
      {
        rank: 3,
        medalType: 'برنز',
        studentId: '1026',
        studentName: 'محمد احمدی',
        belt: 'قرمز',
        categoryTitle: 'نوجوانان پسر - ۴۵ تا ۵۵ کیلو',
      },
    ],
  },
  {
    id: 'comp-102',
    title: 'مسابقات قهرمانی تکواندو استان تهران',
    date: '۱۲ مهر ۱۴۰۵',
    location: 'تهران، سالن شهید افراسیابی',
    description: 'مسابقات رسمی هیئت تکواندو استان در رده‌های نوجوانان و جوانان با حضور منتخب باشگاه‌ها.',
    type: 'استانی',
    status: 'پیش‌رو',
    participantsCount: 12,
    categories: [
      {
        id: 'cat-201',
        title: 'نوجوانان پسر - ۵۵ تا ۶۵ کیلو',
        ageGroup: 'نوجوانان',
        gender: 'مردان',
        weight: '۵۵ تا ۶۵ کیلو',
        participantsCount: 7,
      },
      {
        id: 'cat-202',
        title: 'جوانان پسر - بالای ۶۵ کیلو',
        ageGroup: 'جوانان',
        gender: 'مردان',
        weight: 'بالای ۶۵ کیلو',
        participantsCount: 5,
      },
    ],
    participants: [
      {
        id: 'cp-201',
        studentId: '1026',
        name: 'محمد احمدی',
        age: 17,
        belt: 'قرمز',
        weight: 62,
        ageGroup: 'نوجوانان',
        gender: 'مردان',
        status: 'تأیید شده',
        avatar: 'م',
      },
      {
        id: 'cp-202',
        studentId: '1030',
        name: 'پارسا یوسفی',
        age: 16,
        belt: 'قرمز',
        weight: 60,
        ageGroup: 'نوجوانان',
        gender: 'مردان',
        status: 'تأیید شده',
        avatar: 'پ',
      },
      {
        id: 'cp-203',
        studentId: '1031',
        name: 'مهدی رحیمی',
        age: 18,
        belt: 'مشکی',
        weight: 68,
        ageGroup: 'جوانان',
        gender: 'مردان',
        status: 'تأیید شده',
        avatar: 'م',
      },
    ],
    matches: [],
    medals: [],
  },
  {
    id: 'comp-103',
    title: 'جام بهاره باشگاه‌های برتر',
    date: '۲۰ اردیبهشت ۱۴۰۵',
    location: 'مجموعه ورزشی انقلاب',
    description: 'جام دوستانه بین ۴ آکادمی برتر پایتخت به میزبانی رزمیار.',
    type: 'بین باشگاهی',
    status: 'به پایان رسیده',
    participantsCount: 12,
    categories: [
      {
        id: 'cat-301',
        title: 'نوجوانان پسر - ۴۵ تا ۵۵ کیلو',
        ageGroup: 'نوجوانان',
        gender: 'مردان',
        weight: '۴۵ تا ۵۵ کیلو',
        participantsCount: 8,
      },
      {
        id: 'cat-302',
        title: 'نونهالان دختر - زیر ۴۵ کیلو',
        ageGroup: 'نونهالان',
        gender: 'زنان',
        weight: 'زیر ۴۵ کیلو',
        participantsCount: 4,
      },
    ],
    participants: [],
    matches: [],
    medals: [
      {
        rank: 1,
        medalType: 'طلا',
        studentId: '1024',
        studentName: 'علی رضایی',
        belt: 'آبی',
        categoryTitle: 'نوجوانان - ۴۵ تا ۵۵ کیلو',
      },
      {
        rank: 2,
        medalType: 'نقره',
        studentId: '1025',
        studentName: 'سارا کریمی',
        belt: 'سبز',
        categoryTitle: 'نونهالان دختر - زیر ۴۵ کیلو',
      },
    ],
  },
]

// Student competition history record
export interface StudentCompetitionRecord {
  competitionId: string
  competitionTitle: string
  date: string
  rankTitle: string // e.g. "مقام اول (مدال طلا)"
  medalType?: 'طلا' | 'نقره' | 'برنز'
  categoryTitle: string
  matchesCount: number
  winsCount: number
}

// Function to fetch all competition achievements for a given student
export function getStudentCompetitionHistory(
  studentId: string,
  competitions: Competition[] = INITIAL_COMPETITIONS
): StudentCompetitionRecord[] {
  const records: StudentCompetitionRecord[] = []

  competitions.forEach((comp) => {
    // Check if student won any medal in this competition
    const medal = comp.medals.find((m) => m.studentId === studentId)
    // Check if student participated
    const participant = comp.participants.find((p) => p.studentId === studentId)

    if (medal) {
      records.push({
        competitionId: comp.id,
        competitionTitle: comp.title,
        date: comp.date,
        rankTitle: `مقام ${medal.rank === 1 ? 'اول (مدال طلا)' : medal.rank === 2 ? 'دوم (مدال نقره)' : 'سوم (مدال برنز)'}`,
        medalType: medal.medalType,
        categoryTitle: medal.categoryTitle,
        matchesCount: 2,
        winsCount: medal.rank === 1 ? 2 : 1,
      })
    } else if (participant) {
      records.push({
        competitionId: comp.id,
        competitionTitle: comp.title,
        date: comp.date,
        rankTitle: 'حضور در مسابقه (مرحله حذفی)',
        categoryTitle: comp.categories[0]?.title || 'رده وزنی استاندارد',
        matchesCount: 1,
        winsCount: 0,
      })
    }
  })

  // Add default legacy records for student 1024 if empty
  if (studentId === '1024' && records.length === 0) {
    return [
      {
        competitionId: 'comp-legacy-1',
        competitionTitle: 'جام تهران',
        date: '۲۵ شهریور ۱۴۰۵',
        rankTitle: 'مقام اول (مدال طلا)',
        medalType: 'طلا',
        categoryTitle: 'نوجوانان - وزن دوم',
        matchesCount: 3,
        winsCount: 3,
      },
      {
        competitionId: 'comp-legacy-2',
        competitionTitle: 'مسابقات استان',
        date: '۱۰ مرداد ۱۴۰۵',
        rankTitle: 'مقام سوم (مدال برنز)',
        medalType: 'برنز',
        categoryTitle: 'نوجوانان - وزن دوم',
        matchesCount: 3,
        winsCount: 2,
      },
      {
        competitionId: 'comp-legacy-3',
        competitionTitle: 'جام باشگاه‌ها',
        date: '۲۲ تیر ۱۴۰۵',
        rankTitle: 'مقام دوم (مدال نقره)',
        medalType: 'نقره',
        categoryTitle: 'نوجوانان - وزن دوم',
        matchesCount: 3,
        winsCount: 2,
      },
    ]
  }

  return records
}
