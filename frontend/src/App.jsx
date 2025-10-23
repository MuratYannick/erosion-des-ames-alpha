import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Portal from './pages/portal/Portal'
import Intro from './pages/portal/Intro'
import Univers from './pages/portal/Univers'
import Reglement from './pages/portal/Reglement'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'

// Pages d'erreur
import NotFound404 from './pages/errors/NotFound404'
import Forbidden403 from './pages/errors/Forbidden403'
import Unauthorized401 from './pages/errors/Unauthorized401'
import ServerError500 from './pages/errors/ServerError500'
import ServiceUnavailable503 from './pages/errors/ServiceUnavailable503'
import NetworkError from './pages/errors/NetworkError'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Portal />} />
        <Route path="/intro" element={<Intro />} />
        <Route path="/univers" element={<Univers />} />
        <Route path="/reglement" element={<Reglement />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

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
    </Router>
  )
}

export default App
