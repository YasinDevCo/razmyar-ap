'use client'
import Link from 'next/link'
import { useState } from 'react'
import { ArrowRight, Award, CalendarCheck, CheckCircle2, Medal, Pencil, Plus, Sparkles, Trophy, UserRound } from 'lucide-react'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts'
import { aliRezaei, assessmentHistory, categoryScores, competitions, fa, progress } from '@/lib/razmyar-domain'
import { getStudentCompetitionHistory } from '@/lib/razmyar-competitions'

const beltClass = 'bg-blue-500/15 text-blue-300'
function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) { return <section className={`rounded-2xl border border-border bg-card p-5 ${className}`}>{children}</section> }
function Bar({ label, value }: { label: string; value: number }) { return <div className="flex flex-col gap-2"><div className="flex justify-between text-sm"><span>{label}</span><b>{fa(value)}٪</b></div><div className="h-2 rounded-full bg-muted"><div className="h-2 rounded-full bg-primary transition-all" style={{ width: `${value}%` }} /></div></div> }
export function StudentProfileShowcase() { const [tab, setTab] = useState('نمای کلی'); const [note, setNote] = useState(''); const [saved, setSaved] = useState(false); const tabs = ['نمای کلی', 'مهارت‌ها', 'ارزیابی‌ها', 'حضور و غیاب', 'مسابقات', 'یادداشت‌ها']; return <div className="mx-auto flex max-w-7xl flex-col gap-6">
  <div className="flex items-center justify-between"><Link href="/students" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowRight className="size-4" />بازگشت به شاگردان</Link><span className="text-xs text-muted-foreground">شاگردان / پروفایل شاگرد</span></div>
  <Card className="flex flex-col justify-between gap-5 md:flex-row md:items-center"><div className="flex items-center gap-4"><span className="flex size-20 items-center justify-center rounded-full bg-cyan-500 text-2xl font-bold text-white">ع</span><div><h1 className="text-2xl font-bold">علی رضایی</h1><p className="mt-2 text-sm text-muted-foreground">شماره شاگرد: ۱۰۲۴ · ۱۵ سال · کلاس نوجوانان</p><div className="mt-3 flex flex-wrap gap-2"><span className={`rounded-full px-3 py-1 text-xs ${beltClass}`}>کمربند آبی</span><span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs text-emerald-300">فعال</span></div></div></div><div className="flex flex-wrap gap-2"><Link href="/students/1024/analysis" className="flex items-center gap-2 rounded-xl border border-primary/30 bg-accent/40 px-4 py-2 text-sm font-semibold text-primary hover:bg-accent"><Sparkles className="size-4" />تحلیل هوشمند</Link><button className="flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm hover:bg-muted"><Pencil className="size-4" />ویرایش اطلاعات</button><Link href="/assessments?student=1024" className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"><Plus className="size-4" />ارزیابی جدید</Link></div></Card>
  <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">{[['حضور','۸۷٪','۴٪ بیشتر از ماه قبل'],['پیشرفت','۷۸٪','۶٪ رشد در ۳ ماه اخیر'],['آمادگی ارتقا','۸۲٪','نزدیک به آماده'],['مسابقات','۶','۳ مدال']].map(([a,b,c]) => <Card key={a}><p className="text-sm text-muted-foreground">{a}</p><p className="mt-3 text-2xl font-bold">{b}</p><p className="mt-2 text-xs text-primary">{c}</p></Card>)}</div>
  <div className="flex gap-1 overflow-x-auto rounded-xl border border-border bg-card p-1">{tabs.map(t => <button key={t} onClick={() => setTab(t)} className={`shrink-0 rounded-lg px-4 py-2 text-xs transition-colors ${tab === t ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:bg-muted'}`}>{t}</button>)}</div>
  {tab === 'ارزیابی‌ها' ? (
    <div className="flex flex-col gap-6">
      <Card>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-bold">سوابق ارزیابی مهارتی</h2>
            <p className="mt-1 text-xs text-muted-foreground">تاریخچه ارزیابی‌های فنی، مبارزه، فرم و آمادگی جسمانی</p>
          </div>
          <Link href="/assessments?student=1024&new=true" className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-sm">
            <Plus className="size-4" />+ ارزیابی جدید برای علی
          </Link>
        </div>
        <div className="mt-5 divide-y divide-border overflow-hidden rounded-xl border border-border">
          {assessmentHistory.map((item, idx) => (
            <div key={item.title} className="flex flex-col justify-between gap-3 p-4 transition-colors hover:bg-muted/40 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
                  <Award className="size-5" />
                </span>
                <div>
                  <h3 className="font-semibold text-sm">{item.title}</h3>
                  <span className="text-xs text-muted-foreground">ثبت شده در {item.date} · مربی امینی</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-left">
                  <span className="text-base font-bold text-primary">{fa(item.score)}٪</span>
                  <span className="block text-[10px] text-muted-foreground">امتیاز کسب‌شده</span>
                </div>
                <Link href="/assessments" className="rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground hover:border-primary hover:text-primary">
                  مشاهده در ماژول ارزیابی
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  ) : tab === 'مهارت‌ها' ? (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <h2 className="text-lg font-bold">امتیازات مهارت‌های تکنیکی و مبارزه</h2>
        <p className="mt-1 text-xs text-muted-foreground">نمرات ثبت شده در آخرین جلسه ارزیابی</p>
        <div className="mt-5 grid gap-4">
          {aliRezaei.skills.map((s) => (
            <Bar key={s.name} label={`${s.name} (${s.category})`} value={s.score} />
          ))}
        </div>
      </Card>
      <Card className="border-primary/20 bg-accent/15">
        <h2 className="text-lg font-bold">وضعیت تسلط بر تکنیک‌ها</h2>
        <p className="mt-1 text-xs text-muted-foreground">بر اساس استانداردهای فدراسیون و آزمون کمربند قرمز</p>
        <div className="mt-5 space-y-4">
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold">ضربات پا (چاگی‌ها)</span>
              <span className="font-bold text-emerald-400">۹۲٪ (عالی)</span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground leading-6">تسلط عالی بر آپ چاگی، دولیو چاگی و دوی چاگی در ارتفاع بالا.</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold">دفاع و مبارزه نزدیک</span>
              <span className="font-bold text-amber-400">۶۴٪ (نیازمند بهبود)</span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground leading-6">نیاز به هماهنگی بیشتر بین گارد دست و جابه‌جایی پا هنگام ضدحمله.</p>
          </div>
        </div>
        <Link href="/assessments?student=1024&new=true" className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-xs font-bold text-primary-foreground">
          <Plus className="size-4" />شروع ارزیابی جامع مهارتی
        </Link>
      </Card>
    </div>
  ) : tab === 'مسابقات' ? (
    <div className="flex flex-col gap-6">
      <Card>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Trophy className="size-5 text-amber-400" />
              سوابق و افتخارات مسابقات
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">مدال‌ها، مسابقات رسمی و نتایج ثبت شده علی رضایی در ماژول مسابقات</p>
          </div>
          <Link href="/competitions" className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow hover:bg-primary/90 transition-all">
            <Trophy className="size-4" />
            مشاهده همه مسابقات باشگاه
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-center">
            <span className="text-xl">🥇</span>
            <span className="block text-sm font-black text-amber-400 mt-1">۱ طلا</span>
            <span className="text-[10px] text-muted-foreground">جام پاییز</span>
          </div>
          <div className="rounded-xl border border-zinc-400/30 bg-zinc-400/10 p-3 text-center">
            <span className="text-xl">🥈</span>
            <span className="block text-sm font-black text-zinc-300 mt-1">۱ نقره</span>
            <span className="text-[10px] text-muted-foreground">جام باشگاه‌ها</span>
          </div>
          <div className="rounded-xl border border-amber-700/30 bg-amber-700/10 p-3 text-center">
            <span className="text-xl">🥉</span>
            <span className="block text-sm font-black text-amber-500 mt-1">۱ برنز</span>
            <span className="text-[10px] text-muted-foreground">مسابقات استان</span>
          </div>
        </div>

        <div className="mt-6 divide-y divide-border overflow-hidden rounded-2xl border border-border">
          {getStudentCompetitionHistory('1024').map((item, idx) => (
            <div key={`${item.competitionId}-${idx}`} className="flex flex-col justify-between gap-3 p-4 transition-colors hover:bg-muted/40 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-primary/15 text-primary text-xl">
                  {item.medalType === 'طلا' ? '🥇' : item.medalType === 'نقره' ? '🥈' : '🥉'}
                </span>
                <div>
                  <h3 className="font-semibold text-sm text-foreground">{item.competitionTitle}</h3>
                  <span className="text-xs text-muted-foreground">{item.categoryTitle} · {item.date}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="inline-flex items-center rounded-full bg-accent px-3 py-1 text-xs font-bold text-foreground">
                  {item.rankTitle}
                </span>
                <Link href="/competitions" className="rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground hover:border-primary hover:text-primary transition-colors">
                  جدول مسابقه ←
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  ) : tab === 'حضور و غیاب' ? (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card className="p-4 text-center">
          <span className="text-xs text-muted-foreground block mb-1">میانگین حضور</span>
          <b className="text-2xl text-foreground font-black">۸۷٪</b>
          <span className="text-[10px] text-emerald-400 block mt-1">+۴٪ بیشتر از ماه قبل</span>
        </Card>
        <Card className="p-4 text-center">
          <span className="text-xs text-muted-foreground block mb-1">جلسات حاضر</span>
          <b className="text-2xl text-emerald-400 font-black">۳۵ جلسه</b>
          <span className="text-[10px] text-muted-foreground block mt-1">از کل ۴۲ جلسه</span>
        </Card>
        <Card className="p-4 text-center">
          <span className="text-xs text-muted-foreground block mb-1">غیبت</span>
          <b className="text-2xl text-rose-400 font-black">۵ جلسه</b>
          <span className="text-[10px] text-muted-foreground block mt-1">۳ جلسه موجه</span>
        </Card>
        <Card className="p-4 text-center">
          <span className="text-xs text-muted-foreground block mb-1">تاخیر</span>
          <b className="text-2xl text-amber-400 font-black">۲ جلسه</b>
          <span className="text-[10px] text-muted-foreground block mt-1">کمتر از ۱۰ دقیقه</span>
        </Card>
      </div>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-foreground">سوابق حضور در کلاس‌های اخیر</h2>
            <p className="mt-1 text-xs text-muted-foreground">ثبت ورود، خروج و وضعیت انضباطی در جلسات تمرینی</p>
          </div>
          <span className="rounded-xl bg-accent px-3 py-1.5 text-xs font-semibold text-primary">کلاس نوجوانان الف</span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-right text-xs">
            <thead className="bg-muted/40 border-b border-border text-muted-foreground font-bold">
              <tr>
                <th className="p-3.5">عنوان جلسه تمرین</th>
                <th className="p-3.5">تاریخ</th>
                <th className="p-3.5">زمان</th>
                <th className="p-3.5">وضعیت</th>
                <th className="p-3.5">توضیحات مربی</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                { title: 'تمرین مبارزه و دفاع', date: '۱۴ شهریور ۱۴۰۵', time: '۱۶:۰۰', status: 'حاضر', note: 'حضور به‌موقع و آمادگی کامل بدنی' },
                { title: 'تمرین فرم‌های پومسه', date: '۱۲ شهریور ۱۴۰۵', time: '۱۶:۰۵', status: 'تاخیر', note: '۵ دقیقه تاخیر با اطلاع قبلی' },
                { title: 'آمادگی جسمانی و استقامت', date: '۱۰ شهریور ۱۴۰۵', time: '۱۶:۰۰', status: 'حاضر', note: 'تمرین فعال و پرانرژی' },
                { title: 'اصول تکنیک ضربات پا', date: '۰۷ شهریور ۱۴۰۵', time: '۱۶:۰۰', status: 'حاضر', note: 'تسلط عالی روی چاگی‌ها' },
                { title: 'شبیه‌سازی مسابقه', date: '۰۵ شهریور ۱۴۰۵', time: '-', status: 'غیبت موجه', note: 'امتحانات مدرسه (اطلاع ولی)' },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-muted/30">
                  <td className="p-3.5 font-semibold text-foreground">{row.title}</td>
                  <td className="p-3.5 text-muted-foreground">{row.date}</td>
                  <td className="p-3.5 text-muted-foreground">{row.time}</td>
                  <td className="p-3.5">
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      row.status === 'حاضر' ? 'bg-emerald-500/15 text-emerald-400' :
                      row.status === 'تاخیر' ? 'bg-amber-500/15 text-amber-400' :
                      'bg-sky-500/15 text-sky-400'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-muted-foreground">{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  ) : tab === 'یادداشت‌ها' ? (
    <div className="flex flex-col gap-6">
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-foreground">یادداشت‌ها و پرونده انضباطی شاگرد</h2>
            <p className="mt-1 text-xs text-muted-foreground">نکات فنی، رفتاری و توصیه‌های مربی برای علی رضایی</p>
          </div>
        </div>

        {/* New Note Form */}
        <div className="rounded-2xl border border-border bg-muted/20 p-4 space-y-3">
          <label className="text-xs font-bold text-foreground block">ثبت یادداشت جدید مربی:</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="نکات تمرینی، پیشرفت رفتاری یا نقاط نیازمند کار شاگرد را بنویسید..."
            className="w-full min-h-24 rounded-xl border border-input bg-background p-3 text-xs text-foreground outline-none focus:border-primary"
          />
          <div className="flex justify-between items-center">
            <span className="text-[11px] text-muted-foreground">ثبت شونده توسط: مربی امینی</span>
            <button
              onClick={() => {
                if (note.trim()) {
                  setSaved(true)
                  setNote('')
                }
              }}
              className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow hover:bg-primary/90 transition-all"
            >
              ثبت یادداشت مربی
            </button>
          </div>
        </div>

        {/* Existing Notes List */}
        <div className="mt-6 space-y-3">
          {saved && (
            <div className="rounded-2xl border border-primary/30 bg-primary/10 p-4 space-y-1 animate-in fade-in">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-foreground">یادداشت جدید ثبت‌شده</span>
                <span className="text-primary text-[10px]">هم‌اکنون</span>
              </div>
              <p className="text-xs text-foreground leading-6">یادداشت با موفقیت در پرونده شاگرد ثبت گردید.</p>
              <span className="text-[10px] text-muted-foreground block pt-1">نویسنده: مربی امینی</span>
            </div>
          )}

          <div className="rounded-2xl border border-border bg-card p-4 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-foreground">عملکرد مبارزه در مسابقه تمرینی</span>
              <span className="text-muted-foreground text-[10px]">۳ روز پیش</span>
            </div>
            <p className="text-xs text-muted-foreground leading-6">
              در مبارزه تمرینی سرعت ضربات چاگی عالی بود ولی در گارد نزدیک دست‌ها کمی پایین می‌افتاد. نیاز به تمرین روی ضدحمله مستقیم.
            </p>
            <span className="text-[10px] text-primary block pt-1">نویسنده: مربی امینی · دسته: فنی و مبارزه</span>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-foreground">پیشرفت در اجرای فرم‌های پومسه</span>
              <span className="text-muted-foreground text-[10px]">۲ هفته پیش</span>
            </div>
            <p className="text-xs text-muted-foreground leading-6">
              ریتم اجرای تایگوک ۴ و ۵ بسیار منظم‌تر شده و هماهنگی پا و دست بهبود چشمگیری دارد.
            </p>
            <span className="text-[10px] text-primary block pt-1">نویسنده: مربی امینی · دسته: فرم</span>
          </div>
        </div>
      </Card>
    </div>
  ) : tab !== 'نمای کلی' ? (
    <Card><h2 className="text-lg font-bold">{tab}</h2><p className="mt-3 text-sm leading-7 text-muted-foreground">اطلاعات این بخش به‌صورت ساختاریافته در حال آماده‌سازی است. از همین صفحه می‌توانید وضعیت فعلی شاگرد را بررسی کنید.</p></Card>
  ) : (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      <div className="flex flex-col gap-6">
        <Card className="border-primary/20 bg-accent/20">
          <div className="flex items-center gap-2">
            <Sparkles className="size-5 text-primary" />
            <div>
              <h2 className="font-bold">تحلیل عملکرد</h2>
              <p className="mt-1 text-xs text-muted-foreground">خلاصه‌ای از وضعیت فعلی علی بر اساس ارزیابی‌های اخیر</p>
            </div>
          </div>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <h3 className="mb-3 text-sm font-semibold text-emerald-300">نقاط قوت</h3>
              <div className="flex flex-col gap-2 text-sm">
                {['تکنیک‌های پا', 'سرعت اجرا', 'انعطاف‌پذیری'].map((x) => (
                  <div key={x} className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-emerald-400" />
                    {x}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="mb-3 text-sm font-semibold text-amber-300">نیازمند بهبود</h3>
              <div className="flex flex-col gap-2 text-sm">
                {['دفاع در فاصله نزدیک', 'حمله متقابل', 'جابه‌جایی پا'].map((x) => (
                  <div key={x} className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-amber-400" />
                    {x}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-5 rounded-xl border border-border bg-card/60 p-4 text-sm leading-7">
            <b>پیشنهاد برای مربی</b>
            <p className="mt-2 text-muted-foreground">در ۳ جلسه آینده تمرکز بیشتری روی دفاع در فاصله نزدیک و حمله متقابل داشته باشید.</p>
          </div>
        </Card>
        <Card>
          <div className="mb-5 flex items-start justify-between">
            <div>
              <h2 className="font-bold">عملکرد مهارتی</h2>
              <p className="mt-1 text-xs text-muted-foreground">آخرین امتیاز ثبت‌شده برای مهارت‌های اصلی</p>
            </div>
            <Link href="/students/1024/analysis" className="text-xs text-primary">تحلیل هوشمند</Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {aliRezaei.skills.slice(0, 6).map((s) => (
              <Bar key={s.name} label={s.name} value={s.score} />
            ))}
          </div>
        </Card>
        <Card>
          <div className="mb-4 flex justify-between">
            <div>
              <h2 className="font-bold">روند پیشرفت</h2>
              <p className="mt-1 text-xs text-muted-foreground">تغییر امتیاز کلی طی ۶ ماه گذشته</p>
            </div>
            <b className="text-primary">۷۸٪</b>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={progress}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => [`${v}٪`, 'امتیاز']} />
                <Line type="monotone" dataKey="value" stroke="var(--primary)" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
      <div className="flex flex-col gap-6">
        <Card className="border-primary/30">
          <div className="flex items-center justify-between">
            <h2 className="font-bold">آمادگی برای کمربند بعدی</h2>
            <Award className="size-5 text-primary" />
          </div>
          <div className="mt-5 flex items-center gap-4">
            <div className="flex size-24 items-center justify-center rounded-full border-8 border-primary text-xl font-bold">۸۲٪</div>
            <div>
              <p className="text-sm">آبی <span className="text-muted-foreground">←</span> قرمز</p>
              <p className="mt-2 text-xs text-muted-foreground">علی برای آزمون کمربند قرمز به آمادگی خوبی رسیده است.</p>
            </div>
          </div>
          <div className="mt-5 flex flex-col gap-4">
            {categoryScores.map((s) => (
              <Bar key={s.name} label={s.name} value={s.value} />
            ))}
          </div>
          <div className="mt-5 flex gap-2">
            <Link href="/assessments?student=1024" className="flex-1 rounded-xl bg-primary px-3 py-2.5 text-center text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-all">
              مشاهده ارزیابی
            </Link>
            <Link href="/progression" className="flex items-center justify-center rounded-xl border border-border bg-muted/40 px-3 py-2.5 text-center text-xs font-semibold text-foreground hover:border-primary hover:text-primary transition-all">
              مسیر کمربند ←
            </Link>
          </div>
        </Card>
        <Card>
          <h2 className="font-bold">حضور و غیاب</h2>
          <p className="mt-3 text-3xl font-bold">۸۷٪</p>
          <p className="mt-2 text-xs text-emerald-300">وضعیت حضور خوب است.</p>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="rounded-lg bg-muted p-3">حضور<br /><b>۳۵</b></div>
            <div className="rounded-lg bg-muted p-3">غیبت<br /><b>۵</b></div>
            <div className="rounded-lg bg-muted p-3">تاخیر<br /><b>۲</b></div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <h2 className="font-bold">یادداشت‌های مربی</h2>
            <UserRound className="size-5 text-muted-foreground" />
          </div>
          <p className="mt-4 rounded-xl bg-muted/60 p-3 text-sm leading-7">در مبارزه امروز سرعت خوبی داشت اما در فاصله نزدیک عجول بود.</p>
          <p className="mt-3 text-xs text-muted-foreground">۳ روز پیش</p>
          <button onClick={() => setSaved(true)} className="mt-4 flex items-center gap-2 text-sm text-primary">
            <Plus className="size-4" />افزودن یادداشت
          </button>
          {saved && (
            <div className="mt-3 flex flex-col gap-2">
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="یادداشت خود را درباره این شاگرد بنویسید..."
                className="min-h-20 rounded-xl border border-input bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
              <button onClick={() => setSaved(false)} className="rounded-xl bg-primary px-3 py-2 text-sm text-primary-foreground">
                ثبت یادداشت
              </button>
            </div>
          )}
        </Card>
      </div>
    </div>
  )}

 </div> }
