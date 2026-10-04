'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Search, Check, Building2, X } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { useTeamAdminStore } from '@/features/team-admin/store'

export function ClubSelector() {
  const { teamId, teamName, selectedClubId, setSelectedClubId, role, availableClubs = [] } = useAuth()
  const { teamClubs } = useTeamAdminStore(teamId || 'FAJR', selectedClubId)
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Filter clubs based on search input (strictly within current team)
  const filteredClubs = teamClubs.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase().trim())
  )

  const handleSelect = (clubId: string | null) => {
    setSelectedClubId(clubId)
    setIsOpen(false)
    setSearch('')
  }

  // Find currently selected club from current team clubs
  const selectedClub = teamClubs.find((c) => c.id === selectedClubId) || null
  const displayLabel = selectedClub ? selectedClub.name : 'همه باشگاه‌ها'

  return (
    <div className="relative inline-block text-right" ref={dropdownRef}>
      {/* Trigger Button in Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-xl border border-border/80 bg-accent/60 px-3 py-1.5 text-xs font-medium text-foreground transition-all hover:border-primary/50 hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary/20"
        title="انتخاب و تغییر باشگاه فعال"
      >
        <Building2 className="size-3.5 text-primary" />
        <span className="text-muted-foreground hidden sm:inline">باشگاه:</span>
        <span className="font-semibold text-foreground">{displayLabel}</span>
        <ChevronDown className={`size-3 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Desktop Dropdown (Hidden on mobile) */}
      {isOpen && (
        <div className="absolute left-0 mt-2 hidden sm:block w-72 origin-top-right rounded-2xl border border-border/80 bg-card/95 p-2 shadow-2xl backdrop-blur-xl z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="mb-2 px-2 pt-1 flex items-center justify-between">
            <span className="text-[11px] font-bold text-muted-foreground">{teamName}</span>
            <span className="text-[10px] rounded-md bg-primary/10 px-1.5 py-0.5 font-medium text-primary">
              {availableClubs.length} باشگاه مجاز
            </span>
          </div>

          {/* Search Input */}
          <div className="relative mb-2 px-1">
            <Search className="absolute right-3.5 top-2.5 size-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="جستجوی باشگاه..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-border bg-muted/60 pr-8 pl-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:bg-background focus:outline-none"
            />
          </div>

          <div className="max-h-60 overflow-y-auto divide-y divide-border/30">
            {/* All Clubs Option */}
            <button
              onClick={() => handleSelect(null)}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs transition-colors ${
                selectedClubId === null
                  ? 'bg-primary/15 font-bold text-primary'
                  : 'text-foreground hover:bg-muted'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-primary" />
                <span>همه باشگاه‌ها</span>
              </div>
              {selectedClubId === null && <Check className="size-3.5 text-primary" />}
            </button>

            {/* Individual Club Items */}
            {filteredClubs.map((club) => {
              const isSelected = selectedClubId === club.id
              return (
                <button
                  key={club.id}
                  onClick={() => handleSelect(club.id)}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs transition-colors ${
                    isSelected
                      ? 'bg-primary/15 font-bold text-primary'
                      : 'text-foreground hover:bg-muted'
                  }`}
                >
                  <div className="flex flex-col text-right">
                    <span>{club.name}</span>
                    {club.coachName && (
                      <span className="text-[10px] text-muted-foreground">
                        {club.coachName}
                      </span>
                    )}
                  </div>
                  {isSelected && <Check className="size-3.5 text-primary" />}
                </button>
              )
            })}

            {filteredClubs.length === 0 && (
              <div className="py-4 text-center text-xs text-muted-foreground">
                باشگاهی با این نام یافت نشد
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Bottom Sheet Modal (Visible on small screens) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 sm:hidden">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Bottom Sheet Sheet Drawer */}
          <div className="fixed inset-x-0 bottom-0 z-50 rounded-t-3xl border-t border-border/80 bg-card p-4 shadow-2xl animate-in slide-in-from-bottom duration-250">
            {/* Grab handle */}
            <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-muted-foreground/30" />

            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <h3 className="text-base font-bold text-foreground">انتخاب باشگاه</h3>
                <p className="text-xs text-muted-foreground">
                  {teamName} · تغییر باشگاه بدون نیاز به خروج
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Search Input */}
            <div className="relative my-3">
              <Search className="absolute right-3.5 top-3 size-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="جستجوی باشگاه..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-2xl border border-border bg-muted/70 pr-9 pl-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
            </div>

            {/* Club List */}
            <div className="max-h-72 overflow-y-auto space-y-1.5 pb-4">
              {/* Option: All Clubs */}
              <button
                onClick={() => handleSelect(null)}
                className={`flex w-full items-center justify-between rounded-2xl p-3 text-sm transition-colors ${
                  selectedClubId === null
                    ? 'bg-primary/15 font-bold text-primary border border-primary/30'
                    : 'bg-muted/30 text-foreground hover:bg-muted'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="size-2.5 rounded-full bg-primary" />
                  <span>همه باشگاه‌ها</span>
                </div>
                {selectedClubId === null && <Check className="size-4 text-primary" />}
              </button>

              {/* Clubs of Current Team */}
              {filteredClubs.map((club) => {
                const isSelected = selectedClubId === club.id
                return (
                  <button
                    key={club.id}
                    onClick={() => handleSelect(club.id)}
                    className={`flex w-full items-center justify-between rounded-2xl p-3 text-sm transition-colors ${
                      isSelected
                        ? 'bg-primary/15 font-bold text-primary border border-primary/30'
                        : 'bg-muted/30 text-foreground hover:bg-muted'
                    }`}
                  >
                    <div className="flex flex-col text-right">
                      <span className="font-semibold">{club.name}</span>
                      {club.coachName && (
                        <span className="text-xs text-muted-foreground">
                          {club.coachName}
                        </span>
                      )}
                    </div>
                    {isSelected && <Check className="size-4 text-primary" />}
                  </button>
                )
              })}

              {filteredClubs.length === 0 && (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  باشگاهی یافت نشد
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
