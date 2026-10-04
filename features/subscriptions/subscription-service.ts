import { Subscription, Plan, ClubSubscriptionCoverage, SubscriptionStatus } from './types'
import { TeamClub } from '@/features/team-admin/types'

export const MOCK_PLANS: Plan[] = [
  {
    id: 'PLAN_BASIC',
    name: 'طرح پایه (Basic)',
    description: 'مناسب تیم‌های نوپا با ۱ تا ۲ سالن رزمی',
    price: '۵۰۰,۰۰۰ تومان / ماه',
    billingCycle: 'MONTHLY',
    features: {
      workout: true,
      finance: false,
      reports: false,
      reminders: false,
      journal: false,
    },
    limits: {
      maxClubs: 2,
      maxUsers: 5,
      maxPlayers: 80,
      storage: '2 GB',
    },
    status: 'ACTIVE',
  },
  {
    id: 'PLAN_PRO',
    name: 'طرح حرفه‌ای (Pro)',
    description: 'پوشش کامل تمامی باشگاه‌های تیم با دسترسی به امکانات جامع',
    price: '۲,۰۰۰,۰۰۰ تومان / ماه',
    billingCycle: 'MONTHLY',
    features: {
      workout: true,
      finance: true,
      reports: true,
      reminders: true,
      journal: true,
      prioritySupport: true,
    },
    limits: {
      maxClubs: 10,
      maxUsers: 25,
      maxPlayers: 500,
      storage: '20 GB',
    },
    status: 'ACTIVE',
  },
]

// Team-level Subscriptions (NO clubId - belongs strictly to Team)
export const INITIAL_TEAM_SUBSCRIPTIONS: Subscription[] = [
  {
    id: 'sub-fajr',
    teamId: 'FAJR',
    planId: 'PLAN_PRO',
    status: 'ACTIVE',
    startDate: '2026-01-01',
    endDate: '2027-01-01',
    autoRenew: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'sub-team-x',
    teamId: 'TEAM_X',
    planId: 'PLAN_BASIC',
    status: 'ACTIVE',
    startDate: '2026-05-01',
    endDate: '2027-05-01',
    autoRenew: true,
    createdAt: '2026-05-01T00:00:00Z',
    updatedAt: '2026-05-01T00:00:00Z',
  },
  {
    id: 'sub-champs',
    teamId: 'CHAMPS',
    planId: 'PLAN_PRO',
    status: 'SUSPENDED',
    startDate: '2025-01-01',
    endDate: '2026-01-01',
    autoRenew: false,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
]

const STORAGE_KEY_TEAM_SUBSCRIPTIONS = 'razmyar_team_subscriptions_v1'
const STORAGE_KEY_CLUBS = 'razmyar_team_clubs_v2'

function getStoredSubscriptions(): Subscription[] {
  if (typeof window === 'undefined') return INITIAL_TEAM_SUBSCRIPTIONS
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TEAM_SUBSCRIPTIONS)
    if (!raw) return INITIAL_TEAM_SUBSCRIPTIONS
    return JSON.parse(raw)
  } catch {
    return INITIAL_TEAM_SUBSCRIPTIONS
  }
}

function getStoredClubs(): TeamClub[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CLUBS)
    if (!raw) return []
    return JSON.parse(raw)
  } catch {
    return []
  }
}

/**
 * 1. Find subscription belonging to a Team
 */
export function getTeamSubscription(teamId: string): Subscription | undefined {
  const subs = getStoredSubscriptions()
  // Support both code ('FAJR') and legacy id ('t1')
  return subs.find((s) => s.teamId === teamId || (teamId === 't1' && s.teamId === 'FAJR'))
}

/**
 * 2. Get clubs covered under a Team subscription
 * If a new club is added to Team Fajr, it automatically appears here and is covered.
 */
export function getCoveredClubs(teamId: string): TeamClub[] {
  const allClubs = getStoredClubs()
  const normalizedTeamId = teamId === 't1' ? 'FAJR' : teamId
  return allClubs.filter((c) => c.teamId === normalizedTeamId || c.teamId === teamId)
}

/**
 * 3. Subscription Resolution:
 * The function MUST NOT search for a club subscription.
 * Instead:
 * 1. Find the club.
 * 2. Read club.teamId.
 * 3. Find the subscription belonging to that team.
 * 4. Return the inherited subscription status.
 */
export function getClubSubscriptionStatus(clubId: string): ClubSubscriptionCoverage {
  const allClubs = getStoredClubs()
  const club = allClubs.find((c) => c.id === clubId || c.code === clubId)

  if (!club) {
    return {
      covered: false,
      clubId,
      clubName: 'باشگاه نامشخص',
      teamId: '',
      teamName: 'تیم نامشخص',
      status: 'NO_SUB',
      expirationDate: '—',
    }
  }

  const teamSub = getTeamSubscription(club.teamId)
  const plan = teamSub ? MOCK_PLANS.find((p) => p.id === teamSub.planId) : undefined

  return {
    covered: !!teamSub && (teamSub.status === 'ACTIVE' || teamSub.status === 'TRIAL'),
    clubId: club.id,
    clubName: club.name,
    teamId: club.teamId,
    teamName: club.teamId === 'FAJR' ? 'تیم فجر' : club.teamId,
    subscription: teamSub,
    plan,
    status: teamSub ? teamSub.status : 'NO_SUB',
    expirationDate: teamSub ? teamSub.endDate : '—',
  }
}

/**
 * Super Admin helper: List all team subscriptions with covered club details
 */
export function getAllTeamSubscriptionsWithCoverage() {
  const subs = getStoredSubscriptions()
  const clubs = getStoredClubs()

  const TEAMS_MAP: Record<string, string> = {
    FAJR: 'تیم فجر',
    TEAM_X: 'تیم X',
    CHAMPS: 'تیم قهرمانان',
  }

  return subs.map((sub) => {
    const plan = MOCK_PLANS.find((p) => p.id === sub.planId) || MOCK_PLANS[0]
    const coveredClubs = clubs.filter((c) => c.teamId === sub.teamId)
    return {
      subscription: sub,
      teamId: sub.teamId,
      teamName: TEAMS_MAP[sub.teamId] || sub.teamId,
      plan,
      status: sub.status,
      startDate: sub.startDate,
      endDate: sub.endDate,
      autoRenew: sub.autoRenew,
      clubsCoveredCount: coveredClubs.length,
      coveredClubs,
    }
  })
}
