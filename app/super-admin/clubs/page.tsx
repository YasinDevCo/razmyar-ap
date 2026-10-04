'use client'

import { useState } from 'react'
import { RazmyarShell } from '@/components/razmyar-shell'
import { RoleGuard } from '@/features/auth/guards'
import { Building2, Search, MoreVertical, Users, ShieldAlert } from 'lucide-react'
import { MOCK_CLUBS } from '@/features/super-admin/mock-data'

export default function ClubsManagementPage() {
  const [search, setSearch] = useState('')

  return (
    <RoleGuard allowedRoles={['SUPER_ADMIN']}>
      <RazmyarShell title="مدیریت باشگاه‌ها">
        <div className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500">
                <Building2 className="size-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">مدیریت باشگاه‌های پلتفرم</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  مشاهده همه باشگاه‌ها، وابستگی به تیم‌ها و وضعیت آن‌ها
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-input bg-card px-3 py-2">
            <Search className="size-4 text-muted-foreground" />
            <input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="جستجوی باشگاه بر اساس نام یا کد..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-sm">
                <thead className="bg-muted/50 text-xs font-semibold text-muted-foreground">
                  <tr>
                    <th className="p-4">نام باشگاه</th>
                    <th className="p-4">تیم (Tenant)</th>
                    <th className="p-4">آمار</th>
                    <th className="p-4">وضعیت باشگاه</th>
                    <th className="p-4">وضعیت اشتراک</th>
                    <th className="p-4 w-12"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {MOCK_CLUBS.filter(c => c.name.includes(search) || c.code.includes(search)).map((club) => (
                    <tr key={club.id} className="hover:bg-muted/30 transition">
                      <td className="p-4 font-bold text-foreground">
                        {club.name}
                        <span className="block text-[10px] text-muted-foreground font-mono mt-0.5">{club.code}</span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5 font-bold text-primary">
                          <ShieldAlert className="size-3.5" />
                          <span>{club.teamName}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Users className="size-3.5" />
                            <span>{club.playersCount} هنرجو</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-block rounded-md px-2 py-0.5 text-xs font-bold ${
                          club.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-destructive/10 text-destructive'
                        }`}>
                          {club.status === 'ACTIVE' ? 'فعال' : 'غیرفعال'}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-xs font-bold text-foreground">{club.plan}</span>
                        <span className={`block text-[10px] font-bold ${
                          club.subStatus === 'ACTIVE' ? 'text-emerald-500' : 
                          club.subStatus === 'EXPIRING' ? 'text-amber-500' : 'text-destructive'
                        }`}>
                          {club.subStatus === 'ACTIVE' ? 'فعال' : club.subStatus === 'EXPIRING' ? 'در حال انقضا' : 'بدون اشتراک'}
                        </span>
                        {club.subStatus !== 'NO_SUB' && <span className="block text-[10px] text-muted-foreground mt-0.5">تا {club.expDate}</span>}
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
