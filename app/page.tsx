import { CoachDashboard } from '@/components/razmyar-pages'
import { RazmyarShell } from '@/components/razmyar-shell'

export default function Page() {
  return (
    <RazmyarShell title="داشبورد">
      <CoachDashboard />
    </RazmyarShell>
  )
}
