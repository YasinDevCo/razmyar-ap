'use client'

import { useState } from 'react'
import {
  BookOpen,
  Building2,
  Users,
  CheckSquare,
  DollarSign,
  CreditCard,
  TrendingUp,
  Award,
  Calendar,
} from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { useTeamAdminStore } from '../store'

export function TeamReportsView() {
  const { teamId, teamName, selectedClubId, setSelectedClubId } = useAuth()
  const { teamClubs, scopedPlayers, scopedTasks, scopedFinances } = useTeamAdminStore(
    teamId || 'FAJR',
    selectedClubId
  )

  const selectedClub = teamClubs.find((c) => c.id === selectedClubId)

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
              {teamName}
            </span>
            <span className="text-xs text-muted-foreground">
              · {selectedClub ? selectedClub.name : 'مقایسه همه باشگاه‌ها'}
            </span>
          </div>
          <h2 className="text-xl font-bold text-foreground">گزارش‌های عملکرد و مقایسه باشگاه‌ها</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            تحلیل آماری هنرجویان، نرخ حضور و غیاب، پیشرفت وظایف، تراکنش‌های مالی و اشتراک‌ها
          </p>
        </div>

        {/* Scope Selector */}
        <div className="flex items-center gap-1.5 rounded-2xl border border-border bg-card p-1 text-xs">
          <button
            onClick={() => setSelectedClubId(null)}
            className={`rounded-xl px-3 py-1.5 font-bold transition ${
              selectedClubId === null
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            همه باشگاه‌ها
          </button>
          {teamClubs.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedClubId(c.id)}
              className={`rounded-xl px-3 py-1.5 font-bold transition ${
                selectedClubId === c.id
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Comparison Table */}
      <div className="rounded-3xl border border-border bg-card p-5 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          <Building2 className="size-5 text-primary" />
          جدول مقایسه چندجانبه باشگاه‌های {teamName}
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="border-b border-border bg-muted/40 text-[11px] font-bold text-muted-foreground">
              <tr>
                <th className="p-3.5">باشگاه</th>
                <th className="p-3.5">تعداد هنرجو</th>
                <th className="p-3.5">آماده آزمون</th>
                <th className="p-3.5">وضعیت وظایف</th>
                <th className="p-3.5">تراز مالی ثبت‌شده</th>
                <th className="p-3.5">پلن و اعتبار</th>
                <th className="p-3.5">امتیاز ارزیابی</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {teamClubs.map((club) => {
                const isSelected = selectedClubId === club.id
                return (
                  <tr
                    key={club.id}
                    className={`transition hover:bg-muted/30 ${
                      isSelected ? 'bg-primary/5 font-semibold' : ''
                    }`}
                  >
                    <td className="p-3.5 font-bold text-foreground">
                      <div className="flex items-center gap-2">
                        <span className="size-2 rounded-full bg-primary" />
                        <span>{club.name}</span>
                        {isSelected && (
                          <span className="rounded-md bg-primary/20 px-1.5 py-0.5 text-[9px] font-bold text-primary">
                            انتخاب‌شده
                          </span>
                        )}
                      </div>
                      <span className="block text-[10px] text-muted-foreground font-mono mr-4">
                        مسئول: {club.contactName}
                      </span>
                    </td>

                    <td className="p-3.5 font-bold text-foreground">
                      {club.playersCount} نفر
                    </td>

                    <td className="p-3.5">
                      <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-500">
                        {club.id === 'PARTO' ? '۲ نفر' : club.id === 'SARVESTAN' ? '۱ نفر' : '۰ نفر'}
                      </span>
                    </td>

                    <td className="p-3.5 text-muted-foreground">
                      {club.id === 'PARTO' ? '۲ از ۳ انجام شده' : '۱ معلق'}
                    </td>

                    <td className="p-3.5 font-mono font-bold text-emerald-500">
                      {club.id === 'PARTO'
                        ? '+ ۱۰,۵۰۰,۰۰۰'
                        : club.id === 'SARVESTAN'
                        ? '- ۸۰۰,۰۰۰'
                        : '+ ۵,۰۰۰,۰۰۰'}{' '}
                      تومان
                    </td>

                    <td className="p-3.5">
                      <div className="font-bold text-primary">{club.subPlan}</div>
                      <span className="text-[10px] text-muted-foreground">{club.subStatus}</span>
                    </td>

                    <td className="p-3.5">
                      <div className="flex items-center gap-1 font-bold text-foreground">
                        <Award className="size-3.5 text-amber-500" />
                        <span>{club.id === 'PARTO' ? '۹۴٪' : club.id === 'SARVESTAN' ? '۸۶٪' : '۸۲٪'}</span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
