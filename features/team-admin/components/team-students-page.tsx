'use client'

import { useState } from 'react'
import {
  Users,
  Search,
  Plus,
  ArrowRightLeft,
  CheckCircle2,
  Clock,
  History,
  X,
  Phone,
  Building2,
  Award,
  Calendar,
  AlertCircle,
  MoreVertical,
  ChevronDown,
} from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { useTeamAdminStore } from '../store'
import { TeamPlayer } from '../types'

export function TeamStudentsPage() {
  const { teamId, teamName, selectedClubId, setSelectedClubId } = useAuth()
  const {
    teamClubs,
    scopedPlayers,
    addPlayer,
    movePlayer,
    toggleClubStatus,
  } = useTeamAdminStore(teamId || 'FAJR', selectedClubId)

  const [search, setSearch] = useState('')
  const [selectedBelt, setSelectedBelt] = useState('همه')
  const [selectedStatus, setSelectedStatus] = useState('همه')
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Modals
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [movingPlayer, setMovingPlayer] = useState<TeamPlayer | null>(null)
  const [historyPlayer, setHistoryPlayer] = useState<TeamPlayer | null>(null)
  const [targetClubId, setTargetClubId] = useState<string>('')

  // New Player Form State
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [newAge, setNewAge] = useState('15')
  const [newBelt, setNewBelt] = useState('سفید')
  const [newTargetBelt, setNewTargetBelt] = useState('زرد')
  const [newClass, setNewClass] = useState('نوجوانان عمومی')
  const [newClubId, setNewClubId] = useState(selectedClubId || teamClubs[0]?.id || 'PARTO')

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim()) return

    const assignedClub = newClubId || teamClubs[0]?.id || 'PARTO'
    addPlayer({
      name: newName.trim(),
      phone: newPhone.trim() || '۰۹۱۲۰۰۰۰۰۰۰',
      age: parseInt(newAge) || 15,
      belt: newBelt,
      targetBelt: newTargetBelt,
      className: newClass,
      clubId: assignedClub,
      status: 'ACTIVE',
      attendance: 90,
      joinedDate: new Date().toLocaleDateString('fa-IR'),
    })

    setIsAddOpen(false)
    setNewName('')
    setNewPhone('')
    showToast(`هنرجو «${newName}» با موفقیت ثبت شد.`)
  }

  const handleMoveSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!movingPlayer || !targetClubId) return

    const targetClub = teamClubs.find((c) => c.id === targetClubId)
    const success = movePlayer(movingPlayer.id, targetClubId)
    if (success) {
      showToast(`هنرجو «${movingPlayer.name}» به ${targetClub?.name} منتقل شد.`)
      setMovingPlayer(null)
    }
  }

  const filteredPlayers = scopedPlayers.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase().trim()) ||
      p.phone.includes(search.trim())
    const matchesBelt = selectedBelt === 'همه' || p.belt === selectedBelt
    const matchesStatus =
      selectedStatus === 'همه' ||
      (selectedStatus === 'ACTIVE' && p.status === 'ACTIVE') ||
      (selectedStatus === 'READY' && p.status === 'READY_FOR_TEST') ||
      (selectedStatus === 'NEEDS' && p.status === 'NEEDS_PRACTICE')
    return matchesSearch && matchesBelt && matchesStatus
  })

  const selectedClub = teamClubs.find((c) => c.id === selectedClubId)

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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
              {teamName}
            </span>
            <span className="text-xs text-muted-foreground">
              · {selectedClub ? selectedClub.name : 'تمامی باشگاه‌ها'}
            </span>
          </div>
          <h2 className="text-xl font-bold text-foreground">مدیریت بازیکنان و هنرجویان</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            ثبت اطلاعات، وضعیت کمربند و امکان جابجایی هنرجو بین باشگاه‌های زیرمجموعه تیم
          </p>
        </div>

        <button
          onClick={() => {
            setNewClubId(selectedClubId || teamClubs[0]?.id || 'PARTO')
            setIsAddOpen(true)
          }}
          className="flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-2.5 text-xs sm:text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 transition"
        >
          <Plus className="size-4" />
          <span>افزودن هنرجوی جدید</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute right-3.5 top-3 size-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جستجوی هنرجو با نام یا شماره تماس..."
            className="w-full rounded-2xl border border-input bg-card pr-10 pl-4 py-2.5 text-xs sm:text-sm outline-none placeholder:text-muted-foreground focus:border-primary"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Filter by Belt */}
          <select
            value={selectedBelt}
            onChange={(e) => setSelectedBelt(e.target.value)}
            className="rounded-2xl border border-input bg-card px-3 py-2.5 outline-none text-foreground font-semibold"
          >
            <option value="همه">کمربند: همه</option>
            <option value="سفید">سفید</option>
            <option value="زرد">زرد</option>
            <option value="سبز">سبز</option>
            <option value="آبی">آبی</option>
            <option value="قرمز">قرمز</option>
            <option value="مشکی">مشکی</option>
          </select>

          {/* Filter by Status */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-2xl border border-input bg-card px-3 py-2.5 outline-none text-foreground font-semibold"
          >
            <option value="همه">وضعیت: همه</option>
            <option value="ACTIVE">فعال</option>
            <option value="READY">آماده آزمون</option>
            <option value="NEEDS">نیازمند تمرین</option>
          </select>
        </div>
      </div>

      {/* Players Table */}
      <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="border-b border-border bg-muted/40 text-[11px] font-bold text-muted-foreground">
              <tr>
                <th className="p-3.5">هنرجو</th>
                <th className="p-3.5">باشگاه مستقر</th>
                <th className="p-3.5">کمربند فعلی / هدف</th>
                <th className="p-3.5">کلاس تمرینی</th>
                <th className="p-3.5">حضور و غیاب</th>
                <th className="p-3.5">وضعیت مهارت</th>
                <th className="p-3.5 text-left">عملیات مدیریت</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredPlayers.map((player) => {
                const club = teamClubs.find((c) => c.id === player.clubId)
                return (
                  <tr key={player.id} className="transition hover:bg-muted/30">
                    <td className="p-3.5">
                      <div className="font-bold text-foreground text-sm">{player.name}</div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">
                        {player.age} سال · تماس: <span dir="ltr">{player.phone}</span>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <div className="flex items-center gap-1.5 font-semibold text-foreground">
                        <Building2 className="size-3.5 text-primary" />
                        <span>{club?.name || player.clubId}</span>
                      </div>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        کد تیم: {player.teamId}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-foreground">{player.belt}</span>
                        <span className="text-muted-foreground text-[10px]">← {player.targetBelt}</span>
                      </div>
                    </td>
                    <td className="p-3.5 text-muted-foreground">{player.className}</td>
                    <td className="p-3.5">
                      <span className="font-bold text-foreground">{player.attendance}٪</span>
                    </td>
                    <td className="p-3.5">
                      {player.status === 'READY_FOR_TEST' && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-500">
                          آماده آزمون
                        </span>
                      )}
                      {player.status === 'ACTIVE' && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold text-blue-500">
                          فعال
                        </span>
                      )}
                      {player.status === 'NEEDS_PRACTICE' && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-500">
                          نیازمند تمرین
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-left">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Transfer Player Button */}
                        <button
                          onClick={() => {
                            setMovingPlayer(player)
                            // default destination to another club
                            const other = teamClubs.find((c) => c.id !== player.clubId)
                            setTargetClubId(other?.id || '')
                          }}
                          className="flex items-center gap-1 rounded-xl bg-primary/10 px-2.5 py-1 text-[11px] font-bold text-primary hover:bg-primary/20 transition"
                          title="انتقال هنرجو بین باشگاه‌های تیم"
                        >
                          <ArrowRightLeft className="size-3" />
                          <span>انتقال باشگاه</span>
                        </button>

                        {/* View History Button */}
                        <button
                          onClick={() => setHistoryPlayer(player)}
                          className="rounded-xl border border-border p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition"
                          title="سوابق و تاریخچه انتقال"
                        >
                          <History className="size-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}

              {filteredPlayers.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-sm text-muted-foreground">
                    هنرجویی با این فیلترها در دامنه تیم شما یافت نشد
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Move Player Between Clubs (CRITICAL REQUIREMENT) */}
      {movingPlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <div className="rounded-xl bg-primary/10 p-2 text-primary">
                  <ArrowRightLeft className="size-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">انتقال هنرجو به باشگاه دیگر</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{movingPlayer.name}</p>
                </div>
              </div>
              <button
                onClick={() => setMovingPlayer(null)}
                className="rounded-full p-1 text-muted-foreground hover:bg-muted"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleMoveSubmit} className="space-y-4 text-xs">
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-3 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">تیم جاری:</span>
                  <span className="font-bold text-foreground">{teamName} (تغییر نمی‌کند)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">باشگاه فعلی:</span>
                  <span className="font-bold text-foreground">
                    {teamClubs.find((c) => c.id === movingPlayer.clubId)?.name}
                  </span>
                </div>
              </div>

              <div>
                <label className="font-bold text-foreground block mb-1.5">
                  انتخاب باشگاه مقصد در {teamName}:
                </label>
                <select
                  required
                  value={targetClubId}
                  onChange={(e) => setTargetClubId(e.target.value)}
                  className="w-full rounded-2xl border border-input bg-card p-3 font-semibold text-foreground outline-none focus:border-primary"
                >
                  {teamClubs
                    .filter((c) => c.id !== movingPlayer.clubId)
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.contactName})
                      </option>
                    ))}
                </select>
                <p className="text-[10px] text-muted-foreground mt-1.5">
                  توجه: با انتقال هنرجو، شناسه clubId به‌روزرسانی شده، سابقه انتقال در پرونده وی ثبت و در لاگ فعالیت‌های تیم فجر منعکس می‌گردد.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setMovingPlayer(null)}
                  className="rounded-xl border border-border px-4 py-2 font-semibold text-muted-foreground hover:bg-muted"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-primary px-5 py-2 font-bold text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20"
                >
                  تایید و انتقال هنرجو
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Player History */}
      {historyPlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="text-base font-bold text-foreground">تاریخچه و سوابق هنرجو</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{historyPlayer.name} · {historyPlayer.className}</p>
              </div>
              <button
                onClick={() => setHistoryPlayer(null)}
                className="rounded-full p-1 text-muted-foreground hover:bg-muted"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {historyPlayer.history?.map((h, i) => (
                <div key={h.id || i} className="flex items-start gap-3 rounded-2xl border border-border/80 bg-accent/30 p-3 text-xs">
                  <div className="rounded-full bg-primary/10 p-1.5 text-primary mt-0.5">
                    <History className="size-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-foreground">{h.action}</p>
                    {h.fromClub && h.toClub && (
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        از {h.fromClub} به {h.toClub}
                      </p>
                    )}
                    <span className="text-[10px] text-muted-foreground font-mono mt-1 block">
                      تاریخ: {h.date}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2 border-t border-border">
              <button
                onClick={() => setHistoryPlayer(null)}
                className="rounded-xl bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground"
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Add Player */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="text-lg font-bold text-foreground">ثبت‌نام هنرجوی جدید</h3>
                <p className="text-xs text-muted-foreground mt-0.5">تیم {teamName}</p>
              </div>
              <button
                onClick={() => setIsAddOpen(false)}
                className="rounded-full p-1 text-muted-foreground hover:bg-muted"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleAddPlayer} className="space-y-3.5 text-xs">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="font-bold text-foreground block mb-1">نام و نام خانوادگی *</label>
                  <input
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="مثلاً: علی احمدی"
                    className="w-full rounded-xl border border-input bg-muted/40 p-2.5 outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="font-bold text-foreground block mb-1">شماره تماس</label>
                  <input
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="۰۹۱۲..."
                    className="w-full rounded-xl border border-input bg-muted/40 p-2.5 outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <label className="font-bold text-foreground block mb-1">سن</label>
                  <input
                    type="number"
                    value={newAge}
                    onChange={(e) => setNewAge(e.target.value)}
                    className="w-full rounded-xl border border-input bg-muted/40 p-2.5 outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="font-bold text-foreground block mb-1">کمربند فعلی</label>
                  <select
                    value={newBelt}
                    onChange={(e) => setNewBelt(e.target.value)}
                    className="w-full rounded-xl border border-input bg-muted/40 p-2.5 outline-none focus:border-primary font-semibold"
                  >
                    <option value="سفید">سفید</option>
                    <option value="زرد">زرد</option>
                    <option value="سبز">سبز</option>
                    <option value="آبی">آبی</option>
                    <option value="قرمز">قرمز</option>
                    <option value="مشکی">مشکی</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-foreground block mb-1">کمربند هدف</label>
                  <input
                    value={newTargetBelt}
                    onChange={(e) => setNewTargetBelt(e.target.value)}
                    placeholder="مثلاً: زرد"
                    className="w-full rounded-xl border border-input bg-muted/40 p-2.5 outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="font-bold text-foreground block mb-1">باشگاه مستقر</label>
                  <select
                    value={newClubId}
                    onChange={(e) => setNewClubId(e.target.value)}
                    className="w-full rounded-xl border border-input bg-muted/40 p-2.5 outline-none focus:border-primary font-semibold"
                  >
                    {teamClubs.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-foreground block mb-1">کلاس تمرینی</label>
                  <input
                    value={newClass}
                    onChange={(e) => setNewClass(e.target.value)}
                    placeholder="مثلاً: نوجوانان الف"
                    className="w-full rounded-xl border border-input bg-muted/40 p-2.5 outline-none focus:border-primary"
                  />
                </div>
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
                  ثبت هنرجو
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
