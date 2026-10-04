import { RazmyarShell } from '@/components/razmyar-shell'
import { StudentAnalysis } from '@/components/student-analysis'

export default function AliRezaeiAnalysisPage() {
  return (
    <RazmyarShell title="تحلیل هوشمند">
      <StudentAnalysis studentId="1024" />
    </RazmyarShell>
  )
}
