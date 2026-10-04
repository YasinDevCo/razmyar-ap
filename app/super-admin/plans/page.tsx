'use client'

import { RazmyarShell } from '@/components/razmyar-shell'
import { RoleGuard } from '@/features/auth/guards'
import { CreditCard, Plus, MoreVertical, CheckCircle2 } from 'lucide-react'
import { MOCK_PLANS } from '@/features/super-admin/mock-data'

export default function PlansManagementPage() {
  return (
    <RoleGuard allowedRoles={['SUPER_ADMIN']}>
      <RazmyarShell title="مدیریت پلن‌ها">
        <div className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">
                <CreditCard className="size-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">مدیریت پلن‌های اشتراک</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  تعریف و ویرایش پلن‌ها، قیمت‌ها و محدودیت‌ها
                </p>
              </div>
            </div>
            
            <button className="flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground hover:opacity-90 transition">
              <Plus className="size-4" />
              ایجاد پلن جدید
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {MOCK_PLANS.map((plan) => (
              <div key={plan.id} className="rounded-xl border border-border bg-card p-5 shadow-sm flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{plan.description}</p>
                  </div>
                  <span className="rounded-md bg-emerald-500/10 px-2 py-1 text-[10px] font-bold text-emerald-500">
                    {plan.status === 'ACTIVE' ? 'فعال' : 'غیرفعال'}
                  </span>
                </div>
                
                <div className="mb-6">
                  <div className="text-2xl font-bold text-foreground">{plan.price}</div>
                  <div className="text-xs text-muted-foreground">{plan.cycle}</div>
                </div>

                <div className="space-y-3 flex-1">
                  <div className="flex justify-between text-xs pb-2 border-b border-border/50">
                    <span className="text-muted-foreground">حداکثر باشگاه</span>
                    <span className="font-bold">{plan.maxClubs}</span>
                  </div>
                  <div className="flex justify-between text-xs pb-2 border-b border-border/50">
                    <span className="text-muted-foreground">حداکثر کاربر ادمین</span>
                    <span className="font-bold">{plan.maxUsers}</span>
                  </div>
                  <div className="flex justify-between text-xs pb-2 border-b border-border/50">
                    <span className="text-muted-foreground">حداکثر هنرجو</span>
                    <span className="font-bold">{plan.maxPlayers}</span>
                  </div>
                  <div className="flex justify-between text-xs pb-2 border-b border-border/50">
                    <span className="text-muted-foreground">فضای ذخیره‌سازی</span>
                    <span className="font-bold">{plan.storage}</span>
                  </div>
                  
                  <div className="pt-2 space-y-2">
                    <p className="text-xs font-bold mb-2">ویژگی‌ها:</p>
                    {Object.entries(plan.features).map(([key, value]) => (
                      <div key={key} className="flex items-center gap-2 text-xs">
                        {value ? (
                          <CheckCircle2 className="size-3.5 text-emerald-500" />
                        ) : (
                          <div className="size-3.5 rounded-full border border-muted-foreground/30" />
                        )}
                        <span className={value ? 'text-foreground' : 'text-muted-foreground'}>{key}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border flex justify-end">
                  <button className="text-sm font-bold text-primary hover:underline">ویرایش پلن</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </RazmyarShell>
    </RoleGuard>
  )
}
