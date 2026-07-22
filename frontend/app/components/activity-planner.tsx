'use client'

import { useEffect, useState } from 'react'

export type DayPeriod = {
  id: string
  label: string
  activity?: string
  icon?: string
  locked?: boolean
}

const activities = [
  { name: 'Workout', icon: '🏃' },
  { name: 'Read Book', icon: '📚' },
  { name: 'Rest', icon: '☕' },
  { name: 'Practice Skills', icon: '✨' },
  { name: 'Chore', icon: '🧹' },
  { name: 'Cat', icon: '🐱' },
  { name: 'Gaming', icon: '🎮' },
  { name: 'Cooking', icon: '🍳' },
]

type ActivityPlannerProps = {
  periods: DayPeriod[]
}

export default function ActivityPlanner({ periods }: ActivityPlannerProps) {
  const [plan, setPlan] = useState(periods)
  const [editingPeriodId, setEditingPeriodId] = useState<string | null>(null)
  const [notice, setNotice] = useState('')
  const [isGoodNightModalOpen, setIsGoodNightModalOpen] = useState(false)

  useEffect(() => {
    if (!isGoodNightModalOpen) return

    const closeTimer = window.setTimeout(() => {
      setIsGoodNightModalOpen(false)
    }, 3_000)

    return () => window.clearTimeout(closeTimer)
  }, [isGoodNightModalOpen])

  function selectActivity(activity: (typeof activities)[number]) {
    if (!editingPeriodId) return
    setPlan((currentPlan) => currentPlan.map((period) => (
      period.id === editingPeriodId
        ? { ...period, activity: activity.name, icon: activity.icon }
        : period
    )))
    setEditingPeriodId(null)
    setNotice('')
  }

  return (
    <section className="mt-8" aria-label="Daily Activity Plan">
      <div className="space-y-6">
        {plan.map((period) => {
          const isEditing = editingPeriodId === period.id

          return (
            <section key={period.id}>
              <h2 className="inline-flex rounded-full bg-[var(--primary)] px-3 py-1 font-mono text-xs font-bold text-white">
                {period.label.toUpperCase()}
              </h2>
              <div className="mt-2 rounded-2xl border-2 border-[var(--ink)] bg-white p-4 shadow-[4px_4px_0_var(--ink)]">
                {period.activity ? (
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span aria-hidden="true" className="grid size-11 place-items-center rounded-xl border-2 border-[var(--ink)] bg-[var(--tertiary)] text-xl">{period.icon}</span>
                      <div>
                        <p className="font-display text-lg font-extrabold">{period.activity}</p>
                        <p className="text-xs text-[var(--muted)]">{period.locked ? 'Main activity for today' : 'Selected'}</p>
                      </div>
                    </div>
                    {period.locked ? (
                      <span className="rounded-full border-2 border-[var(--ink)] bg-stone-100 px-2 py-1 text-xs font-bold">🔒 Locked</span>
                    ) : (
                      <button onClick={() => setEditingPeriodId((currentId) => currentId === period.id ? null : period.id)} className="rounded-lg border-2 border-[var(--ink)] px-3 py-2 text-sm font-bold hover:bg-[var(--tertiary)]">Change</button>
                    )}
                  </div>
                ) : (
                  <button
                      onClick={() =>
                        setEditingPeriodId((currentId) =>
                          currentId === period.id ? null : period.id
                        )
                      }
                      className="flex w-full flex-col items-center gap-2 rounded-xl border-2 border-dashed border-[var(--muted)] bg-stone-50 py-5 font-bold text-[var(--muted)] transition hover:bg-[var(--tertiary)]"
                    >
                      <span
                        aria-hidden="true"
                        className="grid size-9 place-items-center rounded-full border-2 border-[var(--ink)] bg-white text-xl text-[var(--primary)]"
                      >
                        {isEditing ? '−' : '+'}
                      </span>
                      {/* {isEditing ? 'Close activities' : 'Select an activity'} */}
                  </button>
                )}

                {isEditing && (
                  <div className="mt-4 border-t-2 border-[var(--ink)] pt-4">
                    <p className="mb-3 text-sm font-bold">What you gonna do in the {period.label}?</p>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {activities.map((activity) => (
                        <button key={activity.name} onClick={() => selectActivity(activity)} className="rounded-xl border-2 border-[var(--ink)] bg-[var(--background)] p-3 text-sm font-bold transition hover:bg-[var(--secondary)] hover:text-white">
                          <span aria-hidden="true" className="block text-xl">{activity.icon}</span>
                          <span className="mt-1 block">{activity.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
          )
        })}
      </div>

      <div className="mt-8">
        <button
            onClick={() => setIsGoodNightModalOpen(true)}
            className="w-full rounded-2xl border-2 border-[var(--ink)] bg-[var(--primary)] px-5 py-3 font-display text-lg font-extrabold uppercase tracking-wider text-white shadow-[4px_4px_0_var(--secondary)] transition hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
          >
            Let&apos;s call it a day
        </button>
        <p aria-live="polite" className="mt-3 min-h-5 text-center text-sm font-medium text-[var(--primary)]">{notice}</p>
      </div>

      {isGoodNightModalOpen && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="good-night-title"
        >
          <div className="relative w-full max-w-sm overflow-hidden rounded-2xl border-2 border-[var(--ink)] bg-[var(--background)] p-6 text-center shadow-[6px_6px_0_var(--secondary)]">
            <div aria-hidden="true" className="countdown-bar absolute inset-x-0 top-0 h-2 bg-[var(--secondary)]" />
            <span aria-hidden="true" className="text-5xl">🌙</span>
            <h2 id="good-night-title" className="mt-3 font-display text-3xl font-extrabold text-[var(--primary)]">
              Good Night!
            </h2>
            <p className="mt-2 text-sm text-[var(--muted)]">You&apos;ve finished planning your day.</p>
          
          </div>
        </div>
      )}
    </section>
  )
}
