import { Suspense } from 'react'
import { RazmyarShell } from '@/components/razmyar-shell'
import { ProgressionModule } from '@/components/progression/progression-module'

export default function ProgressionPage() {
  return (
    <RazmyarShell title="پیشرفت کمربند">
      <Suspense fallback={<div className="p-8 text-center text-sm text-muted-foreground">در حال بارگذاری سیستم پیشرفت کمربند...</div>}>
        <ProgressionModule />
      </Suspense>
    </RazmyarShell>
  )
}
