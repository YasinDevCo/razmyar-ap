export type SubscriptionStatus =
  | 'TRIAL'
  | 'ACTIVE'
  | 'EXPIRING'
  | 'EXPIRED'
  | 'SUSPENDED'
  | 'CANCELLED'

export interface Subscription {
  id: string
  teamId: string
  planId: string
  status: SubscriptionStatus
  startDate: string
  endDate: string
  autoRenew: boolean
  createdAt: string
  updatedAt: string
}

export interface PlanLimits {
  maxClubs: number
  maxUsers: number
  maxPlayers: number
  storage: string
}

export interface Plan {
  id: string
  name: string
  description: string
  price: string
  billingCycle: 'MONTHLY' | 'YEARLY'
  features: {
    workout: boolean
    finance: boolean
    reports: boolean
    reminders: boolean
    journal: boolean
    customDomain?: boolean
    prioritySupport?: boolean
  }
  limits: PlanLimits
  status: 'ACTIVE' | 'INACTIVE'
}

export interface ClubSubscriptionCoverage {
  covered: boolean
  clubId: string
  clubName: string
  teamId: string
  teamName: string
  subscription?: Subscription
  plan?: Plan
  status: SubscriptionStatus | 'NO_SUB'
  expirationDate: string
}
