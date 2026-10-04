'use client'

import { useState } from 'react'
import {
  User,
  Shield,
  Award,
  Bell,
  Moon,
  Sun,
  Globe,
  CheckCircle2,
  Save,
  Phone,
  Building2,
  UserCheck,
  CreditCard,
  Lock,
} from 'lucide-react'
import { RazmyarShell } from '@/components/razmyar-shell'
import { RoleGuard } from '@/features/auth/guards'
import { useUserStore } from '@/features/user/store'

export default function ProfilePage() {
  const { profile, updateProfile } = useUserStore()

  const [name, setName] = useState(profile.name)
  const [phone, setPhone] = useState(profile.phone)
  const [belt, setBelt] = useState(profile.belt)
  const [targetBelt, setTargetBelt] = useState(profile.targetBelt)
  const [language, setLanguage] = useState<'fa' | 'en'>(profile.language)
  const [theme, setTheme] = useState<'dark' | 'light'>(profile.theme)
  const [smsNotif, setSmsNotif] = useState(profile.notifications.sms)
  const [pushNotif, setPushNotif] = useState(profile.notifications.push)
  const [workoutNotif, setWorkoutNotif] = useState(profile.notifications.reminderWorkout)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    updateProfile({
      name,
      phone,
      belt,
      targetBelt,
      language,
      theme,
      notifications: {
        sms: smsNotif,
        push: pushNotif,
        reminderWorkout: workoutNotif,
      },
    })
    showToast('اطلاعات پروفایل شخصی با موفقیت ذخیره شد.')
  }

  return (
    <RoleGuard allowedRoles={['USER', 'TEAM_ADMIN', 'SUPER_ADMIN']}>
      <RazmyarShell title="پروفایل شخصی هنرجو">
        <div className="max-w-4xl space-y-6 pb-12">
          {/* Toast */}
          {toastMessage && (
            <div className="fixed bottom-6 left-6 z-50 flex items-center gap-2 rounded-2xl bg-foreground px-4 py-3 text-xs font-bold text-background shadow-2xl animate-in slide-in-from-bottom-5">
              <CheckCircle2 className="size-4 text-emerald-400" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* Profile Card Header */}
          <div className="flex flex-col sm:flex-row items-center gap-5 rounded-3xl border border-border bg-gradient-to-br from-card via-card to-primary/5 p-6 shadow-sm">
            <div className="flex size-20 items-center justify-center rounded-3xl bg-primary text-3xl font-black text-primary-foreground shadow-xl shadow-primary/20">
              {name.charAt(0) || 'ع'}
            </div>

            <div className="space-y-1 text-center sm:text-right flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-xl font-bold text-foreground">{name}</h2>
                <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-bold text-emerald-500">
                  هنرجوی فعال باشگاه
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                عضو باشگاه {profile.clubName} · تحت نظارت مربی {profile.coachName}
              </p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2 text-xs">
                <span className="rounded-xl border border-border bg-muted/30 px-3 py-1 font-semibold text-foreground flex items-center gap-1.5">
                  <Award className="size-3.5 text-primary" />
                  کمربند فعلی: {belt}
                </span>
                <span className="rounded-xl border border-border bg-muted/30 px-3 py-1 font-semibold text-foreground flex items-center gap-1.5">
                  <Shield className="size-3.5 text-amber-500" />
                  هدف بعدی: {targetBelt}
                </span>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <form onSubmit={handleSave} className="space-y-6">
            {/* Section 1: General Info */}
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2 border-b border-border pb-3">
                <User className="size-4 text-primary" />
                اطلاعات فردی و هویتی
              </h3>

              <div className="grid gap-4 sm:grid-cols-2 text-xs">
                <div>
                  <label className="font-bold text-foreground block mb-1.5">نام و نام خانوادگی *</label>
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-2xl border border-input bg-muted/30 px-3.5 py-2.5 outline-none focus:border-primary font-semibold"
                  />
                </div>

                <div>
                  <label className="font-bold text-foreground block mb-1.5">شماره تلفن همراه *</label>
                  <input
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-2xl border border-input bg-muted/30 px-3.5 py-2.5 outline-none focus:border-primary font-semibold font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-foreground block mb-1.5">رنگ کمربند کنونی</label>
                  <select
                    value={belt}
                    onChange={(e) => setBelt(e.target.value)}
                    className="w-full rounded-2xl border border-input bg-muted/30 px-3.5 py-2.5 outline-none focus:border-primary font-semibold text-foreground"
                  >
                    <option value="سفید">سفید</option>
                    <option value="زرد">زرد</option>
                    <option value="سبز">سبز</option>
                    <option value="آبی">آبی</option>
                    <option value="قرمز">قرمز</option>
                    <option value="مشکی دان ۱">مشکی دان ۱</option>
                    <option value="مشکی دان ۲">مشکی دان ۲</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-foreground block mb-1.5">هدف ارتقای کمربند</label>
                  <select
                    value={targetBelt}
                    onChange={(e) => setTargetBelt(e.target.value)}
                    className="w-full rounded-2xl border border-input bg-muted/30 px-3.5 py-2.5 outline-none focus:border-primary font-semibold text-foreground"
                  >
                    <option value="زرد">زرد</option>
                    <option value="سبز">سبز</option>
                    <option value="آبی">آبی</option>
                    <option value="قرمز">قرمز</option>
                    <option value="مشکی دان ۱">مشکی دان ۱</option>
                    <option value="مشکی دان ۲">مشکی دان ۲</option>
                  </select>
                </div>
              </div>

              {/* Club & Coach details (Read-only for athlete) */}
              <div className="grid gap-4 sm:grid-cols-2 pt-2 border-t border-border/60 text-xs">
                <div>
                  <label className="font-bold text-muted-foreground block mb-1.5">باشگاه محل تمرین (ثبت شده)</label>
                  <div className="flex items-center gap-2 rounded-2xl border border-border/70 bg-muted/20 px-3.5 py-2.5 text-muted-foreground">
                    <Building2 className="size-4" />
                    <span>{profile.clubName}</span>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-muted-foreground block mb-1.5">استاد / مربی مسئول</label>
                  <div className="flex items-center gap-2 rounded-2xl border border-border/70 bg-muted/20 px-3.5 py-2.5 text-muted-foreground">
                    <UserCheck className="size-4" />
                    <span>{profile.coachName}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Preferences & UI */}
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2 border-b border-border pb-3">
                <Globe className="size-4 text-primary" />
                تنظیمات کاربری و ظاهر
              </h3>

              <div className="grid gap-4 sm:grid-cols-2 text-xs">
                <div>
                  <label className="font-bold text-foreground block mb-1.5">زبان برنامه</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as any)}
                    className="w-full rounded-2xl border border-input bg-muted/30 px-3.5 py-2.5 outline-none focus:border-primary font-semibold text-foreground"
                  >
                    <option value="fa">فارسی (پیش‌فرض)</option>
                    <option value="en">English (انگلیسی)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-foreground block mb-1.5">پوسته نمایشی (تم)</label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setTheme('dark')}
                      className={`flex-1 flex items-center justify-center gap-2 rounded-2xl border py-2.5 font-bold transition ${
                        theme === 'dark'
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-input bg-muted/20 text-muted-foreground'
                      }`}
                    >
                      <Moon className="size-4" />
                      <span>تیره (Dark)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTheme('light')}
                      className={`flex-1 flex items-center justify-center gap-2 rounded-2xl border py-2.5 font-bold transition ${
                        theme === 'light'
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-input bg-muted/20 text-muted-foreground'
                      }`}
                    >
                      <Sun className="size-4" />
                      <span>روشن (Light)</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Notifications */}
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2 border-b border-border pb-3">
                <Bell className="size-4 text-primary" />
                تنظیمات دریافت اعلان و یادآوری
              </h3>

              <div className="space-y-3 text-xs">
                <label className="flex items-center justify-between rounded-2xl border border-border p-3.5 cursor-pointer hover:bg-muted/20 transition">
                  <div className="space-y-0.5">
                    <span className="font-bold text-foreground block">ارسال پیامک یادآوری کلاس‌ها</span>
                    <span className="text-[11px] text-muted-foreground">دریافت SMS ۲ ساعت پیش از آغاز سانس باشگاه</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={smsNotif}
                    onChange={(e) => setSmsNotif(e.target.checked)}
                    className="size-4 accent-primary rounded cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between rounded-2xl border border-border p-3.5 cursor-pointer hover:bg-muted/20 transition">
                  <div className="space-y-0.5">
                    <span className="font-bold text-foreground block">اعلان‌های درون‌برنامه‌ای (Push Notification)</span>
                    <span className="text-[11px] text-muted-foreground">هشدارهای وظایف و رویدادهای باشگاه</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={pushNotif}
                    onChange={(e) => setPushNotif(e.target.checked)}
                    className="size-4 accent-primary rounded cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between rounded-2xl border border-border p-3.5 cursor-pointer hover:bg-muted/20 transition">
                  <div className="space-y-0.5">
                    <span className="font-bold text-foreground block">یادآور برنامه تمرین انفرادی</span>
                    <span className="text-[11px] text-muted-foreground">هشدار روزانه جهت ثبت چک‌لیست حرکات و پیشرفت</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={workoutNotif}
                    onChange={(e) => setWorkoutNotif(e.target.checked)}
                    className="size-4 accent-primary rounded cursor-pointer"
                  />
                </label>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="submit"
                className="flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 text-xs sm:text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 transition"
              >
                <Save className="size-4" />
                <span>ذخیره تغییرات پروفایل</span>
              </button>
            </div>
          </form>
        </div>
      </RazmyarShell>
    </RoleGuard>
  )
}
