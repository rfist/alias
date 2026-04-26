import * as Slider from '@radix-ui/react-slider'
import * as Switch from '@radix-ui/react-switch'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useGameStore } from '../../store'
import WizardHeader from '../../components/WizardHeader'
import type { ExtraTimeMode } from '../../types'

const EXTRA_TIME_OPTIONS: ExtraTimeMode[] = [0, 10, 20, 30, 'infinity']

export default function SettingsStep() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { draft, updateDraftSettings } = useGameStore()

  if (!draft) {
    navigate('/')
    return null
  }

  const s = draft.settings

  return (
    <main className="flex min-h-svh flex-col p-4 max-w-lg mx-auto">
      <WizardHeader title={t('wizard.settings.title')} backTo="/new-game/teams" />

      <div className="flex flex-col gap-6 flex-1">

        {/* Target Points */}
        <SettingRow
          label={t('wizard.settings.targetPoints')}
          value={`${s.targetPoints}`}
        >
          <Slider.Root
            min={10} max={200} step={10}
            value={[s.targetPoints]}
            onValueChange={([v]) => updateDraftSettings({ targetPoints: v })}
            className="relative flex items-center w-full h-5"
            aria-label={t('wizard.settings.targetPoints')}
          >
            <Slider.Track className="relative h-1 flex-1 rounded-full bg-gray-200">
              <Slider.Range className="absolute h-full rounded-full bg-yellow-400" />
            </Slider.Track>
            <Slider.Thumb className="block w-5 h-5 rounded-full bg-white border-2 border-yellow-400 shadow" />
          </Slider.Root>
        </SettingRow>

        {/* Turn Time */}
        <SettingRow
          label={t('wizard.settings.turnTime')}
          value={`${s.turnTimeSeconds} ${t('wizard.settings.turnTimeUnit')}`}
        >
          <Slider.Root
            min={10} max={120} step={10}
            value={[s.turnTimeSeconds]}
            onValueChange={([v]) => updateDraftSettings({ turnTimeSeconds: v })}
            className="relative flex items-center w-full h-5"
            aria-label={t('wizard.settings.turnTime')}
          >
            <Slider.Track className="relative h-1 flex-1 rounded-full bg-gray-200">
              <Slider.Range className="absolute h-full rounded-full bg-yellow-400" />
            </Slider.Track>
            <Slider.Thumb className="block w-5 h-5 rounded-full bg-white border-2 border-yellow-400 shadow" />
          </Slider.Root>
        </SettingRow>

        {/* Extra Time — segmented control */}
        <SettingRow label={t('wizard.settings.extraTime')}>
          <div className="flex gap-1" role="group" aria-label={t('wizard.settings.extraTime')}>
            {EXTRA_TIME_OPTIONS.map((opt) => {
              const label =
                opt === 'infinity' ? t('wizard.settings.extraTimeInfinity') : `${opt}`
              const isSelected = s.lastWordExtraTime === opt
              return (
                <button
                  key={opt}
                  onClick={() => updateDraftSettings({ lastWordExtraTime: opt })}
                  aria-pressed={isSelected}
                  className={`flex-1 py-1.5 rounded-lg text-sm font-medium border transition-colors
                    ${isSelected
                      ? 'bg-yellow-400 border-yellow-400 text-black'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                >
                  {label}
                </button>
              )
            })}
          </div>
        </SettingRow>

        {/* Skip Penalty */}
        <SwitchRow
          label={t('wizard.settings.skipPenalty')}
          checked={s.skipPenaltyEnabled}
          onCheckedChange={(v) => updateDraftSettings({ skipPenaltyEnabled: v })}
          id="skip-penalty"
        />

        {/* Shared Last Word */}
        <SwitchRow
          label={t('wizard.settings.sharedLastWord')}
          checked={s.sharedLastWordEnabled}
          onCheckedChange={(v) => updateDraftSettings({ sharedLastWordEnabled: v })}
          id="shared-last-word"
        />

        {/* Sound */}
        <SwitchRow
          label={t('wizard.settings.sound')}
          checked={s.soundEnabled}
          onCheckedChange={(v) => updateDraftSettings({ soundEnabled: v })}
          id="sound"
        />
      </div>

      <button
        onClick={() => navigate('/new-game/dictionaries')}
        className="mt-6 w-full rounded-xl bg-yellow-400 py-3 font-semibold"
      >
        {t('common.next')}
      </button>
    </main>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SettingRow({
  label,
  value,
  children,
}: {
  label: string
  value?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-baseline">
        <h2 className="text-sm font-medium text-gray-700">{label}</h2>
        {value && <span className="text-sm font-semibold text-gray-900">{value}</span>}
      </div>
      {children}
    </div>
  )
}

function SwitchRow({
  label,
  checked,
  onCheckedChange,
  id,
}: {
  label: string
  checked: boolean
  onCheckedChange: (v: boolean) => void
  id: string
}) {
  const labelId = `${id}-label`
  return (
    <div className="flex items-center justify-between">
      <h2 id={labelId} className="text-sm font-medium text-gray-700">{label}</h2>
      <Switch.Root
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        aria-labelledby={labelId}
        className={`relative w-10 h-6 rounded-full transition-colors
          ${checked ? 'bg-yellow-400' : 'bg-gray-200'}`}
      >
        <Switch.Thumb
          className="block w-4 h-4 bg-white rounded-full shadow transition-transform
            translate-x-1 data-[state=checked]:translate-x-5"
        />
      </Switch.Root>
    </div>
  )
}
