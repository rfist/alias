import { useEffect, useRef } from 'react'
import { useGameStore } from '../store'

// Drives the game timer by calling tick() every ~100ms while a turn is active.
//
// Why a ref instead of re-creating the interval on status change:
// - The interval always runs, but only calls tick() when the game is in a
//   ticking state. This avoids interval setup/teardown on every tick update.
// - stateRef holds the latest tick function and shouldTick value without
//   causing the effect to re-run (which would restart the interval).
export function useTimer() {
  const tick = useGameStore((state) => state.tick)
  const status = useGameStore((state) => state.match?.currentRoundGame.status)

  // Any of these statuses may involve a running countdown
  const shouldTick =
    status === 'running' ||
    status === 'last_word' ||
    status === 'shared_last_word'

  const stateRef = useRef({ shouldTick, tick })

  useEffect(() => {
    stateRef.current = { shouldTick, tick }
  }, [shouldTick, tick])
  useEffect(() => {
    let lastTime: number | null = null

    const interval = setInterval(() => {
      const { shouldTick, tick } = stateRef.current

      if (!shouldTick) {
        lastTime = null // reset so there's no elapsed-time spike when resuming
        return
      }

      const now = performance.now()
      if (lastTime !== null) {
        tick(now - lastTime)
      }
      lastTime = now
    }, 100)

    return () => clearInterval(interval)
  }, []) // empty deps — interval runs for the lifetime of the component
}
