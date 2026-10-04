'use client'

import { useState } from 'react'
import {
  DollarSign,
  Plus,
  Search,
  ArrowDownLeft,
  ArrowUpRight,
  Building2,
  Calendar,
  Tag,
  CheckCircle2,
  X,
  PieChart,
  TrendingUp,
} from 'lucide-react'
import { RazmyarShell } from '@/components/razmyar-shell'
import { RoleGuard } from '@/features/auth/guards'
import { useAuth } from '@/lib/auth-context'
import { useTeamAdminStore } from '@/features/team-admin/store'
import { TeamTransaction } from '@/features/team-admin/types'

export default function FinancePage() {
  const { teamId, teamName, selectedClubId } = useAuth()
  const { teamClubs, scopedFinances, addTransaction } = useTeamAdminStore(teamId || 'FAJR', selectedClubId)

  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('ALL')
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Form State
  const [title, setTitle] = useState('')
  const [type, setType] = useState<TeamTransaction['type']>('INCOME')
  const [category, setCategory] = useState<TeamTransaction['category']>('شهریه')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState('۱۴۰۵/۰۶/۲۸')
  const [targetClub, setTargetClub] = useState(selectedClubId || teamClubs[0]?.id || 'PARTO')

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  const handleCreateTransaction = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !amount) return

    addTransaction({
      title: title.trim(),
      type,
      category,
      amount: parseInt(amount.replace(/,/g, '')) || 0,
      date,
      clubId: targetClub,
      status: 'SETTLED',
    })

    setIsAddOpen(false)
    setTitle('')
    setAmount('')
    showToast('تراکنش مالی جدید با موفقیت ثبت شد.')
  }

  const totalIncome = scopedFinances
    .filter((f) => f.type === 'INCOME')
    .reduce((sum, f) => sum + f.amount, 0)
  const totalExpense = scopedFinances
    .filter((f) => f.type === 'EXPENSE')
    .reduce((sum, f) => sum + f.amount, 0)
  const netBalance = totalIncome - totalExpense

  const filteredFinances = scopedFinances.filter((f) => {
    const matchesSearch = f.title.toLowerCase().includes(search.toLowerCase().trim())
    const matchesType = filterType === 'ALL' || f.type === filterType
    return matchesSearch && matchesType
  })

  const selectedClub = teamClubs.find((c) => c.id === selectedClubId)

  return (
    <RoleGuard allowedRoles={['TEAM_ADMIN', 'SUPER_ADMIN']}>
      <RazmyarShell title="امور مالی باشگاه">
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
              <h2 className="text-xl font-bold text-foreground">مدیریت مالی و صندوق باشگاه</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                ثبت و رصد درآمد شهریه‌ها، هزینه‌های سالن و تراز مالی تفکیک‌شده
              </p>
            </div>

            <button
              onClick={() => {
                setTargetClub(selectedClubId || teamClubs[0]?.id || 'PARTO')
                setIsAddOpen(true)
              }}
              className="flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-2.5 text-xs sm:text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 transition"
            >
              <Plus className="size-4" />
              <span>ثبت تراکنش مالی</span>
            </button>
          </div>

          {/* KPI Summary Cards */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-muted-foreground">کل دریافتی / درآمد</span>
                <div className="rounded-xl bg-emerald-500/10 p-2 text-emerald-500">
                  <ArrowDownLeft className="size-4" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-black text-emerald-500">
                  {totalIncome.toLocaleString('fa-IR')}
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5">تومان (شهریه و متفرقه)</div>
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-muted-foreground">کل پرداختی / هزینه‌ها</span>
                <div className="rounded-xl bg-rose-500/10 p-2 text-rose-500">
                  <ArrowUpRight className="size-4" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-black text-rose-500">
                  {totalExpense.toLocaleString('fa-IR')}
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5">تومان (اجاره، مربی، تجهیزات)</div>
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-muted-foreground">تراز خالص صندوق</span>
                <div className="rounded-xl bg-primary/10 p-2 text-primary">
                  <TrendingUp className="size-4" />
                </div>
              </div>
              <div className="mt-3">
                <div className={`text-2xl font-black ${netBalance >= 0 ? 'text-primary' : 'text-rose-500'}`}>
                  {netBalance.toLocaleString('fa-IR')}
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5">تومان (موجودی عملیاتی)</div>
              </div>
            </div>
          </div>

          {/* Filters & Search */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute right-3.5 top-3 size-4 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="جستجوی عنوان تراکنش مالی..."
                className="w-full rounded-2xl border border-input bg-card pr-10 pl-4 py-2.5 text-xs sm:text-sm outline-none placeholder:text-muted-foreground focus:border-primary"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilterType('ALL')}
                className={`rounded-2xl px-3.5 py-2 text-xs font-bold transition ${
                  filterType === 'ALL'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'border border-border bg-card text-muted-foreground hover:bg-muted'
                }`}
              >
                همه
              </button>
              <button
                onClick={() => setFilterType('INCOME')}
                className={`rounded-2xl px-3.5 py-2 text-xs font-bold transition ${
                  filterType === 'INCOME'
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'border border-border bg-card text-muted-foreground hover:bg-muted'
                }`}
              >
                درآمدها
              </button>
              <button
                onClick={() => setFilterType('EXPENSE')}
                className={`rounded-2xl px-3.5 py-2 text-xs font-bold transition ${
                  filterType === 'EXPENSE'
                    ? 'bg-rose-500 text-white shadow-sm'
                    : 'border border-border bg-card text-muted-foreground hover:bg-muted'
                }`}
              >
                هزینه‌ها
              </button>
            </div>
          </div>

          {/* Ledger Table */}
          <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="border-b border-border bg-muted/40 text-[11px] font-bold text-muted-foreground">
                  <tr>
                    <th className="p-3.5">شرح تراکنش</th>
                    <th className="p-3.5">نوع</th>
                    <th className="p-3.5">باشگاه</th>
                    <th className="p-3.5">دسته‌بندی</th>
                    <th className="p-3.5">تاریخ</th>
                    <th className="p-3.5">مبلغ</th>
                    <th className="p-3.5 text-left">وضعیت</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredFinances.map((tx) => {
                    const isIncome = tx.type === 'INCOME'
                    const club = teamClubs.find((c) => c.id === tx.clubId)
                    return (
                      <tr key={tx.id} className="transition hover:bg-muted/30">
                        <td className="p-3.5 font-bold text-foreground">{tx.title}</td>
                        <td className="p-3.5">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                              isIncome
                                ? 'bg-emerald-500/10 text-emerald-500'
                                : 'bg-rose-500/10 text-rose-500'
                            }`}
                          >
                            {isIncome ? <ArrowDownLeft className="size-3" /> : <ArrowUpRight className="size-3" />}
                            {isIncome ? 'درآمد' : 'هزینه'}
                          </span>
                        </td>
                        <td className="p-3.5 text-muted-foreground font-semibold">
                          {club?.name || tx.clubId}
                        </td>
                        <td className="p-3.5">
                          <span className="rounded-lg bg-accent px-2 py-0.5 font-semibold text-foreground">
                            {tx.category}
                          </span>
                        </td>
                        <td className="p-3.5 font-mono text-[11px] text-muted-foreground">{tx.date}</td>
                        <td className="p-3.5 font-bold text-sm font-mono">
                          <span className={isIncome ? 'text-emerald-500' : 'text-rose-500'}>
                            {isIncome ? '+' : '-'}
                            {tx.amount.toLocaleString('fa-IR')}
                          </span>
                          <span className="text-[10px] text-muted-foreground mr-1">تومان</span>
                        </td>
                        <td className="p-3.5 text-left">
                          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-500">
                            <CheckCircle2 className="size-3" />
                            تسویه شده
                          </span>
                        </td>
                      </tr>
                    )
                  })}

                  {filteredFinances.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-sm text-muted-foreground">
                        تراکنش مالی ثبت نشده است
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* MODAL: Add Transaction */}
        {isAddOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="text-base font-bold text-foreground">ثبت تراکنش مالی جدید</h3>
                <button
                  onClick={() => setIsAddOpen(false)}
                  className="rounded-full p-1 text-muted-foreground hover:bg-muted"
                >
                  <X className="size-5" />
                </button>
              </div>

              <form onSubmit={handleCreateTransaction} className="space-y-3.5 text-xs">
                <div>
                  <label className="font-bold text-foreground block mb-1">عنوان تراکنش *</label>
                  <input
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="مثلاً: شهریه ماهانه گروه نوجوانان"
                    className="w-full rounded-xl border border-input bg-muted/40 p-2.5 outline-none focus:border-primary"
                  />
                </div>

                <div className="grid gap-3 grid-cols-2">
                  <div>
                    <label className="font-bold text-foreground block mb-1">نوع تراکنش</label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value as any)}
                      className="w-full rounded-xl border border-input bg-muted/40 p-2.5 outline-none font-bold text-foreground"
                    >
                      <option value="INCOME">درآمد (+)</option>
                      <option value="EXPENSE">هزینه (-)</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-foreground block mb-1">دسته‌بندی</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full rounded-xl border border-input bg-muted/40 p-2.5 outline-none font-semibold text-foreground"
                    >
                      <option value="شهریه">شهریه</option>
                      <option value="تجهیزات">تجهیزات</option>
                      <option value="حق‌الزحمه مربی">حق‌الزحمه مربی</option>
                      <option value="اجاره سالن">اجاره سالن</option>
                      <option value="بیمه">بیمه</option>
                      <option value="سایر">سایر</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-foreground block mb-1">مبلغ (تومان) *</label>
                  <input
                    required
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="مثلاً: 2500000"
                    className="w-full rounded-xl border border-input bg-muted/40 p-2.5 font-mono text-sm outline-none focus:border-primary"
                  />
                </div>

                <div className="grid gap-3 grid-cols-2">
                  <div>
                    <label className="font-bold text-foreground block mb-1">باشگاه سالن</label>
                    <select
                      value={targetClub}
                      onChange={(e) => setTargetClub(e.target.value)}
                      className="w-full rounded-xl border border-input bg-muted/40 p-2.5 outline-none font-semibold text-foreground"
                    >
                      {teamClubs.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-foreground block mb-1">تاریخ</label>
                    <input
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
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
                    ثبت تراکنش
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </RazmyarShell>
    </RoleGuard>
  )
}
