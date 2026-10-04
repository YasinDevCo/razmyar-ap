import { fa } from './razmyar-domain'

export type AssessmentCategoryType = 'تکنیک‌ها' | 'فرم' | 'مبارزه' | 'آمادگی جسمانی'

export type AssessmentType = 
  | 'ارزیابی کمربند'
  | 'ارزیابی مهارتهای فنی'
  | 'ارزیابی فنی'
  | 'ارزیابی مبارزه'
  | 'ارزیابی آمادگی جسمانی'

export type AssessmentStatus = 'تکمیل شده' | 'در حال بررسی' | 'نیازمند توجه' | 'آماده ارتقا'

export type BeltLevel = 'سفید' | 'زرد' | 'سبز' | 'آبی' | 'قرمز' | 'مشکی'

export interface SkillAssessment {
  name: string
  score: number
  category: AssessmentCategoryType
}

export interface AssessmentCategory {
  name: AssessmentCategoryType
  skills: string[]
  iconName?: string
}

export interface AssessmentRecommendation {
  focusSkills: string[]
  text: string
  strengths: string[]
}

export interface AssessmentResult {
  categoryAverages: Record<AssessmentCategoryType, number>
  overallScore: number
  status: AssessmentStatus
  beltReadiness: number
  recommendations: AssessmentRecommendation
}

export interface Assessment {
  id: string
  studentId: string
  studentName: string
  studentAvatar: string
  studentBelt: string
  targetBelt: string
  studentClass: string
  type: AssessmentType | string
  belt: string
  score: number
  date: string
  evaluator: string
  status: AssessmentStatus
  categoryScores: Record<AssessmentCategoryType, number>
  skills: SkillAssessment[]
  notes: string
  beltReadiness: number
  recommendations: AssessmentRecommendation
}

export interface AssessmentStudent {
  id: string
  name: string
  avatar: string
  belt: BeltLevel | string
  nextBelt: BeltLevel | string
  className: string
  age: number
  avatarColor: string
}

export const BELT_PROGRESSION_MAP: Record<string, string> = {
  'سفید': 'زرد',
  'زرد': 'سبز',
  'سبز': 'آبی',
  'آبی': 'قرمز',
  'قرمز': 'مشکی',
  'مشکی': 'مشکی دان ۲',
}

export const BELT_STYLES: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  'سفید': { bg: 'bg-slate-100/10', text: 'text-slate-200', border: 'border-slate-300/30', dot: 'bg-slate-200' },
  'زرد': { bg: 'bg-amber-500/15', text: 'text-amber-300', border: 'border-amber-500/30', dot: 'bg-amber-400' },
  'سبز': { bg: 'bg-emerald-500/15', text: 'text-emerald-300', border: 'border-emerald-500/30', dot: 'bg-emerald-400' },
  'آبی': { bg: 'bg-blue-500/15', text: 'text-blue-300', border: 'border-blue-500/30', dot: 'bg-blue-400' },
  'قرمز': { bg: 'bg-rose-500/15', text: 'text-rose-300', border: 'border-rose-500/30', dot: 'bg-rose-400' },
  'مشکی': { bg: 'bg-neutral-800', text: 'text-neutral-200', border: 'border-neutral-700', dot: 'bg-neutral-300' },
}

export const ASSESSMENT_CATEGORIES: AssessmentCategory[] = [
  {
    name: 'تکنیک‌ها',
    skills: ['آپ چاگی', 'دولیو چاگی', 'یوپ چاگی', 'دوی چاگی'],
  },
  {
    name: 'فرم',
    skills: ['تایگوک', 'دقت حرکات', 'تعادل', 'ریتم اجرا'],
  },
  {
    name: 'مبارزه',
    skills: ['حمله', 'دفاع', 'حمله متقابل', 'جابه‌جایی پا', 'فاصله‌گیری'],
  },
  {
    name: 'آمادگی جسمانی',
    skills: ['انعطاف‌پذیری', 'سرعت', 'استقامت', 'توان انفجاری'],
  },
]

export const ASSESSABLE_STUDENTS: AssessmentStudent[] = [
  {
    id: '1024',
    name: 'علی رضایی',
    avatar: 'ع',
    belt: 'آبی',
    nextBelt: 'قرمز',
    className: 'کلاس نوجوانان',
    age: 15,
    avatarColor: 'from-cyan-500 to-blue-600',
  },
  {
    id: '1026',
    name: 'محمد احمدی',
    avatar: 'م',
    belt: 'قرمز',
    nextBelt: 'مشکی',
    className: 'کلاس جوانان و بزرگسالان',
    age: 17,
    avatarColor: 'from-rose-500 to-orange-600',
  },
  {
    id: '1025',
    name: 'سارا کریمی',
    avatar: 'س',
    belt: 'سبز',
    nextBelt: 'آبی',
    className: 'کلاس بانوان و نوجوانان',
    age: 14,
    avatarColor: 'from-emerald-500 to-teal-600',
  },
  {
    id: '1027',
    name: 'نگار کریمی',
    avatar: 'ن',
    belt: 'زرد',
    nextBelt: 'سبز',
    className: 'کلاس نونهالان',
    age: 13,
    avatarColor: 'from-violet-500 to-purple-600',
  },
  {
    id: '1028',
    name: 'امیر حسینی',
    avatar: 'ا',
    belt: 'زرد',
    nextBelt: 'سبز',
    className: 'کلاس نوجوانان',
    age: 14,
    avatarColor: 'from-amber-500 to-yellow-600',
  },
  {
    id: '1029',
    name: 'رضا مرادی',
    avatar: 'ر',
    belt: 'آبی',
    nextBelt: 'قرمز',
    className: 'کلاس جوانان',
    age: 18,
    avatarColor: 'from-blue-600 to-indigo-700',
  },
]

export interface ScoreInterpretation {
  label: string
  badgeClass: string
  barClass: string
  textClass: string
}

export function getScoreInterpretation(score: number): ScoreInterpretation {
  if (score < 50) {
    return {
      label: 'نیازمند تمرین',
      badgeClass: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
      barClass: 'bg-rose-500',
      textClass: 'text-rose-400',
    }
  }
  if (score < 70) {
    return {
      label: 'نیازمند بهبود',
      badgeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
      barClass: 'bg-amber-500',
      textClass: 'text-amber-400',
    }
  }
  if (score < 85) {
    return {
      label: 'قابل قبول',
      badgeClass: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
      barClass: 'bg-blue-500',
      textClass: 'text-blue-400',
    }
  }
  if (score < 95) {
    return {
      label: 'خوب',
      badgeClass: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
      barClass: 'bg-emerald-500',
      textClass: 'text-emerald-400',
    }
  }
  return {
    label: 'عالی',
    badgeClass: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
    barClass: 'bg-cyan-500',
    textClass: 'text-cyan-400',
  }
}

export function calculateAssessmentMetrics(
  skills: SkillAssessment[],
  assessmentType: string = 'ارزیابی کمربند'
): AssessmentResult {
  const categoryTotals: Record<AssessmentCategoryType, { sum: number; count: number }> = {
    'تکنیک‌ها': { sum: 0, count: 0 },
    'فرم': { sum: 0, count: 0 },
    'مبارزه': { sum: 0, count: 0 },
    'آمادگی جسمانی': { sum: 0, count: 0 },
  }

  skills.forEach((s) => {
    if (categoryTotals[s.category]) {
      categoryTotals[s.category].sum += s.score
      categoryTotals[s.category].count += 1
    }
  })

  const categoryAverages: Record<AssessmentCategoryType, number> = {
    'تکنیک‌ها': categoryTotals['تکنیک‌ها'].count > 0 ? Math.round(categoryTotals['تکنیک‌ها'].sum / categoryTotals['تکنیک‌ها'].count) : 0,
    'فرم': categoryTotals['فرم'].count > 0 ? Math.round(categoryTotals['فرم'].sum / categoryTotals['فرم'].count) : 0,
    'مبارزه': categoryTotals['مبارزه'].count > 0 ? Math.round(categoryTotals['مبارزه'].sum / categoryTotals['مبارزه'].count) : 0,
    'آمادگی جسمانی': categoryTotals['آمادگی جسمانی'].count > 0 ? Math.round(categoryTotals['آمادگی جسمانی'].sum / categoryTotals['آمادگی جسمانی'].count) : 0,
  }

  const overallScore = skills.length > 0
    ? Math.round(skills.reduce((acc, s) => acc + s.score, 0) / skills.length)
    : 0

  const sortedAsc = [...skills].sort((a, b) => a.score - b.score)
  const sortedDesc = [...skills].sort((a, b) => b.score - a.score)

  const focusSkills = sortedAsc.slice(0, 3).map((s) => s.name)
  const strengths = sortedDesc.slice(0, 3).map((s) => s.name)

  let status: AssessmentStatus = 'تکمیل شده'
  if (overallScore >= 85) {
    status = 'آماده ارتقا'
  } else if (overallScore < 70) {
    status = 'نیازمند توجه'
  } else {
    status = 'تکمیل شده'
  }

  const beltReadiness = Math.min(100, Math.max(0, Math.round(overallScore * 1.02)))

  return {
    categoryAverages,
    overallScore,
    status,
    beltReadiness,
    recommendations: {
      focusSkills,
      text: 'در جلسات آینده تمرکز بیشتری روی این مهارت‌ها پیشنهاد می‌شود.',
      strengths,
    },
  }
}

export function createDefaultSkillsForStudent(studentName: string): SkillAssessment[] {
  // Balanced realistic defaults based on the student
  if (studentName === 'علی رضایی') {
    return [
      { name: 'آپ چاگی', score: 92, category: 'تکنیک‌ها' },
      { name: 'دولیو چاگی', score: 88, category: 'تکنیک‌ها' },
      { name: 'یوپ چاگی', score: 85, category: 'تکنیک‌ها' },
      { name: 'دوی چاگی', score: 87, category: 'تکنیک‌ها' },
      { name: 'تایگوک', score: 82, category: 'فرم' },
      { name: 'دقت حرکات', score: 84, category: 'فرم' },
      { name: 'تعادل', score: 80, category: 'فرم' },
      { name: 'ریتم اجرا', score: 78, category: 'فرم' },
      { name: 'حمله', score: 85, category: 'مبارزه' },
      { name: 'دفاع', score: 64, category: 'مبارزه' },
      { name: 'حمله متقابل', score: 68, category: 'مبارزه' },
      { name: 'جابه‌جایی پا', score: 61, category: 'مبارزه' },
      { name: 'فاصله‌گیری', score: 74, category: 'مبارزه' },
      { name: 'انعطاف‌پذیری', score: 94, category: 'آمادگی جسمانی' },
      { name: 'سرعت', score: 92, category: 'آمادگی جسمانی' },
      { name: 'استقامت', score: 88, category: 'آمادگی جسمانی' },
      { name: 'توان انفجاری', score: 90, category: 'آمادگی جسمانی' },
    ]
  }

  // Generic full skills template with good starting baseline
  const template: SkillAssessment[] = []
  ASSESSMENT_CATEGORIES.forEach((cat) => {
    cat.skills.forEach((skillName) => {
      let base = 75
      if (cat.name === 'تکنیک‌ها') base = 80
      if (cat.name === 'مبارزه') base = 70
      if (cat.name === 'آمادگی جسمانی') base = 85
      template.push({
        name: skillName,
        score: base,
        category: cat.name,
      })
    })
  })
  return template
}

export const INITIAL_ASSESSMENTS: Assessment[] = [
  {
    id: 'asm-101',
    studentId: '1024',
    studentName: 'علی رضایی',
    studentAvatar: 'ع',
    studentBelt: 'آبی',
    targetBelt: 'قرمز',
    studentClass: 'کلاس نوجوانان',
    type: 'ارزیابی مهارتهای فنی',
    belt: 'آبی',
    score: 82,
    date: '۱۲ شهریور ۱۴۰۵',
    evaluator: 'مربی امینی',
    status: 'تکمیل شده',
    categoryScores: {
      'تکنیک‌ها': 88,
      'فرم': 81,
      'مبارزه': 72,
      'آمادگی جسمانی': 91,
    },
    skills: createDefaultSkillsForStudent('علی رضایی'),
    notes: 'تکنیک‌های ضربه پا با سرعت و زاویه عالی اجرا شد. در بخش مبارزه نیازمند تمرکز روی دفاع و جابه‌جایی سریع‌تر در زاویه‌ها هستیم.',
    beltReadiness: 84,
    recommendations: {
      focusSkills: ['جابه‌جایی پا', 'دفاع', 'حمله متقابل'],
      text: 'در جلسات آینده تمرکز بیشتری روی این مهارت‌ها پیشنهاد می‌شود.',
      strengths: ['انعطاف‌پذیری', 'آپ چاگی', 'سرعت'],
    },
  },
  {
    id: 'asm-102',
    studentId: '1026',
    studentName: 'محمد احمدی',
    studentAvatar: 'م',
    studentBelt: 'قرمز',
    targetBelt: 'مشکی',
    studentClass: 'کلاس جوانان و بزرگسالان',
    type: 'ارزیابی مبارزه',
    belt: 'قرمز',
    score: 72,
    date: '۱۰ شهریور ۱۴۰۵',
    evaluator: 'مربی امینی',
    status: 'تکمیل شده',
    categoryScores: {
      'تکنیک‌ها': 76,
      'فرم': 70,
      'مبارزه': 68,
      'آمادگی جسمانی': 74,
    },
    skills: [
      { name: 'آپ چاگی', score: 78, category: 'تکنیک‌ها' },
      { name: 'دولیو چاگی', score: 75, category: 'تکنیک‌ها' },
      { name: 'یوپ چاگی', score: 74, category: 'تکنیک‌ها' },
      { name: 'دوی چاگی', score: 77, category: 'تکنیک‌ها' },
      { name: 'تایگوک', score: 70, category: 'فرم' },
      { name: 'دقت حرکات', score: 72, category: 'فرم' },
      { name: 'تعادل', score: 68, category: 'فرم' },
      { name: 'ریتم اجرا', score: 70, category: 'فرم' },
      { name: 'حمله', score: 75, category: 'مبارزه' },
      { name: 'دفاع', score: 62, category: 'مبارزه' },
      { name: 'حمله متقابل', score: 65, category: 'مبارزه' },
      { name: 'جابه‌جایی پا', score: 66, category: 'مبارزه' },
      { name: 'فاصله‌گیری', score: 72, category: 'مبارزه' },
      { name: 'انعطاف‌پذیری', score: 76, category: 'آمادگی جسمانی' },
      { name: 'سرعت', score: 72, category: 'آمادگی جسمانی' },
      { name: 'استقامت', score: 74, category: 'آمادگی جسمانی' },
      { name: 'توان انفجاری', score: 74, category: 'آمادگی جسمانی' },
    ],
    notes: 'قدرت بدنی خوبی دارد ولی در ضدحمله‌ها و زمان‌بندی دفاع نیازمند کار مداوم است.',
    beltReadiness: 73,
    recommendations: {
      focusSkills: ['دفاع', 'حمله متقابل', 'جابه‌جایی پا'],
      text: 'در جلسات آینده تمرکز بیشتری روی این مهارت‌ها پیشنهاد می‌شود.',
      strengths: ['آپ چاگی', 'دوی چاگی', 'انعطاف‌پذیری'],
    },
  },
  {
    id: 'asm-103',
    studentId: '1025',
    studentName: 'سارا کریمی',
    studentAvatar: 'س',
    studentBelt: 'سبز',
    targetBelt: 'آبی',
    studentClass: 'کلاس بانوان و نوجوانان',
    type: 'ارزیابی کمربند',
    belt: 'سبز',
    score: 88,
    date: '۸ شهریور ۱۴۰۵',
    evaluator: 'مربی امینی',
    status: 'آماده ارتقا',
    categoryScores: {
      'تکنیک‌ها': 90,
      'فرم': 92,
      'مبارزه': 82,
      'آمادگی جسمانی': 88,
    },
    skills: [
      { name: 'آپ چاگی', score: 92, category: 'تکنیک‌ها' },
      { name: 'دولیو چاگی', score: 90, category: 'تکنیک‌ها' },
      { name: 'یوپ چاگی', score: 88, category: 'تکنیک‌ها' },
      { name: 'دوی چاگی', score: 90, category: 'تکنیک‌ها' },
      { name: 'تایگوک', score: 95, category: 'فرم' },
      { name: 'دقت حرکات', score: 94, category: 'فرم' },
      { name: 'تعادل', score: 90, category: 'فرم' },
      { name: 'ریتم اجرا', score: 89, category: 'فرم' },
      { name: 'حمله', score: 84, category: 'مبارزه' },
      { name: 'دفاع', score: 80, category: 'مبارزه' },
      { name: 'حمله متقابل', score: 82, category: 'مبارزه' },
      { name: 'جابه‌جایی پا', score: 80, category: 'مبارزه' },
      { name: 'فاصله‌گیری', score: 84, category: 'مبارزه' },
      { name: 'انعطاف‌پذیری', score: 90, category: 'آمادگی جسمانی' },
      { name: 'سرعت', score: 86, category: 'آمادگی جسمانی' },
      { name: 'استقامت', score: 88, category: 'آمادگی جسمانی' },
      { name: 'توان انفجاری', score: 88, category: 'آمادگی جسمانی' },
    ],
    notes: 'فرم‌ها بسیار تمیز و با طمانینه و قدرت اجرا شدند. کاملا آماده برای آزمون کمربند آبی است.',
    beltReadiness: 94,
    recommendations: {
      focusSkills: ['دفاع', 'جابه‌جایی پا', 'حمله متقابل'],
      text: 'در جلسات آینده تمرکز بیشتری روی این مهارت‌ها پیشنهاد می‌شود.',
      strengths: ['تایگوک', 'دقت حرکات', 'آپ چاگی'],
    },
  },
  {
    id: 'asm-104',
    studentId: '1027',
    studentName: 'نگار کریمی',
    studentAvatar: 'ن',
    studentBelt: 'زرد',
    targetBelt: 'سبز',
    studentClass: 'کلاس نونهالان',
    type: 'ارزیابی آمادگی جسمانی',
    belt: 'زرد',
    score: 91,
    date: '۵ شهریور ۱۴۰۵',
    evaluator: 'مربی امینی',
    status: 'آماده ارتقا',
    categoryScores: {
      'تکنیک‌ها': 88,
      'فرم': 89,
      'مبارزه': 90,
      'آمادگی جسمانی': 97,
    },
    skills: [
      { name: 'آپ چاگی', score: 90, category: 'تکنیک‌ها' },
      { name: 'دولیو چاگی', score: 88, category: 'تکنیک‌ها' },
      { name: 'یوپ چاگی', score: 86, category: 'تکنیک‌ها' },
      { name: 'دوی چاگی', score: 88, category: 'تکنیک‌ها' },
      { name: 'تایگوک', score: 90, category: 'فرم' },
      { name: 'دقت حرکات', score: 90, category: 'فرم' },
      { name: 'تعادل', score: 88, category: 'فرم' },
      { name: 'ریتم اجرا', score: 88, category: 'فرم' },
      { name: 'حمله', score: 92, category: 'مبارزه' },
      { name: 'دفاع', score: 88, category: 'مبارزه' },
      { name: 'حمله متقابل', score: 90, category: 'مبارزه' },
      { name: 'جابه‌جایی پا', score: 90, category: 'مبارزه' },
      { name: 'فاصله‌گیری', score: 90, category: 'مبارزه' },
      { name: 'انعطاف‌پذیری', score: 100, category: 'آمادگی جسمانی' },
      { name: 'سرعت', score: 96, category: 'آمادگی جسمانی' },
      { name: 'استقامت', score: 96, category: 'آمادگی جسمانی' },
      { name: 'توان انفجاری', score: 96, category: 'آمادگی جسمانی' },
    ],
    notes: 'انعطاف‌پذیری ۱۰۰٪ فوق‌العاده و سرعت عالی در رده سنی نونهالان.',
    beltReadiness: 96,
    recommendations: {
      focusSkills: ['یوپ چاگی', 'دقت حرکات', 'تعادل'],
      text: 'در جلسات آینده تمرکز بیشتری روی این مهارت‌ها پیشنهاد می‌شود.',
      strengths: ['انعطاف‌پذیری', 'سرعت', 'استقامت'],
    },
  },
  {
    id: 'asm-105',
    studentId: '1028',
    studentName: 'امیر حسینی',
    studentAvatar: 'ا',
    studentBelt: 'زرد',
    targetBelt: 'سبز',
    studentClass: 'کلاس نوجوانان',
    type: 'ارزیابی فنی',
    belt: 'زرد',
    score: 64,
    date: '۲ شهریور ۱۴۰۵',
    evaluator: 'مربی امینی',
    status: 'نیازمند توجه',
    categoryScores: {
      'تکنیک‌ها': 62,
      'فرم': 65,
      'مبارزه': 60,
      'آمادگی جسمانی': 69,
    },
    skills: [
      { name: 'آپ چاگی', score: 68, category: 'تکنیک‌ها' },
      { name: 'دولیو چاگی', score: 60, category: 'تکنیک‌ها' },
      { name: 'یوپ چاگی', score: 58, category: 'تکنیک‌ها' },
      { name: 'دوی چاگی', score: 62, category: 'تکنیک‌ها' },
      { name: 'تایگوک', score: 66, category: 'فرم' },
      { name: 'دقت حرکات', score: 64, category: 'فرم' },
      { name: 'تعادل', score: 62, category: 'فرم' },
      { name: 'ریتم اجرا', score: 68, category: 'فرم' },
      { name: 'حمله', score: 64, category: 'مبارزه' },
      { name: 'دفاع', score: 55, category: 'مبارزه' },
      { name: 'حمله متقابل', score: 58, category: 'مبارزه' },
      { name: 'جابه‌جایی پا', score: 60, category: 'مبارزه' },
      { name: 'فاصله‌گیری', score: 63, category: 'مبارزه' },
      { name: 'انعطاف‌پذیری', score: 70, category: 'آمادگی جسمانی' },
      { name: 'سرعت', score: 68, category: 'آمادگی جسمانی' },
      { name: 'استقامت', score: 70, category: 'آمادگی جسمانی' },
      { name: 'توان انفجاری', score: 68, category: 'آمادگی جسمانی' },
    ],
    notes: 'به علت غیبت‌های اخیر در حفظ تعادل ضربات چاگی و دفاع هوشیارانه ضعف دارد.',
    beltReadiness: 65,
    recommendations: {
      focusSkills: ['دفاع', 'حمله متقابل', 'یوپ چاگی'],
      text: 'در جلسات آینده تمرکز بیشتری روی این مهارت‌ها پیشنهاد می‌شود.',
      strengths: ['انعطاف‌پذیری', 'استقامت', 'آپ چاگی'],
    },
  },
  {
    id: 'asm-106',
    studentId: '1029',
    studentName: 'رضا مرادی',
    studentAvatar: 'ر',
    studentBelt: 'آبی',
    targetBelt: 'قرمز',
    studentClass: 'کلاس جوانان',
    type: 'ارزیابی مبارزه',
    belt: 'آبی',
    score: 79,
    date: '۳۰ مرداد ۱۴۰۵',
    evaluator: 'مربی امینی',
    status: 'در حال بررسی',
    categoryScores: {
      'تکنیک‌ها': 82,
      'فرم': 78,
      'مبارزه': 77,
      'آمادگی جسمانی': 80,
    },
    skills: [
      { name: 'آپ چاگی', score: 86, category: 'تکنیک‌ها' },
      { name: 'دولیو چاگی', score: 84, category: 'تکنیک‌ها' },
      { name: 'یوپ چاگی', score: 80, category: 'تکنیک‌ها' },
      { name: 'دوی چاگی', score: 78, category: 'تکنیک‌ها' },
      { name: 'تایگوک', score: 78, category: 'فرم' },
      { name: 'دقت حرکات', score: 80, category: 'فرم' },
      { name: 'تعادل', score: 76, category: 'فرم' },
      { name: 'ریتم اجرا', score: 78, category: 'فرم' },
      { name: 'حمله', score: 82, category: 'مبارزه' },
      { name: 'دفاع', score: 72, category: 'مبارزه' },
      { name: 'حمله متقابل', score: 75, category: 'مبارزه' },
      { name: 'جابه‌جایی پا', score: 76, category: 'مبارزه' },
      { name: 'فاصله‌گیری', score: 80, category: 'مبارزه' },
      { name: 'انعطاف‌پذیری', score: 82, category: 'آمادگی جسمانی' },
      { name: 'سرعت', score: 80, category: 'آمادگی جسمانی' },
      { name: 'استقامت', score: 78, category: 'آمادگی جسمانی' },
      { name: 'توان انفجاری', score: 80, category: 'آمادگی جسمانی' },
    ],
    notes: 'پیشرفت در حملات مستقیم خوب بوده است. برای ارتقا به کمربند قرمز در یک آزمون شبیه‌سازی مجدد شرکت خواهد کرد.',
    beltReadiness: 81,
    recommendations: {
      focusSkills: ['دفاع', 'حمله متقابل', 'تعادل'],
      text: 'در جلسات آینده تمرکز بیشتری روی این مهارت‌ها پیشنهاد می‌شود.',
      strengths: ['آپ چاگی', 'دولیو چاگی', 'انعطاف‌پذیری'],
    },
  },
]
