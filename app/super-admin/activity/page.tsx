'use client'

import { RazmyarShell } from '@/components/razmyar-shell'
import { RoleGuard } from '@/features/auth/guards'
import { Server, Activity } from 'lucide-react'
import { MOCK_ACTIVITY } from '@/features/super-admin/mock-data'

export default function ActivityManagementPage() {
  return (
    <RoleGuard allowedRoles={['SUPER_ADMIN']}>
      <RazmyarShell title="گزارش فعالیت‌ها">
        <div className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-500">
                <Server className="size-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">گزارش فعالیت‌های سیستم (Activity Log)</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  مشاهده وقایع مهم و لاگ‌های سیستم
                </p>
              </div>
            </div>
          </div>
          
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-sm">
                <thead className="bg-muted/50 text-xs font-semibold text-muted-foreground">
                  <tr>
                    <th className="p-4">زمان</th>
                    <th className="p-4">کاربر / عامل</th>
                    <th className="p-4">عملیات</th>
                    <th className="p-4">تیم</th>
                    <th className="p-4">باشگاه</th>
                    <th className="p-4">وضعیت</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {MOCK_ACTIVITY.map((activity) => (
                    <tr key={activity.id} className="hover:bg-muted/30 transition">
                      <td className="p-4 font-mono text-xs text-muted-foreground">{activity.date}</td>
                      <td className="p-4 font-bold text-foreground">{activity.who}</td>
                      <td className="p-4 text-foreground">{activity.action}</td>
                      <td className="p-4 text-muted-foreground">{activity.team}</td>
                      <td className="p-4 text-muted-foreground">{activity.club}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-bold ${
                          activity.status === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                        }`}>
                          <Activity className="size-3" />
                          {activity.status}
                        </span>
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
