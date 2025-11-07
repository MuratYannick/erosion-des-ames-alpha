import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Portal from './pages/portal/Portal'
import Intro from './pages/portal/Intro'
import Univers from './pages/portal/Univers'
import Reglement from './pages/portal/Reglement'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'

// Pages du forum
import CategoriesPage from './pages/forum/CategoriesPage'
import SectionsPage from './pages/forum/SectionsPage'
import TopicsPage from './pages/forum/TopicsPage'
import TopicDetailPage from './pages/forum/TopicDetailPage'
import NewSectionPage from './pages/forum/NewSectionPage'

// Pages d'erreur
import NotFound404 from './pages/errors/NotFound404'
import Forbidden403 from './pages/errors/Forbidden403'
import Unauthorized401 from './pages/errors/Unauthorized401'
import ServerError500 from './pages/errors/ServerError500'
import ServiceUnavailable503 from './pages/errors/ServiceUnavailable503'
import NetworkError from './pages/errors/NetworkError'

// ErrorBoundary global
import GlobalErrorBoundary from './components/errors/GlobalErrorBoundary'

function App() {
  return (
    <Router>
      <AuthProvider>
        <GlobalErrorBoundary>
          <Routes>
          {/* Portail */}
          <Route path="/" element={<Portal />} />
          <Route path="/intro" element={<Intro />} />
          <Route path="/univers" element={<Univers />} />
          <Route path="/reglement" element={<Reglement />} />
          <Route path="/home" element={<Home />} />

          {/* Authentification */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Forum - Hiérarchie des routes */}
          <Route path="/forum" element={<CategoriesPage />} />
          <Route path="/forum/sections/new" element={<NewSectionPage />} />
          <Route path="/forum/:categorySlug" element={<SectionsPage />} />
          <Route path="/forum/:categorySlug/:sectionSlug" element={<TopicsPage />} />
          <Route path="/forum/:categorySlug/:sectionSlug/:topicSlug" element={<TopicDetailPage />} />

          {/* Pages d'erreur */}
          <Route path="/error/401" element={<Unauthorized401 />} />
          <Route path="/error/403" element={<Forbidden403 />} />
          <Route path="/error/404" element={<NotFound404 />} />
          <Route path="/error/500" element={<ServerError500 />} />
          <Route path="/error/503" element={<ServiceUnavailable503 />} />
          <Route path="/error/network" element={<NetworkError />} />

          {/* Route catch-all pour 404 */}
          <Route path="*" element={<NotFound404 />} />
          </Routes>
        </GlobalErrorBoundary>
      </AuthProvider>
    </Router>
  )
}

export default App
