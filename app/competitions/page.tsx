import { Suspense } from 'react'
import { CompetitionModule } from '@/components/competitions/competition-module'
import { RazmyarShell } from '@/components/razmyar-shell'

export default function Page() {
  return (
    <RazmyarShell title="مسابقات">
      <Suspense fallback={<div className="p-8 text-center text-sm text-muted-foreground">در حال بارگذاری اطلاعات مسابقات...</div>}>
        <CompetitionModule />
      </Suspense>
    </RazmyarShell>
  )
}
