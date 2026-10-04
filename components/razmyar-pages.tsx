'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Award, ArrowLeft, CalendarDays, CheckCircle2, ChevronLeft, Flame, MoreHorizontal, Plus, Search, Shield, Star, Target, TrendingUp, Trophy, UserRound, Users, Zap } from 'lucide-react'
import { api } from '@/lib/api'

const students = [
  { id: '1024', name: 'علی رضایی', age: '۱۵ سال', belt: 'آبی', avatar: 'ع', status: 'آماده ارتقا', score: 82, color: 'bg-cyan-500' },
  { id: '1025', name: 'سارا کریمی', age: '۱۴ سال', belt: 'سبز', avatar: 'س', status: 'آماده ارتقا', score: 91, color: 'bg-emerald-500' },
  { id: '1026', name: 'محمد احمدی', age: '۱۷ سال', belt: 'قرمز', avatar: 'م', status: 'نیازمند تمرین', score: 74, color: 'bg-rose-500' },
  { id: '1027', name: 'نگار کریمی', age: '۱۳ سال', belt: 'زرد', avatar: 'ن', status: 'فعال', score: 88, color: 'bg-amber-500' },
]

function SectionTitle({ title, action = 'مشاهده همه' }: { title: string; action?: string }) {
  return <div className="mb-4 flex items-center justify-between"><h2 className="text-base font-bold">{title}</h2><button className="flex items-center gap-1 text-xs text-primary hover:underline">{action}<ChevronLeft className="size-3" /></button></div>
}

export function CoachDashboard() {
  return <div className="mx-auto max-w-7xl space-y-6">
    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><p className="mb-2 text-sm text-primary">شنبه، ۱۲ خرداد ۱۴۰۳</p><h2 className="text-2xl font-bold tracking-tight">سلام مربی امینی</h2><p className="mt-2 text-sm text-muted-foreground">این خلاصه عملکرد باشگاه شما در این هفته است.</p></div><Link href="/students" className="flex w-fit items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/10"><Plus className="size-4" />افزودن شاگرد</Link></div>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[['شاگردان فعال','۴۸','+۱۲٪ این ماه', Users],['میانگین حضور','۸۷٪','+۵٪ نسبت به ماه قبل',CalendarDays],['آماده آزمون','۷ نفر','۳ نفر در این هفته',Award],['امتیاز باشگاه','۴.۸','از ۵ امتیاز',Star]].map(([label,value,hint,Icon]) => <div key={label as string} className="rounded-2xl border border-border bg-card p-5"><div className="flex items-center justify-between"><p className="text-sm text-muted-foreground">{label as string}</p><span className="rounded-lg bg-accent p-2 text-primary"><Icon className="size-4" /></span></div><p className="mt-4 text-2xl font-bold">{value as string}</p><p className="mt-2 text-xs text-primary">{hint as string}</p></div>)}</div>
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      <section className="rounded-2xl border border-border bg-card p-5"><SectionTitle title="شاگردان نیازمند توجه" /><div className="flex flex-col gap-3">{students.slice(0,3).map((student) => <Link href={student.name === 'علی رضایی' ? '/students/ali-rezaei' : '/students'} key={student.name} className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-muted"><span className={`flex size-10 items-center justify-center rounded-full ${student.color} text-sm font-bold text-white`}>{student.avatar}</span><span className="min-w-0 flex-1"><span className="block text-sm font-semibold">{student.name}</span><span className="block text-xs text-muted-foreground">کمربند {student.belt} · {student.age}</span></span><span className="text-left"><span className="block text-xs font-medium text-amber-400">{student.status}</span><span className="block text-xs text-muted-foreground">امتیاز {student.score}</span></span><ChevronLeft className="size-4 text-muted-foreground" /></Link>)}</div></section>
      <section className="rounded-2xl border border-border bg-card p-5"><SectionTitle title="برنامه امروز" action="تقویم کامل" /><div className="flex flex-col gap-3"><div className="rounded-xl border border-primary/20 bg-accent/50 p-4"><div className="flex items-center justify-between"><span className="text-sm font-semibold">گروه نوجوانان</span><span className="text-xs text-primary">۱۶:۰۰</span></div><p className="mt-2 text-xs text-muted-foreground">تمرین فرم و مبارزه · ۱۲ شاگرد</p></div><div className="rounded-xl border border-border p-4"><div className="flex items-center justify-between"><span className="text-sm font-semibold">گروه بزرگسالان</span><span className="text-xs text-muted-foreground">۱۸:۳۰</span></div><p className="mt-2 text-xs text-muted-foreground">آمادگی مسابقات · ۸ شاگرد</p></div><div className="rounded-xl border border-border p-4"><div className="flex items-center justify-between"><span className="text-sm font-semibold">آزمون کمربند</span><span className="text-xs text-muted-foreground">۲۰:۰۰</span></div><p className="mt-2 text-xs text-muted-foreground">ارزیابی ۷ شاگرد منتخب</p></div></div></section>
    </div>
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]"><section className="rounded-2xl border border-border bg-card p-5"><SectionTitle title="روند پیشرفت شاگردان" /><div className="flex h-52 items-end gap-3 border-b border-border px-2 pt-8">{[45,58,52,68,62,77,86,80,93,88,96,92].map((height,i)=><div key={i} className="flex h-full flex-1 flex-col justify-end gap-2"><div className="rounded-t-md bg-primary/80 transition-all hover:bg-primary" style={{height:`${height}%`}}/><span className="text-center text-[10px] text-muted-foreground">{['تیر','مرد','شه','مهر','آبا','آذر','دی','بهم','اسف','فر','ار','خرد'][i]}</span></div>)}</div></section><section className="rounded-2xl border border-border bg-card p-5"><SectionTitle title="نشان‌های اخیر" /><div className="flex flex-col gap-4"><div className="flex items-center gap-3"><span className="rounded-full bg-amber-500/15 p-3 text-amber-400"><Flame className="size-5" /></span><span className="flex-1"><span className="block text-sm font-semibold">رکورد حضور</span><span className="text-xs text-muted-foreground">سارا احمدی · ۱۲ جلسه متوالی</span></span></div><div className="flex items-center gap-3"><span className="rounded-full bg-cyan-500/15 p-3 text-cyan-400"><Zap className="size-5" /></span><span className="flex-1"><span className="block text-sm font-semibold">پیشرفت سریع</span><span className="text-xs text-muted-foreground">محمد مرادی · ارتقای کمربند</span></span></div><div className="flex items-center gap-3"><span className="rounded-full bg-violet-500/15 p-3 text-violet-400"><Trophy className="size-5" /></span><span className="flex-1"><span className="block text-sm font-semibold">قهرمان مسابقه</span><span className="text-xs text-muted-foreground">تیم نوجوانان · جام تهران</span></span></div></div></section></div>
  </div>
}

const ALL_STUDENTS = [
  { id: '1024', name: 'علی رضایی', age: 15, belt: 'آبی', targetBelt: 'قرمز', avatar: 'ع', status: 'آماده ارتقا', score: 82, attendance: 87, className: 'نوجوانان الف', color: 'bg-cyan-500' },
  { id: '1025', name: 'سارا کریمی', age: 14, belt: 'سبز', targetBelt: 'آبی', avatar: 'س', status: 'آماده ارتقا', score: 91, attendance: 93, className: 'بانوان و نوجوانان', color: 'bg-emerald-500' },
  { id: '1026', name: 'محمد احمدی', age: 17, belt: 'قرمز', targetBelt: 'مشکی', avatar: 'م', status: 'نیازمند تمرین', score: 74, attendance: 81, className: 'جوانان و بزرگسالان', color: 'bg-rose-500' },
  { id: '1027', name: 'نگار کریمی', age: 13, belt: 'زرد', targetBelt: 'سبز', avatar: 'ن', status: 'فعال', score: 88, attendance: 90, className: 'نونهالان', color: 'bg-amber-500' },
  { id: '1028', name: 'سینا کریمی', age: 16, belt: 'آبی', targetBelt: 'قرمز', avatar: 'س', status: 'فعال', score: 76, attendance: 84, className: 'نوجوانان الف', color: 'bg-indigo-500' },
  { id: '1029', name: 'رضا مرادی', age: 15, belt: 'سبز', targetBelt: 'آبی', avatar: 'ر', status: 'نیازمند تمرین', score: 69, attendance: 79, className: 'نوجوانان ب', color: 'bg-teal-500' },
  { id: '1030', name: 'پارسا یوسفی', age: 16, belt: 'قرمز', targetBelt: 'مشکی', avatar: 'پ', status: 'فعال', score: 85, attendance: 88, className: 'نوجوانان الف', color: 'bg-blue-500' },
  { id: '1031', name: 'مهدی رحیمی', age: 18, belt: 'مشکی', targetBelt: 'دان ۲', avatar: 'م', status: 'آماده ارتقا', score: 94, attendance: 95, className: 'تیم مسابقات', color: 'bg-zinc-700' },
]

import { useAuth } from '@/lib/auth-context'

export function StudentsPage() {
  const { selectedClubId, selectedClub, teamName } = useAuth()
  const [studentList, setStudentList] = useState(ALL_STUDENTS)
  const [query, setQuery] = useState('')
  const [selectedBelt, setSelectedBelt] = useState('همه')
  const [selectedStatus, setSelectedStatus] = useState('همه')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [toastMsg, setToastMsg] = useState<string | null>(null)

  // Load from API on mount and on selectedClubId change
  useEffect(() => {
    async function loadStudents() {
      const data = await api.students.getAll()
      if (data && data.length > 0) {
        setStudentList(data)
      }
    }
    loadStudents()
  }, [selectedClubId])

  // New Student Form State
  const [newName, setNewName] = useState('')
  const [newAge, setNewAge] = useState('۱۵')
  const [newBelt, setNewBelt] = useState('سفید')
  const [newPhone, setNewPhone] = useState('۰۹۱۲۱۲۳۴۵۶۷')
  const [newClass, setNewClass] = useState('کلاس نوجوانان')

  const showToast = (msg: string) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 3500)
  }

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim()) return

    const parsedAge = parseInt(newAge, 10) || 15
    const payload = {
      name: newName.trim(),
      age: parsedAge,
      belt: newBelt,
      className: newClass,
      mobile: newPhone,
    }

    const created = await api.students.create(payload)

    const newStudent = created || {
      id: String(Date.now()).slice(-4),
      name: newName.trim(),
      age: parsedAge,
      belt: newBelt,
      targetBelt: newBelt === 'سفید' ? 'زرد' : 'سبز',
      avatar: newName.trim()[0] || 'ش',
      status: 'فعال',
      score: 75,
      attendance: 100,
      className: newClass,
      color: 'bg-primary',
    }

    setStudentList([newStudent, ...studentList])
    setIsAddModalOpen(false)
    setNewName('')
    showToast('شاگرد جدید با موفقیت به باشگاه اضافه شد.')
  }

  const filtered = studentList.filter((s: any) => {
    // Multi-Club Scope Filter
    if (selectedClubId && selectedClubId !== 'ALL') {
      if (s.clubId && s.clubId !== selectedClubId) return false
      // For fallback mock mapping when clubId is not yet on item:
      if (!s.clubId) {
        if (selectedClubId === 'PARTO' && !['1024', '1025', '1026'].includes(s.id)) return false
        if (selectedClubId === 'SARVESTAN' && !['1027', '1028'].includes(s.id)) return false
        if (selectedClubId === 'HEJAB' && !['1029', '1030', '1031'].includes(s.id)) return false
      }
    }

    const matchQuery = !query.trim() || s.name.includes(query.trim()) || s.id.includes(query.trim())
    const matchBelt = selectedBelt === 'همه' || s.belt === selectedBelt
    const matchStatus = selectedStatus === 'همه' || s.status === selectedStatus
    return matchQuery && matchBelt && matchStatus
  })

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {toastMsg && (
        <div className="fixed bottom-6 left-6 z-50 flex items-center gap-3 rounded-2xl border border-primary/30 bg-card/95 px-5 py-3 text-sm font-semibold text-foreground shadow-2xl backdrop-blur-md">
          <CheckCircle2 className="size-5 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="text-xs text-primary font-bold">{teamName}</span>
            <span className="text-xs text-muted-foreground">·</span>
            <span className="rounded-md bg-accent px-2 py-0.5 text-[11px] font-semibold text-foreground">
              باشگاه فعال: {selectedClub ? selectedClub.name : 'همه باشگاه‌ها'}
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">شاگردان باشگاه</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {selectedClub ? `مدیریت پرونده و شاگردان ${selectedClub.name}` : `نمایش تجمیعی شاگردان تمامی باشگاه‌های ${teamName}`}
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex w-fit items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90 transition-all active:scale-[0.98]"
        >
          <Plus className="size-4" />
          + ثبت شاگرد جدید
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-center">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-input bg-background px-3.5 py-2">
          <Search className="size-4 text-muted-foreground shrink-0" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="جستجوی نام شاگرد یا شماره پرونده..."
            className="w-full bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedBelt}
            onChange={(e) => setSelectedBelt(e.target.value)}
            className="rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground outline-none focus:border-primary"
          >
            <option value="همه">همه کمربندها</option>
            <option value="سفید">کمربند سفید</option>
            <option value="زرد">کمربند زرد</option>
            <option value="سبز">کمربند سبز</option>
            <option value="آبی">کمربند آبی</option>
            <option value="قرمز">کمربند قرمز</option>
            <option value="مشکی">کمربند مشکی</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground outline-none focus:border-primary"
          >
            <option value="همه">همه وضعیت‌ها</option>
            <option value="آماده ارتقا">آماده ارتقا</option>
            <option value="فعال">فعال</option>
            <option value="نیازمند تمرین">نیازمند تمرین</option>
          </select>

          {(query || selectedBelt !== 'همه' || selectedStatus !== 'همه') && (
            <button
              onClick={() => {
                setQuery('')
                setSelectedBelt('همه')
                setSelectedStatus('همه')
              }}
              className="rounded-xl border border-border px-3 py-2 text-xs text-muted-foreground hover:text-foreground"
            >
              پاک کردن فیلترها
            </button>
          )}
        </div>
      </div>

      {/* Desktop Table */}
      <section className="hidden overflow-hidden rounded-2xl border border-border bg-card shadow-sm md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="border-b border-border bg-muted/40 text-muted-foreground font-bold">
              <tr>
                <th className="px-5 py-4">شاگرد</th>
                <th className="px-5 py-4">سن و کلاس</th>
                <th className="px-5 py-4">کمربند</th>
                <th className="px-5 py-4">امتیاز مهارتی</th>
                <th className="px-5 py-4">حضور</th>
                <th className="px-5 py-4">وضعیت</th>
                <th className="px-5 py-4 text-left">اقدام</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted-foreground">
                    شاگردی با مشخصات وارد شده پیدا نشد.
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-4">
                      <Link href={`/students/${s.id}`} className="flex items-center gap-3 group">
                        <span className={`flex size-10 items-center justify-center rounded-full ${s.color} font-bold text-white shrink-0`}>
                          {s.avatar}
                        </span>
                        <div>
                          <span className="block font-bold text-foreground text-sm group-hover:text-primary transition-colors">
                            {s.name}
                          </span>
                          <span className="text-[11px] text-muted-foreground">پرونده: {s.id}</span>
                        </div>
                      </Link>
                    </td>
                    <td className="px-5 py-4">
                      <span className="block text-foreground font-medium">{s.age} سال</span>
                      <span className="text-[11px] text-muted-foreground">{s.className}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center rounded-full bg-accent/60 border border-border px-3 py-1 text-xs font-semibold text-foreground">
                        کمربند {s.belt}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-24 rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all"
                            style={{ width: `${s.score}%` }}
                          />
                        </div>
                        <span className="font-bold text-foreground">{s.score}٪</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-bold text-emerald-400">{s.attendance}٪</td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                          s.status === 'آماده ارتقا'
                            ? 'bg-emerald-500/15 text-emerald-400'
                            : s.status === 'نیازمند تمرین'
                              ? 'bg-amber-500/15 text-amber-400'
                              : 'bg-primary/15 text-primary'
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-left">
                      <Link
                        href={`/students/${s.id}`}
                        className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:border-primary hover:text-primary transition-colors"
                      >
                        <span>پروفایل</span>
                        <ChevronLeft className="size-3" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-border px-5 py-3 text-xs text-muted-foreground">
          <span>نمایش {filtered.length} از {studentList.length} شاگرد</span>
          <span className="font-medium">صفحه ۱ از ۱</span>
        </div>
      </section>

      {/* Mobile Cards View (< md) */}
      <div className="grid gap-3 md:hidden">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center text-xs text-muted-foreground">
            شاگردی با این مشخصات پیدا نشد.
          </div>
        ) : (
          filtered.map((s) => (
            <Link
              key={s.id}
              href={`/students/${s.id}`}
              className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm hover:border-primary/50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`flex size-10 items-center justify-center rounded-full ${s.color} font-bold text-white`}>
                    {s.avatar}
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">{s.name}</h3>
                    <span className="text-[11px] text-muted-foreground">{s.age} سال · کمربند {s.belt}</span>
                  </div>
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                    s.status === 'آماده ارتقا'
                      ? 'bg-emerald-500/15 text-emerald-400'
                      : s.status === 'نیازمند تمرین'
                        ? 'bg-amber-500/15 text-amber-400'
                        : 'bg-primary/15 text-primary'
                  }`}
                >
                  {s.status}
                </span>
              </div>

              <div className="space-y-1.5 border-t border-border/80 pt-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">پیشرفت مهارتی:</span>
                  <span className="font-bold text-foreground">{s.score}٪</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${s.score}%` }} />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 text-xs text-muted-foreground">
                <span>حضور: <b className="text-emerald-400">{s.attendance}٪</b></span>
                <span className="flex items-center gap-1 text-primary font-bold">
                  مشاهده پروفایل
                  <ChevronLeft className="size-3" />
                </span>
              </div>
            </Link>
          ))
        )}
      </div>

      {/* Modal: Add Student */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-foreground">ثبت شاگرد جدید در باشگاه</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-muted"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddStudent} className="space-y-4 text-xs">
              <div>
                <label className="block text-muted-foreground mb-1 font-medium">نام و نام خانوادگی *</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="مثال: کیان محمدی"
                  className="w-full rounded-xl border border-input bg-background px-3 py-2 text-foreground outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-muted-foreground mb-1 font-medium">سن</label>
                  <input
                    type="number"
                    value={newAge}
                    onChange={(e) => setNewAge(e.target.value)}
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-foreground outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-muted-foreground mb-1 font-medium">کمربند فعلی</label>
                  <select
                    value={newBelt}
                    onChange={(e) => setNewBelt(e.target.value)}
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-foreground outline-none focus:border-primary"
                  >
                    <option value="سفید">سفید</option>
                    <option value="زرد">زرد</option>
                    <option value="سبز">سبز</option>
                    <option value="آبی">آبی</option>
                    <option value="قرمز">قرمز</option>
                    <option value="مشکی">مشکی</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-muted-foreground mb-1 font-medium">کلاس تمرینی</label>
                <input
                  type="text"
                  value={newClass}
                  onChange={(e) => setNewClass(e.target.value)}
                  placeholder="کلاس نوجوانان الف"
                  className="w-full rounded-xl border border-input bg-background px-3 py-2 text-foreground outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-muted-foreground mb-1 font-medium">شماره تماس ولی / شاگرد</label>
                <input
                  type="text"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="۰۹۱۲۱۲۳۴۵۶۷"
                  className="w-full rounded-xl border border-input bg-background px-3 py-2 text-foreground outline-none focus:border-primary"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-primary py-2.5 text-xs font-bold text-primary-foreground shadow hover:bg-primary/90"
                >
                  ثبت پرونده شاگرد
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-xl border border-border px-4 py-2.5 text-xs font-medium text-muted-foreground hover:bg-muted"
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

export function StudentProfile() { return <div className="mx-auto max-w-7xl space-y-6"><Link href="/students" className="flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" />بازگشت به شاگردان</Link><div className="flex flex-col justify-between gap-5 rounded-2xl border border-border bg-card p-6 md:flex-row md:items-center"><div className="flex items-center gap-4"><span className="flex size-20 items-center justify-center rounded-2xl bg-cyan-500 text-2xl font-bold text-white">ع</span><div><h2 className="text-2xl font-bold">علی رضایی</h2><p className="mt-2 text-sm text-muted-foreground">۱۶ سال · شاگرد از شهریور ۱۴۰۲</p><span className="mt-3 inline-flex rounded-full bg-accent px-3 py-1 text-xs text-primary">کمربند سبز</span></div></div><div className="flex gap-2"><button className="rounded-xl border border-border px-4 py-2 text-sm">ویرایش پروفایل</button><button className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">ثبت ارزیابی</button></div></div><div className="grid gap-4 sm:grid-cols-3"><div className="rounded-2xl border border-border bg-card p-5"><p className="text-sm text-muted-foreground">امتیاز کلی</p><p className="mt-3 text-3xl font-bold">۷۲<span className="text-sm text-muted-foreground"> / ۱۰۰</span></p><p className="mt-2 text-xs text-amber-400">نیاز به تمرکز بیشتر</p></div><div className="rounded-2xl border border-border bg-card p-5"><p className="text-sm text-muted-foreground">حضور در ماه جاری</p><p className="mt-3 text-3xl font-bold">۸۵٪</p><p className="mt-2 text-xs text-primary">+۸٪ نسبت به ماه قبل</p></div><div className="rounded-2xl border border-border bg-card p-5"><p className="text-sm text-muted-foreground">تا کمربند بعدی</p><p className="mt-3 text-3xl font-bold">۲۴٪</p><p className="mt-2 text-xs text-muted-foreground">آزمون در ۴۵ روز آینده</p></div></div><div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]"><section className="rounded-2xl border border-border bg-card p-5"><SectionTitle title="نقاط قوت و نیاز به تمرین" /><div className="flex flex-col gap-4"><div><div className="mb-2 flex justify-between text-xs"><span>انعطاف‌پذیری</span><span className="text-primary">۸۶٪</span></div><div className="h-2 rounded-full bg-muted"><div className="h-2 w-[86%] rounded-full bg-primary" /></div></div><div><div className="mb-2 flex justify-between text-xs"><span>تکنیک پا</span><span className="text-primary">۷۸٪</span></div><div className="h-2 rounded-full bg-muted"><div className="h-2 w-[78%] rounded-full bg-primary" /></div></div><div><div className="mb-2 flex justify-between text-xs"><span>سرعت واکنش</span><span className="text-amber-400">۵۹٪</span></div><div className="h-2 rounded-full bg-muted"><div className="h-2 w-[59%] rounded-full bg-amber-400" /></div></div><div><div className="mb-2 flex justify-between text-xs"><span>تمرکز و ذهنیت</span><span className="text-amber-400">۶۴٪</span></div><div className="h-2 rounded-full bg-muted"><div className="h-2 w-[64%] rounded-full bg-amber-400" /></div></div></div></section><section className="rounded-2xl border border-border bg-card p-5"><SectionTitle title="آخرین ارزیابی‌ها" /><div className="flex flex-col gap-3">{['ارزیابی ماهانه · ۲۸ اردیبهشت','آزمون آمادگی کمربند · ۱۵ اردیبهشت','ارزیابی ماهانه · ۲۸ فروردین'].map((x,i)=><div key={x} className="flex items-center gap-3 rounded-xl border border-border p-3"><span className="rounded-lg bg-accent p-2 text-primary"><Target className="size-4" /></span><span className="flex-1"><span className="block text-sm font-semibold">{x}</span><span className="text-xs text-muted-foreground">ثبت شده توسط مربی امینی</span></span><span className="text-lg font-bold">{[72,68,61][i]}</span><ChevronLeft className="size-4 text-muted-foreground" /></div>)}</div></section></div></div> }

import { Suspense } from 'react'
import { AssessmentModule } from '@/components/assessments/assessment-module'
export function AssessmentsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-muted-foreground">در حال بارگذاری ارزیابی‌ها...</div>}>
      <AssessmentModule />
    </Suspense>
  )
}

export function CompetitionsPage() { return <div className="mx-auto max-w-7xl space-y-6"><div className="flex justify-between"><div><h2 className="text-2xl font-bold">مسابقات</h2><p className="mt-2 text-sm text-muted-foreground">مسابقات پیش‌رو و عملکرد تیم باشگاه</p></div><button className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"><Plus className="size-4" />ثبت مسابقه</button></div><section className="rounded-2xl border border-border bg-card p-5"><SectionTitle title="مسابقات پیش‌رو" /><div className="grid gap-4 md:grid-cols-2"><div className="rounded-2xl border border-primary/30 bg-accent/40 p-5"><div className="flex items-start justify-between"><span className="rounded-lg bg-primary/15 p-3 text-primary"><Trophy className="size-6" /></span><span className="text-xs text-primary">۱۸ روز دیگر</span></div><h3 className="mt-5 text-lg font-bold">جام تکواندو استان تهران</h3><p className="mt-2 text-sm text-muted-foreground">جمعه، ۳۰ خرداد ۱۴۰۳ · سالن شهید افراسیابی</p><div className="mt-5 flex items-center justify-between border-t border-border pt-4"><span className="text-xs text-muted-foreground">۱۲ شرکت‌کننده از باشگاه شما</span><button className="text-xs font-semibold text-primary">مشاهده جزئیات</button></div></div><div className="rounded-2xl border border-border p-5"><div className="flex items-start justify-between"><span className="rounded-lg bg-violet-500/15 p-3 text-violet-400"><Shield className="size-6" /></span><span className="text-xs text-muted-foreground">۴۵ روز دیگر</span></div><h3 className="mt-5 text-lg font-bold">مسابقات آزاد نوجوانان</h3><p className="mt-2 text-sm text-muted-foreground">شنبه، ۲۷ تیر ۱۴۰۳ · مجموعه ورزشی آزادی</p><div className="mt-5 flex items-center justify-between border-t border-border pt-4"><span className="text-xs text-muted-foreground">در حال انتخاب تیم</span><button className="text-xs font-semibold text-primary">مشاهده جزئیات</button></div></div></div></section><section className="rounded-2xl border border-border bg-card p-5"><SectionTitle title="نتایج اخیر" /><div className="flex flex-col gap-3">{['جام باشگاه‌های تهران','مسابقات منطقه ۳','لیگ نوجوانان استان'].map((x,i)=><div key={x} className="flex items-center gap-4 rounded-xl border border-border p-4"><span className="rounded-lg bg-amber-500/15 p-3 text-amber-400"><Trophy className="size-5" /></span><span className="flex-1"><span className="block text-sm font-semibold">{x}</span><span className="text-xs text-muted-foreground">اردیبهشت ۱۴۰۳ · تیم رزمیار</span></span><span className="text-left"><span className="block text-sm font-bold text-primary">{['۲ طلا · ۳ نقره','۱ طلا · ۲ برنز','۳ نقره'][i]}</span><span className="text-xs text-muted-foreground">مدال‌ها</span></span></div>)}</div></section></div> }

import { ProgressionModule } from '@/components/progression/progression-module'
export function ProgressionPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-muted-foreground">در حال بارگذاری سیستم پیشرفت کمربند...</div>}>
      <ProgressionModule />
    </Suspense>
  )
}

export function ReportsPageContent() {
  const [downloading, setDownloading] = useState<string | null>(null)
  const handleDownload = (name: string) => {
    setDownloading(name)
    setTimeout(() => setDownloading(null), 2000)
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {downloading && (
        <div className="fixed bottom-6 left-6 z-50 flex items-center gap-3 rounded-2xl border border-primary/30 bg-card/95 px-5 py-3 text-sm font-semibold text-foreground shadow-2xl backdrop-blur-md">
          <CheckCircle2 className="size-5 text-emerald-400" />
          <span>گزارش «{downloading}» با موفقیت آماده دریافت شد.</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">گزارش‌های مدیریتی</h1>
          <p className="mt-1 text-sm text-muted-foreground">خلاصه آماری عملکرد شاگردان، پیشرفت کمربند و دستاوردهای مسابقات</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleDownload('خروجی جامع فصلی (PDF)')}
            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow hover:bg-primary/90"
          >
            دریافت خروجی PDF
          </button>
          <button
            onClick={() => handleDownload('اکسل اطلاعات شاگردان')}
            className="flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-xs font-semibold text-foreground hover:bg-muted"
          >
            خروجی اکسل
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-border bg-card p-5 space-y-1">
          <span className="text-xs text-muted-foreground">کل ساعات تمرینی فصل</span>
          <p className="text-2xl font-black text-foreground">۴۲۰ ساعت</p>
          <span className="text-[11px] text-emerald-400 block">+۱۵٪ نسبت به فصل قبل</span>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 space-y-1">
          <span className="text-xs text-muted-foreground">نرخ قبولی در آزمون کمربند</span>
          <p className="text-2xl font-black text-foreground">۹۲٪</p>
          <span className="text-[11px] text-primary block">۲۳ نفر ارتقا یافته</span>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 space-y-1">
          <span className="text-xs text-muted-foreground">میانگین امتیاز مهارتی باشگاه</span>
          <p className="text-2xl font-black text-foreground">۸۱٪</p>
          <span className="text-[11px] text-emerald-400 block">+۶٪ ارتقای میانگین</span>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 space-y-1">
          <span className="text-xs text-muted-foreground">مجموع مدال‌های کسب‌شده</span>
          <p className="text-2xl font-black text-foreground">۲۸ مدال</p>
          <span className="text-[11px] text-amber-400 block">۸ طلا · ۱۲ نقره · ۸ برنز</span>
        </div>
      </div>

      {/* Available Reports Grid */}
      <div className="grid gap-5 sm:grid-cols-2">
        {[
          { title: 'گزارش ارزیابی جامع مهارتی شاگردان', desc: 'تفکیک نمرات تکنیک، فرم، مبارزه و آمادگی بدنی تمامی ۴۸ شاگرد.', date: 'شهریور ۱۴۰۵', format: 'PDF · Excel' },
          { title: 'بیلان نتایج مسابقات و مدال‌آوران', desc: 'ثبت نتایج تورنمنت‌های پاییز، مسابقات استانی و جام باشگاه‌ها.', date: 'مرداد ۱۴۰۵', format: 'PDF' },
          { title: 'گزارش فصلی حضور و غیاب و انضباط', desc: 'نرخ حضور شاگردان، غیبت‌های موجه و ساعات تمرینی ثبت‌شده.', date: '۳ ماهه تابستان', format: 'Excel' },
          { title: 'برنامه و پیش‌بینی آزمون‌های کمربند بعدی', desc: 'لیست شاگردان واجد شرایط شرکت در آزمون‌های پایان فصل.', date: 'پاییز ۱۴۰۵', format: 'PDF' },
        ].map((rep, idx) => (
          <div key={idx} className="flex flex-col justify-between rounded-2xl border border-border bg-card p-5 space-y-4 hover:border-primary/40 transition-colors">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="rounded-md bg-accent/60 px-2 py-0.5 text-[10px] font-bold text-primary">{rep.format}</span>
                <span className="text-[11px] text-muted-foreground">{rep.date}</span>
              </div>
              <h3 className="text-base font-bold text-foreground">{rep.title}</h3>
              <p className="text-xs text-muted-foreground leading-6">{rep.desc}</p>
            </div>
            <div className="flex gap-2 border-t border-border pt-4">
              <button
                onClick={() => handleDownload(rep.title)}
                className="flex-1 rounded-xl bg-primary/10 py-2 text-center text-xs font-bold text-primary hover:bg-primary hover:text-primary-foreground transition-all"
              >
                دانلود گزارش
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function SettingsPageContent() {
  const [saved, setSaved] = useState(false)
  const [clubName, setClubName] = useState('باشگاه تکواندو امینی')
  const [coachName, setCoachName] = useState('استاد امینی')
  const [phone, setPhone] = useState('۰۲۱۲۲۳۳۴۴۵۵')
  const [passingScore, setPassingScore] = useState('۷۵')

  useEffect(() => {
    async function loadSettings() {
      const data = await api.settings.get()
      if (data) {
        if (data.name) setClubName(data.name)
        if (data.coachName) setCoachName(data.coachName)
        if (data.phone) setPhone(data.phone)
        if (data.passingScore) setPassingScore(String(data.passingScore))
      }
    }
    loadSettings()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    await api.settings.update({
      name: clubName,
      coachName,
      phone,
      passingScore: parseInt(passingScore, 10) || 75,
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 3500)
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {saved && (
        <div className="fixed bottom-6 left-6 z-50 flex items-center gap-3 rounded-2xl border border-primary/30 bg-card/95 px-5 py-3 text-sm font-semibold text-foreground shadow-2xl backdrop-blur-md">
          <CheckCircle2 className="size-5 text-emerald-400" />
          <span>تنظیمات با موفقیت ذخیره شد.</span>
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">تنظیمات سامانه</h1>
        <p className="mt-1 text-sm text-muted-foreground">پیکربندی مشخصات باشگاه، معیارهای ارزیابی و دسترسی‌ها</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
          <h2 className="text-base font-bold text-foreground">مشخصات عمومی باشگاه</h2>
          <div className="grid gap-4 sm:grid-cols-2 text-xs">
            <div>
              <label className="block text-muted-foreground mb-1">نام باشگاه</label>
              <input
                type="text"
                value={clubName}
                onChange={(e) => setClubName(e.target.value)}
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-foreground outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-muted-foreground mb-1">مربی ارشد / مدیر</label>
              <input
                type="text"
                value={coachName}
                onChange={(e) => setCoachName(e.target.value)}
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-foreground outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-muted-foreground mb-1">شماره تماس پشتیبانی باشگاه</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-foreground outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-muted-foreground mb-1">رشته ورزشی اصلی</label>
              <select className="w-full rounded-xl border border-input bg-background px-3 py-2 text-foreground outline-none focus:border-primary">
                <option value="tkd">تکواندو (WT)</option>
                <option value="karate">کاراته</option>
                <option value="bjj">جوجیتسو برزیلی</option>
                <option value="judo">جودو</option>
              </select>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
          <h2 className="text-base font-bold text-foreground">معیارهای آزمون و ارتقا</h2>
          <div className="grid gap-4 sm:grid-cols-2 text-xs">
            <div>
              <label className="block text-muted-foreground mb-1">حداقل امتیاز قبولی در ارتقای کمربند (درصد)</label>
              <input
                type="number"
                value={passingScore}
                onChange={(e) => setPassingScore(e.target.value)}
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-foreground outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-muted-foreground mb-1">دوره ارزیابی پیشنهادی</label>
              <select className="w-full rounded-xl border border-input bg-background px-3 py-2 text-foreground outline-none focus:border-primary">
                <option value="30">هر ۳۰ روز (ماهانه)</option>
                <option value="60">هر ۶۰ روز (دو ماهه)</option>
                <option value="90">هر ۹۰ روز (فصلی)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="submit"
            className="rounded-xl bg-primary px-6 py-2.5 text-xs font-bold text-primary-foreground shadow hover:bg-primary/90 transition-all"
          >
            ذخیره تنظیمات
          </button>
        </div>
      </form>
    </div>
  )
}

export function HelpPageContent() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">راهنما و پشتیبانی رزمیار</h1>
        <p className="mt-1 text-sm text-muted-foreground">پاسخ به سوالات متداول مربیان و راهنمای کار با بخش‌های مختلف سامانه</p>
      </div>

      <div className="space-y-4">
        {[
          { q: 'چگونه برای شاگرد ارزیابی مهارتی ثبت کنم؟', a: 'از منوی اصلی وارد بخش «ارزیابی‌ها» شوید، دکمه «+ ثبت ارزیابی جدید» را بزنید، شاگرد را انتخاب نموده و نمرات مهارت‌های تکنیک، فرم، مبارزه و آمادگی بدنی را ثبت فرمایید.' },
          { q: 'جدول براکت مسابقات چگونه برندگان را بالا می‌برد؟', a: 'در تب «جدول مسابقات»، روی هر بازی کلیک کنید. پس از ثبت نمرات و تعیین برنده، با زدن دکمه «ثبت نتیجه»، برنده به‌طور خودکار به بازی مرحله بعد صعود می‌کند.' },
          { q: 'آیا سامانه از رشته‌های رزمی دیگر هم پشتیبانی می‌کند؟', a: 'بله، معماری پیشرفت کمربند و مسابقات رزمیار به‌صورت چندرشته‌ای طراحی شده و قابلیت تنظیم رده‌ها و کمربندها برای کاراته، جوجیتسو و سایر رشته‌ها را داراست.' },
          { q: 'چگونه تحلیل هوشمند عملکرد را مشاهده کنم؟', a: 'در پروفایل شاگرد یا ماژول ارزیابی، روی دکمه «تحلیل هوشمند» کلیک کنید تا نقاط قوت، ضعف و پیشنهاد جلسات تمرینی را مشاهده نمایید.' },
        ].map((faq, i) => (
          <div key={i} className="rounded-2xl border border-border bg-card p-5 space-y-2">
            <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">؟</span>
              {faq.q}
            </h3>
            <p className="text-xs text-muted-foreground leading-7 pr-8">{faq.a}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h4 className="text-sm font-bold text-foreground">نیاز به راهنمایی بیشتری دارید؟</h4>
          <p className="text-xs text-muted-foreground mt-1">تیم پشتیبانی فنی رزمیار در ساعات کاری آماده پاسخگویی به مربیان گرامی است.</p>
        </div>
        <span className="rounded-xl bg-card border border-border px-4 py-2 text-xs font-bold text-primary">
          پشتیبانی: ۰۲۱-۸۸۸۸۹۹۹۹
        </span>
      </div>
    </div>
  )
}

export function SimplePage({ title, description }: { title: string; description: string }) {
  return <ReportsPageContent />
}


