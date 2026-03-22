import { useEffect, useRef } from 'react'
import { useFocusOnMount } from '../hooks/useFocusOnMount'
import * as Dialog from '@radix-ui/react-dialog'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useGameStore } from '../store'
import { useTimer } from '../hooks/useTimer'
import type { RoundGameStatus } from '../types'

export default function Round() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const match = useGameStore((state) => state.match)
  const resultsPending = useGameStore((state) => state.resultsPending)
  const clearResultsPending = useGameStore((state) => state.clearResultsPending)
  const startTurn = useGameStore((state) => state.startTurn)
  const guessWord = useGameStore((state) => state.guessWord)
  const skipWord = useGameStore((state) => state.skipWord)
  const pauseTurn = useGameStore((state) => state.pauseTurn)
  const resumeTurn = useGameStore((state) => state.resumeTurn)
  const resolveSharedLastWord = useGameStore((state) => state.resolveSharedLastWord)

  // Drive the countdown timer
  useTimer()

  const teamNameRef = useFocusOnMount<HTMLParagraphElement>()

  // Navigate to Results when a turn finishes
  useEffect(() => {
    if (resultsPending) {
      clearResultsPending()
      navigate('/game/results')
    }
  }, [resultsPending, clearResultsPending, navigate])

  if (!match) {
    navigate('/')
    return null
  }

  const rg = match.currentRoundGame
  const { status, currentWord, guessedCount, skippedCount,
          timeRemainingMs, lastWordTimeRemainingMs, sharedLastWordPopup } = rg
  const { turnTimeSeconds, lastWordExtraTime } = match.settings

  const activeTeam = match.teams.find((t) => t.id === match.roundTracking.activeTeamId)!
  const isWordVisible = status === 'running' || status === 'last_word' || status === 'shared_last_word'
  const isLastWord = status === 'last_word' || status === 'shared_last_word'
  const isShared = status === 'shared_last_word'

  // Timer progress (0..1)
  const timerProgress = timeRemainingMs / (turnTimeSeconds * 1000)
  // Last-word extra timer progress (0..1), only when there's a countdown
  const lastWordTotalMs = lastWordExtraTime === 0
    ? 2000
    : typeof lastWordExtraTime === 'number'
      ? lastWordExtraTime * 1000
      : null
  const lastWordProgress = lastWordTimeRemainingMs !== null && lastWordTotalMs !== null
    ? lastWordTimeRemainingMs / lastWordTotalMs
    : null

  return (
    <main className="flex min-h-svh flex-col p-4 max-w-lg mx-auto select-none">

      {/* ── Accessible live regions ──────────────────────────────────────── */}
      {/* Screen readers announce new words automatically (section 9.6) */}
      <WordAnnouncer word={currentWord} status={status} />

      {/* ── Top bar ──────────────────────────────────────────────────────── */}
      <header className="flex justify-between items-start mb-4">
        <div>
          <p
            ref={teamNameRef}
            tabIndex={-1}
            className="text-xs text-gray-500 uppercase tracking-wider font-semibold outline-none"
          >
            {activeTeam.name}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">{t('round.guessedCount')}</p>
        </div>
        <p
          className="text-6xl font-black tabular-nums leading-none"
          aria-label={`${t('round.guessedCount')}: ${guessedCount}`}
        >
          {guessedCount}
        </p>
      </header>

      {/* ── Central word area ────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center gap-3">

        {/* Status labels */}
        {isLastWord && (
          <div className="flex gap-2" aria-hidden="true">
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded">
              {t('round.lastLabel')}
            </span>
            {isShared && (
              <span className="bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded">
                {t('round.sharedLabel')}
              </span>
            )}
          </div>
        )}

        {/* Central circle */}
        <div
          className={`w-64 h-64 rounded-full flex items-center justify-center text-center p-6
            ${isWordVisible ? 'bg-yellow-400' : 'bg-gray-100'}`}
        >
          {status === 'idle' && (
            <button
              onClick={startTurn}
              className="text-2xl font-black w-full h-full rounded-full flex items-center justify-center"
              aria-label={t('round.start')}
            >
              {t('round.start')}
            </button>
          )}

          {status === 'paused' && (
            <button
              onClick={resumeTurn}
              className="text-2xl font-black w-full h-full rounded-full flex items-center justify-center"
              aria-label={t('round.continue')}
            >
              {t('round.continue')}
            </button>
          )}

          {isWordVisible && currentWord && (
            <WordDisplay word={currentWord} />
          )}
        </div>

        {/* Last-word extra time countdown (only when finite extra time) */}
        {isLastWord && lastWordProgress !== null && (
          <div className="w-48 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-red-500 transition-all duration-100"
              style={{ width: `${lastWordProgress * 100}%` }}
              role="progressbar"
              aria-valuenow={Math.ceil((lastWordTimeRemainingMs ?? 0) / 1000)}
              aria-valuemin={0}
              aria-valuemax={lastWordTotalMs! / 1000}
            />
          </div>
        )}
      </div>

      {/* ── Action buttons (visible when a word is showing) ──────────────── */}
      {isWordVisible && (
        <div className="flex gap-3 mb-4">
          <button
            onClick={skipWord}
            className="flex-1 rounded-xl border-2 border-gray-300 py-4 text-lg font-bold
              text-gray-600 active:scale-95 transition-transform"
            aria-label={t('round.skipped')}
          >
            ✗ {t('round.skipped')}
          </button>
          <button
            onClick={guessWord}
            className="flex-1 rounded-xl bg-green-500 py-4 text-lg font-bold text-white
              active:scale-95 transition-transform"
            aria-label={t('round.guessed')}
          >
            ✓ {t('round.guessed')}
          </button>
        </div>
      )}

      {/* ── Bottom bar ───────────────────────────────────────────────────── */}
      <footer className="flex flex-col gap-2">
        {/* Skipped count */}
        <div className="flex justify-between text-sm text-gray-500 px-1">
          <span>{t('round.skippedCount')}</span>
          <span
            className="font-semibold"
            aria-label={`${t('round.skippedCount')}: ${skippedCount}`}
          >
            {skippedCount}
          </span>
        </div>

        {/* Main timer progress bar */}
        {(status === 'running' || status === 'paused') && (
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-yellow-400 transition-all duration-100"
              style={{ width: `${timerProgress * 100}%` }}
              role="progressbar"
              aria-label={`${Math.ceil(timeRemainingMs / 1000)}s`}
              aria-valuenow={Math.ceil(timeRemainingMs / 1000)}
              aria-valuemin={0}
              aria-valuemax={turnTimeSeconds}
            />
          </div>
        )}

        {/* Pause / Menu buttons */}
        <div className="flex gap-2 mt-1">
          {status === 'paused' && (
            <button
              onClick={() => navigate('/')}
              className="flex-1 rounded-xl border py-2 text-sm font-medium text-gray-600"
            >
              {t('common.menu')}
            </button>
          )}
          {status === 'running' && (
            <button
              onClick={pauseTurn}
              className="flex-1 rounded-xl border py-2 text-sm font-medium text-gray-600"
              aria-label={t('round.pause')}
            >
              ⏸ {t('round.pause')}
            </button>
          )}
        </div>
      </footer>

      {/* ── Shared last word popup ────────────────────────────────────────── */}
      <Dialog.Root open={!!sharedLastWordPopup}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <Dialog.Content
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
              w-[90vw] max-w-sm bg-white rounded-2xl p-6 shadow-xl"
            aria-describedby={undefined}
          >
            <Dialog.Title className="text-lg font-bold text-center mb-4">
              {t('round.sharedPopup.title')}
            </Dialog.Title>

            <p className="text-center text-2xl font-black text-yellow-500 mb-6">
              {sharedLastWordPopup?.word}
            </p>

            <div className="flex flex-col gap-2">
              {match.teams.map((team) => (
                <button
                  key={team.id}
                  onClick={() => resolveSharedLastWord(team.id)}
                  className="w-full rounded-xl bg-yellow-400 py-3 font-semibold
                    active:scale-95 transition-transform"
                >
                  {team.name}
                </button>
              ))}
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </main>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

// The word the team needs to explain. Updating the key forces React to remount
// the element, which moves focus to it — enabling screen readers to announce it.
function WordDisplay({ word }: { word: string }) {
  const ref = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    ref.current?.focus()
  }, [word])

  return (
    <p
      ref={ref}
      className="text-3xl font-black leading-tight break-words"
      tabIndex={-1}  // focusable but not in tab order
      lang="auto"    // let browser pick correct language for TTS
    >
      {word}
    </p>
  )
}

// Hidden aria-live region that announces state changes to screen readers.
// Uses 'assertive' for timer end (urgent), 'polite' for word changes (non-disruptive).
function WordAnnouncer({ word, status }: { word: string | null; status: RoundGameStatus }) {
  const { t } = useTranslation()
  const prevWordRef = useRef<string | null>(null)
  const wordMessage = word && word !== prevWordRef.current
    ? t('round.a11y.newWord', { word })
    : ''
  prevWordRef.current = word

  const urgentMessage =
    status === 'last_word' || status === 'shared_last_word'
      ? t('round.a11y.timerEnded')
      : status === 'paused'
        ? t('round.a11y.paused')
        : ''

  return (
    <>
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {wordMessage}
      </div>
      <div aria-live="assertive" aria-atomic="true" className="sr-only">
        {urgentMessage}
      </div>
    </>
  )
}
