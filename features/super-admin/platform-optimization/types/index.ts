export type IdeaCategory =
  | 'FEATURE'
  | 'UX'
  | 'PERFORMANCE'
  | 'SECURITY'
  | 'BUSINESS'
  | 'BUG'
  | 'OTHER'

export type IdeaStatus =
  | 'IDEA'
  | 'REVIEWING'
  | 'PLANNED'
  | 'IN_PROGRESS'
  | 'DONE'
  | 'REJECTED'

export type IdeaPriority =
  | 'LOW'
  | 'MEDIUM'
  | 'HIGH'
  | 'CRITICAL'

export interface PlatformIdea {
  id: string
  title: string
  description?: string
  category: IdeaCategory
  status: IdeaStatus
  priority: IdeaPriority
  createdBy: string
  createdAt: string
  updatedAt: string
  notes?: string
}

export type IdeaSortOption = 'NEWEST' | 'OLDEST' | 'PRIORITY'

export interface IdeaFilterState {
  search: string
  status: IdeaStatus | 'ALL'
  category: IdeaCategory | 'ALL'
  priority: IdeaPriority | 'ALL'
  sortBy: IdeaSortOption
}
