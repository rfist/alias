import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

interface Props {
  title: string
  backTo: string
}

export default function WizardHeader({ title, backTo }: Props) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <header className="flex items-center gap-3 mb-6">
      <button
        onClick={() => navigate(backTo)}
        className="text-sm font-medium px-2 py-1 rounded hover:bg-gray-100"
        aria-label={t('common.back')}
      >
        ←
      </button>
      <h1 className="text-xl font-bold">{title}</h1>
    </header>
  )
}
