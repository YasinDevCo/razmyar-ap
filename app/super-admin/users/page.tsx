'use client'

import { useState } from 'react'
import { RazmyarShell } from '@/components/razmyar-shell'
import { RoleGuard } from '@/features/auth/guards'
import { Users, Search, MoreVertical } from 'lucide-react'
import { MOCK_USERS } from '@/features/super-admin/mock-data'

export default function UsersManagementPage() {
  const [search, setSearch] = useState('')

  return (
    <RoleGuard allowedRoles={['SUPER_ADMIN']}>
      <RazmyarShell title="مدیریت کاربران پلتفرم">
        <div className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500">
                <Users className="size-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">مدیریت کاربران و دسترسی‌ها</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  نظارت بر تمامی کاربران ثبت‌نام شده در سیستم
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-input bg-card px-3 py-2">
            <Search className="size-4 text-muted-foreground" />
            <input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="جستجوی کاربر (نام، ایمیل)..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-sm">
                <thead className="bg-muted/50 text-xs font-semibold text-muted-foreground">
                  <tr>
                    <th className="p-4">کاربر</th>
                    <th className="p-4">نقش</th>
                    <th className="p-4">تیم</th>
                    <th className="p-4">باشگاه</th>
                    <th className="p-4">وضعیت</th>
                    <th className="p-4 w-12"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {MOCK_USERS.filter(u => u.name.includes(search) || u.email.includes(search)).map((user) => (
                    <tr key={user.id} className="hover:bg-muted/30 transition">
                      <td className="p-4">
                        <div className="font-bold text-foreground">{user.name}</div>
                        <div className="text-[10px] text-muted-foreground mt-0.5">{user.email}</div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-bold ${
                          user.role === 'SUPER_ADMIN' ? 'bg-purple-500/10 text-purple-500' :
                          user.role === 'TEAM_ADMIN' ? 'bg-blue-500/10 text-blue-500' : 'bg-muted text-muted-foreground'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="p-4 text-muted-foreground">{user.teamName}</td>
                      <td className="p-4 text-muted-foreground">{user.clubName}</td>
                      <td className="p-4">
                        <span className={`text-xs font-bold ${
                          user.status === 'ACTIVE' ? 'text-emerald-500' : 'text-destructive'
                        }`}>
                          {user.status === 'ACTIVE' ? 'فعال' : 'غیرفعال'}
                        </span>
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
