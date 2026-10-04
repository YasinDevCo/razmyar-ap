import { fa } from './razmyar-domain'

export type ReadinessLevelType = 'در حال پیشرفت' | 'نیازمند تمرین' | 'نزدیک به آمادگی' | 'آماده ارزیابی'

export interface BeltCategoryRequirement {
  category: string
  minimumScore: number
}

export interface BeltRequirementItem {
  id: string
  category: string
  name: string
  minimumScore: number
  description?: string
}

export interface BeltLevelConfig {
  id: string
  name: string
  order: number
  color: string
  bgColor: string
  textColor: string
  borderColor: string
  dotColor: string
  minimumOverallScore: number
  categoryRequirements: BeltCategoryRequirement[]
  skillRequirements: BeltRequirementItem[]
  studentCount: number
  nearPromotionCount: number
}

export interface PromotionHistoryRecord {
  beltName: string
  date: string
  evaluator?: string
  score?: number
}

export interface StudentProgressionProfile {
  studentId: string
  name: string
  avatar: string
  avatarColor: string
  currentBelt: string
  targetBelt: string
  className: string
  age: number
  readinessScore: number
  weakestCategory: string
  lastAssessmentDate: string
  weakSkills: Array<{
    name: string
    score: number
  }>
  studentSkillScores: Record<string, number>
  studentCategoryScores: Record<string, number>
  promotionHistory: PromotionHistoryRecord[]
}

export interface MartialArtDiscipline {
  id: string
  name: string
  belts: BeltLevelConfig[]
}

export function getReadinessLevel(score: number): {
  level: ReadinessLevelType
  badgeClass: string
  textClass: string
  barColor: string
} {
  if (score < 60) {
    return {
      level: 'در حال پیشرفت',
      badgeClass: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
      textClass: 'text-slate-400',
      barColor: 'bg-slate-500',
    }
  }
  if (score < 80) {
    return {
      level: 'نیازمند تمرین',
      badgeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
      textClass: 'text-amber-400',
      barColor: 'bg-amber-500',
    }
  }
  if (score < 90) {
    return {
      level: 'نزدیک به آمادگی',
      badgeClass: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
      textClass: 'text-blue-400',
      barColor: 'bg-blue-500',
    }
  }
  return {
    level: 'آماده ارزیابی',
    badgeClass: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    textClass: 'text-emerald-400',
    barColor: 'bg-emerald-500',
  }
}

export const DEFAULT_TAEKWONDO_BELTS: BeltLevelConfig[] = [
  {
    id: 'belt-white',
    name: 'سفید',
    order: 1,
    color: '#e2e8f0',
    bgColor: 'bg-slate-100/10',
    textColor: 'text-slate-200',
    borderColor: 'border-slate-300/30',
    dotColor: 'bg-slate-200',
    minimumOverallScore: 60,
    studentCount: 8,
    nearPromotionCount: 4,
    categoryRequirements: [
      { category: 'تکنیک‌ها', minimumScore: 60 },
      { category: 'فرم', minimumScore: 60 },
      { category: 'مبارزه', minimumScore: 50 },
      { category: 'آمادگی جسمانی', minimumScore: 60 },
    ],
    skillRequirements: [
      { id: 'sk-1', category: 'تکنیک‌ها', name: 'آپ چاگی مقدماتی', minimumScore: 60 },
      { id: 'sk-2', category: 'تکنیک‌ها', name: 'دولیو چاگی مقدماتی', minimumScore: 60 },
      { id: 'sk-3', category: 'فرم', name: 'تایگوک ایل جانگ', minimumScore: 60 },
      { id: 'sk-4', category: 'آمادگی جسمانی', name: 'انعطاف‌پذیری پایه', minimumScore: 60 },
    ],
  },
  {
    id: 'belt-yellow',
    name: 'زرد',
    order: 2,
    color: '#eab308',
    bgColor: 'bg-amber-500/15',
    textColor: 'text-amber-300',
    borderColor: 'border-amber-500/30',
    dotColor: 'bg-amber-400',
    minimumOverallScore: 70,
    studentCount: 6,
    nearPromotionCount: 2,
    categoryRequirements: [
      { category: 'تکنیک‌ها', minimumScore: 70 },
      { category: 'فرم', minimumScore: 70 },
      { category: 'مبارزه', minimumScore: 60 },
      { category: 'آمادگی جسمانی', minimumScore: 65 },
    ],
    skillRequirements: [
      { id: 'sk-5', category: 'تکنیک‌ها', name: 'آپ چاگی', minimumScore: 70 },
      { id: 'sk-6', category: 'تکنیک‌ها', name: 'دولیو چاگی', minimumScore: 65 },
      { id: 'sk-7', category: 'تکنیک‌ها', name: 'یوپ چاگی مقدماتی', minimumScore: 65 },
      { id: 'sk-8', category: 'فرم', name: 'تایگوک ای جانگ', minimumScore: 70 },
      { id: 'sk-9', category: 'مبارزه', name: 'حمله مستقیم', minimumScore: 65 },
      { id: 'sk-10', category: 'آمادگی جسمانی', name: 'سرعت و استقامت', minimumScore: 65 },
    ],
  },
  {
    id: 'belt-green',
    name: 'سبز',
    order: 3,
    color: '#22c55e',
    bgColor: 'bg-emerald-500/15',
    textColor: 'text-emerald-300',
    borderColor: 'border-emerald-500/30',
    dotColor: 'bg-emerald-400',
    minimumOverallScore: 75,
    studentCount: 5,
    nearPromotionCount: 2,
    categoryRequirements: [
      { category: 'تکنیک‌ها', minimumScore: 75 },
      { category: 'فرم', minimumScore: 75 },
      { category: 'مبارزه', minimumScore: 70 },
      { category: 'آمادگی جسمانی', minimumScore: 70 },
    ],
    skillRequirements: [
      { id: 'sk-11', category: 'تکنیک‌ها', name: 'آپ چاگی', minimumScore: 75 },
      { id: 'sk-12', category: 'تکنیک‌ها', name: 'دولیو چاگی', minimumScore: 75 },
      { id: 'sk-13', category: 'تکنیک‌ها', name: 'یوپ چاگی', minimumScore: 70 },
      { id: 'sk-14', category: 'تکنیک‌ها', name: 'دوی چاگی', minimumScore: 70 },
      { id: 'sk-15', category: 'فرم', name: 'تایگوک سام جانگ', minimumScore: 75 },
      { id: 'sk-16', category: 'مبارزه', name: 'دفاع و ضدحمله', minimumScore: 70 },
      { id: 'sk-17', category: 'آمادگی جسمانی', name: 'انعطاف‌پذیری و چابکی', minimumScore: 70 },
    ],
  },
  {
    id: 'belt-blue',
    name: 'آبی',
    order: 4,
    color: '#3b82f6',
    bgColor: 'bg-blue-500/15',
    textColor: 'text-blue-300',
    borderColor: 'border-blue-500/30',
    dotColor: 'bg-blue-400',
    minimumOverallScore: 80,
    studentCount: 7,
    nearPromotionCount: 3,
    categoryRequirements: [
      { category: 'تکنیک‌ها', minimumScore: 80 },
      { category: 'فرم', minimumScore: 80 },
      { category: 'مبارزه', minimumScore: 75 },
      { category: 'آمادگی جسمانی', minimumScore: 70 },
    ],
    skillRequirements: [
      { id: 'sk-18', category: 'تکنیک‌ها', name: 'آپ چاگی', minimumScore: 75 },
      { id: 'sk-19', category: 'تکنیک‌ها', name: 'دولیو چاگی', minimumScore: 80 },
      { id: 'sk-20', category: 'تکنیک‌ها', name: 'یوپ چاگی', minimumScore: 75 },
      { id: 'sk-21', category: 'تکنیک‌ها', name: 'دوی چاگی', minimumScore: 80 },
      { id: 'sk-22', category: 'فرم', name: 'تایگوک سا جانگ و او جانگ', minimumScore: 80 },
      { id: 'sk-23', category: 'مبارزه', name: 'دفاع در فاصله نزدیک', minimumScore: 75 },
      { id: 'sk-24', category: 'مبارزه', name: 'حمله متقابل', minimumScore: 75 },
      { id: 'sk-25', category: 'مبارزه', name: 'جابه‌جایی پا', minimumScore: 75 },
      { id: 'sk-26', category: 'آمادگی جسمانی', name: 'انعطاف‌پذیری و توان انفجاری', minimumScore: 75 },
    ],
  },
  {
    id: 'belt-red',
    name: 'قرمز',
    order: 5,
    color: '#ef4444',
    bgColor: 'bg-rose-500/15',
    textColor: 'text-rose-300',
    borderColor: 'border-rose-500/30',
    dotColor: 'bg-rose-400',
    minimumOverallScore: 85,
    studentCount: 3,
    nearPromotionCount: 1,
    categoryRequirements: [
      { category: 'تکنیک‌ها', minimumScore: 85 },
      { category: 'فرم', minimumScore: 85 },
      { category: 'مبارزه', minimumScore: 80 },
      { category: 'آمادگی جسمانی', minimumScore: 80 },
    ],
    skillRequirements: [
      { id: 'sk-27', category: 'تکنیک‌ها', name: 'ترکیب‌های چاگی پیشرفته', minimumScore: 85 },
      { id: 'sk-28', category: 'تکنیک‌ها', name: 'دوی هوریو چاگی', minimumScore: 80 },
      { id: 'sk-29', category: 'فرم', name: 'تایگوک یوک جانگ تا پال جانگ', minimumScore: 85 },
      { id: 'sk-30', category: 'مبارزه', name: 'مدیریت فاصله و هوگیو', minimumScore: 80 },
      { id: 'sk-31', category: 'آمادگی جسمانی', name: 'استقامت قلبی و سرعت ضربه', minimumScore: 85 },
    ],
  },
  {
    id: 'belt-black',
    name: 'مشکی',
    order: 6,
    color: '#111827',
    bgColor: 'bg-neutral-800',
    textColor: 'text-neutral-200',
    borderColor: 'border-neutral-700',
    dotColor: 'bg-neutral-300',
    minimumOverallScore: 90,
    studentCount: 3,
    nearPromotionCount: 0,
    categoryRequirements: [
      { category: 'تکنیک‌ها', minimumScore: 90 },
      { category: 'فرم', minimumScore: 90 },
      { category: 'مبارزه', minimumScore: 85 },
      { category: 'آمادگی جسمانی', minimumScore: 85 },
    ],
    skillRequirements: [
      { id: 'sk-32', category: 'تکنیک‌ها', name: 'تسلط کامل بر تکنیک‌های پومسه و کیوروگی', minimumScore: 90 },
      { id: 'sk-33', category: 'فرم', name: 'فرم کوریو (Koryo)', minimumScore: 90 },
      { id: 'sk-34', category: 'مبارزه', name: 'مبارزه آزاد و داوری', minimumScore: 85 },
      { id: 'sk-35', category: 'آمادگی جسمانی', name: 'آمادگی بدنی سطح قهرمانی', minimumScore: 90 },
    ],
  },
]

export const DISCIPLINES: MartialArtDiscipline[] = [
  {
    id: 'taekwondo',
    name: 'تکواندو (WT)',
    belts: DEFAULT_TAEKWONDO_BELTS,
  },
  {
    id: 'karate',
    name: 'کاراته (WKF)',
    belts: [
      { ...DEFAULT_TAEKWONDO_BELTS[0], name: 'سفید' },
      { ...DEFAULT_TAEKWONDO_BELTS[1], name: 'زرد' },
      { ...DEFAULT_TAEKWONDO_BELTS[2], name: 'نارنجی', color: '#f97316' },
      { ...DEFAULT_TAEKWONDO_BELTS[3], name: 'سبز' },
      { ...DEFAULT_TAEKWONDO_BELTS[4], name: 'آبی' },
      { ...DEFAULT_TAEKWONDO_BELTS[5], name: 'قهوه‌ای', color: '#78350f' },
    ],
  },
  {
    id: 'bjj',
    name: 'جوجیتسو برزیلی (IBJJF)',
    belts: [
      { ...DEFAULT_TAEKWONDO_BELTS[0], name: 'سفید' },
      { ...DEFAULT_TAEKWONDO_BELTS[3], name: 'آبی' },
      { ...DEFAULT_TAEKWONDO_BELTS[4], name: 'بنفش', color: '#9333ea' },
      { ...DEFAULT_TAEKWONDO_BELTS[5], name: 'قهوه‌ای', color: '#78350f' },
      { ...DEFAULT_TAEKWONDO_BELTS[5], name: 'مشکی' },
    ],
  },
]

export const PROGRESSION_STUDENTS: StudentProgressionProfile[] = [
  {
    studentId: '1024',
    name: 'علی رضایی',
    avatar: 'ع',
    avatarColor: 'from-cyan-500 to-blue-600',
    currentBelt: 'آبی',
    targetBelt: 'قرمز',
    className: 'کلاس نوجوانان',
    age: 15,
    readinessScore: 82,
    weakestCategory: 'مبارزه',
    lastAssessmentDate: '۱۲ شهریور ۱۴۰۵',
    weakSkills: [
      { name: 'دفاع', score: 64 },
      { name: 'جابه‌جایی پا', score: 61 },
      { name: 'حمله متقابل', score: 68 },
    ],
    studentCategoryScores: {
      'تکنیک‌ها': 88,
      'فرم': 79,
      'مبارزه': 72,
      'آمادگی جسمانی': 91,
    },
    studentSkillScores: {
      'آپ چاگی': 92,
      'دولیو چاگی': 88,
      'یوپ چاگی': 85,
      'دوی چاگی': 87,
      'تایگوک سا جانگ و او جانگ': 79,
      'دفاع در فاصله نزدیک': 64,
      'حمله متقابل': 68,
      'جابه‌جایی پا': 61,
      'انعطاف‌پذیری و توان انفجاری': 91,
    },
    promotionHistory: [
      { beltName: 'کمربند آبی', date: '۱۲ فروردین ۱۴۰۵', evaluator: 'مربی امینی', score: 84 },
      { beltName: 'کمربند سبز', date: '۲۵ آبان ۱۴۰۴', evaluator: 'مربی امینی', score: 86 },
      { beltName: 'کمربند زرد', date: '۱۰ تیر ۱۴۰۴', evaluator: 'مربی امینی', score: 81 },
      { beltName: 'کمربند سفید', date: '۱۰ اردیبهشت ۱۴۰۳', evaluator: 'باشگاه امینی', score: 75 },
    ],
  },
  {
    studentId: '1025',
    name: 'سارا کریمی',
    avatar: 'س',
    avatarColor: 'from-emerald-500 to-teal-600',
    currentBelt: 'سبز',
    targetBelt: 'آبی',
    className: 'کلاس بانوان و نوجوانان',
    age: 14,
    readinessScore: 91,
    weakestCategory: 'مبارزه',
    lastAssessmentDate: '۱۰ شهریور ۱۴۰۵',
    weakSkills: [
      { name: 'دفاع', score: 80 },
      { name: 'جابه‌جایی پا', score: 80 },
      { name: 'حمله متقابل', score: 82 },
    ],
    studentCategoryScores: {
      'تکنیک‌ها': 90,
      'فرم': 92,
      'مبارزه': 82,
      'آمادگی جسمانی': 88,
    },
    studentSkillScores: {
      'آپ چاگی': 92,
      'دولیو چاگی': 90,
      'یوپ چاگی': 88,
      'دوی چاگی': 90,
      'تایگوک سام جانگ': 94,
      'دفاع و ضدحمله': 80,
      'انعطاف‌پذیری و چابکی': 88,
    },
    promotionHistory: [
      { beltName: 'کمربند سبز', date: '۱۵ اسفند ۱۴۰۴', evaluator: 'مربی امینی', score: 88 },
      { beltName: 'کمربند زرد', date: '۲۰ مهر ۱۴۰۴', evaluator: 'مربی امینی', score: 85 },
      { beltName: 'کمربند سفید', date: '۱ تیر ۱۴۰۴', evaluator: 'باشگاه امینی', score: 79 },
    ],
  },
  {
    studentId: '1026',
    name: 'محمد احمدی',
    avatar: 'م',
    avatarColor: 'from-rose-500 to-orange-600',
    currentBelt: 'قرمز',
    targetBelt: 'مشکی',
    className: 'کلاس جوانان و بزرگسالان',
    age: 17,
    readinessScore: 72,
    weakestCategory: 'مبارزه',
    lastAssessmentDate: '۱۰ شهریور ۱۴۰۵',
    weakSkills: [
      { name: 'دفاع', score: 62 },
      { name: 'حمله متقابل', score: 65 },
      { name: 'جابه‌جایی پا', score: 66 },
    ],
    studentCategoryScores: {
      'تکنیک‌ها': 76,
      'فرم': 70,
      'مبارزه': 68,
      'آمادگی جسمانی': 74,
    },
    studentSkillScores: {
      'ترکیب‌های چاگی پیشرفته': 78,
      'دوی هوریو چاگی': 74,
      'تایگوک یوک جانگ تا پال جانگ': 70,
      'مدیریت فاصله و هوگیو': 68,
      'استقامت قلبی و سرعت ضربه': 74,
    },
    promotionHistory: [
      { beltName: 'کمربند قرمز', date: '۱ خرداد ۱۴۰۵', evaluator: 'مربی امینی', score: 80 },
      { beltName: 'کمربند آبی', date: '۱۵ آذر ۱۴۰۴', evaluator: 'مربی امینی', score: 82 },
      { beltName: 'کمربند سبز', date: '۱۰ تیر ۱۴۰۴', evaluator: 'مربی امینی', score: 85 },
    ],
  },
  {
    studentId: '1027',
    name: 'نگار کریمی',
    avatar: 'ن',
    avatarColor: 'from-violet-500 to-purple-600',
    currentBelt: 'زرد',
    targetBelt: 'سبز',
    className: 'کلاس نونهالان',
    age: 13,
    readinessScore: 91,
    weakestCategory: 'فرم',
    lastAssessmentDate: '۵ شهریور ۱۴۰۵',
    weakSkills: [
      { name: 'یوپ چاگی', score: 86 },
      { name: 'دقت حرکات', score: 88 },
      { name: 'تعادل', score: 88 },
    ],
    studentCategoryScores: {
      'تکنیک‌ها': 88,
      'فرم': 89,
      'مبارزه': 90,
      'آمادگی جسمانی': 97,
    },
    studentSkillScores: {
      'آپ چاگی': 90,
      'دولیو چاگی': 88,
      'یوپ چاگی مقدماتی': 86,
      'تایگوک ای جانگ': 89,
      'حمله مستقیم': 90,
      'سرعت و استقامت': 97,
    },
    promotionHistory: [
      { beltName: 'کمربند زرد', date: '۲۸ اردیبهشت ۱۴۰۵', evaluator: 'مربی امینی', score: 90 },
      { beltName: 'کمربند سفید', date: '۱ اسفند ۱۴۰۴', evaluator: 'باشگاه امینی', score: 88 },
    ],
  },
  {
    studentId: '1028',
    name: 'امیر حسینی',
    avatar: 'ا',
    avatarColor: 'from-amber-500 to-yellow-600',
    currentBelt: 'زرد',
    targetBelt: 'سبز',
    className: 'کلاس نوجوانان',
    age: 14,
    readinessScore: 64,
    weakestCategory: 'تکنیک‌ها',
    lastAssessmentDate: '۲ شهریور ۱۴۰۵',
    weakSkills: [
      { name: 'دفاع', score: 55 },
      { name: 'حمله متقابل', score: 58 },
      { name: 'یوپ چاگی', score: 58 },
    ],
    studentCategoryScores: {
      'تکنیک‌ها': 62,
      'فرم': 65,
      'مبارزه': 60,
      'آمادگی جسمانی': 69,
    },
    studentSkillScores: {
      'آپ چاگی': 68,
      'دولیو چاگی': 60,
      'یوپ چاگی مقدماتی': 58,
      'تایگوک ای جانگ': 65,
      'حمله مستقیم': 60,
      'سرعت و استقامت': 69,
    },
    promotionHistory: [
      { beltName: 'کمربند زرد', date: '۱۰ بهمن ۱۴۰۴', evaluator: 'مربی امینی', score: 72 },
      { beltName: 'کمربند سفید', date: '۱ مهر ۱۴۰۴', evaluator: 'باشگاه امینی', score: 70 },
    ],
  },
]
