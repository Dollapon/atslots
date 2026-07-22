import Link from 'next/link'
import ActivityPlanner from './components/activity-planner'
import type { DayPeriod } from './components/activity-planner'
import CurrentDate from './components/current-date'





const periods: DayPeriod[] = [
    { id: 'daytime', label: 'Daytime', activity: 'Working', icon: '💼', locked: true },
    { id: 'after-work', label: 'After Work' },
    { id: 'evening', label: 'Evening' },
    { id: 'night', label: 'Night' },
  ]

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <header className="sticky top-0 z-20 border-b-2 border-[var(--ink)] bg-[var(--background)]">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <Link className="flex items-center gap-2 font-display text-xl font-extrabold text-[var(--primary)]" href="/">
            <span aria-hidden="true">📝</span>
            Activity Slots
          </Link>
          <button aria-label="เปิดเมนูผู้ใช้" className="grid size-9 place-items-center rounded-full border-2 border-[var(--ink)] bg-[var(--tertiary)] font-bold">
            A
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-7 pb-28">
        <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[var(--secondary)]">Holla !</p>
        <h1 className="mt-2 font-display text-3xl font-extrabold leading-tight text-[var(--primary)] sm:text-4xl">
          What are you up to today?
        </h1>
        <CurrentDate />
        <ActivityPlanner periods={periods} />
      </main>

      <nav aria-label="Main" className="fixed inset-x-0 bottom-0 z-20 border-t-2 border-[var(--ink)] bg-white">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-around px-3 text-xs font-bold">
          <Link aria-current="page" className="rounded-lg border-2 border-[var(--ink)] bg-[var(--secondary)] px-3 py-2 text-white shadow-[2px_2px_0_var(--primary)]" href="/">Today</Link>
          <Link className="rounded-lg px-3 py-2 text-[var(--muted)]" href="/bookings">My Schedule</Link>
          <Link className="rounded-lg px-3 py-2 text-[var(--muted)]" href="/schedule">Goals</Link>
          <Link className="rounded-lg px-3 py-2 text-[var(--muted)]" href="/settings">Settings</Link>
        </div>
      </nav>
    </div>
  )
}
