'use client'

import { useState } from 'react'
import {
  Activity,
  Clock,
  Building2,
  Users,
  CheckSquare,
  DollarSign,
  CreditCard,
  Filter,
} from 'lucide-react'
import { RazmyarShell } from '@/components/razmyar-shell'
import { RoleGuard } from '@/features/auth/guards'
import { useAuth } from '@/lib/auth-context'
import { useTeamAdminStore } from '@/features/team-admin/store'
import { TeamActivity } from '@/features/team-admin/types'

export default function ActivityPage() {
  const { teamId, teamName, selectedClubId } = useAuth()
  const { scopedActivities } = useTeamAdminStore(teamId || 'FAJR', selectedClubId)

  const [filterType, setFilterType] = useState('ALL')

  const filtered = scopedActivities.filter((a) => {
    if (filterType === 'ALL') return true
    return a.type === filterType
  })

  const getIcon = (type: TeamActivity['type']) => {
    switch (type) {
      case 'CLUB':
        return <Building2 className="size-4 text-blue-500" />
      case 'PLAYER':
        return <Users className="size-4 text-emerald-500" />
      case 'TASK':
        return <CheckSquare className="size-4 text-purple-500" />
      case 'FINANCE':
        return <DollarSign className="size-4 text-amber-500" />
      case 'SUBSCRIPTION':
        return <CreditCard className="size-4 text-indigo-500" />
      default:
        return <Activity className="size-4 text-primary" />
    }
  }

  return (
    <RoleGuard allowedRoles={['TEAM_ADMIN', 'SUPER_ADMIN']}>
      <RazmyarShell title="فعالیت‌های تیم">
        <div className="space-y-6 pb-12">
          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                  {teamName}
                </span>
                <span className="text-xs text-muted-foreground">· گزارش رویدادها</span>
              </div>
              <h2 className="text-xl font-bold text-foreground">رویدادها و لاگ فعالیت‌های تیم</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                ثبت کلیه وقایع شامل ایجاد باشگاه، ثبت یا انتقال بازیکن، وظایف و درخواست‌ها
              </p>
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              {['ALL', 'CLUB', 'PLAYER', 'TASK', 'FINANCE', 'SUBSCRIPTION'].map((t) => {
                const labels: Record<string, string> = {
                  ALL: 'همه',
                  CLUB: 'باشگاه‌ها',
                  PLAYER: 'بازیکنان',
                  TASK: 'وظایف',
                  FINANCE: 'مالی',
                  SUBSCRIPTION: 'اشتراک‌ها',
                }
                return (
                  <button
                    key={t}
                    onClick={() => setFilterType(t)}
                    className={`rounded-xl px-3 py-1.5 font-bold transition ${
                      filterType === t
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'border border-border bg-card text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    {labels[t]}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Timeline List */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <div className="relative border-r-2 border-border/80 mr-4 pr-6 space-y-6">
              {filtered.map((act) => (
                <div key={act.id} className="relative group">
                  {/* Timeline bullet dot */}
                  <div className="absolute -right-[33px] top-1.5 flex size-5 items-center justify-center rounded-full border-2 border-card bg-primary text-primary-foreground shadow-sm">
                    <span className="size-1.5 rounded-full bg-white" />
                  </div>

                  <div className="rounded-2xl border border-border/80 bg-accent/20 p-4 transition hover:border-primary/40 hover:bg-accent/40">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="rounded-lg bg-background p-1.5 border border-border shadow-xs">
                          {getIcon(act.type)}
                        </div>
                        <h4 className="font-bold text-foreground text-sm">
                          <span className="text-primary">{act.who}:</span> {act.action}
                        </h4>
                      </div>
                      <span className="font-mono text-[11px] text-muted-foreground flex items-center gap-1">
                        <Clock className="size-3" />
                        {act.date}
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground pr-8">{act.target}</p>
                  </div>
                </div>
              ))}

              {filtered.length === 0 && (
                <div className="py-12 text-center text-sm text-muted-foreground">
                  رویدادی برای این فیلتر ثبت نشده است
                </div>
              )}
            </div>
          </div>
        </div>
      </RazmyarShell>
    </RoleGuard>
  )
}
