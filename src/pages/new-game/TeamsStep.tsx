import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { nanoid } from 'nanoid'
import { useGameStore } from '../../store'
import WizardHeader from '../../components/WizardHeader'

export default function TeamsStep() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { draft, updateDraftTeams } = useGameStore()

  // Guard: if no draft exists, redirect back to home
  if (!draft) {
    navigate('/')
    return null
  }

  const teams = draft.teams
  const teamNamePool = t('teamNames', { returnObjects: true }) as string[]

  function handleNameChange(id: string, name: string) {
    updateDraftTeams(teams.map((t) => (t.id === id ? { ...t, name } : t)))
  }

  function handleRandomize(id: string) {
    const current = teams.find((t) => t.id === id)
    const available = teamNamePool.filter((n) => n !== current?.name)
    const random = available[Math.floor(Math.random() * available.length)]
    updateDraftTeams(teams.map((t) => (t.id === id ? { ...t, name: random } : t)))
  }

  function handleAdd() {
    const newTeam = {
      id: nanoid(),
      name: teamNamePool[Math.floor(Math.random() * teamNamePool.length)],
      order: teams.length,
    }
    updateDraftTeams([...teams, newTeam])
  }

  function handleRemove(id: string) {
    const filtered = teams.filter((t) => t.id !== id)
    // Re-assign order to keep it sequential after removal
    updateDraftTeams(filtered.map((t, i) => ({ ...t, order: i })))
  }

  function handleNext() {
    navigate('/new-game/settings')
  }

  return (
    <main className="flex min-h-svh flex-col p-4 max-w-lg mx-auto">
      <WizardHeader title={t('wizard.teams.title')} backTo="/" />

      <ul className="flex flex-col gap-3 flex-1" aria-label={t('wizard.teams.title')}>
        {teams.map((team, index) => {
          const canRemove = index >= 2
          return (
            <li
              key={team.id}
              className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2"
            >
              <div className="flex flex-col flex-1 gap-1">
                <label
                  htmlFor={`team-name-${team.id}`}
                  className="text-xs text-gray-500"
                >
                  {t('wizard.teams.teamNameLabel')}
                </label>
                <input
                  id={`team-name-${team.id}`}
                  type="text"
                  value={team.name}
                  onChange={(e) => handleNameChange(team.id, e.target.value)}
                  placeholder={t('wizard.teams.teamNamePlaceholder')}
                  className="text-base font-semibold outline-none bg-transparent"
                  aria-label={`${t('wizard.teams.teamNameLabel')} ${index + 1}`}
                />
              </div>

              <button
                onClick={() => handleRandomize(team.id)}
                className="text-xs text-gray-500 px-2 py-1 rounded hover:bg-gray-100"
                aria-label={`${t('wizard.teams.randomizeName')} ${team.name}`}
              >
                {t('wizard.teams.randomizeName')}
              </button>

              {canRemove && (
                <button
                  onClick={() => handleRemove(team.id)}
                  className="text-xs text-red-400 px-2 py-1 rounded hover:bg-red-50"
                  aria-label={`${t('wizard.teams.removeTeam')} ${team.name}`}
                >
                  {t('wizard.teams.removeTeam')}
                </button>
              )}
            </li>
          )
        })}
      </ul>

      <button
        onClick={handleAdd}
        className="mt-4 w-full border border-dashed border-gray-300 rounded-xl py-3 text-gray-500 hover:border-gray-400 hover:text-gray-700"
        aria-label={t('wizard.teams.addTeam')}
      >
        + {t('wizard.teams.addTeam')}
      </button>

      <button
        onClick={handleNext}
        className="mt-4 w-full rounded-xl bg-yellow-400 py-3 font-semibold"
      >
        {t('common.next')}
      </button>
    </main>
  )
}
