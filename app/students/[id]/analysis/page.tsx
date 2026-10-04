import { RazmyarShell } from '@/components/razmyar-shell'
import { StudentAnalysis } from '@/components/student-analysis'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function AnalysisPage({ params }: PageProps) {
  const { id } = await params
  return (
    <RazmyarShell title="تحلیل هوشمند">
      <StudentAnalysis studentId={id} />
    </RazmyarShell>
  )
}
