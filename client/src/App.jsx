import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import DashboardLayout from './components/layout/DashboardLayout'
import { useAuth } from './hooks/useAuth'
import Dashboard from './pages/Dashboard'
import Home from './pages/Home'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import PublicCollect from './pages/PublicCollect'
import PublicWall from './pages/PublicWall'
import Register from './pages/Register'
import Settings from './pages/Settings'
import Spaces from './pages/Spaces'
import CreateSpace from './pages/CreateSpace'
import EditSpace from './pages/EditSpace'
import Testimonials from './pages/Testimonials'
import EmbedGenerator from './pages/EmbedGenerator'

function LoadingScreen() {
  return <main className="loading-screen"><span className="loading-mark" aria-hidden="true" /><span>Opening your workspace...</span></main>
}

function ProtectedRoute() {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return <LoadingScreen />
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />

  return <Outlet />
}

function PublicOnlyRoute() {
  const { user, loading } = useAuth()

  if (loading) return <LoadingScreen />
  if (user) return <Navigate to="/dashboard" replace />

  return <Outlet />
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/collect/:slug" element={<PublicCollect />} />
      <Route path="/wall/:slug" element={<PublicWall />} />
      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/spaces" element={<Spaces />} />
          <Route path="/spaces/new" element={<CreateSpace />} />
          <Route path="/spaces/:id/edit" element={<EditSpace />} />
          <Route path="/testimonials" element={<Testimonials />} />
                    <Route path="/embed" element={<EmbedGenerator />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
