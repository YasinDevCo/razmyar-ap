'use client'

import { create } from 'zustand'
import {
  PlatformIdea,
  IdeaFilterState,
  IdeaStatus,
  IdeaPriority,
  IdeaCategory,
  IdeaSortOption,
} from '../types'
import { platformOptimizationService } from '../services/platform-optimization.service'

interface PlatformOptimizationStore {
  ideas: PlatformIdea[]
  isLoading: boolean
  filters: IdeaFilterState

  // Modal states
  isCreateOpen: boolean
  isEditOpen: boolean
  selectedIdea: PlatformIdea | null

  // Actions
  fetchIdeas: () => Promise<void>
  createIdea: (
    data: Omit<PlatformIdea, 'id' | 'createdAt' | 'updatedAt'>
  ) => Promise<PlatformIdea>
  updateIdea: (id: string, data: Partial<PlatformIdea>) => Promise<void>
  deleteIdea: (id: string) => Promise<void>
  changeStatus: (id: string, status: IdeaStatus) => Promise<void>
  changePriority: (id: string, priority: IdeaPriority) => Promise<void>

  // Filter actions
  setSearch: (search: string) => void
  setStatusFilter: (status: IdeaStatus | 'ALL') => void
  setCategoryFilter: (category: IdeaCategory | 'ALL') => void
  setPriorityFilter: (priority: IdeaPriority | 'ALL') => void
  setSortBy: (sortBy: IdeaSortOption) => void
  resetFilters: () => void

  // Modal controls
  openCreate: () => void
  closeCreate: () => void
  openEdit: (idea: PlatformIdea) => void
  closeEdit: () => void
  openDetail: (idea: PlatformIdea) => void
  closeDetail: () => void

  // Computed helpers
  getFilteredIdeas: () => PlatformIdea[]
  getMetrics: () => {
    total: number
    inReview: number
    planned: number
    inProgress: number
    done: number
    ideasCount: number
  }
}

const DEFAULT_FILTERS: IdeaFilterState = {
  search: '',
  status: 'ALL',
  category: 'ALL',
  priority: 'ALL',
  sortBy: 'NEWEST',
}

const PRIORITY_ORDER: Record<IdeaPriority, number> = {
  CRITICAL: 4,
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1,
}

export const usePlatformOptimization = create<PlatformOptimizationStore>((set, get) => ({
  ideas: [],
  isLoading: true,
  filters: DEFAULT_FILTERS,

  isCreateOpen: false,
  isEditOpen: false,
  selectedIdea: null,

  fetchIdeas: async () => {
    set({ isLoading: true })
    try {
      const ideas = await platformOptimizationService.getIdeas()
      set({ ideas, isLoading: false })
    } catch {
      set({ isLoading: false })
    }
  },

  createIdea: async (data) => {
    const newIdea = await platformOptimizationService.createIdea(data)
    set((state) => ({
      ideas: [newIdea, ...state.ideas],
      isCreateOpen: false,
    }))
    return newIdea
  },

  updateIdea: async (id, data) => {
    const updated = await platformOptimizationService.updateIdea(id, data)
    set((state) => ({
      ideas: state.ideas.map((i) => (i.id === id ? updated : i)),
      selectedIdea: state.selectedIdea?.id === id ? updated : state.selectedIdea,
      isEditOpen: false,
    }))
  },

  deleteIdea: async (id) => {
    await platformOptimizationService.deleteIdea(id)
    set((state) => ({
      ideas: state.ideas.filter((i) => i.id !== id),
      selectedIdea: state.selectedIdea?.id === id ? null : state.selectedIdea,
    }))
  },

  changeStatus: async (id, status) => {
    await get().updateIdea(id, { status })
  },

  changePriority: async (id, priority) => {
    await get().updateIdea(id, { priority })
  },

  setSearch: (search) => set((s) => ({ filters: { ...s.filters, search } })),
  setStatusFilter: (status) => set((s) => ({ filters: { ...s.filters, status } })),
  setCategoryFilter: (category) => set((s) => ({ filters: { ...s.filters, category } })),
  setPriorityFilter: (priority) => set((s) => ({ filters: { ...s.filters, priority } })),
  setSortBy: (sortBy) => set((s) => ({ filters: { ...s.filters, sortBy } })),
  resetFilters: () => set({ filters: DEFAULT_FILTERS }),

  openCreate: () => set({ isCreateOpen: true }),
  closeCreate: () => set({ isCreateOpen: false }),
  openEdit: (idea) => set({ isEditOpen: true, selectedIdea: idea }),
  closeEdit: () => set({ isEditOpen: false }),
  openDetail: (idea) => set({ selectedIdea: idea }),
  closeDetail: () => set({ selectedIdea: null }),

  getFilteredIdeas: () => {
    const { ideas, filters } = get()
    let result = ideas.filter((item) => {
      const matchSearch =
        item.title.toLowerCase().includes(filters.search.toLowerCase().trim()) ||
        (item.description &&
          item.description.toLowerCase().includes(filters.search.toLowerCase().trim())) ||
        (item.notes && item.notes.toLowerCase().includes(filters.search.toLowerCase().trim()))

      const matchStatus = filters.status === 'ALL' || item.status === filters.status
      const matchCategory = filters.category === 'ALL' || item.category === filters.category
      const matchPriority = filters.priority === 'ALL' || item.priority === filters.priority

      return matchSearch && matchStatus && matchCategory && matchPriority
    })

    // Sorting
    if (filters.sortBy === 'NEWEST') {
      result = [...result]
    } else if (filters.sortBy === 'OLDEST') {
      result = [...result].reverse()
    } else if (filters.sortBy === 'PRIORITY') {
      result = [...result].sort((a, b) => PRIORITY_ORDER[b.priority] - PRIORITY_ORDER[a.priority])
    }

    return result
  },

  getMetrics: () => {
    const { ideas } = get()
    return {
      total: ideas.length,
      inReview: ideas.filter((i) => i.status === 'REVIEWING').length,
      planned: ideas.filter((i) => i.status === 'PLANNED').length,
      inProgress: ideas.filter((i) => i.status === 'IN_PROGRESS').length,
      done: ideas.filter((i) => i.status === 'DONE').length,
      ideasCount: ideas.filter((i) => i.status === 'IDEA').length,
    }
  },
}))
