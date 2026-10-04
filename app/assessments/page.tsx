'use client'

import { useState, Suspense } from 'react'
import { AssessmentModule } from '@/components/assessments/assessment-module'
import { RazmyarShell } from '@/components/razmyar-shell'
import { TeamWorkoutView } from '@/features/team-admin/components/team-workout-view'
import { useAuth } from '@/lib/auth-context'
import { Dumbbell, Award } from 'lucide-react'

export default function Page() {
  const { role } = useAuth()
  const [activeTab, setActiveTab] = useState<'WORKOUT' | 'ASSESSMENT'>('WORKOUT')

  return (
    <RazmyarShell title="تمرینات و ارزیابی مهارت‌ها">
      {role === 'TEAM_ADMIN' && (
        <div className="mb-6 flex items-center gap-2 border-b border-border pb-3">
          <button
            onClick={() => setActiveTab('WORKOUT')}
            className={`flex items-center gap-2 rounded-2xl px-4 py-2 text-xs sm:text-sm font-bold transition ${
              activeTab === 'WORKOUT'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'border border-border bg-card text-muted-foreground hover:bg-muted'
            }`}
          >
            <Dumbbell className="size-4" />
            <span>برنامه‌های تمرینی باشگاه</span>
          </button>
          <button
            onClick={() => setActiveTab('ASSESSMENT')}
            className={`flex items-center gap-2 rounded-2xl px-4 py-2 text-xs sm:text-sm font-bold transition ${
              activeTab === 'ASSESSMENT'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'border border-border bg-card text-muted-foreground hover:bg-muted'
            }`}
          >
            <Award className="size-4" />
            <span>ارزیابی مهارت‌ها و کمربندها</span>
          </button>
        </div>
      )}

      {activeTab === 'WORKOUT' && role === 'TEAM_ADMIN' ? (
        <TeamWorkoutView />
      ) : (
        <Suspense fallback={<div className="p-8 text-center text-sm text-muted-foreground">در حال بارگذاری ارزیابی‌ها...</div>}>
          <AssessmentModule />
        </Suspense>
      )}
    </RazmyarShell>
  )
}
