'use client'

import { useSyncExternalStore } from 'react'

function formatCurrentDate() {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date())
}

export default function CurrentDate() {
  const dateText = useSyncExternalStore(
    () => () => undefined,
    formatCurrentDate,
    () => 'Loading date...',
  )

  return <p className="mt-2 text-sm text-[var(--muted)]">{dateText}</p>
}
