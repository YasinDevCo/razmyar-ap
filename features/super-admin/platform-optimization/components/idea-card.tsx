'use client'

import { PlatformIdea, IdeaCategory } from '../types'
import { IdeaStatusBadge } from './idea-status-badge'
import { IdeaPriorityBadge } from './idea-priority-badge'
import {
  Calendar,
  User,
  Tag,
  Clock,
  Sparkles,
  Zap,
  Shield,
  Layout,
  Briefcase,
  Bug,
  HelpCircle,
} from 'lucide-react'

export function getCategoryMeta(category: IdeaCategory) {
  switch (category) {
    case 'FEATURE':
      return { label: 'قابلیت جدید', icon: Sparkles, color: 'text-blue-500 bg-blue-500/10' }
    case 'UX':
      return { label: 'تجربه کاربری', icon: Layout, color: 'text-purple-500 bg-purple-500/10' }
    case 'PERFORMANCE':
      return { label: 'کارایی و سرعت', icon: Zap, color: 'text-amber-500 bg-amber-500/10' }
    case 'SECURITY':
      return { label: 'امنیت', icon: Shield, color: 'text-emerald-500 bg-emerald-500/10' }
    case 'BUSINESS':
      return { label: 'کسب‌وکار و مالی', icon: Briefcase, color: 'text-cyan-500 bg-cyan-500/10' }
    case 'BUG':
      return { label: 'رفع باگ', icon: Bug, color: 'text-rose-500 bg-rose-500/10' }
    case 'OTHER':
    default:
      return { label: 'سایر موارد', icon: HelpCircle, color: 'text-muted-foreground bg-muted' }
  }
}

interface IdeaCardProps {
  idea: PlatformIdea
  onClick: () => void
}

export function IdeaCard({ idea, onClick }: IdeaCardProps) {
  const cat = getCategoryMeta(idea.category)
  const CatIcon = cat.icon

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer rounded-3xl border border-border bg-card p-5 shadow-xs transition-all hover:border-primary/50 hover:shadow-md space-y-3.5"
    >
      {/* Top row: Badges */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span
            className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-0.5 text-[11px] font-bold ${cat.color}`}
          >
            <CatIcon className="size-3" />
            <span>{cat.label}</span>
          </span>
          <IdeaPriorityBadge priority={idea.priority} />
        </div>

        <IdeaStatusBadge status={idea.status} />
      </div>

      {/* Title & Description */}
      <div>
        <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
          {idea.title}
        </h4>
        {idea.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
            {idea.description}
          </p>
        )}
      </div>

      {/* Meta Footer */}
      <div className="flex items-center justify-between border-t border-border/60 pt-3 text-[11px] text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <User className="size-3 text-muted-foreground" />
          <span>{idea.createdBy}</span>
        </div>

        <div className="flex items-center gap-1.5 font-mono">
          <Calendar className="size-3 text-muted-foreground" />
          <span>ثبت: {idea.createdAt}</span>
        </div>
      </div>
    </div>
  )
}
