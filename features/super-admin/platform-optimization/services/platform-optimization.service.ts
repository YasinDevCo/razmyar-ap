import { PlatformIdea } from '../types'
import { MOCK_PLATFORM_IDEAS } from '../mock/mock-ideas'

const STORAGE_KEY_PLATFORM_IDEAS = 'razmyar_platform_ideas_v1'

/**
 * Storage adapter abstraction (MMKV / LocalStorage)
 * Decoupled from UI components, ready for 1:1 drop-in replacement
 * with NestJS API + MongoDB (platform_ideas collection).
 */
class PlatformOptimizationStorage {
  private isBrowser(): boolean {
    return typeof window !== 'undefined'
  }

  getItems(): PlatformIdea[] {
    if (!this.isBrowser()) return MOCK_PLATFORM_IDEAS
    try {
      const raw = localStorage.getItem(STORAGE_KEY_PLATFORM_IDEAS)
      if (!raw) {
        // Initialize with realistic seed ideas
        localStorage.setItem(STORAGE_KEY_PLATFORM_IDEAS, JSON.stringify(MOCK_PLATFORM_IDEAS))
        return MOCK_PLATFORM_IDEAS
      }
      return JSON.parse(raw)
    } catch {
      return MOCK_PLATFORM_IDEAS
    }
  }

  setItems(items: PlatformIdea[]): void {
    if (!this.isBrowser()) return
    try {
      localStorage.setItem(STORAGE_KEY_PLATFORM_IDEAS, JSON.stringify(items))
      // Notify other tabs / listeners
      window.dispatchEvent(new Event('platform-ideas-updated'))
    } catch (e) {
      console.error('Failed to persist platform ideas', e)
    }
  }
}

const storage = new PlatformOptimizationStorage()

export const platformOptimizationService = {
  async getIdeas(): Promise<PlatformIdea[]> {
    return storage.getItems()
  },

  async getIdeaById(id: string): Promise<PlatformIdea | undefined> {
    const ideas = storage.getItems()
    return ideas.find((i) => i.id === id)
  },

  async createIdea(
    data: Omit<PlatformIdea, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<PlatformIdea> {
    const current = storage.getItems()
    const nowPersian = new Intl.DateTimeFormat('fa-IR').format(new Date())

    const newIdea: PlatformIdea = {
      ...data,
      id: 'idea-' + Date.now(),
      createdAt: nowPersian,
      updatedAt: nowPersian,
    }

    const updated = [newIdea, ...current]
    storage.setItems(updated)
    return newIdea
  },

  async updateIdea(id: string, data: Partial<PlatformIdea>): Promise<PlatformIdea> {
    const current = storage.getItems()
    const nowPersian = new Intl.DateTimeFormat('fa-IR').format(new Date())

    let updatedItem: PlatformIdea | undefined

    const next = current.map((item) => {
      if (item.id === id) {
        updatedItem = {
          ...item,
          ...data,
          updatedAt: nowPersian,
        }
        return updatedItem
      }
      return item
    })

    if (!updatedItem) {
      throw new Error(`Idea with id ${id} not found`)
    }

    storage.setItems(next)
    return updatedItem
  },

  async deleteIdea(id: string): Promise<void> {
    const current = storage.getItems()
    const next = current.filter((item) => item.id !== id)
    storage.setItems(next)
  },
}
