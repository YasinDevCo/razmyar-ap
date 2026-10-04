'use client'

import { useState } from 'react'
import {
  Building2,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Edit2,
  Settings,
  X,
  Phone,
  Mail,
  MapPin,
  Users,
  Shield,
  CreditCard,
} from 'lucide-react'
import { RazmyarShell } from '@/components/razmyar-shell'
import { RoleGuard } from '@/features/auth/guards'
import { useAuth } from '@/lib/auth-context'
import { useTeamAdminStore } from '@/features/team-admin/store'
import { TeamClub } from '@/features/team-admin/types'

export default function ClubsManagementPage() {
  const { teamId, teamName, selectedClubId, setSelectedClubId } = useAuth()
  const { teamClubs, addClub, updateClub, toggleClubStatus } = useTeamAdminStore(teamId || 'FAJR', selectedClubId)

  const [search, setSearch] = useState('')
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editingClub, setEditingClub] = useState<TeamClub | null>(null)
  const [settingsClub, setSettingsClub] = useState<TeamClub | null>(null)

  // Add Club Form
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [contactName, setContactName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [notes, setNotes] = useState('')

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    addClub({
      name: name.trim(),
      code: code.trim() || name.trim().toUpperCase(),
      contactName: contactName.trim() || 'مدیر سالن',
      phone: phone.trim() || '۰۹۱۲۰۰۰۰۰۰۰',
      email: email.trim() || 'club@example.com',
      address: address.trim() || 'ثبت نشده',
      status: 'ACTIVE',
      subPlan: 'BASIC',
      subStatus: 'ACTIVE',
      subExpiration: '۱۴۰۶/۰۱/۰۱',
      notes: notes.trim(),
    })

    setIsAddOpen(false)
    setName('')
    setCode('')
    setContactName('')
    setPhone('')
    setEmail('')
    setAddress('')
    setNotes('')
    showToast(`باشگاه «${name}» با موفقیت افزوده شد.`)
  }

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingClub) return

    updateClub(editingClub.id, {
      name: editingClub.name,
      contactName: editingClub.contactName,
      phone: editingClub.phone,
      email: editingClub.email,
      address: editingClub.address,
      notes: editingClub.notes,
    })

    setEditingClub(null)
    showToast('اطلاعات باشگاه با موفقیت به‌روزرسانی شد.')
  }

  const filteredClubs = teamClubs.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase().trim()) ||
      c.code.toLowerCase().includes(search.toLowerCase().trim()) ||
      c.contactName.toLowerCase().includes(search.toLowerCase().trim())
  )

  return (
    <RoleGuard allowedRoles={['TEAM_ADMIN', 'SUPER_ADMIN']}>
      <RazmyarShell title="مدیریت باشگاه‌ها">
        <div className="space-y-6 pb-12">
          {/* Toast */}
          {toastMessage && (
            <div className="fixed bottom-6 left-6 z-50 flex items-center gap-2 rounded-2xl bg-foreground px-4 py-3 text-xs font-bold text-background shadow-2xl animate-in slide-in-from-bottom-5">
              <CheckCircle2 className="size-4 text-emerald-400" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                  {teamName}
                </span>
                <span className="text-xs text-muted-foreground">· حوزه مدیریت داخلی تیم</span>
              </div>
              <h2 className="text-xl font-bold text-foreground">باشگاه‌های زیرمجموعه تیم</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                ایجاد، ویرایش، فعال‌سازی سالن‌ها و نظارت بر وضعیت اشتراک
              </p>
            </div>

            <button
              onClick={() => setIsAddOpen(true)}
              className="flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-2.5 text-xs sm:text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 transition"
            >
              <Plus className="size-4" />
              <span>ایجاد باشگاه جدید</span>
            </button>
          </div>

          {/* Restrictions Banner */}
          <div className="rounded-2xl border border-border bg-muted/40 p-3.5 text-xs text-muted-foreground flex items-center gap-3">
            <Shield className="size-4 text-primary shrink-0" />
            <span>
              <strong>حیطه دسترسی مدیر تیم:</strong> شما فقط باشگاه‌های متعلق به <strong>{teamName}</strong> را مدیریت می‌کنید. مدیریت پلن‌های کلان پلتفرم و قیمت‌گذاری صرفاً در اختیار مالک پلتفرم (SUPER_ADMIN) است.
            </span>
          </div>

          {/* Search bar */}
          <div className="flex items-center gap-2 rounded-2xl border border-input bg-card px-3.5 py-2.5">
            <Search className="size-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="جستجوی باشگاه با نام، کد یا مربی مسئول..."
              className="flex-1 bg-transparent text-xs sm:text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>

          {/* Clubs Grid Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredClubs.map((club) => {
              const isSelected = selectedClubId === club.id
              return (
                <div
                  key={club.id}
                  className={`rounded-3xl border p-5 shadow-sm transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-primary bg-primary/[0.03] ring-2 ring-primary/20'
                      : 'border-border bg-card hover:border-primary/40'
                  }`}
                >
                  <div className="space-y-3.5">
                    {/* Top Row: Name & Status */}
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-foreground">{club.name}</h3>
                          {isSelected && (
                            <span className="rounded-full bg-primary px-2 py-0.5 text-[9px] font-bold text-primary-foreground">
                              فعال در هدر
                            </span>
                          )}
                        </div>
                        <span className="font-mono text-[11px] text-muted-foreground">کد: {club.code}</span>
                      </div>

                      <button
                        onClick={() => toggleClubStatus(club.id)}
                        title="تغییر وضعیت فعالیت باشگاه"
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold transition ${
                          club.status === 'ACTIVE'
                            ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'
                            : 'bg-muted text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500'
                        }`}
                      >
                        {club.status === 'ACTIVE' ? 'فعال' : 'غیرفعال'}
                      </button>
                    </div>

                    {/* Subscription & Players details */}
                    <div className="rounded-2xl bg-accent/40 p-3 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground flex items-center gap-1.5">
                          <CreditCard className="size-3.5 text-primary" />
                          پلن اشتراک:
                        </span>
                        <span className="font-bold text-primary">{club.subPlan}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">وضعیت دسترسی:</span>
                        <span>
                          {club.subStatus === 'ACTIVE' && (
                            <span className="text-emerald-500 font-bold">معتبر و فعال</span>
                          )}
                          {club.subStatus === 'EXPIRING' && (
                            <span className="text-amber-500 font-bold">در حال انقضا</span>
                          )}
                          {club.subStatus === 'NO_SUB' && (
                            <span className="text-destructive font-bold">بدون اشتراک</span>
                          )}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-muted-foreground">انقضا:</span>
                        <span className="font-mono text-muted-foreground">{club.subExpiration}</span>
                      </div>
                    </div>

                    {/* Contact & Address */}
                    <div className="space-y-1.5 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Users className="size-3.5 text-muted-foreground" />
                        <span>مربی مسئول: <strong className="text-foreground">{club.contactName}</strong></span>
                        <span className="mr-auto font-bold text-foreground">({club.playersCount} هنرجو)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="size-3.5 text-muted-foreground" />
                        <span dir="ltr">{club.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="size-3.5 text-muted-foreground shrink-0" />
                        <span className="truncate">{club.address}</span>
                      </div>
                    </div>

                    {club.notes && (
                      <p className="text-[11px] text-muted-foreground bg-muted/30 p-2 rounded-xl border border-border/50">
                        {club.notes}
                      </p>
                    )}
                  </div>

                  {/* Actions Bottom Bar */}
                  <div className="mt-5 pt-3.5 border-t border-border flex items-center justify-between gap-2">
                    <button
                      onClick={() => setSelectedClubId(club.id)}
                      className={`flex-1 rounded-xl py-1.5 text-xs font-bold transition ${
                        isSelected
                          ? 'bg-primary text-primary-foreground'
                          : 'border border-border hover:bg-muted text-foreground'
                      }`}
                    >
                      {isSelected ? 'باشگاه انتخاب‌شده' : 'انتخاب این باشگاه'}
                    </button>

                    <button
                      onClick={() => setEditingClub(club)}
                      title="ویرایش باشگاه"
                      className="rounded-xl border border-border p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition"
                    >
                      <Edit2 className="size-3.5" />
                    </button>

                    <button
                      onClick={() => setSettingsClub(club)}
                      title="تنظیمات عملیاتی سالن"
                      className="rounded-xl border border-border p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition"
                    >
                      <Settings className="size-3.5" />
                    </button>
                  </div>
                </div>
              )
            })}

            {filteredClubs.length === 0 && (
              <div className="col-span-full py-12 text-center text-sm text-muted-foreground">
                باشگاهی با این مشخصات در تیم شما یافت نشد
              </div>
            )}
          </div>
        </div>

        {/* MODAL: Add Club */}
        {isAddOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <h3 className="text-lg font-bold text-foreground">ایجاد باشگاه جدید</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">افزودن باشگاه به زیرمجموعه {teamName}</p>
                </div>
                <button
                  onClick={() => setIsAddOpen(false)}
                  className="rounded-full p-1 text-muted-foreground hover:bg-muted"
                >
                  <X className="size-5" />
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-3.5 text-xs">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="font-bold text-foreground block mb-1">نام باشگاه *</label>
                    <input
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="نام باشگاه..."
                      className="w-full rounded-xl border border-input bg-muted/40 p-2.5 outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-foreground block mb-1">کد اختصاصی (Slug)</label>
                    <input
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="مثلاً: ALBORZ"
                      className="w-full rounded-xl border border-input bg-muted/40 p-2.5 font-mono outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="font-bold text-foreground block mb-1">نام مربی / مسئول</label>
                    <input
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="استاد ..."
                      className="w-full rounded-xl border border-input bg-muted/40 p-2.5 outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-foreground block mb-1">شماره تماس</label>
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="۰۹۱۲..."
                      className="w-full rounded-xl border border-input bg-muted/40 p-2.5 outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-foreground block mb-1">ایمیل باشگاه</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="club@domain.ir"
                    className="w-full rounded-xl border border-input bg-muted/40 p-2.5 outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="font-bold text-foreground block mb-1">آدرس سالن</label>
                  <input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="آدرس دقیق سالن ورزشی..."
                    className="w-full rounded-xl border border-input bg-muted/40 p-2.5 outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="font-bold text-foreground block mb-1">یادداشت‌ها</label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="توضیحات و امکانات سالن..."
                    className="w-full rounded-xl border border-input bg-muted/40 p-2.5 outline-none focus:border-primary"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setIsAddOpen(false)}
                    className="rounded-xl border border-border px-4 py-2 font-semibold text-muted-foreground hover:bg-muted"
                  >
                    انصراف
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-primary px-5 py-2 font-bold text-primary-foreground hover:bg-primary/90"
                  >
                    ثبت و ذخیره باشگاه
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: Edit Club */}
        {editingClub && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <h3 className="text-lg font-bold text-foreground">ویرایش مشخصات باشگاه</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{editingClub.name}</p>
                </div>
                <button
                  onClick={() => setEditingClub(null)}
                  className="rounded-full p-1 text-muted-foreground hover:bg-muted"
                >
                  <X className="size-5" />
                </button>
              </div>

              <form onSubmit={handleUpdate} className="space-y-3.5 text-xs">
                <div>
                  <label className="font-bold text-foreground block mb-1">نام باشگاه</label>
                  <input
                    required
                    value={editingClub.name}
                    onChange={(e) => setEditingClub({ ...editingClub, name: e.target.value })}
                    className="w-full rounded-xl border border-input bg-muted/40 p-2.5 outline-none focus:border-primary"
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="font-bold text-foreground block mb-1">مربی / مسئول</label>
                    <input
                      value={editingClub.contactName}
                      onChange={(e) => setEditingClub({ ...editingClub, contactName: e.target.value })}
                      className="w-full rounded-xl border border-input bg-muted/40 p-2.5 outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-foreground block mb-1">شماره تماس</label>
                    <input
                      value={editingClub.phone}
                      onChange={(e) => setEditingClub({ ...editingClub, phone: e.target.value })}
                      className="w-full rounded-xl border border-input bg-muted/40 p-2.5 outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-foreground block mb-1">آدرس سالن</label>
                  <input
                    value={editingClub.address}
                    onChange={(e) => setEditingClub({ ...editingClub, address: e.target.value })}
                    className="w-full rounded-xl border border-input bg-muted/40 p-2.5 outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="font-bold text-foreground block mb-1">یادداشت‌ها</label>
                  <textarea
                    rows={2}
                    value={editingClub.notes || ''}
                    onChange={(e) => setEditingClub({ ...editingClub, notes: e.target.value })}
                    className="w-full rounded-xl border border-input bg-muted/40 p-2.5 outline-none focus:border-primary"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setEditingClub(null)}
                    className="rounded-xl border border-border px-4 py-2 font-semibold text-muted-foreground hover:bg-muted"
                  >
                    انصراف
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-primary px-5 py-2 font-bold text-primary-foreground hover:bg-primary/90"
                  >
                    ذخیره تغییرات
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: Operational Settings */}
        {settingsClub && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <h3 className="text-base font-bold text-foreground">تنظیمات عملیاتی سالن</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{settingsClub.name}</p>
                </div>
                <button
                  onClick={() => setSettingsClub(null)}
                  className="rounded-full p-1 text-muted-foreground hover:bg-muted"
                >
                  <X className="size-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-3 rounded-2xl border border-border bg-accent/30">
                  <div>
                    <span className="font-bold block">پذیرش هنرجوی جدید</span>
                    <span className="text-[10px] text-muted-foreground">امکان ثبت‌نام آنلاین در این شعبه</span>
                  </div>
                  <input type="checkbox" defaultChecked className="size-4 text-primary rounded" />
                </div>

                <div className="flex items-center justify-between p-3 rounded-2xl border border-border bg-accent/30">
                  <div>
                    <span className="font-bold block">پیامک خودکار یادآوری شهریه</span>
                    <span className="text-[10px] text-muted-foreground">ارسال پیامک در سررسید ماهانه</span>
                  </div>
                  <input type="checkbox" defaultChecked className="size-4 text-primary rounded" />
                </div>

                <div className="flex items-center justify-between p-3 rounded-2xl border border-border bg-accent/30">
                  <div>
                    <span className="font-bold block">ثبت خودکار حضور و غیاب</span>
                    <span className="text-[10px] text-muted-foreground">ثبت ورود از طریق کیوسک سالن</span>
                  </div>
                  <input type="checkbox" className="size-4 text-primary rounded" />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => {
                    setSettingsClub(null)
                    showToast('تنظیمات عملیاتی سالن ذخیره شد.')
                  }}
                  className="rounded-xl bg-primary px-4 py-2 font-bold text-primary-foreground hover:bg-primary/90 text-xs"
                >
                  تایید و ذخیره
                </button>
              </div>
            </div>
          </div>
        )}
      </RazmyarShell>
    </RoleGuard>
  )
}
