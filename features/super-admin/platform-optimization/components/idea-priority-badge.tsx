'use client'

import { IdeaPriority } from '../types'
import { AlertCircle, ArrowUp, Minus, AlertTriangle } from 'lucide-react'

export function IdeaPriorityBadge({ priority }: { priority: IdeaPriority }) {
  switch (priority) {
    case 'CRITICAL':
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-rose-500/10 px-2 py-0.5 text-[10px] font-bold text-rose-500">
          <AlertTriangle className="size-3" />
          <span>بحرانی (Critical)</span>
        </span>
      )
    case 'HIGH':
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-500">
          <ArrowUp className="size-3" />
          <span>بالا (High)</span>
        </span>
      )
    case 'MEDIUM':
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
          <Minus className="size-3" />
          <span>عادی (Medium)</span>
        </span>
      )
    case 'LOW':
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
          <Minus className="size-3" />
          <span>پایین (Low)</span>
        </span>
      )
  }
}
