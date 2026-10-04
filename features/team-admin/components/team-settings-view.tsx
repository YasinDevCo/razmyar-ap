'use client'

import { useState } from 'react'
import {
  Settings,
  Shield,
  Bell,
  Sliders,
  CheckCircle2,
  Building2,
  Lock,
} from 'lucide-react'
import { useAuth } from '@/lib/auth-context'

export function TeamSettingsView() {
  const { teamId, teamName } = useAuth()
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const [tName, setTName] = useState(teamName)
  const [managerName, setManagerName] = useState('استاد فجری (مدیر تیم)')
  const [phone, setPhone] = useState('۰۹۱۲۱۱۱۱۱۱۱')
  const [email, setEmail] = useState('fajr@example.com')

  // Toggles
  const [allowPromotions, setAllowPromotions] = useState(true)
  const [allowSmsReminders, setAllowSmsReminders] = useState(true)
  const [allowKioskAttendance, setAllowKioskAttendance] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setToastMessage('تنظیمات تیم با موفقیت ذخیره شد.')
    setTimeout(() => setToastMessage(null), 3000)
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 flex items-center gap-2 rounded-2xl bg-foreground px-4 py-3 text-xs font-bold text-background shadow-2xl animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="size-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
            {teamName}
          </span>
          <span className="text-xs text-muted-foreground">· تنظیمات داخلی تیم</span>
        </div>
        <h2 className="text-xl font-bold text-foreground">تنظیمات و پیکربندی تیم</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          مدیریت پروفایل تیم، قوانین عملیاتی و دسترسی‌های کادر فنی
        </p>
      </div>

      {/* Security Scope Notice */}
      <div className="rounded-2xl border border-border bg-muted/40 p-4 text-xs text-muted-foreground flex items-center gap-3">
        <Lock className="size-4 text-primary shrink-0" />
        <span>
          <strong>محدوده اختیارات مدیر تیم:</strong> شما دسترسی لازم جهت ویرایش اطلاعات تیم و سالن‌های زیرمجموعه خود را دارید. گزینه‌های مربوط به تنظیمات زیرساختی، پلن‌های عمومی پلتفرم و سایر تیم‌ها بر اساس نقش شما غیرفعال هستند.
        </span>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Team Profile */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <Building2 className="size-5 text-primary" />
            مشخصات کلی تیم
          </h3>

          <div className="grid gap-4 sm:grid-cols-2 text-xs">
            <div>
              <label className="font-bold text-foreground block mb-1">نام تیم</label>
              <input
                value={tName}
                onChange={(e) => setTName(e.target.value)}
                className="w-full rounded-xl border border-input bg-muted/40 p-2.5 outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="font-bold text-foreground block mb-1">شناسه سازمانی (Tenant Code)</label>
              <input
                disabled
                value={teamId || 'FAJR'}
                className="w-full rounded-xl border border-input bg-muted/70 p-2.5 font-mono text-muted-foreground cursor-not-allowed"
              />
            </div>
            <div>
              <label className="font-bold text-foreground block mb-1">نام مدیر ارشد تیم</label>
              <input
                value={managerName}
                onChange={(e) => setManagerName(e.target.value)}
                className="w-full rounded-xl border border-input bg-muted/40 p-2.5 outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="font-bold text-foreground block mb-1">شماره تماس اضطراری</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl border border-input bg-muted/40 p-2.5 outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>

        {/* Allowed Features & Operational Toggles */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <Sliders className="size-5 text-primary" />
            امکانات و ویژگی‌های مجاز تیم
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3.5 rounded-2xl border border-border bg-accent/20">
              <div>
                <span className="font-bold block text-foreground">سیستم آزمون و ارتقای کمربند</span>
                <span className="text-muted-foreground text-[11px]">اجازه به مربیان سالن‌ها جهت ثبت آزمون و پیشنهاد ترفیع</span>
              </div>
              <input
                type="checkbox"
                checked={allowPromotions}
                onChange={(e) => setAllowPromotions(e.target.checked)}
                className="size-4 text-primary rounded"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl border border-border bg-accent/20">
              <div>
                <span className="font-bold block text-foreground">سامانه پیامکی یادآوری شهریه</span>
                <span className="text-muted-foreground text-[11px]">ارسال خودکار پیامک سررسید به والدین و هنرجویان باشگاه‌ها</span>
              </div>
              <input
                type="checkbox"
                checked={allowSmsReminders}
                onChange={(e) => setAllowSmsReminders(e.target.checked)}
                className="size-4 text-primary rounded"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl border border-border bg-accent/20">
              <div>
                <span className="font-bold block text-foreground">کیوسک هوشمند حضور و غیاب</span>
                <span className="text-muted-foreground text-[11px]">امکان اتصال دستگاه کارت‌خوان در ورودی سالن‌ها</span>
              </div>
              <input
                type="checkbox"
                checked={allowKioskAttendance}
                onChange={(e) => setAllowKioskAttendance(e.target.checked)}
                className="size-4 text-primary rounded"
              />
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="rounded-2xl bg-primary px-6 py-2.5 text-xs sm:text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 transition"
          >
            ذخیره تنظیمات تیم
          </button>
        </div>
      </form>
    </div>
  )
}
