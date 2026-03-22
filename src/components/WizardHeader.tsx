import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useFocusOnMount } from '../hooks/useFocusOnMount'

interface Props {
  title: string
  backTo: string
}

// Renders the Back button + page title for wizard steps.
// Automatically moves focus to the title on mount for screen reader page announcements.
export default function WizardHeader({ title, backTo }: Props) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const headingRef = useFocusOnMount<HTMLHeadingElement>()

  return (
    <header className="flex items-center gap-3 mb-6">
      <button
        onClick={() => navigate(backTo)}
        className="text-sm font-medium px-2 py-1 rounded hover:bg-gray-100"
        aria-label={t('common.back')}
      >
        ←
      </button>
      <h1
        ref={headingRef}
        tabIndex={-1}
        className="text-xl font-bold outline-none"
      >
        {title}
      </h1>
    </header>
  )
}
