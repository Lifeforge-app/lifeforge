/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React, { useContext, useEffect } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import Dashboard from './modules/Dashboard'
import Auth from './auth'
import MainApplication from './MainApplication'
import { AuthContext } from './providers/AuthProvider'
import TodoList from './modules/TodoList'
import Calendar from './modules/Calendar'
import Projects from './modules/Projects'
import Kanban from './modules/Projects/components/Kanban'
import NotFound from './components/general/NotFound'
import IdeaBox from './modules/IdeaBox'
import Ideas from './modules/IdeaBox/components/Ideas'
import Snippets from './modules/Snippets'
import Resources from './modules/Resources'
import CodeTime from './modules/CodeTime'
import PomodoroTimer from './modules/PomodoroTimer'
import Flashcards from './modules/Flashcards'
import CardSet from './modules/Flashcards/components/CardSet'
import ReferenceBooks from './modules/ReferenceBooks'
import Changelog from './modules/Changelog'
import Notes from './modules/Notes'
import NotesCategory from './modules/Notes/Workspace'
import NotesSubject from './modules/Notes/Subject'
import Settings from './modules/Settings'
import Personalization from './modules/Personalization'
import ServerStatus from './modules/ServerStatus'
import Spotify from './modules/Spotify'
import Modules from './modules/Modules'

function AppRouter(): React.JSX.Element {
  const { auth, authLoading } = useContext(AuthContext)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (!authLoading) {
      if (!auth && location.pathname !== '/auth') {
        navigate('/auth?redirect=' + location.pathname)
      } else if (auth) {
        if (location.pathname === '/auth') {
          if (location.search) {
            const redirect = new URLSearchParams(location.search).get(
              'redirect'
            )
            if (redirect) {
              navigate(redirect)
            } else {
              navigate('/dashboard')
            }
          }
        } else if (location.pathname === '/') {
          navigate('/dashboard')
        }
      }
    }
  }, [auth, location, authLoading])

  return (
    <Routes>
      <Route path="/" element={<MainApplication />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="todo-list" element={<TodoList />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="spotify" element={<Spotify />} />
        <Route path="projects" element={<Projects />} />
        <Route path="projects/:id" element={<Kanban />} />
        <Route path="idea-box" element={<IdeaBox />} />
        <Route path="idea-box/:id" element={<Ideas />} />
        <Route path="snippets" element={<Snippets />} />
        <Route path="snippets/snippet/:id" element={<Snippets />} />
        <Route path="resources" element={<Resources />} />
        <Route path="code-time" element={<CodeTime />} />
        <Route path="pomodoro-timer" element={<PomodoroTimer />} />
        <Route path="flashcards" element={<Flashcards />} />
        <Route path="flashcards/:id" element={<CardSet />} />
        <Route path="reference-books" element={<ReferenceBooks />} />
        <Route path="notes" element={<Notes />} />
        <Route path="notes/:workspace" element={<NotesCategory />} />
        <Route path="notes/:workspace/:subject/*" element={<NotesSubject />} />
        <Route path="personalization" element={<Personalization />} />
        <Route path="settings" element={<Settings />} />
        <Route path="modules" element={<Modules />} />
        <Route path="server-status" element={<ServerStatus />} />
        <Route path="change-log" element={<Changelog />} />
      </Route>
      <Route path="auth" element={<Auth />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRouter
