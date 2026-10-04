export type DashboardStudent = { id: string; name: string; belt: string; issue: string; metric: string; status: string }

export const attentionStudents: DashboardStudent[] = [
  { id: '1024', name: 'علی رضایی', belt: 'آبی', issue: 'دفاع در فاصله نزدیک', metric: '۸۲٪ آمادگی', status: 'نزدیک به آزمون' },
  { id: '1026', name: 'محمد احمدی', belt: 'قرمز', issue: 'استقامت و ضدحمله', metric: '۷۴٪ پیشرفت', status: 'نیازمند تمرین' },
  { id: '1025', name: 'سارا کریمی', belt: 'سبز', issue: 'آماده ارتقا به کمربند آبی', metric: '۹۱٪ آمادگی', status: 'آماده ارزیابی' },
  { id: '1027', name: 'نگار کریمی', belt: 'زرد', issue: 'پیشرفت فرم و تعادل', metric: '۸۸٪ پیشرفت', status: 'فعال' },
]

export const progressData = [
  { name: 'هفته اول', value: 72 }, { name: 'هفته دوم', value: 75 }, { name: 'هفته سوم', value: 78 }, { name: 'هفته چهارم', value: 81 },
]

export const beltData = [
  { name: 'سفید', value: 8 }, { name: 'زرد', value: 6 }, { name: 'سبز', value: 5 }, { name: 'آبی', value: 7 }, { name: 'قرمز', value: 3 }, { name: 'مشکی', value: 3 },
]

export const activities = [
  ['علی رضایی ارزیابی شد.', '۲ ساعت پیش'], ['محمد احمدی به کمربند قرمز ارتقا پیدا کرد.', 'امروز، ۱۰:۳۰'], ['مسابقه جام پاییز ایجاد شد.', 'امروز، ۰۹:۱۵'], ['سارا کریمی به باشگاه اضافه شد.', 'دیروز، ۱۸:۴۵'], ['۳ ارزیابی جدید ثبت شد.', 'دیروز، ۱۶:۲۰'],
]

export const upcomingEvents = [
  { title: 'جام پاییز رزمیار', date: '۲۵ شهریور', type: 'مسابقه', participants: '۱۸ شاگرد' },
  { title: 'آزمون کمربند', date: '۳۰ شهریور', type: 'آزمون ارتقا', participants: '۱۲ شاگرد' },
]

export const quickActions = [
  { label: 'افزودن شاگرد', href: '/students' }, { label: 'ارزیابی شاگرد', href: '/assessments' }, { label: 'ایجاد مسابقه', href: '/competitions' }, { label: 'مشاهده گزارش‌ها', href: '/reports' },
]
