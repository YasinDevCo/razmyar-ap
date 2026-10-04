'use client'

import { useState } from 'react'
import { RazmyarShell } from '@/components/razmyar-shell'
import { RoleGuard } from '@/features/auth/guards'
import { ShieldAlert, Plus, Search, MoreVertical, Building2, CheckCircle2, XCircle } from 'lucide-react'
import { MOCK_TEAMS } from '@/features/super-admin/mock-data'

export default function TeamsManagementPage() {
  const [search, setSearch] = useState('')

  return (
    <RoleGuard allowedRoles={['SUPER_ADMIN']}>
      <RazmyarShell title="مدیریت تیم‌ها">
        <div className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <ShieldAlert className="size-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">مدیریت تیم‌های پلتفرم</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  مشاهده و مدیریت تیم‌ها، پلن‌ها و وضعیت اشتراک
                </p>
              </div>
            </div>
            
            <button className="flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground hover:opacity-90 transition">
              <Plus className="size-4" />
              ایجاد تیم جدید
            </button>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-input bg-card px-3 py-2">
            <Search className="size-4 text-muted-foreground" />
            <input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="جستجوی تیم بر اساس نام یا کد..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-sm">
                <thead className="bg-muted/50 text-xs font-semibold text-muted-foreground">
                  <tr>
                    <th className="p-4">نام تیم</th>
                    <th className="p-4">کد (Tenant)</th>
                    <th className="p-4">باشگاه‌ها</th>
                    <th className="p-4">کاربران</th>
                    <th className="p-4">پلن / اشتراک</th>
                    <th className="p-4">تاریخ انقضا</th>
                    <th className="p-4">وضعیت</th>
                    <th className="p-4 w-12"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {MOCK_TEAMS.filter(t => t.name.includes(search) || t.code.includes(search)).map((team) => (
                    <tr key={team.id} className="hover:bg-muted/30 transition">
                      <td className="p-4 font-bold text-foreground">
                        {team.name}
                        <span className="block text-[10px] text-muted-foreground font-normal mt-0.5">مدیر: {team.contactName}</span>
                      </td>
                      <td className="p-4 font-mono text-xs">{team.code}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5">
                          <Building2 className="size-3.5 text-muted-foreground" />
                          <span>{team.clubsCount}</span>
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground">{team.usersCount}</td>
                      <td className="p-4">
                        <span className="inline-block rounded-md bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary mb-1">
                          {team.plan}
                        </span>
                        <span className={`block text-[10px] font-bold ${
                          team.subStatus === 'ACTIVE' ? 'text-emerald-500' : 
                          team.subStatus === 'EXPIRING' ? 'text-amber-500' : 'text-destructive'
                        }`}>
                          {team.subStatus === 'ACTIVE' ? 'فعال' : team.subStatus === 'EXPIRING' ? 'در حال انقضا' : 'معلق'}
                        </span>
                      </td>
                      <td className="p-4 font-mono text-xs text-muted-foreground">{team.subExp}</td>
                      <td className="p-4">
                        {team.status === 'ACTIVE' ? (
                          <div className="flex items-center gap-1.5 text-emerald-500">
                            <CheckCircle2 className="size-4" />
                            <span className="text-xs font-bold">فعال</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-destructive">
                            <XCircle className="size-4" />
                            <span className="text-xs font-bold">معلق</span>
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        <button className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition">
                          <MoreVertical className="size-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </RazmyarShell>
    </RoleGuard>
  )
}
