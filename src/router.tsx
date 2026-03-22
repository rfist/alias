import { createBrowserRouter, Navigate } from 'react-router-dom'
import MainMenu from './pages/MainMenu'
import Rules from './pages/Rules'
import TeamsStep from './pages/new-game/TeamsStep'
import SettingsStep from './pages/new-game/SettingsStep'
import DictionariesStep from './pages/new-game/DictionariesStep'
import Prepare from './pages/Prepare'
import Round from './pages/Round'
import Results from './pages/Results'
import Victory from './pages/Victory'

export const router = createBrowserRouter([
  { path: '/', element: <MainMenu /> },
  { path: '/rules', element: <Rules /> },
  { path: '/new-game', element: <Navigate to="/new-game/teams" replace /> },
  { path: '/new-game/teams', element: <TeamsStep /> },
  { path: '/new-game/settings', element: <SettingsStep /> },
  { path: '/new-game/dictionaries', element: <DictionariesStep /> },
  { path: '/game/prepare', element: <Prepare /> },
  { path: '/game/round', element: <Round /> },
  { path: '/game/results', element: <Results /> },
  { path: '/game/victory', element: <Victory /> },
  { path: '*', element: <Navigate to="/" replace /> },
])
