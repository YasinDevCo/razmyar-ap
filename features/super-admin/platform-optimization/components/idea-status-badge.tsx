'use client'

import { IdeaStatus } from '../types'
import {
  Lightbulb,
  Search,
  CalendarClock,
  PlayCircle,
  CheckCircle2,
  XCircle,
} from 'lucide-react'

export function IdeaStatusBadge({ status }: { status: IdeaStatus }) {
  switch (status) {
    case 'IDEA':
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2.5 py-0.5 text-[11px] font-bold text-blue-500 border border-blue-500/20">
          <Lightbulb className="size-3" />
          <span>ایده اولیه (Idea)</span>
        </span>
      )
    case 'REVIEWING':
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/10 px-2.5 py-0.5 text-[11px] font-bold text-purple-500 border border-purple-500/20">
          <Search className="size-3" />
          <span>در حال بررسی (Reviewing)</span>
        </span>
      )
    case 'PLANNED':
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-bold text-amber-500 border border-amber-500/20">
          <CalendarClock className="size-3" />
          <span>برنامه‌ریزی شده (Planned)</span>
        </span>
      )
    case 'IN_PROGRESS':
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-cyan-500/10 px-2.5 py-0.5 text-[11px] font-bold text-cyan-500 border border-cyan-500/20">
          <PlayCircle className="size-3" />
          <span>در حال اجرا (In Progress)</span>
        </span>
      )
    case 'DONE':
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-bold text-emerald-500 border border-emerald-500/20">
          <CheckCircle2 className="size-3" />
          <span>انجام شد (Done)</span>
        </span>
      )
    case 'REJECTED':
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-2.5 py-0.5 text-[11px] font-bold text-rose-500 border border-rose-500/20">
          <XCircle className="size-3" />
          <span>رد شده (Rejected)</span>
        </span>
      )
  }
}
